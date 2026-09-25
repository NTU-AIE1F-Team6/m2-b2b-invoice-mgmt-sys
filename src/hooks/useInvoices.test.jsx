import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useInvoices } from './useInvoices.js'

const mockInvoices = [
    {
        id: 'INV-2026-001',
        buyerName: 'Test Buyer',
        buyerUEN: '202012345E',
        items: [],
        status: 'Draft',
    },
]

function InvoiceHarness() {
    const store = useInvoices()

    return (
        <div>
            <span data-testid="loading">
                {store.loading ? 'Loading' : 'Loaded'}
            </span>
            <span data-testid="count">{store.invoices.length}</span>
            {store.error && <span>{store.error}</span>}
        </div>
    )
}

beforeEach(() => {
    localStorage.clear()
    vi.spyOn(global, 'fetch')
})

afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
})

describe('useInvoices', () => {
    it('shows loading before the fetch resolves', () => {
        global.fetch.mockImplementation(() => new Promise(() => { }))

        render(<InvoiceHarness />)

        expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    })

    it('loads invoices after a successful fetch', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ invoices: mockInvoices }),
        })

        render(<InvoiceHarness />)

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
        })

        expect(screen.getByTestId('count')).toHaveTextContent('1')
        expect(global.fetch).toHaveBeenCalled()
    })

    it('shows an error when the API request fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        })

        render(<InvoiceHarness />)

        expect(
            await screen.findByText('Mock API returned HTTP 500'),
        ).toBeInTheDocument()
    })

})

function TransmissionHarness() {
    const store = useInvoices()

    return (
        <div>
            <span data-testid="status">
                {store.invoices[0]?.status || 'Loading'}
            </span>

            <button
                type="button"
                onClick={() => store.transmitInvoice('INV-2026-001')}
            >
                Transmit
            </button>
        </div>
    )

    it('transmits an invoice with a valid UEN', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ invoices: mockInvoices }),
        })

        render(<TransmissionHarness />)

        expect(await screen.findByTestId('status')).toHaveTextContent('Draft')

        vi.useFakeTimers()

        const user = userEvent.setup({
            advanceTimers: vi.advanceTimersByTime,
        })

        await user.click(screen.getByRole('button', { name: 'Transmit' }))

        expect(screen.getByTestId('status')).toHaveTextContent('Queued')

        await act(async () => {
            await vi.advanceTimersByTimeAsync(900)
        })

        expect(screen.getByTestId('status')).toHaveTextContent('Transmitted')
    })
}