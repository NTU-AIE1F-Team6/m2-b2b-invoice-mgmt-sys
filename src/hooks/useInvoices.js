import { useCallback, useEffect, useReducer } from 'react'
import { STATUS, UEN_PATTERN } from '../data/constants.js'
import { nextInvoiceId } from '../utils/invoice.js'

// Invoice store: useReducer for the collection, useEffect to fetch the mock API on first load
// and to persist every change to localStorage (so the demo survives a refresh).
const STORAGE_KEY = 'invoicenow-sg-invoices-v1'
const API_URL = `${import.meta.env.BASE_URL}api/invoices.json`
const NETWORK_DELAY_MS = 900

const initialState = { invoices: [], loading: true, loaded: false, error: null, busyId: null }

function reducer(state, action) {
  switch (action.type) {
    case 'load/start':
      return { ...state, loading: true, error: null }
    case 'load/success':
      return { ...state, loading: false, loaded: true, invoices: action.invoices }
    case 'load/error':
      return { ...state, loading: false, error: action.error }
    case 'busy':
      return { ...state, busyId: action.id }
    case 'add':
      return { ...state, invoices: [action.invoice, ...state.invoices] }
    case 'update':
      return { ...state, invoices: state.invoices.map((i) => (i.id === action.invoice.id ? action.invoice : i)) }
    case 'delete':
      return { ...state, invoices: state.invoices.filter((i) => i.id !== action.id) }
    case 'status':
      return {
        ...state,
        invoices: state.invoices.map((i) =>
          i.id === action.id
            ? { ...i, status: action.status, failureReason: action.failureReason, updatedAt: action.at }
            : i,
        ),
      }
    default:
      return state
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function useInvoices() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(async (signal, { ignoreCache = false } = {}) => {
    dispatch({ type: 'load/start' })
    const cached = ignoreCache ? null : readCache()
    if (cached) {
      dispatch({ type: 'load/success', invoices: cached })
      return
    }
    try {
      const res = await fetch(API_URL, { signal })
      if (!res.ok) throw new Error(`Mock API returned HTTP ${res.status}`)
      const json = await res.json()
      dispatch({ type: 'load/success', invoices: json.invoices })
    } catch (err) {
      if (err.name !== 'AbortError') dispatch({ type: 'load/error', error: err.message })
    }
  }, [])

  // Initial fetch (aborted if the component unmounts mid-request).
  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  // Persist after every successful change.
  useEffect(() => {
    if (!state.loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.invoices))
    } catch {
      // storage full or blocked: the in-memory copy still works
    }
  }, [state.invoices, state.loaded])

  const simulateTransmit = useCallback(async (invoice) => {
    dispatch({ type: 'busy', id: invoice.id })
    dispatch({ type: 'status', id: invoice.id, status: STATUS.QUEUED, at: new Date().toISOString() })
    await wait(NETWORK_DELAY_MS)
    const ok = UEN_PATTERN.test(invoice.buyerUEN)
    dispatch({
      type: 'status',
      id: invoice.id,
      status: ok ? STATUS.TRANSMITTED : STATUS.FAILED,
      failureReason: ok ? undefined : 'Access Point rejected: buyer UEN is not a valid Singapore UEN',
      at: new Date().toISOString(),
    })
    dispatch({ type: 'busy', id: null })
    return ok
  }, [])

  const addInvoice = useCallback(
    async (payload, { transmit = false } = {}) => {
      const invoice = {
        ...payload,
        id: nextInvoiceId(state.invoices),
        peppolId: `${payload.buyerUEN}@SGUEN`,
        status: STATUS.DRAFT,
        createdAt: new Date().toISOString(),
      }
      dispatch({ type: 'add', invoice })
      const ok = transmit ? await simulateTransmit(invoice) : null
      return { invoice, transmitted: ok }
    },
    [state.invoices, simulateTransmit],
  )

  const updateInvoice = useCallback((invoice) => {
    dispatch({
      type: 'update',
      invoice: { ...invoice, peppolId: `${invoice.buyerUEN}@SGUEN`, updatedAt: new Date().toISOString() },
    })
  }, [])

  const deleteInvoice = useCallback((id) => dispatch({ type: 'delete', id }), [])

  const transmitInvoice = useCallback(
    async (id) => {
      const invoice = state.invoices.find((i) => i.id === id)
      if (!invoice) return false
      return simulateTransmit(invoice)
    },
    [state.invoices, simulateTransmit],
  )

  const markPaid = useCallback((id) => {
    dispatch({ type: 'status', id, status: STATUS.PAID, at: new Date().toISOString() })
  }, [])

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    return load(undefined, { ignoreCache: true })
  }, [load])

  const retryLoad = useCallback(() => load(undefined), [load])

  return {
    invoices: state.invoices,
    loading: state.loading,
    error: state.error,
    busyId: state.busyId,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    transmitInvoice,
    markPaid,
    resetDemo,
    retryLoad,
  }
}
