import Layout from "app/core/layouts/Layout"

import ct from "class-types.macro"
import db from "db"
import debounce from "lodash/debounce"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import Router from "next/router"

const debouncedPush = debounce(Router.push, 1000)

import { useState } from "react"

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { hostname } = query

  return {
    props: {
      indexers: await db.indexer.findMany(),
      hostname: typeof hostname === "string" ? hostname : "",
    },
  }
}

const Indexers = ({
  indexers,
  hostname,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [hostnameFilter, setHostnameFilter] = useState(hostname)

  const firstIndexer = indexers[0]

  if (!firstIndexer) {
    return <div>No Indexer could be found</div>
  }

  return (
    <>
      <div
        className={ct(
          "relative",
          "rounded-md",
          "border",
          "border-gray-300",
          "py-2",
          "px-3",
          "shadow-sm",
          "focus-within:border-lime-600",
          "focus-within:ring-1",
          "focus-within:ring-lime-600",
        )}
      >
        <label
          htmlFor="filterUrl"
          className={ct(
            "absolute",
            "-top-2",
            "left-2",
            "-mt-px",
            "inline-block",
            "bg-white",
            "px-1",
            "text-xs",
            "font-medium",
            "capitalize",
            "text-gray-900",
          )}
        >
          Filter by URL
        </label>
        <input
          id="filterUrl"
          className={ct(
            "block",
            "w-full",
            "border-0",
            "p-0",
            "text-gray-900",
            "placeholder-gray-500",
            "focus:ring-0",
            "sm:text-sm",
          )}
          name="filterUrl"
          value={hostnameFilter}
          onChange={(e) => {
            const newFilter = e.target.value

            if (newFilter) {
              debouncedPush({
                query: { hostname: newFilter },
              })?.catch(console.error)
            } else {
              debouncedPush({ query: {} })?.catch(console.error)
            }

            return setHostnameFilter(e.target.value)
          }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th />
            {Object.keys(firstIndexer).map((indexerKey) => (
              <th key={indexerKey}>{indexerKey}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indexers
            .filter((indexer) => indexer.hostname.includes(hostnameFilter))
            .map((indexer) => (
              <tr key={indexer.id}>
                <th>
                  <Link
                    href={{
                      pathname: "/indexers/[id]/edit",
                      query: { id: String(indexer.id) },
                    }}
                  >
                    <a>Edit</a>
                  </Link>
                </th>
                {Object.entries(indexer).map(([key, value]) => {
                  return (
                    <td key={key}>
                      {typeof value === "object" || typeof value === "boolean"
                        ? value instanceof Date
                          ? value.toJSON()
                          : JSON.stringify(value)
                        : value}
                    </td>
                  )
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

Indexers.authenticate = true
Indexers.getLayout = (page: JSX.Element) => (
  <Layout title={"All Indexers"}>{page}</Layout>
)

export default Indexers
