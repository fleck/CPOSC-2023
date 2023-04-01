import Layout from "app/core/layouts/Layout"
import React from "react"

import { InferGetServerSidePropsType } from "next"

import { PropertyTemplateForm } from "../../app/propertyTemplates/Form"
import { emptyPropertyTemplate } from "../../app/propertyTemplates/helpers"

export const getServerSideProps = async () => {
  return { props: { propertyTemplate: emptyPropertyTemplate() } }
}

export default function NewPropertyTemplate({
  propertyTemplate,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!propertyTemplate) return

  return <PropertyTemplateForm {...{ propertyTemplate }} />
}

NewPropertyTemplate.getLayout = (page: JSX.Element) => (
  <Layout title="New Property Template">{page}</Layout>
)
