import { resolver } from "@blitzjs/rpc"
import { handleKnownErrors } from "app/items/handleKnownErrors"
import db from "db"
import * as z from "zod"

const UpdateChild = z.object({
  id: z.number(),
  item_id: z.number(),
  parent_id: z.number(),
  titleType: z.literal("SPECIFIC").or(z.literal("GENERIC")).optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateChild),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const child = await db.child
      .update({ where: { id }, data })
      .catch(handleKnownErrors)

    return child
  },
)
