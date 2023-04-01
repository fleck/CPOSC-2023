import React from "react"
import { Checkbox, SelectInput, TextInput } from "./FormElements"

type KeyUnion<T, P extends string = ""> = T extends readonly any[]
  ? T extends (infer U)[]
    ? KeyUnionArray<U, P>
    : never
  : T extends object
  ? KeyUnionObject<T, P, true>
  : never

type KeyUnionArray<T, P extends string> = {
  [K in keyof T]: T[K] extends any[]
    ? KeyUnionArray<T[K], `${P}[${Exclude<K, symbol>}]`>
    : T[K] extends object
    ? KeyUnionObject<
        T[K],
        Exclude<K, symbol> extends number
          ? `${P}[${Exclude<K, symbol>}]`
          : never
      >
    : K extends number
    ? `${P}[]`
    : `${P}[${Exclude<K, symbol>}]`
}[Exclude<keyof T, keyof any[]>]

type KeyUnionObject<T, P extends string, TopLevel = false> = {
  [K in keyof T]: T[K] extends readonly any[]
    ? KeyUnionArray<
        T[K],
        TopLevel extends true
          ? `${P}${Exclude<K, symbol>}`
          : `${P}[${Exclude<K, symbol>}]`
      >
    : T[K] extends object
    ? TopLevel extends true
      ? KeyUnionObject<T[K], `${P}${Exclude<K, symbol>}`>
      : KeyUnionObject<T[K], `${P}[${Exclude<K, symbol>}]`>
    : TopLevel extends true
    ? K
    : `${P}[${Exclude<K, symbol>}]`
}[Exclude<keyof T, keyof any[]>]

type FunctionParameter<T> = T extends (...args: infer P) => any ? P : never

export const createForm = <
  FormComponents extends {
    [P in keyof FormComponents]: (
      props: FunctionParameter<FormComponents[P]>[0],
    ) => ReturnType<FormComponents[P]>
  },
>({
  formComponents,
}: {
  formComponents: FormComponents
}) => {
  return {
    Form: <T extends {}, ValidNames = KeyUnion<T>>({
      children,
      ...props
    }: {
      children: (data: {
        [P in keyof FormComponents]: (
          props: FunctionParameter<FormComponents[P]>[0] & { name: ValidNames },
        ) => ReturnType<FormComponents[P]>
      }) => JSX.Element
    } & Omit<
      React.DetailedHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >,
      "children"
    >) => {
      return (
        <form {...props}>
          {children({
            ...formComponents,
          })}
        </form>
      )
    },
    components: <T extends {}, ValidNames = KeyUnion<T>>(): {
      [P in keyof FormComponents]: (
        props: FunctionParameter<FormComponents[P]>[0] & { name: ValidNames },
      ) => ReturnType<FormComponents[P]>
    } => {
      return formComponents
    },
  }
}

export const { Form, components } = createForm({
  formComponents: {
    SelectInput,
    TextInput,
    Checkbox,
    Input: (
      props: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
    ) => <input {...props} />,
  },
})
