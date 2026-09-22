// A small purple label naming the React feature behind a piece of UI. It stays hidden until
// the "Hints" toggle in the navbar adds the .hints-on class to the app wrapper (see index.css),
// so no prop or context has to be threaded through every component.
export default function Hint({ label, className = '' }) {
  return (
    <span className={`react-hint ${className}`} aria-hidden="true">
      {label}
    </span>
  )
}
