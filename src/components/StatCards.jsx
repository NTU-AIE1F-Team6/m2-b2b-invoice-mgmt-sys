import { STATUS } from '../data/constants.js'
import { formatSGD, invoiceTotal, isOverdue } from '../utils/invoice.js'
import Hint from './Hint.jsx'

const TONES = {
  emerald: ['text-slate-900', 'bg-emerald-50 text-emerald-600'],
  blue: ['text-blue-600', 'bg-blue-50 text-blue-600'],
  amber: ['text-amber-600', 'bg-amber-50 text-amber-600'],
  rose: ['text-rose-600', 'bg-rose-50 text-rose-600'],
}

function Card({ label, value, tone, icon }) {
  const [valueClass, iconClass] = TONES[tone]
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <h3 className={`text-2xl font-bold mt-1 truncate ${valueClass}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-xl shrink-0 ${iconClass}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
        </svg>
      </div>
    </div>
  )
}

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`

export default function StatCards({ invoices }) {
  const sum = (status) => invoices.filter((i) => i.status === status).reduce((acc, i) => acc + invoiceTotal(i), 0)
  const collected = sum(STATUS.PAID)
  const inTransit = sum(STATUS.TRANSMITTED) + sum(STATUS.QUEUED)
  const drafts = invoices.filter((i) => i.status === STATUS.DRAFT).length
  const overdue = invoices.filter((i) => i.status === STATUS.TRANSMITTED && isOverdue(i)).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Hint label="These totals are worked out fresh from the invoice list each time it changes. Nothing is stored separately, so they can never go stale (derived from props)" className="sm:col-span-2 xl:col-span-4 justify-self-start" />
      <Card
        label="Collected revenue"
        value={formatSGD(collected)}
        tone="emerald"
        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <Card label="In transit (Peppol)" value={formatSGD(inTransit)} tone="blue" icon="M13 10V3L4 14h7v7l9-11h-7z" />
      <Card
        label="Unsent drafts"
        value={plural(drafts, 'invoice')}
        tone="amber"
        icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
      <Card label="Overdue" value={plural(overdue, 'invoice')} tone="rose" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </div>
  )
}
