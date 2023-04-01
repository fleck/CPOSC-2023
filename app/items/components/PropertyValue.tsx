import React from "react"
import { ChildItem } from "../queries/getRootItem"
import calculate from "../../properties/models/calculate"

export function PropertyValue({
  prefix,
  digitsAfterDecimal,
  dynamic,
  text,
  item,
  postfix,
}: {
  prefix: string | null
  digitsAfterDecimal: number | null
  dynamic: boolean
  text: string
  item: ChildItem
  postfix: string | null
}) {
  const result = dynamic && text && calculate(text, item)

  const value = result && (result.error ? result.error.message : result.value)

  const finalValue = value === false ? text : value

  return (
    <>
      {!!prefix && prefix}
      {typeof digitsAfterDecimal === "number"
        ? Number(finalValue).toFixed(digitsAfterDecimal)
        : finalValue}
      {!!postfix && postfix}
    </>
  )
}
