import { act, render, screen, waitFor } from '@testing-library/react'
import { useInvoices } from './useInvoices.js'
import * as invoicesApi from '../api/invoices.js'

vi.mock('../api/invoices.js')
vi.mock('../api/client.js', () => ({ hasMockApi: () => true }))

const mockInvoices = [
  {
    id: 'mock-id-1',
    invoiceNumber: 'INV-2026-001',
    buyerName: 'Test Buyer',
    buyerUEN: '202012345E',
    items: [],
    status: 'Draft',
  },
]

function InvoiceHarness() {
  const store = useInvoices('john')

  return (
    <div>
      <span data-testid="loading">{store.loading ? 'Loading' : 'Loaded'}</span>
      <span data-testid="count">{store.invoices.length}</span>
      {store.error && <span>{store.error}</span>}
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useInvoices', () => {
  it('shows loading before the fetch resolves', () => {
    invoicesApi.listInvoices.mockImplementation(() => new Promise(() => {}))

    render(<InvoiceHarness />)

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
  })

  it('loads invoices after a successful fetch', async () => {
    invoicesApi.listInvoices.mockResolvedValueOnce(mockInvoices)

    render(<InvoiceHarness />)

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
    })

    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('shows an error and keeps the list empty when the load fails', async () => {
    invoicesApi.listInvoices.mockRejectedValueOnce(new Error('MockAPI GET /invoices failed: HTTP 500'))

    render(<InvoiceHarness />)

    expect(await screen.findByText('MockAPI GET /invoices failed: HTTP 500')).toBeInTheDocument()
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})

describe('transmitInvoice', () => {
  it('transmits an invoice with a valid UEN, PUTing the queued then settled status', async () => {
    invoicesApi.listInvoices.mockResolvedValueOnce(mockInvoices)
    invoicesApi.updateInvoice.mockImplementation((id, invoice) => Promise.resolve(invoice))

    const { result } = renderHookLike()
    await waitFor(() => expect(result.current.loading).toBe(false))

    let ok
    await act(async () => {
      ok = await result.current.transmitInvoice('mock-id-1')
    })

    expect(ok).toBe(true)
    expect(invoicesApi.updateInvoice).toHaveBeenCalledWith('mock-id-1', expect.objectContaining({ status: 'Queued' }))
    expect(invoicesApi.updateInvoice).toHaveBeenCalledWith('mock-id-1', expect.objectContaining({ status: 'Transmitted' }))
    expect(result.current.invoices[0].status).toBe('Transmitted')
  }, 10000)

  it('reports a rejected UEN as Failed', async () => {
    const invalidUenInvoice = [{ ...mockInvoices[0], buyerUEN: 'not-a-uen' }]
    invoicesApi.listInvoices.mockResolvedValueOnce(invalidUenInvoice)
    invoicesApi.updateInvoice.mockImplementation((id, invoice) => Promise.resolve(invoice))

    const { result } = renderHookLike()
    await waitFor(() => expect(result.current.loading).toBe(false))

    let ok
    await act(async () => {
      ok = await result.current.transmitInvoice('mock-id-1')
    })

    expect(ok).toBe(false)
    expect(result.current.invoices[0].status).toBe('Failed')
  }, 10000)
})

describe('failed writes', () => {
  it('addInvoice leaves the list unchanged and rethrows on a server error', async () => {
    invoicesApi.listInvoices.mockResolvedValueOnce([])
    invoicesApi.createInvoice.mockRejectedValueOnce(new Error('MockAPI POST /invoices failed: HTTP 500'))

    const { result } = renderHookLike()
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await expect(
        result.current.addInvoice({ buyerName: 'Acme', buyerUEN: '202012345E', items: [] }),
      ).rejects.toThrow('HTTP 500')
    })

    expect(result.current.invoices).toHaveLength(0)
  })
})

// Minimal renderHook substitute: this project only depends on @testing-library/react.
function renderHookLike() {
  const result = { current: null }
  function Capture() {
    result.current = useInvoices('john')
    return null
  }
  const utils = render(<Capture />)
  return { ...utils, result }
}
