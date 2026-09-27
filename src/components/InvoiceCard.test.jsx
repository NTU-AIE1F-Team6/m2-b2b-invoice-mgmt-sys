import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InvoiceCard from './InvoiceCard.jsx'

const invoice = {
  id: 'mock-id-1',
  invoiceNumber: 'INV-2026-001',
  buyerName: 'Temasek Tech Solutions Pte Ltd',
  buyerUEN: '202012345E',
  peppolId: '202012345E@SGUEN',
  issueDate: '2026-09-01',
  dueDate: '2099-10-01',
  items: [
    { description: 'Cloud setup', sku: '', qty: 2, unitPrice: 100 },
  ],
  includePayNowQR: true,
  status: 'Draft',
}

const editUser = { username: 'john', name: 'John', role: 'EDIT' }
const viewOnlyUser = { username: 'viewer', name: 'View-only User', role: 'VIEW_ONLY' }

const defaultProps = {
  invoice,
  user: editUser,
  busy: false,
  onTransmit: vi.fn(),
  onMarkPaid: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
}

describe('InvoiceCard', () => {
  it('renders invoice details and total', () => {
    render(<InvoiceCard {...defaultProps} />)

    expect(screen.getByText('INV-2026-001')).toBeInTheDocument()
    expect(screen.getByText('Temasek Tech Solutions Pte Ltd')).toBeInTheDocument()
    expect(screen.getByText(/UEN\s+202012345E/)).toBeInTheDocument()
    expect(screen.getByText('1 item + PayNow QR')).toBeInTheDocument()
    expect(screen.getByText('$218.00')).toBeInTheDocument()
  })

  it('shows Transmit for a draft invoice', () => {
    render(<InvoiceCard {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Transmit' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mark paid' })).not.toBeInTheDocument()
  })

  it('calls onTransmit with the invoice ID', async () => {
    const user = userEvent.setup()
    const onTransmit = vi.fn()

    render(<InvoiceCard {...defaultProps} onTransmit={onTransmit} />)

    await user.click(screen.getByRole('button', { name: 'Transmit' }))

    expect(onTransmit).toHaveBeenCalledWith('mock-id-1')
  })

  it('calls edit and delete callbacks', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <InvoiceCard
        {...defaultProps}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onEdit).toHaveBeenCalledWith('mock-id-1')
    expect(onDelete).toHaveBeenCalledWith('mock-id-1')
  })

  it('shows Mark paid for a transmitted invoice', () => {
    render(
      <InvoiceCard
        {...defaultProps}
        invoice={{ ...invoice, status: 'Transmitted' }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Mark paid' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Transmit' })).not.toBeInTheDocument()
  })

  it('hides edit, delete and transmit for a view-only user', () => {
    render(<InvoiceCard {...defaultProps} user={viewOnlyUser} />)

    expect(screen.queryByRole('button', { name: 'Transmit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('hides delete for a paid invoice even for an editor', () => {
    render(<InvoiceCard {...defaultProps} invoice={{ ...invoice, status: 'Paid' }} />)

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })
})
