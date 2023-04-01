import ct from "class-types.macro"
import React, { useEffect, useRef, useState } from "react"
import { ChildItem } from "../queries/getRootItem"
import { isNewRecord } from "../../core/model/isNewRecord"

type Props = {
  editing: boolean
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  globalEditMode: boolean
  child?: Exclude<ChildItem["children"], undefined>[number]
}

export function Title({
  editing,
  item,
  setItem,
  globalEditMode,
  child,
}: Props) {
  const [alreadyFocusedTitle, setAlreadyFocusedTitle] = useState(false)

  const title = useRef<HTMLInputElement>(null)

  const genericTitle = child?.titleType === "GENERIC"

  const displayedItemName = genericTitle ? item.genericName : item.name

  useEffect(() => {
    if (!isNewRecord(item) || alreadyFocusedTitle) return

    setAlreadyFocusedTitle(true)

    // The transition from the modal closing before this seems to interfere with the focus
    // Adding the timeout fixes the issue.
    const focus = setTimeout(() => {
      title.current?.focus()
    }, 300)

    return () => clearTimeout(focus)
  }, [alreadyFocusedTitle, item])

  return (
    <>
      {editing ? (
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
          ref={title}
          value={displayedItemName}
          aria-label={`Title for ${isNewRecord(item) ? "new " : ""}item`}
          placeholder="Enter title for item"
          onChange={(event) =>
            setItem((prevItem) => {
              if (genericTitle) {
                return { ...prevItem, genericName: event.target.value }
              }
              return { ...prevItem, name: event.target.value }
            })
          }
          style={{ font: "inherit", letterSpacing: "inherit" }}
        />
      ) : (
        displayedItemName
      )}

      {globalEditMode && ` ID: ${item.id}`}
    </>
  )
}
