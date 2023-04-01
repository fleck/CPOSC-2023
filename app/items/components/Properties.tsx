import ct from "class-types.macro"
import React, { lazy, Suspense } from "react"

import type { ChildItem, ChildOrRootItem } from "../queries/getRootItem"

import { group } from "../../properties/models/group"
import { DeepReadonly } from "../TypeUtilities"
import { Property } from "./Property"

const EditGroup = lazy(() => import("./EditGroup"))

const AddNewProperty = lazy(() => import("./AddNewProperty"))

const AddNewPropertiesFromTemplate = lazy(
  () => import("./AddNewPropertiesFromTemplate"),
)

const ImportItem = lazy(() => import("./ImportItem"))

type Props = DeepReadonly<{
  globalEditMode: boolean
  item: ChildOrRootItem
  setItem: React.Dispatch<React.SetStateAction<ChildOrRootItem>>
  properties: ChildOrRootItem["properties"]
  title: string
  className?: ClassTypes
  propertyTemplate?: ChildOrRootItem["properties"][number]
}>

/** https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f */
export default function Properties({
  globalEditMode,
  item,
  setItem,
  properties,
  title,
  className = "",
  propertyTemplate,
}: Props) {
  const propertiesInGroups = group(properties)

  const groups = propertiesInGroups.map(([group]) => group)

  return (
    <div
      className={ct(
        "mr-1",
        "overflow-hidden",
        "bg-white",
        "shadow",
        "sm:w-[26rem]",
        "sm:rounded-lg",
        className,
      )}
    >
      {title && (
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {propertiesInGroups
            .map(([group, propertiesInGroup], index) => [
              group ? (
                <GroupHeading
                  key={group}
                  {...{
                    group,
                    index,
                    globalEditMode,
                    groups: groups,
                    propertiesInGroup,
                    properties,
                    setItem,
                  }}
                />
              ) : (
                globalEditMode &&
                groups.length > 1 && (
                  <GroupHeading
                    key="ungrouped"
                    {...{
                      groupName: "Ungrouped Properties",
                      group,
                      index,
                      globalEditMode,
                      groups: groups,
                      propertiesInGroup,
                      properties,
                      setItem,
                    }}
                  />
                )
              ),
              propertiesInGroup.map((property) => (
                <Property
                  key={property.id.toString()}
                  className={index % 2 ? "bg-gray-100" : ""}
                  {...{
                    globalEditMode,
                    property,
                    item,
                    setItem,
                    properties,
                    propertiesInGroup,
                  }}
                />
              )),
            ])
            .flat(2)}
        </dl>
        <div>
          {globalEditMode && (
            <>
              Imported Items:
              {item.importedItems?.map((importedItem) => (
                <div key={importedItem.id}>
                  Name: {importedItem.name} ID: {importedItem.id}
                </div>
              ))}
            </>
          )}
        </div>
        {globalEditMode && (
          <Suspense fallback={<div>loading</div>}>
            <AddNewProperty
              aria-label={`Add ${title}`}
              {...{ setItem, propertyTemplate }}
            />
            <AddNewPropertiesFromTemplate {...{ item, setItem }} />
            <ImportItem setItem={setItem} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

type GroupHeadingProps = DeepReadonly<{
  groupName?: string
  group: string
  index: number
  globalEditMode: boolean
  groups: string[]
  properties: ChildItem["properties"]
  propertiesInGroup: ChildItem["properties"][number][]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}>

function GroupHeading({
  group,
  index,
  globalEditMode,
  groups,
  groupName = group?.toString() || "null",
  propertiesInGroup,
  properties,
  setItem,
}: GroupHeadingProps) {
  return (
    <div
      key={groupName}
      className={ct(
        "flex",
        "space-x-2",
        "py-4",
        "py-5",
        "px-6",
        "font-semibold",
        index % 2 ? "bg-gray-100" : "",
      )}
    >
      <h4>{groupName}</h4>
      {globalEditMode && (
        <Suspense fallback={null}>
          <EditGroup
            {...{
              groups,
              group,
              groupName,
              properties,
              propertiesInGroup,
              setItem,
            }}
          />
        </Suspense>
      )}
    </div>
  )
}
