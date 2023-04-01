import { resolver } from "@blitzjs/rpc"
import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"
import { NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"
import { comparisonColumnSchema } from "../schema"

const comparisonColumns = z.array(comparisonColumnSchema)

export default resolver.pipe(
  resolver.zod(comparisonColumns),
  resolver.authorize(),
  async (input) => {
    const itemId = input[0]?.itemId

    if (!itemId) {
      throw new NotFoundError("must provide itemId")
    }

    const updatedProperties = await db.$transaction([
      ...input.map(({ position, id }) =>
        db.comparisonColumn.update({
          data: {
            position,
          },
          where: { id: Number(id) },
        }),
      ),
    ])

    await findItemByIdAndClearCache(itemId)

    return updatedProperties
  },
)
