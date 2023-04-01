import * as z from "zod"
import db from "db"

const homePageIdSchema = z.array(z.number())

export async function getFeaturedPageIds() {
  const featuredPagesRaw = await db.setting.findFirst({
    where: { key: "featuredPages" },
  })

  const parsedFeaturedPages = homePageIdSchema.safeParse(
    featuredPagesRaw?.value,
  )

  return parsedFeaturedPages.success ? parsedFeaturedPages.data : []
}
