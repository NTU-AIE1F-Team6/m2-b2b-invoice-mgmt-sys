import { useCallback, useEffect, useRef, useState } from 'react'

// Generic data-fetching hook: loading + error + data, aborts on unmount, refetch() on demand.
// `source` is a URL string (plain fetch + json) or a function `(signal) => Promise<data>` for
// API-layer helpers that already parse JSON (e.g. src/api/referenceData.js).
export function useFetch(source, { enabled = true, transform } = {}) {
  const [state, setState] = useState({ data: null, loading: Boolean(enabled && source), error: null })
  const [attempt, setAttempt] = useState(0)
  const transformRef = useRef(transform)
  transformRef.current = transform

  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    if (!enabled || !source) return undefined
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))

    const fetchJson =
      typeof source === 'function'
        ? source(controller.signal)
        : fetch(source, { signal: controller.signal }).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(source, window.location.href).hostname}`)
            return res.json()
          })

    fetchJson
      .then((json) => {
        const fn = transformRef.current
        setState({ data: fn ? fn(json) : json, loading: false, error: null })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({ data: null, loading: false, error: err.message || 'Request failed' })
      })

    return () => controller.abort()
  }, [source, enabled, attempt])

  return { ...state, refetch }
}
