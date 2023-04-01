import { conformObject } from "./conformObject"
import { test, expect } from "@playwright/test"

test("keeps default values when unknown object has different types", () => {
  const defaultObj = { a: 1, b: "2", c: true }
  const unknownObj = { a: "1", b: 2, c: "true" }
  const result = conformObject(defaultObj, unknownObj)
  expect(result).toEqual({ data: defaultObj })
})

test("keeps default values when unknown object is missing keys", () => {
  const defaultObj = { a: 1, b: "2", c: true }
  const unknownObj = { a: "1" }
  const result = conformObject(defaultObj, unknownObj)
  expect(result).toEqual({ data: defaultObj })
})

test("keeps default values when unknown object has extra keys", () => {
  const defaultObj = { a: 1, b: "2", c: true }
  const unknownObj = { a: "1", b: 2, c: "true", d: "4" }
  const result = conformObject(defaultObj, unknownObj)
  expect(result).toEqual({ data: defaultObj })
})

test("keeps default values when unknown object has different types for nested objects", () => {
  const defaultObj = { a: 1, b: "2", c: true, d: { e: 1, f: "2", g: true } }

  const unknownObj = { a: "1", b: 2, c: "true", d: { e: "1", f: 2, g: "true" } }
  const result = conformObject(defaultObj, unknownObj)
  expect(result).toEqual({ data: defaultObj })
})

test("an empty string in an array should work", () => {
  const defaultObj = {
    id: "0",
    name: "test",
    hostnames: [""],
  }

  const unknownObj = {
    id: "0",
    name: "test",
    hostnames: ["www.amazon.com"],
  }

  const result = conformObject(defaultObj, unknownObj)
  expect(result).toEqual({ data: unknownObj })
})
