import InvoiceCard from './InvoiceCard.jsx'
import Hint from './Hint.jsx'

export default function InvoiceList({ invoices, user, busyId, onTransmit, onMarkPaid, onEdit, onDelete }) {
  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-14 px-4 text-slate-400 text-sm">
        <Hint label="Conditional rendering: empty state" className="mb-2" />
        <div>No invoices match your search or filter.</div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Hint label="invoices.map() renders one InvoiceCard per item, key = invoice.id" className="md:col-span-2 xl:col-span-3 justify-self-start" />
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          user={user}
          busy={busyId === invoice.id}
          onTransmit={onTransmit}
          onMarkPaid={onMarkPaid}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
