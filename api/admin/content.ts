import type { IncomingMessage, ServerResponse } from "node:http";
import { defaultContent, type SiteContent } from "../../src/content.js";
import { redis } from "../_lib/redis.js";
import { body, isAdmin, json, validOrigin } from "../_lib/security.js";
import { deleteManagedVideos } from "../_lib/cloudinary.js";

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
function sanitize(input: SiteContent): SiteContent {
  if (
    !input?.hero ||
    !input?.showcase ||
    !input?.pricing ||
    !Array.isArray(input.workCategories)
  )
    throw new Error("Invalid content");
  return {
    brandName: clean(input.brandName, 60),
    navCtaText: clean(input.navCtaText, 40) || "Let's Talk",
    hero: {
      line1: clean(input.hero.line1, 80),
      line2: clean(input.hero.line2, 80),
      accent: clean(input.hero.accent, 100),
      description: clean(input.hero.description),
      imageUrl: clean(input.hero.imageUrl, 900_000),
      imageX: Math.max(0, Math.min(100, Number(input.hero.imageX) || 50)),
      imageY: Math.max(0, Math.min(100, Number(input.hero.imageY) || 50)),
      imageZoom: Math.max(
        100,
        Math.min(200, Number(input.hero.imageZoom) || 100),
      ),
      imageBrightness: Math.max(
        50,
        Math.min(150, Number(input.hero.imageBrightness) || 100),
      ),
      primaryButtonText:
        clean(input.hero.primaryButtonText, 40) || "View My Work",
      secondaryButtonText:
        clean(input.hero.secondaryButtonText, 40) || "Start a Project",
    },
    showcase: {
      eyebrow: clean(input.showcase.eyebrow, 80),
      title: clean(input.showcase.title, 100),
      accent: clean(input.showcase.accent, 100),
      videos: input.showcase.videos.slice(0, 20).map((v, i) => ({
        id: i + 1,
        title: clean(v.title, 100),
        video: clean(v.video, 1000),
        publicId: clean(v.publicId, 300) || undefined,
      })),
    },
    workCategories: input.workCategories
      .slice(0, 20)
      .map((category, categoryIndex) => ({
        label: clean(category.label, 80),
        key:
          clean(category.key, 80)
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-") || `category-${categoryIndex + 1}`,
        videos: category.videos.slice(0, 50).map((video, videoIndex) => ({
          id: categoryIndex * 1000 + videoIndex + 1,
          title: clean(video.title, 100),
          video: clean(video.video, 1000),
          publicId: clean(video.publicId, 300) || undefined,
          frameTime: Math.max(0, Math.min(3600, Number(video.frameTime) || 2)),
          thumbnail: clean(video.thumbnail, 1000) || undefined,
        })),
      })),
    pricing: {
      eyebrow: clean(input.pricing.eyebrow, 80),
      title: clean(input.pricing.title, 100),
      accent: clean(input.pricing.accent, 100),
      plans: input.pricing.plans.slice(0, 10).map((p) => ({
        name: clean(p.name, 80),
        price: clean(p.price, 40),
        period: clean(p.period, 40),
        description: clean(p.description),
        features: p.features.slice(0, 20).map((f) => clean(f, 160)),
        popular: Boolean(p.popular),
        buttonText: clean(p.buttonText, 80),
      })),
    },
  };
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
    if (req.method === "GET") {
      const saved = await redis(["GET", "site:content"]);
      const parsed = saved ? JSON.parse(saved) : defaultContent;
      return json(res, 200, {
        ...defaultContent,
        ...parsed,
        workCategories: parsed.workCategories || defaultContent.workCategories,
      });
    }
    if (req.method === "PUT") {
      if (!validOrigin(req))
        return json(res, 403, { error: "Invalid request origin" });
      const content = sanitize(await body(req));
      const previousRaw = await redis(["GET", "site:content"]);
      const previous = previousRaw ? JSON.parse(previousRaw) as SiteContent : defaultContent;
      await redis(["SET", "site:content", JSON.stringify(content)]);
      const currentIds = new Set([
        ...content.showcase.videos.map((video) => video.publicId),
        ...content.workCategories.flatMap((category) =>
          category.videos.map((video) => video.publicId),
        ),
      ].filter((id): id is string => Boolean(id)));
      const removedIds = [
        ...previous.showcase.videos.map((video) => video.publicId),
        ...previous.workCategories.flatMap((category) =>
          category.videos.map((video) => video.publicId),
        ),
      ].filter((id): id is string => Boolean(id) && !currentIds.has(id));
      await deleteManagedVideos(removedIds);
      return json(res, 200, content);
    }
    json(res, 405, { error: "Method not allowed" });
  } catch {
    json(res, 400, { error: "Unable to save content" });
  }
}
