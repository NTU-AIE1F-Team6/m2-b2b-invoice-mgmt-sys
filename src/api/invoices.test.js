import { createInvoice, deleteInvoice, listInvoices, updateInvoice } from './invoices.js'

beforeEach(() => {
  vi.stubEnv('VITE_MOCKAPI_URL', 'https://example.mockapi.io')
  vi.spyOn(global, 'fetch')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('listInvoices', () => {
  it('returns the parsed array on success', async () => {
    const invoices = [{ id: '1', invoiceNumber: 'INV-2026-001' }]
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => invoices })

    await expect(listInvoices()).resolves.toEqual(invoices)
    expect(global.fetch).toHaveBeenCalledWith('https://example.mockapi.io/invoices', expect.any(Object))
  })

  it('throws a readable error on an HTTP error status', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 })

    await expect(listInvoices()).rejects.toThrow('HTTP 500')
  })

  it('propagates a network error', async () => {
    global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(listInvoices()).rejects.toThrow('Failed to fetch')
  })
})

describe('createInvoice', () => {
  it('POSTs the invoice as JSON and returns the created record', async () => {
    const draft = { invoiceNumber: 'INV-2026-002', items: [] }
    const created = { id: '2', ...draft }
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => created })

    await expect(createInvoice(draft)).resolves.toEqual(created)

    const [, options] = global.fetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(draft)
  })
})

describe('updateInvoice', () => {
  it('PUTs to the invoice-specific path', async () => {
    const invoice = { id: '2', status: 'Paid' }
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => invoice })

    await updateInvoice('2', invoice)

    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toBe('https://example.mockapi.io/invoices/2')
    expect(options.method).toBe('PUT')
  })
})

describe('deleteInvoice', () => {
  it('DELETEs the invoice-specific path', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => null })

    await deleteInvoice('2')

    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toBe('https://example.mockapi.io/invoices/2')
    expect(options.method).toBe('DELETE')
  })
})

describe('without VITE_MOCKAPI_URL', () => {
  it('rejects mutating calls with the offline message', async () => {
    vi.stubEnv('VITE_MOCKAPI_URL', '')
    await expect(createInvoice({})).rejects.toThrow('Offline demo data')
  })
})
