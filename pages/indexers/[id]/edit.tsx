import Button from "app/core/components/Button"
import Layout from "app/core/layouts/Layout"
import {
  replacementsSchema,
  selectorsSchema,
} from "packages/indexer/src/IndexerSchema"

import updateIndexer from "app/indexers/mutations/updateIndexer"

import db from "db"
import { useState } from "react"
import { IndexerForm } from "../../../app/indexers/IndexerForm"
import { Loading } from "../../../app/core/components/Loading"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { NotFoundError } from "blitz"
import { useMutation } from "@blitzjs/rpc"

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  if (typeof query["id"] !== "string") throw new NotFoundError()

  const indexer = await db.indexer.findFirst({
    where: { id: Number(query["id"]) },
  })

  if (!indexer) throw new NotFoundError()

  return { props: { indexer } }
}

const EditIndexer = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const [indexer, setIndexer] = useState(props.indexer)

  const [updateIndexerMutation, { isLoading }] = useMutation(updateIndexer)

  const parsedSelectors = selectorsSchema.safeParse(indexer.selectors)

  const selectors = parsedSelectors.success ? parsedSelectors.data : []

  const parsedReplacements = replacementsSchema.safeParse(indexer.replacements)

  const replacements = parsedReplacements.success ? parsedReplacements.data : []

  return (
    <IndexerForm
      onSubmit={async (values) => {
        const parsedSelectors = selectorsSchema.safeParse(values.selectors)

        const selectors = parsedSelectors.success ? parsedSelectors.data : []

        const parsedReplacements = replacementsSchema.safeParse(
          values.replacements,
        )

        const replacements = parsedReplacements.success
          ? parsedReplacements.data
          : []

        const newIndexer = {
          ...indexer,
          ...values,
          selectors,
          replacements,
        }

        setIndexer({
          ...newIndexer,
          nextIndexerId: newIndexer.nextIndexerId
            ? Number(newIndexer.nextIndexerId)
            : null,
        })

        const updatedIndexer = await updateIndexerMutation(newIndexer)

        setIndexer(updatedIndexer)
      }}
      initialValues={{
        ...indexer,
        selectors,
        replacements,
      }}
    >
      <Button type="submit" color="lime">
        {isLoading && <Loading />}
        Update Indexer
      </Button>
    </IndexerForm>
  )
}

EditIndexer.authenticate = true
EditIndexer.getLayout = (page: JSX.Element) => (
  <Layout title={"Create New Indexer"}>{page}</Layout>
)

export default EditIndexer
