import { createContext, useContext } from "react";

export interface SiteConfig {
  key: "zuglo" | "gellert";
  apiBase: string;   // "/api" or "/api/gellert"
  basePath: string;  // "/" or "/gellert"
  therapistRoute: string; // "/szakemberek" or "/gellert/szakemberek"
}

const SiteContext = createContext<SiteConfig>({
  key: "zuglo",
  apiBase: "/api",
  basePath: "/",
  therapistRoute: "/szakemberek",
});

export const useSite = () => useContext(SiteContext);
export default SiteContext;
