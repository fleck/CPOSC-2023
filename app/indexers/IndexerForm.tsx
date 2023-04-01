import Form, { FormProps } from "app/core/components/Form"
import LabeledCheckbox from "app/core/components/LabeledCheckbox"
import LabeledTextField from "app/core/components/LabeledTextField"
import ct from "class-types.macro"
import { IndexerType } from "@prisma/client"
import { Field, FormSpy } from "react-final-form"
import { FieldArray } from "react-final-form-arrays"
import arrayMutators from "final-form-arrays"
import { ClientSideIndexer } from "packages/indexer/src/IndexerSchema"
import { useQuery } from "@blitzjs/rpc"
import findIndexers from "./queries/findMany"
import { useEffect, useState } from "react"
import * as z from "zod"

type ReadonlyAll<T> = T extends Map<unknown, unknown>
  ? Omit<T, "set" | "clear" | "delete">
  : T extends Set<unknown>
  ? Omit<T, "add" | "clear" | "delete">
  : Readonly<T>

// T is a generic type for value parameter, our case this will be string
function useDebounce<T>(value: T, delay: number): ReadonlyAll<T> {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value as ReadonlyAll<T>)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay], // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export function IndexerForm(props: FormProps<typeof ClientSideIndexer>) {
  const [currentHostname, setHostname] = useState(props.initialValues?.hostname)

  const hostname = useDebounce(currentHostname, 500)

  const [allPotentialNextIndexers] = useQuery(
    findIndexers,
    { where: { hostname } },
    {},
  )

  const potentialNextIndexers = allPotentialNextIndexers?.filter(
    (indexer) => indexer.id !== props.initialValues?.id,
  )

  return (
    <Form
      {...props}
      mutators={{
        ...arrayMutators,
      }}
    >
      <FormSpy<z.infer<typeof ClientSideIndexer>>
        onChange={({ dirty, values }) => {
          // working around a bug until fix lands: https://github.com/final-form/react-final-form/pull/965
          if (!dirty) return

          setHostname(values.hostname)
        }}
      />
      <LabeledTextField name="name" />
      <LabeledTextField name="hostname" />
      <LabeledTextField name="pathExtension" />
      <FieldArray name="replacements">
        {({ fields }) => (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                fields.push((fields.length || 0) + 1)
              }}
            >
              Add Replacement
            </button>
            {fields.map((name, index) => (
              <div key={name}>
                <label>Replacement #{index + 1} </label>
                <Field
                  name={`${name}search`}
                  component="input"
                  placeholder="search"
                />
                <Field
                  name={`${name}replacement`}
                  component="input"
                  placeholder="replacement"
                />
                <span
                  onClick={() => fields.remove(index)}
                  style={{ cursor: "pointer" }}
                >
                  ❌
                </span>
              </div>
            ))}
          </>
        )}
      </FieldArray>
      <LabeledTextField name="decimalPlaces" type="number" />
      <LabeledTextField name="slice" />
      <FieldArray name="selectors">
        {({ fields }) => (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                fields.push((fields.length || 0) + 1)
              }}
            >
              Add Selector
            </button>
            {fields.map((name, index) => (
              <div key={name}>
                <label>Selector #{index + 1} </label>
                <Field
                  name={`${name}selector`}
                  component="input"
                  placeholder="selector"
                />
                <span
                  onClick={() => fields.remove(index)}
                  style={{ cursor: "pointer" }}
                >
                  ❌
                </span>
              </div>
            ))}
          </>
        )}
      </FieldArray>

      <LabeledTextField name="cookie" />
      <Field
        id="location"
        name="indexType"
        className={ct(
          "inline-block",
          "rounded-md",
          "border-gray-300",
          "py-0.5",
          "pr-10",
          "pl-1",
          "text-base",
          "focus:border-indigo-500",
          "focus:outline-none",
          "focus:ring-indigo-500",
          "sm:text-sm",
        )}
        component="select"
        defaultValue={IndexerType["CSS"]}
      >
        {Object.keys(IndexerType).map((itemType) => (
          <option value={itemType} key={itemType}>
            {itemType}
          </option>
        ))}
      </Field>
      <Field
        id="location"
        name="nextIndexerId"
        className={ct(
          "inline-block",
          "rounded-md",
          "border-gray-300",
          "py-0.5",
          "pr-10",
          "pl-1",
          "text-base",
          "focus:border-indigo-500",
          "focus:outline-none",
          "focus:ring-indigo-500",
          "sm:text-sm",
        )}
        component="select"
        defaultValue={props.initialValues?.nextIndexerId}
      >
        <option value="">Select Next Indexer</option>

        {potentialNextIndexers?.map((indexer) => (
          <option value={indexer.id} key={indexer.id}>
            {indexer.name} {indexer.hostname}
          </option>
        ))}
      </Field>
      <LabeledTextField name="postProcessor" />
      <LabeledTextField name="selectorToClick" />
      <LabeledCheckbox name="decodeUrl" />
      <LabeledCheckbox name="keepOldValue" />
      <LabeledTextField name="secondsBetweenUpdates" />
      {props.children}
    </Form>
  )
}
