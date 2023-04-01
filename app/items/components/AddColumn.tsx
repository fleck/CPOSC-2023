import React from "react"
import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"
import { PlusCircleIcon } from "@heroicons/react/solid"
import type { ChildItem } from "../queries/getRootItem"
import { Align } from "@prisma/client"

type Props = {
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

let comparisonColumnIdSeq = 0

type ColumnDefaults = {
  itemId: number
  align?: Align
  subject?: boolean
}

export const createNewColumn = ({
  itemId,
  align = "LEFT",
  subject = false,
}: ColumnDefaults) =>
  ({
    id: BigInt(comparisonColumnIdSeq--),
    itemId,
    name: "",
    position: null,
    created_at: new Date(),
    updated_at: new Date(),
    subject,
    align,
  } as const)

export default function AddColumn({ setItem, item }: Props) {
  return (
    <EditButton
      className={ct("mx-auto", "my-2")}
      onClick={() =>
        setItem((prevItem) => ({
          ...prevItem,
          comparisonColumns: [
            ...prevItem.comparisonColumns,
            createNewColumn({ itemId: item.id }),
          ],
        }))
      }
      color="amber"
      title="Add new column"
      aria-label="Add new column"
    >
      <PlusCircleIcon className={ct("h-4", "w-4")} />
    </EditButton>
  )
}
