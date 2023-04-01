import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"
import { CreateDatum, UpdateDatum } from "app/properties/Datum"
import db from "db"
import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import sample from "lodash/sample"
import { getData } from "../../app/properties/getData"
import type { Job } from "packages/indexer/src/types"
import { ChildItem } from "app/items/queries/getRootItem"
import { browsers } from "app/sockets"
import { propertyTemplateSchema } from "app/propertyTemplates/propertyTemplateSchema"
import { bigint } from "app/propertyTemplates/bigint"

export const appRouter = router({
  createProperty: publicProcedure
    .input(CreateDatum)
    .mutation(async ({ input }) => {
      const {
        itemId,
        featured,
        position,
        digitsAfterDecimal,
        fileId,
        indexerId,
        ...otherInputs
      } = input

      const datum = await db.property.create({
        data: {
          datum: {
            create: {
              ...otherInputs,
              digitsAfterDecimal: digitsAfterDecimal
                ? Number(digitsAfterDecimal)
                : null,
              indexerId: indexerId ? Number(indexerId) : null,
              fileId: fileId ? Number(fileId) : null,
            },
          },
          item: { connect: { id: itemId } },
          featured,
          position,
        },
        include: {
          datum: { include: { image: true, indexer: true } },
        },
      })

      await findItemByIdAndClearCache(itemId)

      return datum
    }),
  updateProperty: publicProcedure
    .input(UpdateDatum)
    .mutation(async ({ input, ctx }) => {
      const { itemId, featured, position, id, ...otherInputs } = input

      const property = await db.property.update({
        data: {
          datum: {
            update: {
              ...otherInputs,
              indexerId: otherInputs.indexerId
                ? Number(otherInputs.indexerId)
                : null,
              fileId: otherInputs.fileId ? Number(otherInputs.fileId) : null,
            },
          },
          item: { connect: { id: itemId } },
          featured,
          position,
        },
        include: {
          datum: { include: { image: true, indexer: true } },
        },
        where: { id: BigInt(id) },
      })

      await findItemByIdAndClearCache(itemId)

      await reIndex(property, ctx?.userId || 0)

      return property
    }),
  indexers: publicProcedure
    .input(z.object({ hostnames: z.array(z.string()) }))
    .query(async ({ input }) => {
      const indexers = await db.indexer.findMany({
        where: { hostname: { in: input.hostnames } },
      })

      return indexers
    }),
  createOrUpdatePropertyTemplate: publicProcedure
    .input(z.unknown())
    .mutation(async ({ input }) => {
      const { properties, id, ...propertyTemplate } =
        propertyTemplateSchema.parse(input)

      const propertiesQuery = {
        connectOrCreate: properties.map(
          ({ datum: { id: datumId, ...datum }, id, ...property }) => ({
            where: { id: BigInt(id) },
            create: {
              ...property,
              datum: {
                connectOrCreate: { where: { id: datumId }, create: datum },
              },
            },
          }),
        ),
      }

      const updatedOrCreatedPropertyTemplate = await db.propertyTemplate.upsert(
        {
          where: { id: BigInt(id) },
          create: {
            ...propertyTemplate,
            properties: propertiesQuery,
          },
          update: {
            ...propertyTemplate,
            properties: propertiesQuery,
          },
        },
      )

      return updatedOrCreatedPropertyTemplate
    }),
  propertyTemplates: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      const hostname = new URL(input.url).hostname

      const propertyTemplates = await db.propertyTemplate.findMany({
        where: { hostnames: { has: hostname } },
        include: { properties: { include: { datum: true } } },
      })

      return propertyTemplates
    }),
  createPropertiesFromTemplate: publicProcedure
    .input(
      z.object({
        propertyTemplateId: bigint,
        itemId: z.number(),
        url: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const propertyTemplate = await db.propertyTemplate.findFirst({
        where: { id: input.propertyTemplateId },
        include: { properties: { include: { datum: true } } },
      })

      if (!propertyTemplate) {
        throw new Error(
          `Cannot find template with id ${input.propertyTemplateId}`,
        )
      }

      const properties = await Promise.all(
        propertyTemplate.properties.map(
          ({ id, datum: { id: datumId, ...datum }, ...property }) =>
            db.property.create({
              data: {
                datum: datum.global
                  ? { connect: { id: datumId } }
                  : {
                      create: {
                        ...datum,
                        indexerId: datum.indexerId ? datum.indexerId : null,
                        fileId: datum.fileId ? datum.fileId : null,
                        url: input.url,
                      },
                    },
                item: { connect: { id: input.itemId } },
                featured: property.featured,
                position: property.position,
              },
              include: {
                datum: { include: { image: true, indexer: true } },
              },
            }),
        ),
      )

      await findItemByIdAndClearCache(input.itemId)

      return properties
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter

async function reIndex(
  property: ChildItem["properties"][number],
  userId?: number,
) {
  if (property.datum.indexer && property.datum.url) {
    const browser = sample([...browsers.values()])

    if (!browser) {
      throw new Error("No Browsers available to perform index")
    }

    const job: Job = {
      url: property.datum.url,
      queue: "single",
      notify: userId ? [userId] : [],
      dataToIndex: await getData(property),
    }

    browser.send(JSON.stringify(job))
  }
}
