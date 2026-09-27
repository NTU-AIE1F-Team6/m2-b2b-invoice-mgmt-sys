import { useCallback, useEffect, useReducer } from 'react'
import { STATUS, UEN_PATTERN } from '../data/constants.js'
import { nextInvoiceId } from '../utils/invoice.js'
import { hasMockApi } from '../api/client.js'
import * as invoicesApi from '../api/invoices.js'

// Invoice store: useReducer for the collection, backed by MockAPI (or the static demo JSON when
// VITE_MOCKAPI_URL is unset). State only changes after the API confirms a write, so a failed
// create/update/delete leaves the list exactly as it was and the caller sees the error.
const NETWORK_DELAY_MS = 900

const initialState = { invoices: [], loading: true, loaded: false, error: null, busyId: null }

function reducer(state, action) {
  switch (action.type) {
    case 'load/start':
      return { ...state, loading: true, error: null }
    case 'load/success':
      return { ...state, loading: false, loaded: true, invoices: action.invoices, error: null }
    case 'load/error':
      return { ...state, loading: false, error: action.error }
    case 'busy':
      return { ...state, busyId: action.id }
    case 'add':
      return { ...state, invoices: [action.invoice, ...state.invoices], busyId: null }
    case 'replace':
      return {
        ...state,
        invoices: state.invoices.map((i) => (i.id === action.invoice.id ? action.invoice : i)),
        busyId: null,
      }
    case 'remove':
      return { ...state, invoices: state.invoices.filter((i) => i.id !== action.id), busyId: null }
    default:
      return state
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// `username` (from the session) is stamped onto every write as createdBy/updatedBy.
export function useInvoices(username) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(async (signal) => {
    dispatch({ type: 'load/start' })
    try {
      const invoices = await invoicesApi.listInvoices(signal)
      dispatch({ type: 'load/success', invoices })
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

  const putInvoice = useCallback(async (invoice) => {
    const saved = await invoicesApi.updateInvoice(invoice.id, invoice)
    dispatch({ type: 'replace', invoice: saved })
    return saved
  }, [])

  const simulateTransmit = useCallback(async (invoice) => {
    dispatch({ type: 'busy', id: invoice.id })
    try {
      const queued = { ...invoice, status: STATUS.QUEUED, updatedAt: new Date().toISOString() }
      await invoicesApi.updateInvoice(invoice.id, queued)
      dispatch({ type: 'replace', invoice: queued })

      await wait(NETWORK_DELAY_MS)

      const ok = UEN_PATTERN.test(invoice.buyerUEN)
      const settled = {
        ...queued,
        status: ok ? STATUS.TRANSMITTED : STATUS.FAILED,
        failureReason: ok ? null : 'Access Point rejected: buyer UEN is not a valid Singapore UEN',
        updatedAt: new Date().toISOString(),
      }
      const saved = await invoicesApi.updateInvoice(invoice.id, settled)
      dispatch({ type: 'replace', invoice: saved })
      return ok
    } finally {
      dispatch({ type: 'busy', id: null })
    }
  }, [])

  const addInvoice = useCallback(
    async (payload, { transmit = false } = {}) => {
      dispatch({ type: 'busy', id: 'new' })
      try {
        const now = new Date().toISOString()
        const draft = {
          invoiceNumber: nextInvoiceId(state.invoices),
          ...payload,
          peppolId: `${payload.buyerUEN}@SGUEN`,
          status: STATUS.DRAFT,
          failureReason: null,
          createdBy: username ?? null,
          createdAt: now,
          updatedAt: now,
          pendingRequest: null,
        }
        const created = await invoicesApi.createInvoice(draft)
        dispatch({ type: 'add', invoice: created })
        const ok = transmit ? await simulateTransmit(created) : null
        return { invoice: created, transmitted: ok }
      } finally {
        dispatch({ type: 'busy', id: null })
      }
    },
    [state.invoices, username, simulateTransmit],
  )

  const updateInvoice = useCallback(
    async (invoice) => {
      dispatch({ type: 'busy', id: invoice.id })
      try {
        const updated = {
          ...invoice,
          peppolId: `${invoice.buyerUEN}@SGUEN`,
          updatedBy: username ?? null,
          updatedAt: new Date().toISOString(),
        }
        return await putInvoice(updated)
      } finally {
        dispatch({ type: 'busy', id: null })
      }
    },
    [putInvoice, username],
  )

  const deleteInvoice = useCallback(async (id) => {
    dispatch({ type: 'busy', id })
    try {
      await invoicesApi.deleteInvoice(id)
      dispatch({ type: 'remove', id })
    } finally {
      dispatch({ type: 'busy', id: null })
    }
  }, [])

  const transmitInvoice = useCallback(
    async (id) => {
      const invoice = state.invoices.find((i) => i.id === id)
      if (!invoice) return false
      return simulateTransmit(invoice)
    },
    [state.invoices, simulateTransmit],
  )

  const markPaid = useCallback(
    async (id) => {
      const invoice = state.invoices.find((i) => i.id === id)
      if (!invoice) return
      dispatch({ type: 'busy', id })
      try {
        await putInvoice({
          ...invoice,
          status: STATUS.PAID,
          updatedBy: username ?? null,
          updatedAt: new Date().toISOString(),
        })
      } finally {
        dispatch({ type: 'busy', id: null })
      }
    },
    [state.invoices, putInvoice, username],
  )

  const retryLoad = useCallback(() => load(undefined), [load])

  return {
    invoices: state.invoices,
    loading: state.loading,
    error: state.error,
    busyId: state.busyId,
    offline: !hasMockApi(),
    addInvoice,
    updateInvoice,
    deleteInvoice,
    transmitInvoice,
    markPaid,
    retryLoad,
  }
}
