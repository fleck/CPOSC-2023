import Link from "next/link"
import ct from "class-types.macro"
import deepEqual from "deep-equal"
import React, { Suspense, useState } from "react"
import type { ChildItem } from "../queries/getRootItem"
import { BlockProps, mapContent } from "./Content"
import { Comparison } from "./Comparison"
import { bare } from "../model/bare"
import EditButton from "app/core/components/EditButton"
import { XCircleIcon } from "@heroicons/react/solid"
import { lazy } from "react"
import type { DeepReadonly } from "../TypeUtilities"
import type { OnSave } from "./Editor"
import { isNewRecord } from "../../core/model/isNewRecord"
import { Heading } from "../../core/components/Heading"
import { Title } from "./Title"

const Editor = lazy(() => import("./Editor"))

type Props = DeepReadonly<{
  globalEditMode: boolean
  item: ChildItem
  child?: Exclude<ChildItem["children"], undefined>[number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  setParentItem?: React.Dispatch<React.SetStateAction<ChildItem>>
  parentItem?: ChildItem
  style?: React.CSSProperties
}> &
  OnSave

const ChildItemComponent = (
  props: Omit<Required<Props>, "setItem" | "style" | "onSave">,
) => {
  const [item, setItem] = useState(props.item)

  return <Item {...props} {...{ setItem, item }} />
}

export default function Item({
  globalEditMode,
  item,
  setItem,
  child,
  setParentItem,
  parentItem,
  style,
  onSave,
}: Props) {
  const [editing, setEditMode] = useState(false)

  if (!editing && isNewRecord(item)) {
    setEditMode(true)
  }

  // Used to track if item changes have been persisted.
  const [itemInitialState, setItemInitialState] = useState(bare(item))

  /**
   * When we change the root item we want to reset the initial state.
   */
  if (itemInitialState.id !== item.id) {
    setItemInitialState(bare(item))
  }

  const dirty = !deepEqual(bare(item), itemInitialState)

  // https://tailwindui.com/components/marketing/sections/content-sections#component-3f7a35fa653498b2c62441a98df3dc08
  return (
    <section
      style={style}
      className={ct("text-lg", globalEditMode ? "ml-10" : "")}
    >
      <Heading
        onClick={() => {
          if (globalEditMode && !editing) {
            setEditMode(true)
          }
        }}
        aria-label={
          globalEditMode && !editing ? `Edit ${item.name}` : undefined
        }
        className="mt-2"
        size={child ? "2xl" : "3xl"}
      >
        <Title {...{ editing, item, setItem, globalEditMode, child }} />
        {editing && (
          <EditButton
            className={ct("mr-2", "h-7", "w-7", "flex-shrink-0")}
            onClick={() => setEditMode(false)}
            color="gray"
            aria-label={`Cancel editing ${item.name}`}
          >
            <XCircleIcon />
          </EditButton>
        )}
        {dirty && !editing && (
          <span className={ct("text-sm", "font-normal", "text-yellow-500")}>
            {" "}
            warning content not saved!
          </span>
        )}
      </Heading>
      {editing && (
        <>
          <label>
            URL:{" "}
            <input
              className={ct(
                "cursor-text",
                "whitespace-pre-wrap",
                "rounded",
                "border",
                "border-solid",
                "border-gray-300",
                "focus:placeholder-transparent",
              )}
              value={item.url}
              aria-label={`URL for item`}
              placeholder="URL title for item"
              onChange={(event) =>
                setItem((prevItem) => ({
                  ...prevItem,
                  url: event.target.value,
                }))
              }
              style={{ font: "inherit", letterSpacing: "inherit" }}
            />
          </label>
          <span className={ct("text-sm", "font-normal", "text-yellow-500")}>
            Changing a URL may lead to broken links and cache may not clear
            properly.
          </span>
        </>
      )}

      <div
        className={ct(
          "prose",
          "prose-lg",
          "prose-lime",
          "mt-6",
          "text-gray-500",
        )}
      >
        {editing ? (
          <Suspense fallback={<div>Loading</div>}>
            <Editor
              {...{
                onSave,
                item,
                setItem,
                dirty,
                setItemInitialState,
                setParentItem,
                child,
                parentItem,
              }}
              // Force editor to re-render when item is changed.
              key={item.id}
            />
          </Suspense>
        ) : Boolean(item.contentState) ? (
          mapContent(item.contentState as BlockProps)
        ) : (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        )}
      </div>

      {item.type === "PAGE" ? (
        item.children.map((child) => (
          <ChildItemComponent
            key={child.id}
            item={child.item}
            setParentItem={setItem}
            parentItem={item}
            {...{ globalEditMode, child }}
          />
        ))
      ) : item.type === "COMPARISON" ? (
        <Comparison {...{ item, setItem, editing }} />
      ) : (
        <List item={item} />
      )}
    </section>
  )
}

function List({ item }: { item: ChildItem }) {
  return item.children.length ? (
    <ul>
      {item.children.map((child) => {
        if (child.item.standalone) {
          return (
            <li key={child.id}>
              <Link
                href={{
                  pathname: "/[itemUrl]",
                  query: { itemUrl: child.item.url },
                }}
              >
                {child.item.name}
              </Link>
            </li>
          )
        }
        return <li key={child.id}>{child.item.name}</li>
      })}
    </ul>
  ) : null
}
