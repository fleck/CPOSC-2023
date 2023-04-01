import React from "react"
import ct from "class-types.macro"
import { XIcon } from "@heroicons/react/outline"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"

import { ItemsList } from "./RichTextEditor"

import { Item } from "@prisma/client"

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onItemAdd: (item?: Item) => void
  title: string
  children?: JSX.Element
}

export function AddItemModal({
  open,
  setOpen,
  onItemAdd,
  title,
  children,
}: Props) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={ct(
                "inline-block",
                "min-h-screen",
                "transform",
                "overflow-hidden",
                "rounded-lg",
                "bg-white",
                "px-4",
                "pt-5",
                "pb-4",
                "text-left",
                "align-bottom",
                "shadow-xl",
                "transition-all",
                "sm:my-8",
                "sm:w-full",
                "sm:max-w-lg",
                "sm:p-6",
                "sm:align-middle",
              )}
            >
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className={ct(
                    "rounded-md",
                    "bg-white",
                    "text-gray-400",
                    "hover:text-gray-500",
                    "focus:outline-none",
                    "focus:ring-2",
                    "focus:ring-indigo-500",
                    "focus:ring-offset-2",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div
                  className={ct(
                    "mt-3",
                    "w-full",
                    "text-center",
                    "sm:mt-0",
                    "sm:text-left",
                  )}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    {children}
                    <div className={ct("mt-4")}>
                      <ItemsList
                        onItemClick={async (existingItem) => {
                          setOpen(false)

                          onItemAdd(existingItem)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
