import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteContent } from "../SiteContentContext";

const ORIGIN = "https://hassaneditz.com";
const SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/hassan.jpeg";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function cloudinaryThumbnail(videoUrl: string, second = 2) {
  const marker = "/video/upload/";
  if (!videoUrl.includes(marker)) return SOCIAL_IMAGE;
  const [base, tail] = videoUrl.split(marker);
  return `${base}${marker}so_${Math.max(0, second)},f_jpg,q_auto/${tail.replace(/\.[^/.]+$/, ".jpg")}`;
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const content = useSiteContent();

  useEffect(() => {
    const isHome = pathname === "/";
    const isWork = pathname === "/work";
    const shouldIndex = isHome || isWork;
    const title = isWork
      ? "Video Editing Portfolio | HassanEditz"
      : isHome
        ? "HassanEditz | Professional Video Editing Services"
        : "Private Admin | HassanEditz";
    const description = isWork
      ? "Explore HassanEditz video editing work across documentaries, motion graphics, SaaS explainers, short-form content, tutorials, and talking-head videos."
      : "Professional video editing for creators, brands, and businesses, including YouTube videos, short-form content, motion graphics, documentaries, and SaaS explainers.";
    const canonicalPath = isWork ? "/work" : "/";
    const canonicalUrl = `${ORIGIN}${canonicalPath}`;

    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", shouldIndex ? "index, follow, max-image-preview:large" : "noindex, nofollow, noarchive");
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", SOCIAL_IMAGE);
    setMeta('meta[property="og:locale"]', "property", "og:locale", "en_US");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", SOCIAL_IMAGE);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    document.getElementById("route-portfolio-schema")?.remove();
    if (isWork) {
      const videos = content.workCategories.flatMap((category) =>
        category.videos.map((video) => ({ ...video, category: category.label })),
      );
      const schema = document.createElement("script");
      schema.id = "route-portfolio-schema";
      schema.type = "application/ld+json";
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "HassanEditz Video Editing Portfolio",
        url: canonicalUrl,
        numberOfItems: videos.length,
        itemListElement: videos.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoObject",
            name: video.title,
            description: `${video.category} video editing portfolio project by HassanEditz.`,
            contentUrl: video.video,
            thumbnailUrl: video.thumbnail || cloudinaryThumbnail(video.video, video.frameTime),
          },
        })),
      });
      document.head.appendChild(schema);
    }
  }, [pathname, content]);

  return null;
}
