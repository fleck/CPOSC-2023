import React, { useState } from "react"

import Layout from "app/core/layouts/Layout"
import getRootItem, { ChildItem } from "app/items/queries/getRootItem"
import ct from "class-types.macro"
import Properties from "app/items/components/Properties"
import { useHotkeys } from "react-hotkeys-hook"

import Item from "app/items/components/Item"
import { newProperty } from "app/properties/models/newProperty"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { NotFoundError } from "blitz"
import Head from "next/head"
import { publiclyCache } from "../app/cache"
import { getSession } from "@blitzjs/auth"
import db from "db"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    query: { itemUrl },
    res,
    req,
  } = ctx

  if (typeof itemUrl !== "string") throw new NotFoundError()

  let item = await getRootItem({ url: itemUrl })

  let caseInsensitive

  if (!item) {
    caseInsensitive = await db.item.findFirst({
      where: {
        url: {
          contains: itemUrl,
          mode: "insensitive",
        },
      },
    })

    if (caseInsensitive) {
      res.statusCode = 301
      res.setHeader("Location", `/${caseInsensitive.url}`)
    }
  }

  if (!item && !caseInsensitive) {
    const redirect = await db.redirect.findFirst({
      where: { from: itemUrl },
      include: { to: true },
    })

    if (redirect) {
      res.statusCode = 301
      res.setHeader("Location", `/${redirect.to.url}`)
    } else {
      res.statusCode = 404
    }

    /**
     * If the item isn't standalone we'll still show it to logged in users.
     * But, we want to make sure the page isn't stored in a public cache.
     */
  } else if (item && !item.standalone) {
    const session = await getSession(req, res)

    if (!session.$isAuthorized()) {
      item = null
      res.statusCode = 401
    }

    return { props: { item } }
  }

  publiclyCache({
    req,
    res,
    for: [365, "days"],
    ...(item && { items: [item] }),
  }).catch(console.warn)

  return { props: { item } }
}

const HasItem = (props: { item: ChildItem }) => {
  const [item, setItem] = useState(props.item)

  /**
   * When pages are navigated client side the root item is changed.
   * We need to ensure that state is updated when this happens.
   */
  if (props.item.id !== item.id) {
    setItem(props.item)
  }

  const [globalEditMode, setGlobalEditMode] = useState(false)

  useHotkeys("cmd+i", () => setGlobalEditMode((prev) => !prev))

  const properties = item.properties.filter((property) => !property.featured)

  const featuredProperties = item.properties.filter(
    (property) => property.featured,
  )

  return (
    <Layout
      navItems={[
        { text: "View", active: true },
        {
          onClick: () =>
            setGlobalEditMode((previousEditMode) => !previousEditMode),
          text: "Edit",
        },
      ]}
    >
      <Head>
        <title>{item.name}</title>
      </Head>

      {(featuredProperties.length > 0 || globalEditMode) && (
        <Properties
          properties={featuredProperties}
          title="Featured Properties"
          className={ct("my-3", "sm:float-right")}
          propertyTemplate={{ ...newProperty(), featured: true }}
          {...{ globalEditMode, item, setItem }}
        />
      )}

      <Item {...{ globalEditMode, item, setItem }} style={{ marginLeft: 0 }} />

      {(properties.length > 0 || globalEditMode) && (
        <Properties
          title="Properties"
          className={ct("my-3")}
          {...{ globalEditMode, item, setItem, properties }}
        />
      )}
    </Layout>
  )
}

const ShowItemPage = ({
  item,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!item)
    return <Layout>We can&apos;t find the page you&apos;re looking for</Layout>

  return <HasItem {...{ item }} />
}

export default ShowItemPage
