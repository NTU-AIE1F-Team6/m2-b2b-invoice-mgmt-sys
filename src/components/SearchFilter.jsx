import { STATUS_FILTERS } from '../data/constants.js'
import Hint from './Hint.jsx'

export default function SearchFilter({ search, onSearch, status, onStatus }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Hint label="Controlled input; state lives in DashboardPage (lifted up)" className="mb-2" />
        <div className="relative">
          <svg className="w-5 h-5 absolute left-3.5 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search by buyer name, UEN or invoice ID..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search invoices"
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
        <Hint label="STATUS_FILTERS.map() with key" />
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              status === s ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
