/* eslint-disable @next/next/no-img-element */
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/outline"
import { Align } from "@prisma/client"
import EditButton from "app/core/components/EditButton"
import { urlFor } from "app/file/url"
import { newProperty } from "app/properties/models/newProperty"
import ct from "class-types.macro"
import Link from "next/link"
import React, { lazy, Suspense, useState } from "react"
import type { ChildItem } from "../queries/getRootItem"
import { createNewColumn } from "./AddColumn"
import { PropertyValue } from "./PropertyValue"
import { validHeightAndWidth } from "./validHeightAndWidth"
import { File } from "db"

const AddColumn = lazy(() => import("./AddColumn"))
const EditComparisonHeader = lazy(() => import("./ColumnHeaderEditor"))
const EditItemInCell = lazy(() => import("./EditItemInCell"))
const EditProperty = lazy(() => import("./EditProperty"))

type Props = {
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  editing: boolean
}

export const Comparison = ({ item, editing, setItem }: Props) => {
  const [artificialColumn] = useState(
    createNewColumn({
      itemId: item.id,
      align: item.comparisonColumns[0]?.align || Align.LEFT,
      subject: true,
    }),
  )

  if (!editing && (!item.comparisonColumns.length || !item.children.length))
    return null

  const comparisonColumnsWithSubject = item.comparisonColumns.some(
    (column) => column.subject,
  )
    ? item.comparisonColumns
    : [artificialColumn, ...item.comparisonColumns]

  return (
    <table>
      <thead>
        <tr>
          {editing && (
            <th>
              <Suspense fallback={null}>
                <AddColumn {...{ setItem, item }} />
              </Suspense>
            </th>
          )}
          {comparisonColumnsWithSubject.map((comparisonColumn) => (
            <th key={comparisonColumn.id.toString()}>
              {editing && (
                <Suspense fallback={null}>
                  <EditComparisonHeader
                    {...{ comparisonColumn, item, setItem }}
                  />
                </Suspense>
              )}
              {comparisonColumn.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {item.children.map((child) => (
          <tr key={child.id}>
            {editing && <th />}
            {comparisonColumnsWithSubject.map((comparisonColumn) => (
              <td key={comparisonColumn.id.toString()}>
                <Cell
                  editingItem={editing}
                  setParentItem={setItem}
                  {...{ comparisonColumn, child }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type CellProps = {
  child: Exclude<ChildItem["children"], undefined>[number]
  comparisonColumn: ChildItem["comparisonColumns"][number]
  editingItem: boolean
  setParentItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

const Cell = ({
  child,
  comparisonColumn,
  editingItem,
  setParentItem,
}: CellProps) => {
  const [item, setItem] = useState(child.item)

  const property = item.properties.find(
    (pr) => pr.datum.name === comparisonColumn.name,
  )

  const [editMode, setEditMode] = useState(
    comparisonColumn.subject && item.id < 1,
  )

  if (comparisonColumn.subject) {
    if (editMode) {
      return (
        <Suspense fallback={null}>
          <EditItemInCell
            {...{ item, setItem, child, setParentItem, setEditMode }}
          />
        </Suspense>
      )
    }

    if (item.standalone) {
      return (
        <Link href={{ pathname: "/[itemUrl]", query: { itemUrl: item.url } }}>
          {item.name}
        </Link>
      )
    }

    return <>{item.name}</>
  }

  if (property) {
    const { dynamic, image } = property.datum

    if (editMode) {
      return (
        <Suspense fallback={null}>
          <EditButton
            color="gray"
            onClick={() => setEditMode(false)}
            className={ct("h-[1.625rem]")}
            aria-label={`Edit Property ${property.datum.name}`}
          >
            <PencilIcon className={ct("h-4", "w-4")} />
          </EditButton>
          <EditProperty
            {...{
              property,
              item,
              setItem,
              dynamic,
              properties: item.properties,
            }}
          />
        </Suspense>
      )
    }

    if (image && validHeightAndWidth(image)) {
      if (item.standalone) {
        return (
          <Link
            href={{
              pathname: "/[itemUrl]",
              query: { itemUrl: item.url },
            }}
          >
            <a>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image {...{ image, property }} />
            </a>
          </Link>
        )
      } else {
        /* eslint-disable-next-line jsx-a11y/alt-text */
        return <Image {...{ image, property }} />
      }
    }

    return (
      <span
        onClick={(event) => {
          if (editingItem) {
            event.preventDefault()
            setEditMode(true)
          }
        }}
        role={editingItem ? "button" : undefined}
      >
        <PropertyValue {...{ item, ...property.datum }} />
      </span>
    )
  }

  return (
    <>
      {editingItem && (
        <Suspense fallback={null}>
          <div className={ct("col-span-4", "block", "px-2", "pt-3")}>
            <EditButton
              className={ct("mx-auto", "my-2")}
              onClick={() => {
                setItem((prevItem) => {
                  const propertyToAdd = newProperty()

                  return {
                    ...prevItem,
                    properties: [
                      ...prevItem.properties,
                      {
                        ...propertyToAdd,
                        datum: {
                          ...propertyToAdd.datum,
                          name: comparisonColumn.name,
                        },
                      },
                    ],
                  }
                })

                setEditMode(true)
              }}
              color="amber"
            >
              <PlusCircleIcon className={ct("h-4", "w-4")} />
            </EditButton>
          </div>
        </Suspense>
      )}
    </>
  )
}
type ImageProps = {
  image: File & {
    metadata: {
      width: number
      height: number
    }
  }
  property: ChildItem["properties"][number]
}

function Image({ image, property }: ImageProps) {
  const maxHeight = 96

  const width = (image.metadata.width / image.metadata.height) * maxHeight

  return (
    <picture>
      <source type="image/avif" srcSet={urlFor(image, "searchResultAvif")} />
      <source type="image/webp" srcSet={urlFor(image, "searchResultWebp")} />
      <img
        alt={image.description}
        src={urlFor(image, "searchResult")}
        width={width}
        height={maxHeight}
        className={ct("rounded-md")}
        aria-labelledby={property.id.toString() + "-name"}
        loading="lazy"
      />
    </picture>
  )
}
