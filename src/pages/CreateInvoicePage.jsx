import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import InvoiceForm from '../components/InvoiceForm.jsx'
import Hint from '../components/Hint.jsx'

export default function CreateInvoicePage({ store, notify }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)

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
      if (action === 'draft') notify(`Invoice ${invoice.id} saved as a draft.`, 'info')
      else if (transmitted) notify(`Invoice ${invoice.id} transmitted via the Peppol network.`)
      else notify(`Invoice ${invoice.id} was rejected by the Access Point.`, 'error')
      navigate('/')
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
            <Hint label="useSearchParams prefill (?uen=&name= or ?item=&price=)" />
            <Hint label="async handler: await store.addInvoice, then notify + navigate" />
          </div>
        </div>
        <InvoiceForm mode="create" initialValues={initialValues} busy={busy} onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </div>
  )
}
