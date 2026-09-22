import { useCallback, useEffect, useRef, useState } from 'react'

// Generic data-fetching hook: loading + error + data, aborts on unmount, refetch() on demand.
export function useFetch(url, { enabled = true, transform } = {}) {
  const [state, setState] = useState({ data: null, loading: Boolean(enabled && url), error: null })
  const [attempt, setAttempt] = useState(0)
  const transformRef = useRef(transform)
  transformRef.current = transform

  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    if (!enabled || !url) return undefined
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url, window.location.href).hostname}`)
        return res.json()
      })
      .then((json) => {
        const fn = transformRef.current
        setState({ data: fn ? fn(json) : json, loading: false, error: null })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({ data: null, loading: false, error: err.message || 'Request failed' })
      })

    return () => controller.abort()
  }, [url, enabled, attempt])

  return { ...state, refetch }
}
