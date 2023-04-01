import { resolver } from "@blitzjs/rpc"
import db from "db"
import { IndexerCreate } from "packages/indexer/src/IndexerSchema"

export default resolver.pipe(
  resolver.zod(IndexerCreate),
  resolver.authorize(),
  async (input) => {
    const indexer = await db.indexer.create({
      data: {
        ...input,
        nextIndexerId: input.nextIndexerId ? Number(input.nextIndexerId) : null,
      },
    })

    return indexer
  },
)
