import db, { Cache } from "db"
import { HomePageItems } from "./getHomePageItems"
import { BaseItem } from "./queries/getRootItem"

export async function getFromCache(url?: string) {
  return (await db.cache.findFirst({
    where: { key: url },
  })) as (Omit<Cache, "value"> & { value: BaseItem | HomePageItems }) | null
}
