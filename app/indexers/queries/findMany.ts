import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(
  resolver.authorize(),
  async (findParams: Parameters<typeof db.indexer.findMany>[0]) => {
    const indexers = await db.indexer.findMany(findParams)

    return indexers
  },
)
