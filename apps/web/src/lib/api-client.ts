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
    throw new Error(
      errorData?.error?.message || `API Error: ${response.statusText}`,
    );
  }

  const json = await response.json();
  if (json && json.meta !== undefined) {
    return { data: json.data, meta: json.meta } as T;
  }
  return (json.data !== undefined ? json.data : json) as T;
}
