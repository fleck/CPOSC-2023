import { disk } from "app/file/disk"
import { NotFoundError } from "blitz"

import db from "db"
import { localPath } from "../create"
import createContentDisposition from "content-disposition"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { key, contentDisposition } = req.query

  if (!key || key instanceof Array)
    throw new NotFoundError("missing or invalid key")

  const file = await db.file.findFirst({ where: { key } })

  if (!file) throw new NotFoundError("no file record exists in the database")

  if (file.contentType) {
    res.setHeader("content-type", file.contentType)
  }

  res.setHeader(
    "content-disposition",
    createContentDisposition(file.name, {
      type: contentDisposition === "attachment" ? "attachment" : "inline",
    }),
  )

  try {
    const a = disk.getStream(localPath(file.key))

    a.on("error", () => {
      throw new NotFoundError("error streaming file from service")
    })

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")

    res.setHeader("Content-Length", file.byteSize)

    res.send(a)
  } catch (error) {
    throw new NotFoundError("error streaming file from service")
  }
}
