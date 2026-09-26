import { hasMockApi, request } from './client.js'

// Fallback for anyone running without VITE_MOCKAPI_URL: read-only static demo data, so the app
// and the test suite keep working without a MockAPI project.
const STATIC_URL = `${import.meta.env.BASE_URL}api/invoices.json`
const OFFLINE_MESSAGE = 'Offline demo data: set VITE_MOCKAPI_URL to save changes.'

async function loadStaticInvoices(signal) {
  const res = await fetch(STATIC_URL, { signal })
  if (!res.ok) throw new Error(`Static demo data returned HTTP ${res.status}`)
  const json = await res.json()
  return json.invoices
}

export function listInvoices(signal) {
  if (!hasMockApi()) return loadStaticInvoices(signal)
  return request('/invoices', { signal })
}

export function getInvoice(id, signal) {
  if (!hasMockApi()) return Promise.reject(new Error(OFFLINE_MESSAGE))
  return request(`/invoices/${id}`, { signal })
}

export function createInvoice(invoice, signal) {
  if (!hasMockApi()) return Promise.reject(new Error(OFFLINE_MESSAGE))
  return request('/invoices', { method: 'POST', body: invoice, signal })
}

export function updateInvoice(id, invoice, signal) {
  if (!hasMockApi()) return Promise.reject(new Error(OFFLINE_MESSAGE))
  return request(`/invoices/${id}`, { method: 'PUT', body: invoice, signal })
}

export function deleteInvoice(id, signal) {
  if (!hasMockApi()) return Promise.reject(new Error(OFFLINE_MESSAGE))
  return request(`/invoices/${id}`, { method: 'DELETE', signal })
}
