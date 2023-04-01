import React, { useState } from "react"
import { z } from "zod"
import ct from "class-types.macro"
import { PropertyTemplate } from "app/propertyTemplates/helpers"
import { propertyTemplateSchema } from "app/propertyTemplates/propertyTemplateSchema"
import type { DeepReadonly } from "../../app/items/TypeUtilities"

import { newProperty } from "app/properties/models/newProperty"
import { Form, components } from "../core/components/TypedForm"
import { trpc, withReactQuery } from "utils/trpc"
import debounce from "lodash/debounce"
import { Indexer } from "@prisma/client"
import { useRouter } from "next/router"

type FormProps = {
  propertyTemplate: DeepReadonly<NonNullable<PropertyTemplate>>
}

const marginTop = "mt-6"

type PropertyTemplateSchema = z.output<typeof propertyTemplateSchema>

const ensureError = (e: unknown) =>
  e instanceof Error ? e : new Error("Unknown error")

export const PropertyTemplateForm = withReactQuery(
  ({ propertyTemplate }: FormProps) => {
    const [propertyTemplateState, setPropertyTemplateState] =
      useState(propertyTemplate)

    const [urls, setUrls] = useState(propertyTemplate.hostnames)

    const router = useRouter()

    const { data: indexers = [] } = trpc.indexers.useQuery(
      {
        hostnames: [...urls],
      },
      { enabled: urls.some((url) => url.length > 2) },
    )

    const { mutateAsync, error } =
      trpc.createOrUpdatePropertyTemplate.useMutation()

    return (
      <>
        {error && <>ERROR: {error.message}</>}
        <Form<PropertyTemplateSchema>
          method="post"
          className={ct(
            "space-y-6",
            "bg-white",
            "py-8",
            "px-4",
            "shadow",
            "sm:rounded-lg",
            "sm:px-10",
          )}
          onSubmit={async (event) => {
            event.preventDefault()

            const formData = new FormData(event.currentTarget)

            // We need to remove any files from the form data
            // because they are not supported by URLSearchParams
            const entries = [...formData.entries()].flatMap(([key, value]) =>
              value instanceof File ? [] : [[key, value]],
            )

            const { parse } = await import("qs")

            const newPropertyTemplate = await mutateAsync(
              parse(new window.URLSearchParams(entries).toString()),
            ).catch(ensureError)

            if (newPropertyTemplate instanceof Error) return

            await router.push({
              pathname: `/property_templates/edit/[id]`,
              query: { id: newPropertyTemplate.id.toString() },
            })
          }}
        >
          {({ TextInput, Input }) => (
            <>
              <Input
                type="hidden"
                defaultValue={propertyTemplate.id.toString()}
                name="id"
              />
              <TextInput
                label="Template Name"
                name="name"
                defaultValue={propertyTemplateState.name?.toString()}
                className={ct(marginTop)}
              />
              {propertyTemplateState.hostnames.map((hostname, index) => (
                <TextInput
                  className={marginTop}
                  key={index}
                  label="Hostname"
                  name="hostnames[]"
                  defaultValue={hostname}
                  onChange={debounce(
                    (event: React.ChangeEvent<HTMLInputElement>) => {
                      const newUrls = [...urls]
                      newUrls[index] = event.target.value
                      setUrls(newUrls)
                    },
                    500,
                  )}
                />
              ))}

              {propertyTemplateState.properties.map((property, index) => (
                <PropertyForm
                  key={property.id.toString()}
                  {...{ property, index, indexers }}
                />
              ))}
              <button
                name="addPropertyTemplate"
                value="true"
                formNoValidate
                onClick={(e) => {
                  e.preventDefault()

                  setPropertyTemplateState((prev) => {
                    return {
                      ...prev,
                      properties: [...prev.properties, newProperty()],
                    }
                  })
                }}
              >
                Add Property
              </button>
              <div>
                <button type="submit">Save</button>
              </div>
            </>
          )}
        </Form>
      </>
    )
  },
)

const { Input, Checkbox, SelectInput, TextInput } =
  components<PropertyTemplateSchema>()

const PropertyForm = ({
  index,
  property,
  indexers,
}: {
  index: number
  property: FormProps["propertyTemplate"]["properties"][number]
  indexers: Indexer[]
}) => {
  const allIndexers = [
    ...indexers.filter((indexer) => indexer.id !== property.datum.indexer?.id),
    ...(property.datum.indexer ? [property.datum.indexer] : []),
  ]

  return (
    <React.Fragment>
      <Input
        type="hidden"
        name={`properties[${index}][id]`}
        defaultValue={property.id.toString()}
      />
      <Input
        type="hidden"
        name={`properties[${index}][datum][id]`}
        defaultValue={property.datum.id}
      />
      <TextInput
        label="Property Name"
        name={`properties[${index}][datum][name]`}
        defaultValue={property.datum.name}
      />

      <Checkbox
        label="Global"
        name={`properties[${index}][datum][global]`}
        defaultChecked={property.datum.global}
      />

      <>{console.log("dynamic: ", property.datum.global)}</>

      <Checkbox
        label="Dynamic"
        name={`properties[${index}][datum][dynamic]`}
        defaultChecked={property.datum.dynamic}
      />
      <>{console.log("dynamic: ", property.datum.dynamic)}</>

      <Checkbox
        label="Featured"
        name={`properties[${index}][featured]`}
        defaultChecked={property.featured}
      />

      <>{console.log("checked: ", property.featured)}</>

      {allIndexers.length ? (
        <SelectInput
          name={`properties[${index}][datum][indexerId]`}
          label="Indexer"
          defaultValue={property.datum.indexerId || ""}
        >
          <option value="">Select Indexer</option>
          {allIndexers.map((indexer) => (
            <option value={indexer.id} key={indexer.id}>
              {indexer.name}
            </option>
          ))}
        </SelectInput>
      ) : (
        "No matching indexers"
      )}

      <TextInput
        defaultValue={property.datum.text}
        label="Text"
        name={`properties[${index}][datum][text]`}
      />

      <TextInput
        defaultValue={property.datum.group}
        label="Group"
        name={`properties[${index}][datum][group]`}
      />

      <TextInput
        defaultValue={property.datum.digitsAfterDecimal ?? undefined}
        label="Digits After Decimal"
        name={`properties[${index}][datum][digitsAfterDecimal]`}
        type="number"
      />

      <TextInput
        defaultValue={property.datum.prefix}
        label="Prefix"
        name={`properties[${index}][datum][prefix]`}
      />

      <TextInput
        defaultValue={property.datum.postfix}
        label="Postfix"
        name={`properties[${index}][datum][postfix]`}
      />
    </React.Fragment>
  )
}
