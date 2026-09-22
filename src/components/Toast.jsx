import { useEffect } from 'react'

const STYLES = {
  success: 'bg-emerald-600 text-white',
  info: 'bg-sky-600 text-white',
  error: 'bg-rose-600 text-white',
}

export default function Toast({ toast, onDone, duration = 3500 }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onDone, duration)
    return () => clearTimeout(timer)
  }, [toast, onDone, duration])

  if (!toast) return null
  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-50" role="status" aria-live="polite">
      <div className={`px-4 py-3 rounded-xl shadow-xl text-sm font-medium ${STYLES[toast.type] || STYLES.success}`}>
        {toast.message}
      </div>
    </div>
  )
}
