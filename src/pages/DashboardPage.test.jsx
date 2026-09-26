import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import DashboardPage from './DashboardPage.jsx'

const invoices = [
  {
    id: 'INV-2026-001',
    buyerName: 'Temasek Tech Solutions',
    buyerUEN: '202012345E',
    peppolId: '202012345E@SGUEN',
    issueDate: '2026-09-01',
    dueDate: '2099-10-01',
    items: [{ description: 'Cloud', qty: 1, unitPrice: 100 }],
    includePayNowQR: false,
    status: 'Draft',
  },
  {
    id: 'INV-2026-002',
    buyerName: 'Marina Bay Logistics',
    buyerUEN: '199854321W',
    peppolId: '199854321W@SGUEN',
    issueDate: '2026-09-10',
    dueDate: '2099-10-10',
    items: [{ description: 'Fleet', qty: 1, unitPrice: 200 }],
    includePayNowQR: false,
    status: 'Paid',
  },
]

function createStore() {
  return {
    invoices,
    loading: false,
    error: null,
    busyId: null,
    transmitInvoice: vi.fn(),
    markPaid: vi.fn(),
    deleteInvoice: vi.fn(),
    resetDemo: vi.fn(),
    retryLoad: vi.fn(),
  }
}

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      date: '2026-09-25',
      rates: { USD: 1.27 },
    }),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderDashboard(store = createStore()) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={<DashboardPage store={store} notify={vi.fn()} />}
        />
        <Route
          path="/edit"
          element={<div>Edit invoice page</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

it('renders the invoice buyers', () => {
  renderDashboard()

  expect(screen.getByText('Temasek Tech Solutions')).toBeInTheDocument()
  expect(screen.getByText('Marina Bay Logistics')).toBeInTheDocument()
})

it('filters invoices by buyer name', async () => {
  const user = userEvent.setup()

  renderDashboard()

  const search = screen.getByRole('searchbox')

  await user.type(search, 'Marina')

  expect(screen.getByText('Marina Bay Logistics')).toBeInTheDocument()
  expect(screen.queryByText('Temasek Tech Solutions')).not.toBeInTheDocument()
})

it('filters invoices by status', async () => {
  const user = userEvent.setup()

  renderDashboard()

  await user.click(screen.getByRole('button', { name: 'Paid' }))

  expect(screen.getByText('Marina Bay Logistics')).toBeInTheDocument()
  expect(screen.queryByText('Temasek Tech Solutions')).not.toBeInTheDocument()
})

it('shows an empty state when no invoice matches', async () => {
  const user = userEvent.setup()

  renderDashboard()

  await user.type(
    screen.getByRole('searchbox'),
    'does-not-exist',
  )

  expect(
    screen.getByText('No invoices match your search or filter.'),
  ).toBeInTheDocument()
})

it('navigates to edit when Edit is clicked', async () => {
  const user = userEvent.setup()

  renderDashboard()

  await user.click(screen.getAllByRole('button', { name: 'Edit' })[0])

  expect(screen.getByText('Edit invoice page')).toBeInTheDocument()
})

it('deletes an invoice after confirmation', async () => {
  const user = userEvent.setup()
  const store = createStore()

  vi.spyOn(window, 'confirm').mockReturnValue(true)

  renderDashboard(store)

  await user.click(screen.getAllByRole('button', { name: 'Delete' })[0])

  expect(store.deleteInvoice).toHaveBeenCalledWith('INV-2026-001')
})
