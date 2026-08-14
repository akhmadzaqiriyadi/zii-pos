/**
 * Utility helper to extract readable error message from API / Error objects.
 */
export function parseApiErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan pada sistem.",
): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  return fallback;
}
