import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "./content";

const SiteContentContext = createContext<SiteContent>(defaultContent);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultContent);
  useEffect(() => {
    fetch("/api/content").then((r) => r.ok ? r.json() : Promise.reject()).then(setContent).catch(() => {});
  }, []);
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export const useSiteContent = () => useContext(SiteContentContext);
