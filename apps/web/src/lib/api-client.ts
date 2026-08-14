import { getCookie } from "./cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getCookie("zii_auth_token");
  const tenantId = getCookie("zii_tenant_id") || "";

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { "x-tenant-id": tenantId } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let extractedMessage = "";

    if (typeof errorData?.message === "string" && errorData.message.trim()) {
      extractedMessage = errorData.message;
    } else if (
      typeof errorData?.error?.message === "string" &&
      errorData.error.message.trim()
    ) {
      extractedMessage = errorData.error.message;
    } else if (typeof errorData?.error === "string" && errorData.error.trim()) {
      extractedMessage = errorData.error;
    } else if (Array.isArray(errorData?.error) && errorData.error.length > 0) {
      extractedMessage = errorData.error
        .map((e: any) => e.message || String(e))
        .join(", ");
    }

    const finalMessage =
      extractedMessage ||
      `Gagal (${response.status}): ${response.statusText || "Respon API error"}`;

    throw new Error(finalMessage);
  }

  const json = await response.json();
  if (json && json.meta !== undefined) {
    return { data: json.data, meta: json.meta } as T;
  }
  return (json.data !== undefined ? json.data : json) as T;
}
