import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createIndexer from "app/indexers/mutations/createIndexer"

import { IndexerForm } from "../../app/indexers/IndexerForm"

const NewIndexer = () => {
  const [createIndexerMutation] = useMutation(createIndexer)

  return (
    <IndexerForm
      onSubmit={async (values) =>
        createIndexerMutation({
          ...values,
        })
      }
      submitText="Create Indexer"
    />
  )
}

NewIndexer.authenticate = true
NewIndexer.getLayout = (page: JSX.Element) => (
  <Layout title={"Create New Indexer"}>{page}</Layout>
)

export default NewIndexer
