import ct from "class-types.macro"
import React, { Fragment, useRef, useState } from "react"
import { useMutation } from "@blitzjs/rpc"

import PropertyForm from "./PropertyForm"

import { ChildItem } from "../queries/getRootItem"

import updatePropertyOrder from "app/properties/mutations/updatePropertyOrder"

import { UseMutationFunction } from "../TypeUtilities"
import { PropertyValue } from "./PropertyValue"
import { isNewRecord } from "app/core/model/isNewRecord"
import deleteProperty from "app/properties/mutations/deleteProperty"
import Button from "app/core/components/Button"

const message = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  console.error(error)
  return "an error has occurred, check the console for more details"
}

type Props = {
  property: ChildItem["properties"][number]
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  properties: ChildItem["properties"]
  propertiesInGroup?: ChildItem["properties"]
}

export default withReactQuery(function EditProperty({
  property,
  item,
  setItem,
  properties,
  propertiesInGroup = [],
}: Props & { dynamic: boolean }) {
  const [updateProperties, { error }] = useMutation(updatePropertyOrder)

  const { mutateAsync: updatePropertyMutation } =
    trpc.updateProperty.useMutation()

  const {
    isLoading,
    error: createError,
    mutateAsync,
  } = trpc.createProperty.useMutation()

  return (
    <>
      {error instanceof Error && (
        <div className={ct("text-red-600")}>{error.message}</div>
      )}

      {propertiesInGroup[0] !== property && (
        <button
          onClick={() =>
            moveProperty({
              move: -1,
              properties,
              property,
              setItem,
              updateProperties,
              propertiesInGroup,
            })
          }
        >
          Move Up
        </button>
      )}

      {propertiesInGroup.at(-1) !== property && (
        <button
          onClick={() =>
            moveProperty({
              move: 1,
              propertiesInGroup,
              properties,
              property,
              setItem,
              updateProperties,
            })
          }
        >
          Move Down
        </button>
      )}

      <PropertyForm
        setItem={setItem}
        item={item}
        property={property}
        submitText="Update"
        initialValues={{
          ...property.datum,
          fileId: property.datum.fileId?.toString(),
          ...property,
        }}
        className={ct("col-span-3", "space-y-8")}
        onSubmit={async (values) => {
          let updatedProperty: typeof property

          if (isNewRecord(property)) {
            updatedProperty = await mutateAsync({
              ...values,
              itemId: item.id,
              fileId: values.fileId,
            })
          } else {
            updatedProperty = await updatePropertyMutation({
              ...property,
              ...values,
              fileId: values.fileId,
              itemId: item.id,
            })
          }

          setItem?.((prevItem) => ({
            ...prevItem,
            properties: prevItem.properties.map((p) =>
              p.id === property.id ? updatedProperty : p,
            ),
          }))
        }}
      >
        Preview
        <dd className="text-sm text-gray-900 col-span-2 items-center flex">
          <PropertyValue {...{ ...property.datum, item }} />
        </dd>
        {isLoading && <Loading />}
        {Boolean(createError) && (
          <span className={ct("font-semibold", "text-red-700")}>
            {message(error)}
          </span>
        )}
      </PropertyForm>

      {!isNewRecord(property) && (
        <DeleteProperty
          id={BigInt(property.id)}
          itemId={item.id}
          setItem={setItem}
        />
      )}
    </>
  )
})

import { Dialog, Transition } from "@headlessui/react"
import { ExclamationIcon } from "@heroicons/react/solid"
import { trpc, withReactQuery } from "utils/trpc"
import { Loading } from "app/core/components/Loading"

type DeleteProps = {
  id: bigint
  itemId: number
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

function DeleteProperty({ id, itemId, setItem }: DeleteProps) {
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const [deleteMutation] = useMutation(deleteProperty)

  return (
    <>
      <Button
        className={ct("col-span-3")}
        onClick={() => setOpen(true)}
        color="red"
      >
        Delete
      </Button>

      {/* https://tailwindui.com/components/application-ui/overlays/modals#component-47a5888a08838ad98779d50878d359b3 */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Delete
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this property? This
                            action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <Button
                      type="button"
                      color="red"
                      onClick={() => {
                        deleteMutation({ id, itemId }).catch(console.error)

                        setItem((prevItem) => ({
                          ...prevItem,
                          properties: prevItem.properties.filter(
                            (p) => BigInt(p.id) !== id,
                          ),
                        }))

                        setOpen(false)
                      }}
                    >
                      Delete property
                    </Button>
                    <Button
                      type="button"
                      color="gray"
                      className={ct("mr-5")}
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

type MoveProps = {
  property: ChildItem["properties"][number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  properties: ChildItem["properties"]
  propertiesInGroup?: ChildItem["properties"]
}

async function moveProperty({
  properties,
  property,
  setItem,
  move,
  updateProperties,
}: MoveProps & {
  move: number
  updateProperties: UseMutationFunction<typeof updatePropertyOrder>
}) {
  const reorderedProperties = properties.filter((prop) => prop !== property)

  reorderedProperties.splice(properties.indexOf(property) + move, 0, property)

  const propertiesWithNewPositions = reorderedProperties.map((prop, index) => ({
    ...prop,
    position: index,
  }))

  setItem((item) => ({ ...item, properties: propertiesWithNewPositions }))

  await updateProperties(propertiesWithNewPositions)
}
