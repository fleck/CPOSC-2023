import { useMutation } from "@blitzjs/rpc"
import { PencilIcon, TrashIcon } from "@heroicons/react/outline"
import createChild from "app/children/mutations/createChild"
import deleteChild from "app/children/mutations/deleteChild"
import updateChild from "app/children/mutations/updateChild"
import EditButton from "app/core/components/EditButton"
import { Button, SaveIcon } from "app/core/components/RichTextEditor"
import { isNewRecord } from "app/core/model/isNewRecord"
import ct from "class-types.macro"
import React from "react"
import { bare, BareItem } from "../model/bare"
import upsertItem from "../mutations/upsertItem"
import { ChildItem } from "../queries/getRootItem"
import { WithoutItem } from "./Editor"

type Props = {
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  child: Exclude<ChildItem["children"], undefined>[number]
  setParentItem: React.Dispatch<React.SetStateAction<ChildItem>>
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditItemInCell({
  item,
  setItem,
  child,
  setParentItem,
  setEditMode,
}: Props) {
  const [deleteChildMutation] = useMutation(deleteChild)

  const [upsertItemMutation] = useMutation(upsertItem)

  const [updateChildMutation] = useMutation(updateChild)

  const [createChildMutation] = useMutation(createChild)

  return (
    <>
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
        value={item.name || ""}
        aria-label={`Title for ${isNewRecord(item) ? "new " : ""}item`}
        placeholder="Enter title for item"
        onChange={(event) =>
          setItem((prevItem) => ({ ...prevItem, name: event.target.value }))
        }
        style={{ font: "inherit", letterSpacing: "inherit" }}
      />
      <Button
        aria-label={`Save ${item.name}`}
        onClick={async () => {
          try {
            let updatedItem: BareItem

            updatedItem = await upsertItemMutation(bare(item))

            setItem((prevItem) => ({ ...prevItem, ...updatedItem }))

            if (!child) return

            let updatedChild: ReturnType<WithoutItem>

            if (isNewRecord(child)) {
              updatedChild = await createChildMutation({
                ...child,
                item_id: updatedItem.id,
              })
            } else {
              const potentialUpdatedChild = await updateChildMutation(child)
              if (potentialUpdatedChild) {
                updatedChild = potentialUpdatedChild
              }
            }

            setParentItem?.((prevItem) => ({
              ...prevItem,
              children: prevItem.children.map((prevChild) =>
                prevChild.id === child.id
                  ? {
                      ...prevChild,
                      ...updatedChild,
                      item: { ...prevChild.item, ...updatedItem },
                    }
                  : prevChild,
              ),
            }))
          } catch (error) {
            console.error(error)
          }
        }}
      >
        <SaveIcon />
      </Button>
      <Button
        aria-label={`Delete ${item.name}`}
        onClick={async () => {
          setParentItem?.((prevItem) => ({
            ...prevItem,
            children: prevItem.children.filter((sibling) => sibling !== child),
          }))

          if (child.id > 0) await deleteChildMutation(child)
        }}
      >
        <TrashIcon />
      </Button>
      <EditButton
        color="gray"
        onClick={() => setEditMode(false)}
        className={ct("h-[1.625rem]")}
        aria-label={`Stop editing `}
      >
        <PencilIcon className={ct("h-4", "w-4")} />
      </EditButton>
    </>
  )
}
