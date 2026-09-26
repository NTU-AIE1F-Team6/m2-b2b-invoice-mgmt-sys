import { Link } from 'react-router'
import { useFetch } from '../hooks/useFetch.js'
import { formatSGD } from '../utils/invoice.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import Hint from '../components/Hint.jsx'

// Third data endpoint: the product and service catalogue. "Add to new invoice" carries the
// product into the create form through the URL, so no shared state is needed.
export default function ProductsPage() {
  const products = useFetch(`${import.meta.env.BASE_URL}api/products.json`, { transform: (j) => j.products })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">Product and service catalogue</h1>
        <p className="text-sm text-slate-500 mt-1">
          Items you can bill. Pick one here or from the line-item dropdown on the invoice form.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Hint label="useFetch #3: mock products.json" />
          <Hint label="Link to /create?item=&price= (React Router)" />
        </div>
      </div>

      {products.error && (
        <ErrorBanner title="Could not load the catalogue" message={products.error} onRetry={products.refetch} />
      )}

      {products.loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-14">
          <LoadingSpinner label="Fetching product catalogue..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {(products.data || []).map((p) => (
            <article key={p.sku} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-400">{p.sku}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{p.category}</span>
                </div>
                <h2 className="font-semibold text-slate-900 mt-1">{p.description}</h2>
              </div>
              <div className="mt-auto">
                <div className="text-lg font-bold text-slate-900">{formatSGD(p.unitPrice)}</div>
                <div className="text-xs text-slate-400">{p.unit}, before 9% GST</div>
              </div>
              <Link
                to={`/create?item=${encodeURIComponent(p.description)}&price=${p.unitPrice}`}
                className="text-center text-sm font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl transition"
              >
                Add to new invoice
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
