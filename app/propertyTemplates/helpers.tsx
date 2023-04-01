import bodyParser from "body-parser"
import util from "util"
import { GetServerSidePropsContext } from "next"
import type QueryString from "qs"
import db from "db"
import { newProperty } from "app/properties/models/newProperty"

export const find = (id: bigint) => {
  return db.propertyTemplate.findFirst({
    where: { id },
    include: {
      properties: { include: { datum: { include: { indexer: true } } } },
    },
  })
}

export type PropertyTemplate = Awaited<ReturnType<typeof find>>

let propertyTemplateIdSequence = 0

export const emptyPropertyTemplate = (
  property?: ReturnType<typeof newProperty>,
) =>
  ({
    name: "",
    hostnames: [""],
    id: BigInt(propertyTemplateIdSequence--),
    properties: property ? [property] : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const)

const getBody = util.promisify(bodyParser.urlencoded({ extended: true }))

type RequestWithBody = GetServerSidePropsContext["req"] & {
  body?: QueryString.ParsedQs
}

export const form = async ({
  req,
  res,
}: Pick<GetServerSidePropsContext, "res"> & { req: RequestWithBody }) => {
  await getBody(req, res)

  return req.body || {}
}
