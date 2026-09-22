import { STATUS } from '../data/constants.js'
import { formatSGD, invoiceTotal, isOverdue } from '../utils/invoice.js'
import PeppolStatusBadge from './PeppolStatusBadge.jsx'
import Hint from './Hint.jsx'

const btn = 'text-xs font-semibold px-2.5 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'

export default function InvoiceCard({ invoice, busy, onTransmit, onMarkPaid, onEdit, onDelete }) {
  const total = invoiceTotal(invoice)
  const overdue = invoice.status === STATUS.TRANSMITTED && isOverdue(invoice)
  const canTransmit = invoice.status === STATUS.DRAFT || invoice.status === STATUS.FAILED
  const itemCount = invoice.items.length

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <Hint label="Props in (invoice), callbacks out (onDelete...)" className="mb-1" />
          <div className="text-xs font-semibold text-slate-400">{invoice.id}</div>
          <h3 className="font-semibold text-slate-900 truncate">{invoice.buyerName}</h3>
          <div className="text-xs text-slate-500 mt-0.5">UEN {invoice.buyerUEN}</div>
        </div>
        <PeppolStatusBadge status={invoice.status} />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt className="text-slate-400">Peppol ID</dt>
          <dd className="font-mono text-slate-700 truncate">{invoice.peppolId}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Line items</dt>
          <dd className="text-slate-700">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
            {invoice.includePayNowQR ? ' + PayNow QR' : ''}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Issued</dt>
          <dd className="text-slate-700">{invoice.issueDate}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Due</dt>
          <dd className={overdue ? 'text-rose-600 font-semibold' : 'text-slate-700'}>
            {invoice.dueDate}
            {overdue ? ' (overdue)' : ''}
          </dd>
        </div>
      </dl>

      {invoice.status === STATUS.FAILED && invoice.failureReason && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{invoice.failureReason}</p>
      )}

      <div className="flex items-end justify-between gap-3 pt-3 border-t border-slate-100">
        <div>
          <div className="text-xs text-slate-400">Total incl. 9% GST</div>
          <div className="text-lg font-bold text-slate-900">{formatSGD(total)}</div>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Hint label="Conditional buttons by status" />
          {canTransmit && (
            <button
              type="button"
              onClick={() => onTransmit(invoice.id)}
              disabled={busy}
              className={`${btn} bg-blue-50 hover:bg-blue-100 text-blue-600`}
            >
              {busy ? 'Sending...' : invoice.status === STATUS.FAILED ? 'Retry' : 'Transmit'}
            </button>
          )}
          {invoice.status === STATUS.TRANSMITTED && (
            <button
              type="button"
              onClick={() => onMarkPaid(invoice.id)}
              className={`${btn} bg-emerald-50 hover:bg-emerald-100 text-emerald-700`}
            >
              Mark paid
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(invoice.id)}
            disabled={busy}
            className={`${btn} bg-slate-100 hover:bg-slate-200 text-slate-700`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(invoice.id)}
            disabled={busy}
            className={`${btn} bg-rose-50 hover:bg-rose-100 text-rose-600`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
