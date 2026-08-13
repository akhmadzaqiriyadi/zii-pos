const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": "demo-tenant-01",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data as T;
}
