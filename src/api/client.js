// Thin wrapper around fetch for the MockAPI backend. Every mutating call throws a readable
// Error on a non-2xx response so callers can show it instead of pretending success.
// Read lazily (not cached at module load) so tests can stub VITE_MOCKAPI_URL per case.
function baseUrl() {
  return (import.meta.env.VITE_MOCKAPI_URL || '').replace(/\/$/, '')
}

export function hasMockApi() {
  return Boolean(baseUrl())
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  const BASE_URL = baseUrl()
  if (!BASE_URL) {
    throw new Error('No MockAPI URL configured (VITE_MOCKAPI_URL is unset).')
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`MockAPI ${method} ${path} failed: HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}
