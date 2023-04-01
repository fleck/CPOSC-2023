/* eslint-disable @next/next/no-img-element */

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

import Layout from "app/core/layouts/Layout"
import searchItems from "app/items/queries/searchItems"
import { Item } from "db"
import { mapContent, BlockProps } from "app/items/components/Content"
import ct from "class-types.macro"
import Link from "next/link"

import { useRouter } from "next/router"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import { useState } from "react"
import Button from "app/core/components/Button"

const ITEMS_PER_PAGE = 100

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  let query = context.query?.query || ""

  if (query instanceof Array) {
    query = query.join(" ")
  }

  const page = Number(context.query?.page) || 0

  const { items, hasMore, count } = await searchItems({
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    query,
  })

  return { props: { page, items, hasMore, count, query } }
}

// https://tailwindui.com/components/application-ui/lists/grid-lists#component-ce021f02f586e0e6a5f8de2ca2ee537b
function Example({ items }: { items: Item[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <Link href={{ pathname: "/[itemUrl]", query: { itemUrl: item.url } }}>
            <a className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-1 text-gray-500 text-sm line-clamp-3">
                  {mapContent(item.contentState as BlockProps)}
                </div>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const ItemsList = ({
  page,
  items,
  hasMore,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const goToPreviousPage = () =>
    router.push({ query: { page: String(page - 1), query } })
  const goToNextPage = () =>
    router.push({ query: { page: String(page + 1), query } })

  return (
    <div>
      <ul>
        <Example items={items} />
      </ul>

      {(page > 0 || hasMore) && (
        <nav
          className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
          aria-label="Pagination"
        >
          <div className="flex-1 flex justify-between sm:justify-end">
            {page > 0 && (
              <button
                onClick={goToPreviousPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {hasMore && (
              <button
                onClick={goToNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}

const ItemsSearch = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const [allItems, setAllItems] = useState(false)

  const [data] = useQuery(
    searchItems,
    { query: props.query, standaloneOnly: false },
    { enabled: allItems },
  )

  return (
    <>
      <Head>
        <title>{props.query} - Idealguides Search</title>
      </Head>

      <div>
        <p>
          Can&apos;t find what you&apos;re looking for?{" "}
          <Link href={{ pathname: "/items/new", query: { name: props.query } }}>
            <a
              className={ct(
                "relative",
                "ml-3",
                "inline-flex",
                "items-center",
                "rounded-md",
                "border",
                "border-gray-300",
                "bg-white",
                "px-4",
                "py-2",
                "text-sm",
                "font-medium",
                "text-gray-700",
                "hover:bg-gray-50",
              )}
            >
              Create Item
            </a>
          </Link>
        </p>

        {allItems ? (
          <Button color="gray" onClick={() => setAllItems(false)}>
            Show only standalone items
          </Button>
        ) : (
          <Button color="cyan" onClick={() => setAllItems(true)}>
            Show all items
          </Button>
        )}

        <ItemsList {...props} items={data?.items || props.items} />
      </div>
    </>
  )
}

ItemsSearch.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>

export default ItemsSearch
