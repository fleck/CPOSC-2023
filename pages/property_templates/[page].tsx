import Layout from "app/core/layouts/Layout"
import React from "react"
import db from "db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { Heading } from "app/core/components/Heading"

const perPage = 4

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const page = Number(query.page) || 1

  const [templates, count] = await Promise.all([
    db.propertyTemplate.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        id: "asc",
      },
    }),
    db.propertyTemplate.count(),
  ])

  const lastPage = count < 1 || Math.ceil(count / perPage) === page

  return { props: { templates, page, lastPage } }
}

export default function PropertyTemplates({
  page,
  templates,
  lastPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Heading>Property Templates</Heading>
      <Link href={{ pathname: "/property_templates/new" }}>
        <a>Create new</a>
      </Link>
      {templates.map((template) => (
        <div key={template.id.toString()}>
          id: {template.id.toString()} name: {template.name}
          <Link
            href={{
              pathname: "/property_templates/edit/[id]",
              query: { id: template.id.toString() },
            }}
          >
            <a>Edit</a>
          </Link>
        </div>
      ))}
      {page > 1 && (
        <Link
          href={{
            pathname: "/property_templates/[page]",
            query: { page: (page - 1).toString() },
          }}
        >
          <a>Previous</a>
        </Link>
      )}

      {!lastPage && (
        <Link
          href={{
            pathname: "/property_templates/[page]",
            query: { page: (page + 1).toString() },
          }}
        >
          <a>Next</a>
        </Link>
      )}
    </>
  )
}

PropertyTemplates.getLayout = (page: JSX.Element) => (
  <Layout title={"All Indexers"}>{page}</Layout>
)
