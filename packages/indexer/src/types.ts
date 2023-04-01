import type { ExtractedData } from "./extractData"
import type { DataToIndex } from "app/properties/getData"

type Queue = "bulk" | "single"

type UserId = number | string

export type Job = {
  url: string
  queue: Queue
  dataToIndex: DataToIndex
  // User that is interested in being notified of the result
  notify?: UserId[]
}

type Retry = {
  retryIn: number
} & Job

export type Result =
  | { response?: ExtractedData; url: string; notify?: UserId[] }
  | Retry
