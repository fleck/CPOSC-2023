import db from "db"
import { HomePageItems } from "./getHomePageItems"
import { BaseItem } from "./queries/getRootItem"

export const putItemInCache = ({
  value,
  url,
}: {
  value: HomePageItems | BaseItem
  url: string
}) =>
  // @ts-expect-error item dates get property converted via implicit conversion, but TS doesn't like it.
  db.cache.create({ data: { key: url, value: value } }).catch((error) => {
    console.error(error)
  })
