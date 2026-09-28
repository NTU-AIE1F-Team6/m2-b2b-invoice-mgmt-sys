import { useState } from 'react'
import { UEN_PATTERN } from '../data/constants.js'
import { computeTotals } from '../utils/invoice.js'
import { useFetch } from '../hooks/useFetch.js'
import { listCustomers, listProducts } from '../api/referenceData.js'
import Hint from './Hint.jsx'

const today = () => new Date().toISOString().slice(0, 10)
const plusDays = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
const input = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
const itemInput = 'px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const label = 'block text-xs font-semibold text-slate-600 uppercase mb-1'
const primary = 'px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed'

const EMPTY_ITEM = { description: '', sku: '', qty: 1, unitPrice: '' }

// Controlled form used by both Create and Edit. `mode` decides which submit buttons appear.
// onSubmit(payload, action) where action is 'draft' | 'transmit' | 'save'.
export default function InvoiceForm({ initialValues, mode = 'create', busy = false, onSubmit, onCancel }) {
  const [buyerName, setBuyerName] = useState(initialValues?.buyerName ?? '')
  const [buyerUEN, setBuyerUEN] = useState(initialValues?.buyerUEN ?? '')
  const [issueDate, setIssueDate] = useState(initialValues?.issueDate ?? today())
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? plusDays(30))
  const [includePayNowQR, setIncludePayNowQR] = useState(initialValues?.includePayNowQR ?? true)
  const [items, setItems] = useState(() =>
    initialValues?.items?.length
      ? initialValues.items.map((i) => ({ ...i }))
      : [{ ...EMPTY_ITEM, description: 'Professional Consulting Services', unitPrice: 1500 }],
  )
  const [error, setError] = useState('')

  // Two reference-data endpoints: the buyer directory feeds the buyer autocomplete (picking a known
  // buyer fills the UEN), the product catalogue feeds the per-line dropdown (filling description + price).
  const customers = useFetch(listCustomers)
  const products = useFetch(listProducts)
  const { subtotal, gst, total } = computeTotals(items)

  const pickProduct = (index, sku) => {
    const product = products.data?.find((p) => p.sku === sku)
    if (!product) return
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, description: product.description, sku: product.sku, unitPrice: product.unitPrice } : item,
      ),
    )
  }

  const handleBuyerName = (value) => {
    setBuyerName(value)
    const match = customers.data?.find((c) => c.name.toLowerCase() === value.trim().toLowerCase())
    if (match) setBuyerUEN(match.uen)
  }

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value, ...(field === 'description' ? { sku: '' } : {}) } : item,
      ),
    )
  }
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }])
  const removeItem = (index) => setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))

  const validate = () => {
    if (!buyerName.trim()) return 'Please enter the buyer company name.'
    if (!UEN_PATTERN.test(buyerUEN.trim().toUpperCase())) {
      return 'Please enter a valid Singapore UEN (e.g. 202012345E, 53412345A or T18LL0123K).'
    }
    if (!issueDate || !dueDate) return 'Please set both the issue date and the due date.'
    if (dueDate < issueDate) return 'The due date cannot be earlier than the issue date.'
    for (const [i, item] of items.entries()) {
      if (!item.description.trim()) return `Line item ${i + 1} needs a description.`
      if (!(Number(item.qty) > 0)) return `Line item ${i + 1} needs a quantity of at least 1.`
      if (item.unitPrice === '' || !(Number(item.unitPrice) >= 0)) return `Line item ${i + 1} needs a unit price.`
    }
    return ''
  }

  const submit = (action) => (e) => {
    e.preventDefault()
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    onSubmit(
      {
        buyerName: buyerName.trim(),
        buyerUEN: buyerUEN.trim().toUpperCase(),
        issueDate,
        dueDate,
        includePayNowQR,
        items: items.map((i) => ({
          description: i.description.trim(),
          sku: i.sku || '',
          qty: Number(i.qty),
          unitPrice: Number(i.unitPrice),
        })),
      },
      action,
    )
  }

  const directoryHint = customers.loading
    ? 'Loading buyer directory...'
    : customers.error
      ? 'Buyer directory unavailable, type the name manually.'
      : 'Start typing to pick from the buyer directory.'

  return (
    <form onSubmit={submit(mode === 'edit' ? 'save' : 'transmit')} className="space-y-6" noValidate>
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Hint label="Whatever you type here is stored by React as you type, so the form always knows its current values and can validate them before saving (controlled inputs)" className="mb-1" />
          <label htmlFor="buyerName" className={label}>Buyer company name</label>
          <input
            id="buyerName"
            list="buyer-directory"
            type="text"
            placeholder="e.g. Temasek Tech Solutions Pte Ltd"
            value={buyerName}
            onChange={(e) => handleBuyerName(e.target.value)}
            className={input}
          />
          <datalist id="buyer-directory">
            {(customers.data || []).map((c) => (
              <option key={c.uen} value={c.name} />
            ))}
          </datalist>
          <span className="text-xs text-slate-400 mt-1 block">{directoryHint}</span>
        </div>
        <div>
          <label htmlFor="buyerUEN" className={label}>Buyer Singapore UEN</label>
          <input
            id="buyerUEN"
            type="text"
            placeholder="e.g. 202012345E"
            value={buyerUEN}
            onChange={(e) => setBuyerUEN(e.target.value.toUpperCase())}
            className={`${input} uppercase`}
          />
          <span className="text-xs text-slate-400 mt-1 block">Peppol ID: {buyerUEN ? `${buyerUEN}@SGUEN` : '...'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="issueDate" className={label}>Issue date</label>
          <input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="dueDate" className={label}>Payment due date</label>
          <input id="dueDate" type="date" value={dueDate} min={issueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Invoice line items <Hint label="Line items are kept as a list in memory. Adding, editing or removing a row makes a fresh copy of the list, which is how React notices the change and updates the screen (array state)" className="ml-2" />{' '}
            <Hint label="This product dropdown is filled from the products data. Choosing one copies its name and price into the row (useFetch + derived value)" />
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
          >
            + Add item
          </button>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_auto] sm:grid-cols-[11rem_1fr_5rem_8rem_auto] gap-2 sm:gap-3 items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100"
          >
            <select
              aria-label={`Item ${index + 1} product`}
              value={item.sku || ''}
              onChange={(e) => pickProduct(index, e.target.value)}
              disabled={!products.data}
              className={`col-span-2 sm:col-span-1 ${itemInput} disabled:text-slate-400`}
            >
              <option value="">{products.loading ? 'Loading catalogue...' : products.error ? 'Catalogue unavailable' : 'Pick from catalogue...'}</option>
              {(products.data || []).map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.sku}: {p.description}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Item description or service"
              aria-label={`Item ${index + 1} description`}
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              className={`col-span-2 sm:col-span-1 ${itemInput}`}
            />
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Qty"
              aria-label={`Item ${index + 1} quantity`}
              value={item.qty}
              onChange={(e) => updateItem(index, 'qty', e.target.value)}
              className={itemInput}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Unit price (SGD)"
              aria-label={`Item ${index + 1} unit price`}
              value={item.unitPrice}
              onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
              className={itemInput}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
              aria-label={`Remove item ${index + 1}`}
              className="text-rose-500 hover:text-rose-700 disabled:text-slate-300 p-2 font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includePayNowQR}
            onChange={(e) => setIncludePayNowQR(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <span className="text-sm font-medium text-slate-700">Embed PayNow UEN QR code for instant B2B settlement</span>
        </label>
        <div className="text-right space-y-1 w-full sm:w-auto">
          <Hint label="Subtotal, GST and total are recalculated from the line items every time they change. They are never typed in or stored, so they cannot disagree with the rows (derived values)" />
          <div className="text-xs text-slate-500">Subtotal: ${subtotal.toFixed(2)}</div>
          <div className="text-xs text-slate-500">GST (9%): ${gst.toFixed(2)}</div>
          <div className="text-base font-bold text-slate-900">Total due: ${total.toFixed(2)} SGD</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-100">
        <Hint label="Pressing this button checks the form for mistakes first. Only if everything is valid is the invoice passed up to the page to be saved (submit handler)" className="self-center" />
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
          Cancel
        </button>
        {mode === 'edit' ? (
          <button type="submit" disabled={busy} className={`${primary} bg-blue-600 hover:bg-blue-700`}>
            Save changes
          </button>
        ) : (
          <>
            <button type="button" onClick={submit('draft')} disabled={busy} className={`${primary} bg-slate-700 hover:bg-slate-800`}>
              Save as draft
            </button>
            <button type="submit" disabled={busy} className={`${primary} bg-blue-600 hover:bg-blue-700`}>
              {busy ? 'Transmitting...' : 'Transmit via Peppol'}
            </button>
          </>
        )}
      </div>
    </form>
  )
}
