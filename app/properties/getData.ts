import db from "db"
import type { ChildItem } from "app/items/queries/getRootItem"

export const getData = (property: ChildItem["properties"][number]) => {
  const data = db.datum.findMany({
    where: { url: property.datum.url },
    include: {
      indexer: { include: { nextIndexer: { include: { nextIndexer: true } } } },
    },
  })

  return data
}

export type DataToIndex = Awaited<ReturnType<typeof getData>>
