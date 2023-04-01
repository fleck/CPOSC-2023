import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateIndexer } from "packages/indexer/src/IndexerSchema"

export default resolver.pipe(
  resolver.zod(UpdateIndexer),
  resolver.authorize(),
  async (input) => {
    const indexer = await db.indexer.update({
      data: {
        ...input,
        nextIndexerId: input.nextIndexerId ? Number(input.nextIndexerId) : null,
      },
      where: { id: input.id },
    })

    return indexer
  },
)
