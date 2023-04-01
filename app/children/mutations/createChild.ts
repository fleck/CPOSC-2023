import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const CreateChild = z.object({
  parent_id: z.number(),
  item_id: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateChild),
  resolver.authorize(),
  async (input) => {
    const child = await db.child.create({
      data: {
        parent_id: Number(input.parent_id),
        item_id: Number(input.item_id),
      },
    })

    await findItemByIdAndClearCache(input.parent_id)

    return child
  },
)
