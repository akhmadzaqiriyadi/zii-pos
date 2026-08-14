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
  if (typeof err === "string" && err.trim()) {
    return err;
  }
  if (err && typeof err === "object") {
    const obj = err as Record<string, any>;
    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message;
    }
    if (typeof obj.error?.message === "string" && obj.error.message.trim()) {
      return obj.error.message;
    }
    if (typeof obj.error === "string" && obj.error.trim()) {
      return obj.error;
    }
  }
  return fallback;
}
