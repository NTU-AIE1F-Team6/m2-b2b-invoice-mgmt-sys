import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import TourPage from './pages/TourPage.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import AppShell from './components/AppShell.jsx'

// Top-level routes: the public login and tour pages, and everything else behind the auth gate.
// AppShell owns the invoice store and declares the inner routes (dashboard, create, edit, customers).
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/tour" element={<TourPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
