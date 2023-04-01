import Layout from "app/core/layouts/Layout"
import { PropertyTemplateForm } from "app/propertyTemplates/Form"

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { find } from "../../../app/propertyTemplates/helpers"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query

  if (typeof id !== "string")
    return { props: { error: new Error("Invalid id") } }

  const propertyTemplate = await find(BigInt(id)).catch((e: unknown) =>
    e instanceof Error ? e : new Error("Unknown error"),
  )

  if (!propertyTemplate || propertyTemplate instanceof Error) {
    return { props: { error: propertyTemplate } }
  }

  return { props: { propertyTemplate } }
}

export default function EditPropertyTemplate({
  propertyTemplate,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!propertyTemplate) return

  return <PropertyTemplateForm {...{ propertyTemplate }} />
}

EditPropertyTemplate.getLayout = (page: JSX.Element) => (
  <Layout title={"All Indexers"}>{page}</Layout>
)
