import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

// Password gate in the style of artificialintelligence.sg/citylife/: a centred card, the password is
// hashed with SHA-256 in the browser and compared against the stored digest, and the session is
// kept in sessionStorage so it ends when the tab closes.
export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) return <Navigate to={location.state?.from || '/'} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Please enter both your username and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await login(username, password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message)
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:outline-none'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-100 to-slate-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-md text-center">
        <div className="text-4xl mb-3" aria-hidden="true">
          🔒
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">InvoiceNow SG</h1>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          This portal is for invited users. Sign in to reach the Peppol e-invoicing dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-left" noValidate>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 shadow-md transition disabled:opacity-60"
          >
            {busy ? 'Checking...' : 'Enter →'}
          </button>
        </form>
        <p className="text-sm text-rose-600 mt-4 min-h-5" role="alert" aria-live="polite">
          {error}
        </p>
        <p className="text-xs text-slate-400 mt-6">
          NTU AI Engineering group project. Demo only, not connected to the real Peppol network.
        </p>
        <Link to="/tour" className="inline-block mt-3 text-sm font-semibold text-violet-700 hover:underline">
          See how it is built (no login needed) &rarr;
        </Link>
      </div>
    </div>
  )
}
