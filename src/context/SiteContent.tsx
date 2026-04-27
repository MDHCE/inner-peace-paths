import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSite } from "./SiteContext";

export interface SiteContent {
  hero?: {
    kicker?: string;
    subtitle?: string;
    primary_cta?: string;
    secondary_cta?: string;
  };
  services?: {
    kicker?: string;
    heading?: string;
    subtitle?: string;
    details_link_label?: string;
    tiles?: Array<{
      icon?: string;
      slug?: string;
      title?: string;
      description?: string;
      content?: string;
    }>;
  };
  about?: {
    kicker?: string;
    heading?: string;
    paragraphs?: string[];
    highlights?: Array<{
      icon?: string;
      label?: string;
      value?: string;
    }>;
  };
  contact?: {
    kicker?: string;
    heading?: string;
    subtitle?: string;
    phone?: string;
    phone_subtitle?: string;
    email?: string;
    address?: string;
    address_subtitle?: string;
    hours?: string;
    hours_subtitle?: string;
    transport_public_label?: string;
    transport_public?: string;
    transport_car_label?: string;
    transport_car?: string;
  };
  footer?: {
    intro?: string;
    operator_heading?: string;
    operator_lines?: string[];
    follow_heading?: string;
    facebook_url?: string;
    instagram_url?: string;
    neak_number?: string;
  };
}

const SiteContentContext = createContext<SiteContent>({});

export const useSiteContent = () => useContext(SiteContentContext);

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const { apiBase } = useSite();
  const [content, setContent] = useState<SiteContent>({});

  useEffect(() => {
    fetch(`${apiBase}/site-content`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setContent(d || {}))
      .catch(() => setContent({}));
  }, [apiBase]);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
};

export default SiteContentContext;
