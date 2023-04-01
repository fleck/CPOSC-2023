/* eslint-disable @next/next/no-img-element */
import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"
import React, { useState, Suspense, lazy } from "react"
import { PencilIcon } from "@heroicons/react/outline"
import { ChildItem } from "../queries/getRootItem"
import { urlFor } from "app/file/url"
import { PropertyValue } from "./PropertyValue"
import { validHeightAndWidth } from "./validHeightAndWidth"

const EditProperty = lazy(() => import("./EditProperty"))

export const Property = ({
  property,
  globalEditMode,
  item,
  setItem,
  properties,
  propertiesInGroup,
  className = "",
}: { property: ChildItem["properties"][number] } & {
  globalEditMode: boolean
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  properties: ChildItem["properties"]
  propertiesInGroup: ChildItem["properties"]
  className?: ClassTypes
}) => {
  const [editMode, setEditMode] = useState(BigInt(property.id) < 1)
  const {
    name = "",
    text = "",
    dynamic,
    image,
    postfix,
    prefix,
    digitsAfterDecimal,
  } = property.datum

  return (
    <div
      key={property.id.toString()}
      className={ct(
        "grid",
        "gap-4",
        "py-4",
        "py-5",
        "px-6",
        className,
        globalEditMode ? "grid-cols-4" : "grid-cols-3",
      )}
    >
      {globalEditMode && (
        <div className={ct("flex")}>
          <EditButton
            color={editMode ? "gray" : "amber"}
            onClick={() => setEditMode((prevEditMode) => !prevEditMode)}
            className={ct("h-[1.625rem]")}
            aria-label={`Edit Property ${property.datum.name}`}
          >
            <PencilIcon className={ct("h-4", "w-4")} />
          </EditButton>
        </div>
      )}
      {editMode ? (
        <Suspense fallback={null}>
          <EditProperty
            {...{
              property,
              item,
              setItem,
              dynamic,
              properties,
              propertiesInGroup,
            }}
          />
        </Suspense>
      ) : image && validHeightAndWidth(image) ? (
        <>
          <div className="block relative w-full col-span-3 aspect-w-10 aspect-h-7 overflow-hidden">
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
                alt={image.description}
                src={urlFor(image)}
                width={image.metadata.width}
                height={image.metadata.height}
                className={ct("mx-auto", "rounded-md")}
                aria-labelledby={property.id.toString() + name + "-name"}
                loading="lazy"
              />
            </picture>
          </div>
          <div className="mt-4 col-span-3 mx-auto flex items-start justify-between">
            <h2
              id={property.id.toString() + name + "-name"}
              className={ct(
                "flex",
                "items-center",
                "text-sm",
                "font-medium",
                "text-gray-500",
              )}
            >
              {name}
            </h2>
          </div>
        </>
      ) : (
        <>
          <dt
            className={ct(
              "flex",
              "items-center",
              "text-sm",
              "font-medium",
              "text-gray-500",
            )}
          >
            {name}{" "}
          </dt>
          <dd className="text-sm text-gray-900 col-span-2 items-center flex">
            <PropertyValue
              {...{ prefix, digitsAfterDecimal, dynamic, text, item, postfix }}
            />
          </dd>
        </>
      )}
    </div>
  )
}
