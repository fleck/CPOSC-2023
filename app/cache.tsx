import { ChildItem } from "app/items/queries/getRootItem"
import { IncomingMessage, ServerResponse } from "http"
import db from "db"

export const publiclyCache = async ({
  for: [days],
  res,
  items = [],
  req: {
    url,
    headers: { host, origin },
  },
}: CacheOptions) => {
  res.setHeader("Cache-Control", `public, s-maxage=${days * 86400}`)

  if (!url || !host) {
    return
  }

  try {
    const urlToCache = new URL(url, `https://${host}`)

    const itemInCache = Boolean(items.length) && {
      items: { connect: items.map((item) => ({ id: item.id })) },
    }

    const shared = { ...itemInCache, headers: { origin } }

    await db.cachedUrl.upsert({
      where: {
        url: urlToCache.href,
      },
      update: {
        ...shared,
      },
      create: { url: urlToCache.href, ...shared },
    })
  } catch (error) {
    console.error(error)
  }
}

type CacheOptions = {
  res: ServerResponse
  items?: Pick<ChildItem, "id">[]
  for: [number, "days"]
  req: IncomingMessage
}
