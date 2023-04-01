import db from "db"

export const getHomePageItems = async (featuredPageIds: number[]) => {
  return await db.item.findMany({
    where: {
      id: { in: featuredPageIds },
    },
    include: {
      properties: { include: { datum: { include: { image: true } } } },
    },
  })
}

export type HomePageItems = Awaited<ReturnType<typeof getHomePageItems>>
