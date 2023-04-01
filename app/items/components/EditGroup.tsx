import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"
import React from "react"
import { useMutation } from "@blitzjs/rpc"
import { ChildItem } from "../queries/getRootItem"
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid"
import { DeepReadonly } from "../TypeUtilities"
import updatePropertyOrder from "app/properties/mutations/updatePropertyOrder"

export default function EditGroup({
  groups,
  group,
  groupName,
  properties,
  propertiesInGroup,
  setItem,
}: DeepReadonly<{
  groupName?: string
  group: string
  groups: string[]
  properties: ChildItem["properties"]
  propertiesInGroup: ChildItem["properties"][number][]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}>) {
  const [updateProperties] = useMutation(updatePropertyOrder)

  return (
    <>
      {groups[0] !== group && (
        <EditButton
          color={"amber"}
          className={ct("h-[1.625rem]")}
          aria-label={`Move Group ${groupName} Up`}
          onClick={async () => {
            const propertiesInNewOrder = properties.filter(
              (property) => !propertiesInGroup.includes(property),
            )

            const previousGroup = groups[groups.indexOf(group) - 1]

            const firstPropertyInPreviousGroup = propertiesInNewOrder
              .filter((property) => property.datum.group === previousGroup)
              .at(0)

            if (!firstPropertyInPreviousGroup) {
              throw new Error(
                "trying to move down, but last property in next group is undefined",
              )
            }

            propertiesInNewOrder.splice(
              propertiesInNewOrder.indexOf(firstPropertyInPreviousGroup),
              0,
              ...propertiesInGroup,
            )

            setItem((item) => ({
              ...item,
              properties: [
                ...item.properties.filter(
                  (property) => !propertiesInNewOrder.includes(property),
                ),
                ...propertiesInNewOrder,
              ],
            }))

            const propertiesWithNewPositions = propertiesInNewOrder.map(
              (prop, index) => ({
                ...prop,
                position: index,
              }),
            )

            await updateProperties(propertiesWithNewPositions)
          }}
        >
          <ArrowUpIcon className={ct("h-4", "w-4")} />
        </EditButton>
      )}
      {groups.at(-1) !== group && (
        <EditButton
          color={"amber"}
          className={ct("h-[1.625rem]")}
          aria-label={`Move Group ${groupName} Down`}
          onClick={async () => {
            const propertiesInNewOrder = properties.filter(
              (property) => !propertiesInGroup.includes(property),
            )

            const nextGroup = groups[groups.indexOf(group) + 1]

            const lastPropertyInNextGroup = propertiesInNewOrder
              .filter((property) => property.datum.group === nextGroup)
              .at(-1)

            if (!lastPropertyInNextGroup) {
              throw new Error(
                "trying to move down, but last property in next group is undefined",
              )
            }

            propertiesInNewOrder.splice(
              propertiesInNewOrder.indexOf(lastPropertyInNextGroup) + 1,
              0,
              ...propertiesInGroup,
            )

            setItem((item) => ({
              ...item,
              properties: [
                ...item.properties.filter(
                  (property) => !propertiesInNewOrder.includes(property),
                ),
                ...propertiesInNewOrder,
              ],
            }))

            const propertiesWithNewPositions = propertiesInNewOrder.map(
              (prop, index) => ({
                ...prop,
                position: index,
              }),
            )

            await updateProperties(propertiesWithNewPositions)
          }}
        >
          <ArrowDownIcon className={ct("h-4", "w-4")} />
        </EditButton>
      )}
    </>
  )
}
