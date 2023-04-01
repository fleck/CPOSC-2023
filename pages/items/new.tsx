import Layout from "app/core/layouts/Layout"
import Item from "app/items/components/Item"
import { useState } from "react"
import type { ChildItem } from "app/items/queries/getRootItem"
import { newItem } from "app/core/components/newItem"

import { useRouter } from "next/router"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  let name = context.query?.name

  if (typeof name !== "string") {
    name = ""
  }

  return { props: { name } }
}

const NewItemPage = ({
  name,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [item, setItem] = useState<ChildItem>({ ...newItem(), name })
  const router = useRouter()

  const [globalEditMode] = useState(true)

  return (
    <>
      <h1>Create New Item</h1>

      <Item
        onSave={(savedItem) =>
          router.push({
            pathname: "/[itemUrl]",
            query: { itemUrl: savedItem.url },
          })
        }
        {...{ globalEditMode, item, setItem }}
      />
    </>
  )
}

// NewItemPage.authenticate = true
NewItemPage.getLayout = (page: JSX.Element) => (
  <Layout title={"Create New Item"}>{page}</Layout>
)

export default NewItemPage
