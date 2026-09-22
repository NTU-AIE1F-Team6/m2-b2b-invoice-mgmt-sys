export default function ErrorBanner({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
      role="alert"
    >
      <div className="flex-1">
        <span className="font-semibold">{title}.</span> {message}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start sm:self-auto text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}
