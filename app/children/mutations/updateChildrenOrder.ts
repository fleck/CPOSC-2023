import { resolver } from "@blitzjs/rpc"
import { clearCacheForItemAndAncestors } from "app/items/mutations/upsertItem"
import { NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const Children = z.array(
  z.object({
    id: z.number(),
    position: z.number(),
    parent_id: z.number(),
  }),
)

export default resolver.pipe(
  resolver.zod(Children),
  resolver.authorize(),
  async (input) => {
    const parent_id = input[0]?.parent_id

    if (!parent_id) {
      throw new NotFoundError("must provide parent_id")
    }

    const updatedProperties = await db.$transaction([
      ...input.map(({ position, id }) =>
        db.child.update({
          data: {
            position,
          },
          where: { id: Number(id) },
        }),
      ),
    ])

    const item = await db.item.findFirst({ where: { id: parent_id } })

    if (item) {
      await clearCacheForItemAndAncestors(item)
    }

    return updatedProperties
  },
)
