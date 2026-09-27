// One-off seed for the MockAPI project: reads the static demo JSON, purges whatever MockAPI
// auto-generated for a new resource, and POSTs the real seed data in the target shape.
//
// Usage: npm run seed   (reads VITE_MOCKAPI_URL from .env.local via `node --env-file`)
import { readFile } from 'node:fs/promises'

const BASE_URL = (process.env.VITE_MOCKAPI_URL || '').replace(/\/$/, '')
if (!BASE_URL) {
  console.error('VITE_MOCKAPI_URL is not set. Add it to .env.local first (see .env.example).')
  process.exit(1)
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// MockAPI's free tier rate-limits bursts of requests (HTTP 429); a small delay between calls
// keeps the purge + reseed loops under that limit.
const THROTTLE_MS = 350

async function request(path, { method = 'GET', body, retries = 3 } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 429 && retries > 0) {
    await wait(1000)
    return request(path, { method, body, retries: retries - 1 })
  }
  if (!res.ok) throw new Error(`${method} ${path} failed: HTTP ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

async function purge(resource) {
  const rows = await request(`/${resource}`)
  for (const row of rows) {
    await request(`/${resource}/${row.id}`, { method: 'DELETE' })
    await wait(THROTTLE_MS)
  }
  console.log(`  purged ${rows.length} existing ${resource} record(s)`)
}

async function readJson(relativePath) {
  const raw = await readFile(new URL(`../public/${relativePath}`, import.meta.url), 'utf8')
  return JSON.parse(raw)
}

async function seedInvoices() {
  console.log('Seeding invoices...')
  await purge('invoices')

  const { invoices } = await readJson('api/invoices.json')
  for (const invoice of invoices) {
    const { id: invoiceNumber, ...rest } = invoice
    const record = {
      invoiceNumber,
      ...rest,
      items: rest.items.map((item) => ({ sku: '', ...item })),
      failureReason: rest.failureReason ?? null,
      createdBy: 'seed',
      updatedAt: rest.createdAt,
      pendingRequest: null,
    }
    await request('/invoices', { method: 'POST', body: record })
    await wait(THROTTLE_MS)
  }
  console.log(`  created ${invoices.length} invoice(s)`)
}

async function seedReferenceData() {
  console.log('Seeding referenceData...')
  await purge('referenceData')

  const { customers } = await readJson('api/customers.json')
  const { products } = await readJson('api/products.json')

  for (const customer of customers) {
    await request('/referenceData', { method: 'POST', body: { type: 'customer', ...customer } })
    await wait(THROTTLE_MS)
  }
  console.log(`  created ${customers.length} customer record(s)`)

  for (const product of products) {
    await request('/referenceData', { method: 'POST', body: { type: 'product', ...product } })
    await wait(THROTTLE_MS)
  }
  console.log(`  created ${products.length} product record(s)`)
}

await seedInvoices()
await seedReferenceData()
console.log('Done.')
