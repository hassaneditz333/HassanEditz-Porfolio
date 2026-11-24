import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "./content";

export function safeMergeContent(loaded: any): SiteContent {
  if (!loaded || typeof loaded !== "object") return defaultContent;
  return {
    brandName: loaded.brandName || defaultContent.brandName,
    navCtaText: loaded.navCtaText || defaultContent.navCtaText,
    hero: {
      ...defaultContent.hero,
      ...(loaded.hero || {})
    },
    showcase: {
      ...defaultContent.showcase,
      ...(loaded.showcase || {}),
      videos: Array.isArray(loaded.showcase?.videos) && loaded.showcase.videos.length > 0
        ? loaded.showcase.videos
        : defaultContent.showcase.videos
    },
    workCategories: Array.isArray(loaded.workCategories) && loaded.workCategories.length > 0
      ? loaded.workCategories
      : defaultContent.workCategories,
    pricing: {
      ...defaultContent.pricing,
      ...(loaded.pricing || {}),
      plans: Array.isArray(loaded.pricing?.plans) && loaded.pricing.plans.length > 0
        ? loaded.pricing.plans
        : defaultContent.pricing.plans
    }
  };
}

const SiteContentContext = createContext<SiteContent>(defaultContent);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setContent(safeMergeContent(data));
      })
      .catch(() => {});
  }, []);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export const useSiteContent = () => useContext(SiteContentContext);
