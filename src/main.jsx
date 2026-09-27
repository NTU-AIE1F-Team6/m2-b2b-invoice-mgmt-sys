import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// Vite injects the `base` from vite.config.js ("/easyinvoice/"). Keeping the trailing slash makes the
// dashboard URL "/easyinvoice/" (a directory the static host can serve) rather than "/easyinvoice".
const basename = import.meta.env.BASE_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
