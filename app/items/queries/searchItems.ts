import { paginate } from "blitz"
import db, { Prisma, Item } from "db"

type GetItemsInput = Pick<Prisma.ItemFindManyArgs, "skip" | "take"> & {
  query: string
  standaloneOnly?: boolean
}

export default async function searchItems({
  query,
  skip = 0,
  take = 100,
  standaloneOnly = true,
}: GetItemsInput) {
  const { items, hasMore, nextPage, count } = await paginate({
    skip,
    take,
    count: async () => {
      const result = db.$queryRaw<any>/*sql*/ `
      SELECT
        COUNT(*)
      FROM
        "items"
        INNER JOIN (
          SELECT
            "items"."id" AS pg_search_id
          FROM
            "items"
          WHERE
            (
              (
                To_tsvector(
                  'simple',
                  Pg_search_dmetaphone(COALESCE("items"."name" :: text, ''))
                )
              ) @@ (
                to_tsquery(
                  'simple',
                  ''' ' || Pg_search_dmetaphone(${query}) || ' '''
                )
              )
            )
            OR (
              (
                to_tsvector('simple', COALESCE("items"."name" :: text, ''))
              ) @@ (
                to_tsquery(
                  'simple',
                  ''' ' || ${query} || ' ''' || ':*'
                )
              )
            )
            OR (
              ${query} % (COALESCE("items"."name" :: text, ''))
            )
        ) AS pg_search_5f3c4f8580d392e422e7c2 ON "items"."id" = pg_search_5f3c4f8580d392e422e7c2.pg_search_id
        ${
          standaloneOnly
            ? Prisma.sql`WHERE
          "items"."standalone" = true`
            : Prisma.empty
        }
    `

      return (await result)[0].count
    },
    query: () => db.$queryRaw<Item[]>/*sql*/ `
      SELECT
        "items".*
      FROM
        "items"
        INNER JOIN (
          SELECT
            "items"."id" AS pg_search_id,
            (
              ts_rank(
                (
                  to_tsvector('simple', coalesce("items"."name" :: text, ''))
                ),
                (
                  to_tsquery('simple', ''' ' || ${query} || ' ''' || ':*')
                ),
                0
              )
            ) AS rank
          FROM
            "items"
          WHERE
            (
              (
                to_tsvector(
                  'simple',
                  pg_search_dmetaphone(coalesce("items"."name" :: text, ''))
                )
              ) @@ (
                to_tsquery(
                  'simple',
                  ''' ' || pg_search_dmetaphone(${query}) || ' '''
                )
              )
            )
            OR (
              (
                to_tsvector('simple', coalesce("items"."name" :: text, ''))
              ) @@ (
                to_tsquery('simple', ''' ' || ${query} || ' ''' || ':*')
              )
            )
            OR (${query} % (coalesce("items"."name" :: text, '')))
        ) AS pg_search_5f3c4f8580d392e422e7c2 ON "items"."id" = pg_search_5f3c4f8580d392e422e7c2.pg_search_id
      ${
        standaloneOnly
          ? Prisma.sql`WHERE
        "items"."standalone" = true`
          : Prisma.empty
      }
      ORDER BY
        pg_search_5f3c4f8580d392e422e7c2.rank DESC LIMIT ${take} OFFSET ${skip}
    `,
  })

  return {
    items,
    nextPage,
    hasMore,
    count,
  }
}
