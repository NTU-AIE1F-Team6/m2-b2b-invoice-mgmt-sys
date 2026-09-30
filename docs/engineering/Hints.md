# Hints mode design

Hints mode adds optional teaching labels that explain the React concepts behind the interface. It
uses one state value in `AppShell` and CSS descendant selectors, so the setting does not need to be
passed through every page and component.

## 1. `AppShell` owns the state

`src/components/AppShell.jsx` defines the browser-storage key and safely reads the saved setting:

```jsx
const HINTS_KEY = 'easyinvoice-hints'

function readHints() {
  try {
    return localStorage.getItem(HINTS_KEY) === '1'
  } catch {
    return false
  }
}
```

The function is passed to `useState` as a lazy initializer, so storage is read only when
`AppShell` mounts:

```jsx
const [hints, setHints] = useState(readHints)
```

If `localStorage` is unavailable, hint mode safely defaults to off.

## 2. The navbar toggles and persists the setting

`AppShell` passes the current state and callback to `Navbar`:

```jsx
<Navbar hints={hints} onToggleHints={toggleHints} />
```

The callback uses the previous state, reverses it, and persists `'1'` or `'0'`:

```jsx
const toggleHints = useCallback(() => {
  setHints((on) => {
    const next = !on
    try {
      localStorage.setItem(HINTS_KEY, next ? '1' : '0')
    } catch {
      // Ignore storage errors; the in-memory toggle still works.
    }
    return next
  })
}, [])
```

In `src/components/Navbar.jsx`, the button calls the callback and exposes its state to assistive
technology:

```jsx
<button
  type="button"
  onClick={onToggleHints}
  aria-pressed={hints}
>
  {hints ? 'Hints on' : 'Hints'}
</button>
```

## 3. A wrapper class controls the entire application

When enabled, `AppShell` adds `hints-on` to its root wrapper:

```jsx
<div className={`min-h-screen flex flex-col ${hints ? 'hints-on' : ''}`}>
```

It also conditionally renders an enabled-state banner linking to the full Tour page:

```jsx
{hints && (
  <div className="bg-violet-600 text-white">
    React hints are on: purple labels name the React feature behind each part of the screen.
    <Link to="/tour">Read the full tour with code</Link>
  </div>
)}
```

## 4. Individual hints are reusable components

`src/components/Hint.jsx` always renders the same small element:

```jsx
export default function Hint({ label, className = '' }) {
  return (
    <span className={`react-hint ${className}`} aria-hidden="true">
      {label}
    </span>
  )
}
```

Feature components place hints beside the UI they explain:

```jsx
<Hint label="All invoices live in one central store (useReducer, state lifted up)" />
```

The labels use `aria-hidden="true"` because they are supplementary learning annotations, not
instructions required to operate the application.

## 5. CSS shows or hides every hint

`src/index.css` hides hints by default:

```css
.react-hint {
  display: none;
}
```

When an ancestor has `hints-on`, CSS displays and styles all descendant hints:

```css
.hints-on .react-hint {
  display: inline-flex;
  align-items: flex-start;
  font-size: 11.5px;
}

.hints-on .react-hint::before {
  content: '\269B';
}
```

The mode also visually identifies major examples:

```css
.hints-on article,
.hints-on form {
  outline: 2px dashed #c4b5fd;
  outline-offset: 3px;
}
```

## Runtime flow

```text
Navbar click
  -> call onToggleHints
  -> update AppShell state
  -> persist preference in localStorage
  -> add or remove .hints-on on the app wrapper
  -> CSS shows or hides every .react-hint descendant
```

The individual `<Hint>` elements remain mounted; CSS changes only their visibility. Only the
enabled-state banner is conditionally mounted. To add another hint, a developer places `<Hint>`
beside the relevant UI without adding Context, new state, or additional prop threading.

## Relevant files

- `src/components/AppShell.jsx` - state, persistence, wrapper class, and enabled banner
- `src/components/Navbar.jsx` - toggle button and `aria-pressed`
- `src/components/Hint.jsx` - reusable hint label
- `src/index.css` - visibility, label styling, and highlighted outlines
- `src/pages/TourPage.jsx` and `src/data/tour.js` - longer explanations and code examples
