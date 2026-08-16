/**
 * Utility helper to extract readable error message from API / Error objects.
 */
export function parseApiErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan pada sistem.",
): string {
  let rawMessage = "";

  if (err instanceof Error && err.message) {
    rawMessage = err.message;
  } else if (typeof err === "string" && err.trim()) {
    rawMessage = err;
  } else if (err && typeof err === "object") {
    const obj = err as Record<string, any>;
    if (typeof obj.message === "string" && obj.message.trim()) {
      rawMessage = obj.message;
    } else if (typeof obj.error?.message === "string" && obj.error.message.trim()) {
      rawMessage = obj.error.message;
    } else if (typeof obj.error === "string" && obj.error.trim()) {
      rawMessage = obj.error;
    }
  }

  if (!rawMessage) return fallback;

  // Filter out internal database/Prisma/stacktrace errors in user-facing UI
  const isTechnicalError =
    /prisma|findUnique|findFirst|db\.|database|postgres|sql|econnrefused|connect|invocation/i.test(
      rawMessage,
    );

  if (isTechnicalError) {
    return "Gagal terhubung ke layanan database server. Silakan coba beberapa saat lagi.";
  }

  return rawMessage;
}
