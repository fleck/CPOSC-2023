export const handleKnownErrors = (error: unknown) => {
  if (
    typeof error === "object" &&
    error != null &&
    "code" in error &&
    // An operation failed because it depends on one or more records that were required but not found.
    // Record to delete does not exist.
    // or
    // Record to update not found.
    error.code === "P2025"
  ) {
    return
  }

  throw error
}
