import { Link, useNavigate, useSearchParams } from 'react-router'
import InvoiceForm from '../components/InvoiceForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import PeppolStatusBadge from '../components/PeppolStatusBadge.jsx'
import Hint from '../components/Hint.jsx'

// Bonus challenge: update an existing invoice. Uses ?id= rather than /edit/:id so a page refresh
// still resolves on the static host (see scripts/postbuild.mjs).
export default function EditInvoicePage({ store, notify }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const id = params.get('id')
  const invoice = store.invoices.find((i) => i.id === id)

  if (store.loading) {
    return <LoadingSpinner label="Loading invoice..." className="py-16" />
  }

  if (!invoice) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <h1 className="text-xl font-bold text-slate-900">Invoice not found</h1>
        <p className="text-sm text-slate-500">There is no invoice with ID {id || '(none)'} in your list.</p>
        <Link to="/" className="inline-block text-sm font-semibold text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const handleSubmit = (payload) => {
    store.updateInvoice({ ...invoice, ...payload })
    notify(`Invoice ${invoice.id} updated.`)
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit invoice {invoice.id}</h1>
            <p className="text-sm text-slate-500">Changes are saved locally; the network status stays as it is.</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Hint label="useSearchParams reads ?id=" />
              <Hint label="key={invoice.id} resets the form state" />
              <Hint label="dispatches 'update' to the reducer" />
            </div>
          </div>
          <PeppolStatusBadge status={invoice.status} />
        </div>
        <InvoiceForm key={invoice.id} mode="edit" initialValues={invoice} onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </div>
  )
}
