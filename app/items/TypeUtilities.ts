import type { MutateFunction } from "@blitzjs/rpc"

export type UseMutationFunction<T extends (...args: any) => any> =
  MutateFunction<Awaited<ReturnType<T>>, unknown, Parameters<T>[0], unknown>

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null

export type Builtin = Primitive | Function | Date | Error | RegExp

export type IsAny<T> = 0 extends 1 & T ? true : false

export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false

export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepReadonly<U>>
  : T extends Promise<infer U>
  ? Promise<DeepReadonly<U>>
  : T extends {}
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : IsUnknown<T> extends true
  ? unknown
  : Readonly<T>
