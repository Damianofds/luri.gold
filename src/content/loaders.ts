import homeData from "./site/home.json";
import type { CollectionRecord, EditorialPageRecord, HomeContent, ProductRecord } from "../site/types";

const collectionModules = import.meta.glob("./site/collections/*.json", {
  eager: true,
  import: "default"
}) as Record<string, unknown>;

const pageModules = import.meta.glob("./site/pages/*.json", {
  eager: true,
  import: "default"
}) as Record<string, unknown>;

const productModules = import.meta.glob("./site/products/*.json", {
  eager: true,
  import: "default"
}) as Record<string, unknown>;

export const homePage = homeData as unknown as HomeContent;
export const collections = Object.values(collectionModules) as CollectionRecord[];
export const pages = Object.values(pageModules) as EditorialPageRecord[];
export const products = Object.values(productModules) as ProductRecord[];
