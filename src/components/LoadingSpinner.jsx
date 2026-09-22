export default function LoadingSpinner({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-slate-500 ${className}`} role="status">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
