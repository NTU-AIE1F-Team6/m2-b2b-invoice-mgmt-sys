import InvoiceCard from './InvoiceCard.jsx'
import Hint from './Hint.jsx'

export default function InvoiceList({ invoices, user, busyId, onTransmit, onMarkPaid, onEdit, onDelete }) {
  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-14 px-4 text-slate-400 text-sm">
        <Hint label="When there are no matching invoices this friendly message is shown instead of a blank space (conditional rendering)" className="mb-2" />
        <div>No invoices match your search or filter.</div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Hint label="One card is drawn for each invoice in the list. Each card is tagged with its invoice number so React knows which one changed and redraws only that card (list rendering with key)" className="md:col-span-2 xl:col-span-3 justify-self-start" />
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
