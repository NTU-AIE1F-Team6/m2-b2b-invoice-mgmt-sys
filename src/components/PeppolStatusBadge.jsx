import { STATUS } from '../data/constants.js'

const STYLES = {
  [STATUS.DRAFT]: 'bg-amber-50 text-amber-700 border-amber-200',
  [STATUS.QUEUED]: 'bg-sky-50 text-sky-700 border-sky-200',
  [STATUS.TRANSMITTED]: 'bg-blue-50 text-blue-700 border-blue-200',
  [STATUS.PAID]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [STATUS.FAILED]: 'bg-rose-50 text-rose-700 border-rose-200',
}

const LABELS = {
  [STATUS.QUEUED]: 'Queued at Access Point',
  [STATUS.TRANSMITTED]: 'Transmitted (Peppol)',
}

export default function PeppolStatusBadge({ status }) {
  const queued = status === STATUS.QUEUED
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
        STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {queued && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" aria-hidden="true" />}
      {LABELS[status] || status}
    </span>
  )
}
