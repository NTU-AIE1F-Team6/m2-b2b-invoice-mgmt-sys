import { Link } from 'react-router'
import { useFetch } from '../hooks/useFetch.js'
import { listCustomers } from '../api/referenceData.js'
import { CONTACTS_API } from '../data/constants.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import Hint from '../components/Hint.jsx'

// Two sources joined on screen: the buyer directory (MockAPI `referenceData`, or the static JSON
// fallback) and free public API #2, randomuser.me, which supplies a contact person for each buyer.
export default function CustomersPage() {
  const customers = useFetch(listCustomers)
  const contacts = useFetch(CONTACTS_API, { transform: (j) => j.results })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">Buyer directory</h1>
        <p className="text-sm text-slate-500 mt-1">
          Companies from the mock directory API, each paired with a contact person fetched live from randomuser.me.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Hint label="This customer list is downloaded from the shared MockAPI server, with loading and error messages while it arrives (useFetch)" />
          <Hint label="These contacts come from a free public internet service, to show the app can talk to outside systems (useFetch, external API)" />
          <Hint label="Clicking a customer opens the new-invoice form with that buyer already filled in, by putting their details in the web address (React Router Link)" />
        </div>
      </div>

      {customers.error && (
        <ErrorBanner title="Could not load the buyer directory" message={customers.error} onRetry={customers.refetch} />
      )}
      {contacts.error && !customers.error && (
        <ErrorBanner
          title="Contact details unavailable"
          message={`${contacts.error}. Company data is still shown.`}
          onRetry={contacts.refetch}
        />
      )}

      {customers.loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-14">
          <LoadingSpinner label="Fetching buyer directory..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(customers.data || []).map((c, index) => {
            const person = contacts.data?.[index]
            return (
              <article key={c.uen} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">{c.name}</h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      UEN {c.uen} · {c.industry} · {c.area}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      c.peppolRegistered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {c.peppolRegistered ? 'On Peppol' : 'Not on Peppol'}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-16">
                  {contacts.loading ? (
                    <LoadingSpinner label="Fetching contact..." />
                  ) : person ? (
                    <>
                      <img src={person.picture.thumbnail} alt="" width="40" height="40" className="rounded-full shrink-0" loading="lazy" />
                      <div className="min-w-0 text-xs">
                        <div className="font-semibold text-slate-800">
                          {person.name.first} {person.name.last}
                        </div>
                        <div className="text-slate-500 truncate">{person.email}</div>
                        <div className="text-slate-500">{person.phone}</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">No contact on file.</span>
                  )}
                </div>

                <Link
                  to={`/create?uen=${encodeURIComponent(c.uen)}&name=${encodeURIComponent(c.name)}`}
                  className="text-center text-sm font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl transition"
                >
                  New e-invoice for this buyer
                </Link>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
