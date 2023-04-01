import { Unionize } from "../queries/getRootItem"
import { File } from "db"

export const validHeightAndWidth = (
  image: Unionize<File, Date | bigint, string>,
): image is File & { metadata: { width: number; height: number } } =>
  typeof image.metadata === "object" &&
  image.metadata !== null &&
  "width" in image.metadata &&
  typeof image.metadata.width === "number" &&
  "height" in image.metadata &&
  typeof image.metadata.height === "number"
