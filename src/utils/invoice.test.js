import {
  lineTotal,
  computeTotals,
  nextInvoiceId,
} from './invoice.js'

describe('invoice utilities', () => {
  it('calculates a line-item total', () => {
    const item = {
      description: 'Consulting',
      qty: 3,
      unitPrice: 150,
    }

    expect(lineTotal(item)).toBe(450)
  })

  it('calculates subtotal, GST, and total', () => {
    const items = [
      { description: 'Service A', qty: 2, unitPrice: 100 },
      { description: 'Service B', qty: 3, unitPrice: 50 },
    ]

    const result = computeTotals(items)

    expect(result.subtotal).toBe(350)
    expect(result.gst).toBe(31.5)
    expect(result.total).toBe(381.5)
  })

  it('generates the next invoice ID for the selected year', () => {
    const invoices = [
      { invoiceNumber: 'INV-2026-001' },
      { invoiceNumber: 'INV-2026-004' },
      { invoiceNumber: 'INV-2025-009' },
    ]

    expect(nextInvoiceId(invoices, 2026)).toBe('INV-2026-005')
  })

  it('starts at 001 when no invoice exists for the year', () => {
    expect(nextInvoiceId([], 2026)).toBe('INV-2026-001')
  })
})