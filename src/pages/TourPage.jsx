import { Link } from 'react-router'
import { CONCEPTS, TREE, CHECKLIST } from '../data/tour.js'
import { useAuth } from '../context/AuthContext.jsx'

const HINTS_KEY = 'invoicenow-hints'

// Public page (no login) that maps each React concept from the course to the file and the
// lines that use it. "Open the app with hints on" switches on the in-app labels first.
export default function TourPage() {
  const { isAuthenticated } = useAuth()

  const enableHints = () => {
    try {
      localStorage.setItem(HINTS_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/tour" className="font-bold tracking-tight">
            InvoiceNow SG <span className="text-slate-400 font-normal">/ how it is built</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" onClick={enableHints} className="bg-violet-600 hover:bg-violet-500 px-3 py-2 rounded-lg font-semibold">
              Open the app with hints on
            </Link>
            <Link to={isAuthenticated ? '/' : '/login'} className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg font-semibold">
              {isAuthenticated ? 'Back to app' : 'Sign in'}
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">NTU AI Engineering, Module 2</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How InvoiceNow SG is built</h1>
          <p className="text-slate-600 mt-3 max-w-3xl">
            A React + Vite app that simulates Singapore&apos;s Peppol e-invoicing network. Below, each React idea from the
            course is matched to the file that uses it, with the real lines of code. Inside the app, switch on
            <strong> Hints</strong> in the navbar and every part of the screen gets a purple label naming the React
            feature behind it.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {CONCEPTS.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="bg-white border border-slate-200 hover:border-violet-400 text-slate-700 px-3 py-1.5 rounded-full">
                {c.title}
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          {CONCEPTS.map((c, i) => (
            <article key={c.id} id={c.id} data-concept={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-20">
              <div className="p-5 sm:p-6 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div>
                  <div className="text-xs font-bold text-violet-600 uppercase tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{c.title}</h2>
                  <p className="text-sm text-slate-600 mt-2">{c.what}</p>
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Files</div>
                    <ul className="space-y-1">
                      {c.files.map((f) => (
                        <li key={f} className="font-mono text-xs text-slate-700 bg-slate-100 rounded px-2 py-1 inline-block mr-1">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={c.live.to}
                    onClick={enableHints}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:underline"
                  >
                    See it live: {c.live.label} &rarr;
                  </Link>
                </div>
                <pre className="bg-slate-900 text-slate-100 text-[12px] leading-relaxed rounded-xl p-4 overflow-x-auto">
                  <code>{c.code}</code>
                </pre>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-900">Component tree</h2>
            <p className="text-sm text-slate-600 mt-1 mb-4">Who renders whom, and which React feature each one leans on.</p>
            <pre className="bg-slate-900 text-slate-100 text-[11.5px] leading-relaxed rounded-xl p-4 overflow-x-auto">
              <code>{TREE}</code>
            </pre>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-900">Requirement checklist</h2>
            <p className="text-sm text-slate-600 mt-1 mb-4">From the Module 2 project brief.</p>
            <ul className="space-y-2">
              {CHECKLIST.map(([req, where]) => (
                <li key={req} className="flex gap-3 text-sm">
                  <span className="text-emerald-600 font-bold shrink-0" aria-hidden="true">&#10003;</span>
                  <span>
                    <span className="text-slate-800">{req}</span>
                    <span className="block text-xs text-slate-500 font-mono">{where}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-violet-50 border border-violet-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-900">Suggested 5-minute demo</h2>
          <ol className="list-decimal list-inside text-sm text-slate-700 mt-3 space-y-1.5">
            <li>Open the app, try a wrong password, then sign in (Context, controlled inputs, RequireAuth).</li>
            <li>Switch on Hints in the navbar and read the labels on the dashboard (useReducer store, useFetch, lists).</li>
            <li>Go to Customers, pick a buyer, and land on the prefilled form (React Router, useSearchParams).</li>
            <li>Add a line item, transmit, watch the toast and the new card (array state, async event, conditional rendering).</li>
            <li>Mark it paid, edit it, delete it, then refresh the page: the list is persisted (localStorage effect).</li>
          </ol>
        </section>
      </main>

      <footer className="text-center text-xs text-slate-400 py-8">
        Source: React 18, Vite 5, React Router 6, Tailwind CSS 4. Hosted on artificialintelligence.sg.
      </footer>
    </div>
  )
}
