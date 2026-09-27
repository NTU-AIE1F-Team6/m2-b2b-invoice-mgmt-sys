import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { USERS } from '../data/users.js'
import { sha256 } from '../utils/hash.js'

// Context is justified here: the session is read by the navbar, the route guard and the login
// page, which sit far apart in the tree. Everything else in the app uses plain props.
const SESSION_KEY = 'easyinvoice-session'
const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  const login = useCallback(async (username, password) => {
    const account = USERS.find((u) => u.username === username.trim().toLowerCase())
    const digest = await sha256(password)
    // Hash even when the account is missing so timing does not reveal valid usernames.
    if (!account || account.passwordHash !== digest) {
      throw new Error('Incorrect username or password. Please try again.')
    }
    const session = {
      username: account.username,
      name: account.name,
      role: account.role,
      loginAt: new Date().toISOString(),
    }
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch {
      // private mode: the session lives in memory only
    }
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
