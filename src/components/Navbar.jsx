import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Hint from './Hint.jsx'

const linkClass = ({ isActive }) =>
  `text-sm font-medium px-3 py-2 rounded-lg transition ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
  }`

export default function Navbar({ hints, onToggleHints }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-y-2 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl flex items-center justify-center shadow">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                EasyInvoice
              </span>
              <span className="hidden sm:block text-xs text-slate-400">Singapore Peppol E-Invoicing Portal</span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Hint label="NavLink: React Router" />
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/customers" className={linkClass}>
              Customers
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              Products
            </NavLink>
            <Link
              to="/create"
              className="inline-flex items-center gap-1 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg shadow-sm transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New E-Invoice</span>
              <span className="sm:hidden">New</span>
            </Link>
            <button
              type="button"
              onClick={onToggleHints}
              aria-pressed={hints}
              title="Show which React feature powers each part of the screen"
              className={`text-xs font-semibold px-3 py-2 rounded-lg transition border ${
                hints
                  ? 'bg-violet-600 border-violet-400 text-white hover:bg-violet-500'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {hints ? 'Hints on' : 'Hints'}
            </button>
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-700">
              <Hint label="useAuth(): Context" />
              <span className="hidden md:block text-xs text-slate-300 leading-tight">
                <span className="block font-semibold text-white">{user?.name}</span>
                <span className="text-slate-400">@{user?.username}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
