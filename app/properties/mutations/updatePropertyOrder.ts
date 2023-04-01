import { resolver } from "@blitzjs/rpc"
import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"

import db from "db"
import * as z from "zod"

const CreateDatum = z.array(
  z.object({
    id: z.any(),
    position: z.number(),
    item_id: z.number().nullable(),
  }),
)

export default resolver.pipe(
  resolver.zod(CreateDatum),
  resolver.authorize(),
  async (input) => {
    const updatedProperties = await db.$transaction([
      ...input.map(({ position, id }) =>
        db.property.update({
          data: {
            position,
          },
          where: { id: Number(id) },
        }),
      ),
    ])

    input[0]?.item_id && (await findItemByIdAndClearCache(input[0].item_id))

    return updatedProperties
  },
)
