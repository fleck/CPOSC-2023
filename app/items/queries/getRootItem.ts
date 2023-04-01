import db from "db"

import type { Prisma } from "db"
import { getFromCache } from "../getFromCache"
import { DeepReadonly } from "../TypeUtilities"

type R = {
  importedItems: {
    include: {
      properties: { include: { datum: true } }
    }
  }
}

const nestedImportedItems = (level: number): R => {
  return {
    importedItems: {
      include: {
        properties: { include: { datum: true } },
        ...(level - 1 && nestedImportedItems(level - 1)),
      },
    },
  }
}

type F = {
  include: {
    children: {
      where?: { id: 0 }
      orderBy: {
        position: "asc"
      }
      include: {
        item: F
      }
    }
    properties: {
      orderBy: {
        position: "asc"
      }
      include: {
        datum: {
          include: {
            image: true
            indexer: true
          }
        }
      }
    }
    comparisonColumns: {
      orderBy: {
        position: "asc"
      }
    }
  }
}

const nestedChildren = (level: number): F => ({
  include: {
    children: {
      orderBy: { position: "asc" },
      include: {
        item:
          level - 1
            ? nestedChildren(level - 1)
            : ({
                include: {
                  children: {
                    orderBy: { position: "asc" },
                    // Using a where clause that'll terminate our loop, but give us an empty array of children
                    where: { id: 0 },
                  },
                  properties: {
                    orderBy: { position: "asc" },
                    include: {
                      datum: { include: { image: true, indexer: true } },
                    },
                  },
                  comparisonColumns: { orderBy: { position: "asc" } },
                },
                // Casting here because Prisma only works if item is a recursive
                // reference, but we need to terminate this recursive function at some point.
              } as F),
      },
    },
    properties: {
      orderBy: { position: "asc" },
      include: { datum: { include: { image: true, indexer: true } } },
    },
    comparisonColumns: { orderBy: { position: "asc" } },
  },
})

const rootItem = async (where: Prisma.ItemWhereInput) =>
  db.item.findFirst({
    where,
    include: {
      ...nestedImportedItems(5),
      ...nestedChildren(5).include,
      properties: {
        orderBy: { position: "asc" },
        include: { datum: { include: { image: true, indexer: true } } },
      },
      comparisonColumns: { orderBy: { position: "asc" } },
    },
  })

export type BaseItem = NonNullable<Awaited<ReturnType<typeof rootItem>>>

export default async function getRootItem(where: Prisma.ItemWhereInput) {
  let item: BaseItem | null

  let cachedItem

  if (typeof where.url === "string") {
    cachedItem = await getFromCache(where.url)
  }

  if (cachedItem?.value && "comparisonColumns" in cachedItem.value) {
    return cachedItem.value
  }

  item = await rootItem(where)

  if (item) {
    // item contains Date types which TypeScript/Prisma won't allow, but they successfully get serialized to strings.
    const itemToCache: Omit<
      typeof item,
      | "created_at"
      | "properties"
      | "comparisonColumns"
      | "children"
      | "updated_at"
      | "importedItems"
    > = item

    db.cache
      .create({
        data: {
          key: item.url,
          value: itemToCache,
        },
      })
      .catch(console.error)
  }

  return item as Unionize<DeepReadonly<typeof item>, Date | bigint, string>
}

type RootItem = NonNullable<Awaited<ReturnType<typeof getRootItem>>>

export type ChildItem = RootItem["children"][number]["item"]

export type ChildOrRootItem = ChildItem & {
  importedItems?: RootItem["importedItems"]
}

export type Unionize<T, Search, TypeToAdd> = T extends Search
  ? T extends Search
    ? T | TypeToAdd
    : T
  : {
      [P in keyof T]: Unionize<T[P], Search, TypeToAdd>
    }
