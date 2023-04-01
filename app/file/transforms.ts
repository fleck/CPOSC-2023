import sharp from "sharp"

export const transformFunctions = {
  searchResult: {
    transform: (file: NodeJS.ReadableStream) =>
      file.pipe(sharp().resize({ width: 600 })),
  },
  searchResultAvif: {
    transform: (file: NodeJS.ReadableStream) =>
      file.pipe(sharp().resize({ width: 600 }).toFormat("avif")),
    contentType: "image/avif",
  },
  searchResultWebp: {
    transform: (file: NodeJS.ReadableStream) =>
      file.pipe(sharp().resize({ width: 600 }).toFormat("webp")),
    contentType: "image/webp",
  },
}

export type Transform = keyof typeof transformFunctions

export const validTransformKey = (key: string): key is Transform =>
  key in transformFunctions
