// Records with an id less then 1 have not been persisted yet.

export const isNewRecord = (item: { id: number | bigint | string }) =>
  BigInt(item.id) < 1
