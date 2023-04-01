/* eslint-disable @next/next/no-img-element */
import { useMutation } from "@blitzjs/rpc"

import Link from "next/link"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

import Layout from "app/core/layouts/Layout"
import { useState } from "react"
import upsertSetting from "app/settings/mutations/upsertSetting"
import { BlockProps, mapContent } from "app/items/components/Content"
import { validHeightAndWidth } from "app/items/components/validHeightAndWidth"
import ct from "class-types.macro"
import { urlFor } from "app/file/url"

import { prefetchFromEventTarget } from "../app/prefetchData"
import { getHomePageItems } from "app/items/getHomePageItems"
import { getFromCache } from "app/items/getFromCache"
import { putItemInCache } from "app/items/putItemInCache"
import { getFeaturedPageIds } from "app/items/getFeaturedPageIds"
import { publiclyCache } from "../app/cache"

const homePageItems = async () => {
  const cachedItem = await getFromCache("/")

  if (cachedItem?.value && !("comparisonColumns" in cachedItem.value)) {
    return cachedItem.value
  }

  const featuredPageIds = await getFeaturedPageIds()

  const items = await getHomePageItems(featuredPageIds)

  await putItemInCache({ value: items, url: "/" })

  return items
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const items = await homePageItems()

  publiclyCache({ ...ctx, for: [365, "days"], items }).catch(console.warn)

  return { props: { items } }
}

type ItemsResult = InferGetServerSidePropsType<typeof getServerSideProps>

const Home = ({ items }: ItemsResult) => {
  const [editMode, setEditMode] = useState(false)

  const [upsertSettingMutation] = useMutation(upsertSetting)

  const [errorMessage, setErrorMessage] = useState("")

  return (
    <Layout
      navItems={[
        {
          onClick: () => setEditMode((previousEditMode) => !previousEditMode),
          text: "Edit",
        },
      ]}
    >
      {editMode && (
        <>
          <textarea
            onChange={async ({ target }) => {
              try {
                const ids = JSON.parse(target.value)

                if (ids && ids instanceof Array) {
                  const value = ids.map(Number)

                  await upsertSettingMutation({
                    key: "featuredPages",
                    value,
                  })

                  setErrorMessage("")

                  return
                }
              } catch (error) {
                if (error && typeof error === "object") {
                  setErrorMessage(error.toString())
                }
                return
              }

              alert("must be JSON Array")
            }}
            defaultValue={JSON.stringify(items.map((item) => item.id))}
          ></textarea>
          {errorMessage && errorMessage}
        </>
      )}
      <div className="container">
        <main
          tabIndex={-1}
          className="focus:outline-none container px-3 mx-auto flex-grow"
        >
          <div className="py-12">
            <div className="max-w-7xl mx-auto ">
              <div className="bg-lime-50 rounded-md">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                    <span className="block">
                      The Best Comparisons and Guides
                    </span>
                    <span className="block text-lime-700">
                      Add great comparisons to your site today.
                    </span>
                  </h2>
                  <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                      <Link href={{ pathname: "/embed" }}>
                        <a
                          className={ct(
                            "inline-flex",
                            "items-center",
                            "justify-center",
                            "rounded-md",
                            "border",
                            "border-transparent",
                            "bg-lime-700",
                            "py-3",
                            "px-5",
                            "text-base",
                            "font-medium",
                            "text-white",
                            "hover:bg-lime-800",
                          )}
                        >
                          Get started
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Share common steps between guides
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      If we have 10 guides that share common steps they can be
                      shared.{" "}
                      <strong className="text-yellow-700">
                        Update a list on one guide, and it&apos;s updated on all
                        the other guides that include it.
                      </strong>
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Keeping information current
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      When users compare items in our guides they&apos;ll{" "}
                      <strong className="text-yellow-700">
                        stop wasting time
                      </strong>{" "}
                      on discontinued items outdated pricing.
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Collaboration
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Don&apos;t see the comparison you&apos;re looking for? Go
                      ahead and create it! Information seem incorrect or out of
                      date? You can correct it. IdealGuides allows our users to
                      help keep guides{" "}
                      <strong className="text-yellow-700">up to date</strong>.
                    </dd>
                  </div>
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                        Calculated data
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      How many years till that solar panel installation pays
                      off? See the calculated payoff time based on up to date
                      utility rates and product pricing.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="text-xl sm:text-3xl mt-8 lg:text-4xl leading-none font-extrabold text-gray-900 tracking-tight mb-8 text-center">
            Featured pages
          </div>
          <div className="mt-12 mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {[...items]
              .sort(function imagesFirst(a, b) {
                return Number(!!firstImage(b)) - Number(!!firstImage(a))
              })
              .map((item) => (
                <ItemTile key={item.id} item={item} />
              ))}
          </div>
        </main>

        <footer className="container px-3 mx-auto py-5 text-center">
          <a className="mx-6 py-4" href="pages/terms-of-use">
            Terms of Use
          </a>

          <a className="mx-6 py-4" href="/pages/privacy-policy">
            Privacy Policy
          </a>
        </footer>
      </div>
    </Layout>
  )
}

export default Home

type ItemResult = ItemsResult["items"][number]

const firstImage = (item: ItemResult) =>
  item.properties.find((property) => property.featured && property.datum.image)
    ?.datum.image

function ItemTile({ item }: { item: ItemResult }) {
  const image = firstImage(item)

  return (
    <div
      className={ct(
        "",
        "col-span-1",
        "flex",
        "flex-col",
        "divide-y",
        "divide-gray-200",
        "rounded-lg",
        "bg-white",
        "text-center",
        "shadow",
        image ? "row-span-2" : "",
      )}
    >
      <Link href={{ pathname: "/[itemUrl]", query: { itemUrl: item.url } }}>
        <a
          className={ct(
            "h-full",
            "overflow-hidden",
            "rounded-lg",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-lime-500",
          )}
          onPointerEnter={prefetchFromEventTarget({ itemUrl: item.url })}
          onTouchStart={prefetchFromEventTarget({ itemUrl: item.url })}
        >
          {image && validHeightAndWidth(image) && (
            <div
              className={ct(
                "flex",
                "h-48",
                "items-center",
                "justify-center",
                "overflow-hidden",
                "rounded-t-lg",
              )}
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet={urlFor(image, "searchResultAvif")}
                />
                <source
                  type="image/webp"
                  srcSet={urlFor(image, "searchResultWebp")}
                />
                <img
                  src={urlFor(image, "searchResult")}
                  alt={image.name}
                  width={image.metadata.width}
                  height={image.metadata.height}
                  loading="lazy"
                />
              </picture>
            </div>
          )}
          <div className="flex-1 bg-white p-6 flex flex-col justify-between">
            <div className="flex-1">
              <div className="mt-2">
                <p className="text-xl font-semibold text-gray-900">
                  {item.name}
                </p>
                <div className="mt-3 text-base text-gray-500">
                  {mapContent(item.contentState as BlockProps)}
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}
