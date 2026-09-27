import { hasMockApi, request } from './client.js'

// Customers and products share one MockAPI resource (`referenceData`), told apart by `type`.
// Falls back to the static JSON files when VITE_MOCKAPI_URL is unset.
const CUSTOMERS_URL = `${import.meta.env.BASE_URL}api/customers.json`
const PRODUCTS_URL = `${import.meta.env.BASE_URL}api/products.json`

async function loadStatic(url, key, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Static demo data returned HTTP ${res.status}`)
  const json = await res.json()
  return json[key]
}

export async function listCustomers(signal) {
  if (!hasMockApi()) return loadStatic(CUSTOMERS_URL, 'customers', signal)
  const rows = await request('/referenceData', { signal })
  return rows.filter((row) => row.type === 'customer')
}

export async function listProducts(signal) {
  if (!hasMockApi()) return loadStatic(PRODUCTS_URL, 'products', signal)
  const rows = await request('/referenceData', { signal })
  return rows.filter((row) => row.type === 'product')
}
