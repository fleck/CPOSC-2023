import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(
    z.object({
      itemId: z.number(),
    }),
  ),
  resolver.authorize(),
  async ({ itemId }) => {
    const parents = await db.child.findMany({
      where: { item_id: itemId },
      include: { parent: true },
    })

    return parents
  },
)
