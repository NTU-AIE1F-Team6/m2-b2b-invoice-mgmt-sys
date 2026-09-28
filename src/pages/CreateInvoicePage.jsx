import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import { can } from '../data/roles.js'
import InvoiceForm from '../components/InvoiceForm.jsx'
import Hint from '../components/Hint.jsx'

export default function CreateInvoicePage({ store, notify }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const allowed = can(user, 'create')

  useEffect(() => {
    if (!allowed) {
      notify('View-only accounts cannot create invoices.', 'error')
      navigate('/', { replace: true })
    }
  }, [allowed, notify, navigate])

  if (!allowed) return null

  // The Customers page links here with ?uen=&name= to pre-fill the buyer, and the Products page
  // with ?item=&price= to pre-fill the first line item.
  const initialValues = {
    buyerName: params.get('name') || '',
    buyerUEN: params.get('uen') || '',
    items: params.get('item') ? [{ description: params.get('item'), qty: 1, unitPrice: Number(params.get('price')) || 0 }] : undefined,
  }

  const handleSubmit = async (payload, action) => {
    setBusy(true)
    try {
      const { invoice, transmitted } = await store.addInvoice(payload, { transmit: action === 'transmit' })
      if (action === 'draft') notify(`Invoice ${invoice.invoiceNumber} saved as a draft.`, 'info')
      else if (transmitted) notify(`Invoice ${invoice.invoiceNumber} transmitted via the Peppol network.`)
      else notify(`Invoice ${invoice.invoiceNumber} was rejected by the Access Point.`, 'error')
      navigate('/')
    } catch (err) {
      notify(`Could not save the invoice: ${err.message}`, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-bold text-slate-900">Create a Peppol e-invoice</h1>
          <p className="text-sm text-slate-500">Follows the Singapore InvoiceNow (PINT-SG) structure with 9% GST.</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Hint label="If you arrived here from Customers or Products, the buyer or product is read from the web address and filled in for you (useSearchParams)" />
            <Hint label="Saving waits for the store to confirm, then shows a toast message and sends you back to the dashboard (async event handler)" />
          </div>
        </div>
        <InvoiceForm mode="create" initialValues={initialValues} busy={busy} onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </div>
  )
}
