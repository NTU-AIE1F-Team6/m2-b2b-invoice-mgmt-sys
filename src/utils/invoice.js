import { GST_RATE } from '../data/constants.js'

export function lineTotal(item) {
  return (Number(item.qty) || 0) * (Number(item.unitPrice) || 0)
}

export function computeTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0)
  const gst = Math.round(subtotal * GST_RATE * 100) / 100
  return { subtotal, gst, total: subtotal + gst }
}

export function invoiceTotal(invoice) {
  return computeTotals(invoice.items).total
}

export function nextInvoiceId(invoices, year = new Date().getFullYear()) {
  const max = invoices.reduce((m, inv) => {
    const match = /^INV-(\d{4})-(\d+)$/.exec(inv.invoiceNumber)
    return match && Number(match[1]) === year ? Math.max(m, Number(match[2])) : m
  }, 0)
  return `INV-${year}-${String(max + 1).padStart(3, '0')}`
}

export function formatSGD(amount) {
  return Number(amount).toLocaleString('en-SG', { style: 'currency', currency: 'SGD', minimumFractionDigits: 2 })
}

export function isOverdue(invoice, today = new Date()) {
  if (invoice.status === 'Paid') return false
  return new Date(invoice.dueDate) < new Date(today.toDateString())
}
