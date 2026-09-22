import { useFetch } from '../hooks/useFetch.js'
import { FX_API } from '../data/constants.js'
import LoadingSpinner from './LoadingSpinner.jsx'
import Hint from './Hint.jsx'

// Free public API #1: Frankfurter (ECB reference rates), no key required.
export default function FxRatesCard() {
  const { data, loading, error, refetch } = useFetch(FX_API)

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Live FX: 1 SGD buys <Hint label="useFetch: useEffect + fetch, loading and error state" className="ml-2" />
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {data ? `ECB reference rates, ${data.date}` : 'Source: api.frankfurter.dev'}
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      {loading && <LoadingSpinner label="Fetching rates..." className="py-2" />}
      {error && !loading && (
        <p className="text-sm text-rose-600">
          Rates unavailable ({error}).{' '}
          <button type="button" onClick={refetch} className="underline font-semibold">
            Try again
          </button>
        </p>
      )}
      {data && !loading && (
        <ul className="flex flex-wrap gap-2">
          {Object.entries(data.rates).map(([ccy, rate]) => (
            <li key={ccy} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
              <span className="font-semibold text-slate-700">{ccy}</span>{' '}
              <span className="text-slate-600 font-mono">{rate.toFixed(ccy === 'JPY' ? 2 : 4)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
