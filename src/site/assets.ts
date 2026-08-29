import { siteConfig } from "./config";

export function assetUrl(path: string): string {
  if (!path) {
    return "";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${siteConfig.assetBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
