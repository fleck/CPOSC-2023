import db, { CachedUrl, Prisma } from "db"
import { NextApiRequest, NextApiResponse } from "next"
import chunk from "lodash/chunk"
import assert from "assert"

export default async function coverage(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  await purgeCdnCache()

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")

  res.status(200).send("Cleared the cache")
}

type Options = {
  id?: bigint
  where?: Prisma.CachedUrlWhereInput
}

export const purgeCdnCache = async ({ id, where }: Options = {}) => {
  // Create a new object here because prisma will only accept a single property
  // but TypeScript will allow additional properties to be passed in if we use
  // the parameter directly.
  const cursor = !!id ? { id } : undefined

  const allCachedUrls = await db.cachedUrl
    .findMany({
      take: 1000,
      cursor,
      orderBy: {
        id: "asc",
      },
      where,
    })
    .catch(console.error)

  if (!allCachedUrls) return

  await clearInChunks(allCachedUrls)

  const nextCursor = allCachedUrls.at(-1)

  if (!nextCursor) return

  /**
   * Cloudflare only allows 1000 URLs per minute to be cleared.
   * https://api.cloudflare.com/#zone-purge-files-by-url
   */
  setTimeout(() => purgeCdnCache(nextCursor), 60000)
}

const cloudflareCacheClearingUrl = `http${
  process.env.FAKE_CLOUDFLARE_DOMAIN ? "" : "s"
}://${
  // Locally we use an API route to mimic the Cloudflare API
  process.env.FAKE_CLOUDFLARE_DOMAIN
    ? process.env.FAKE_CLOUDFLARE_DOMAIN + `:${process.env.PORT}` + "/api"
    : "api.cloudflare.com"
}/client/v4/zones/${process.env.CLOUDFLARE_ZONE}/purge_cache` as const

function clearInChunks(allCachedUrls: CachedUrl[]) {
  return Promise.all(
    chunk(allCachedUrls, 30).map(async function clearThirtyUrlsPerFetch(
      cachedUrls,
    ) {
      const urlsToClear = cachedUrls.map(({ headers, url }) =>
        typeof headers === "object" && headers && "" in headers
          ? { url, headers }
          : url,
      )

      assert(
        process.env.CLOUDFLARE_ZONE,
        "CLOUDFLARE_ZONE environment variable is required",
      )
      assert(
        process.env.CLOUDFLARE_KEY,
        "CLOUDFLARE_KEY environment variable is required",
      )
      assert(
        process.env.CLOUDFLARE_EMAIL,
        "CLOUDFLARE_EMAIL environment variable is required",
      )

      const response = await fetch(cloudflareCacheClearingUrl, {
        body: JSON.stringify({ files: urlsToClear }),
        headers: {
          "X-Auth-Email": process.env.CLOUDFLARE_EMAIL,
          "Content-Type": "application/json",
          "X-Auth-Key": process.env.CLOUDFLARE_KEY,
        },
        method: "POST",
      })

      if (!response.ok) {
        console.error(response.statusText, response.headers, response.body)
      }

      await clearCache(cachedUrls)
    }),
  )
}

const clearCache = async (cachedUrls: CachedUrl[]) => {
  await db.cachedUrl.deleteMany({
    where: { id: { in: cachedUrls.map((cachedUrl) => cachedUrl.id) } },
  })
}
