// Content for the public "How it's built" page (/tour). Every snippet is copied from the real
// source file it names, trimmed to the lines that matter.
export const CONCEPTS = [
  {
    id: 'components',
    title: 'Components, JSX and props',
    what: 'The UI is split into small functional components. A parent passes data down as props; a child calls a callback prop to talk back up.',
    files: ['src/components/InvoiceList.jsx', 'src/components/InvoiceCard.jsx'],
    live: { to: '/', label: 'Dashboard: each card is an InvoiceCard' },
    code: `// InvoiceList.jsx: the parent maps data into child components
{invoices.map((invoice) => (
  <InvoiceCard
    key={invoice.id}
    invoice={invoice}
    busy={busyId === invoice.id}
    onDelete={onDelete}
  />
))}

// InvoiceCard.jsx: the child reads props and calls back up on a click
export default function InvoiceCard({ invoice, busy, onDelete }) {
  return <button onClick={() => onDelete(invoice.id)}>Delete</button>
}`,
  },
  {
    id: 'usestate',
    title: 'useState and controlled inputs',
    what: 'Every form field is a controlled input: React state is the single source of truth, and onChange writes the new value back into state.',
    files: ['src/components/InvoiceForm.jsx', 'src/pages/LoginPage.jsx', 'src/pages/DashboardPage.jsx'],
    live: { to: '/create', label: 'Create invoice form' },
    code: `// InvoiceForm.jsx
const [buyerName, setBuyerName] = useState(initialValues?.buyerName ?? '')
const [buyerUEN, setBuyerUEN] = useState(initialValues?.buyerUEN ?? '')

<input value={buyerName} onChange={(e) => handleBuyerName(e.target.value)} />
<input value={buyerUEN} onChange={(e) => setBuyerUEN(e.target.value.toUpperCase())} />

// DashboardPage.jsx: search and filter are plain useState too
const [search, setSearch] = useState('')
const [status, setStatus] = useState('All')`,
  },
  {
    id: 'usereducer',
    title: 'useReducer for the invoice store',
    what: 'The invoice list has many kinds of change (add, replace, remove, busy). A reducer keeps every transition in one place; the pages only dispatch actions, and state only changes after MockAPI confirms the write.',
    files: ['src/hooks/useInvoices.js'],
    live: { to: '/', label: 'Dashboard: Transmit, Mark paid, Delete all dispatch actions' },
    code: `// useInvoices.js
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, invoices: [action.invoice, ...state.invoices], busyId: null }
    case 'replace':
      return { ...state, invoices: state.invoices.map((i) =>
        i.id === action.invoice.id ? action.invoice : i), busyId: null }
    case 'remove':
      return { ...state, invoices: state.invoices.filter((i) => i.id !== action.id), busyId: null }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, initialState)
const deleteInvoice = useCallback(async (id) => {
  await invoicesApi.deleteInvoice(id) // only dispatch once the API confirms
  dispatch({ type: 'remove', id })
}, [])`,
  },
  {
    id: 'useeffect',
    title: 'useEffect and data fetching',
    what: 'Fetching runs in an effect after render. The hook tracks loading and error, and the cleanup aborts the request if the component unmounts or the URL changes.',
    files: ['src/hooks/useFetch.js', 'src/hooks/useInvoices.js'],
    live: { to: '/', label: 'Dashboard: FX rates card and the invoice load spinner' },
    code: `// useFetch.js
useEffect(() => {
  if (!enabled || !url) return undefined
  const controller = new AbortController()
  setState((s) => ({ ...s, loading: true, error: null }))

  fetch(url, { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      return res.json()
    })
    .then((json) => setState({ data: json, loading: false, error: null }))
    .catch((err) => {
      if (err.name === 'AbortError') return
      setState({ data: null, loading: false, error: err.message })
    })

  return () => controller.abort() // cleanup
}, [url, enabled, attempt])`,
  },
  {
    id: 'lifting',
    title: 'Lifting state up',
    what: 'Dashboard, Create and Edit all read or change the same invoices, so the store lives in their common parent (AppShell) and flows down as a prop.',
    files: ['src/components/AppShell.jsx'],
    live: { to: '/', label: 'Create an invoice, then see it on the dashboard' },
    code: `// AppShell.jsx
export default function AppShell() {
  const store = useInvoices() // owned once, here

  return (
    <Routes>
      <Route path="/"       element={<DashboardPage store={store} notify={notify} />} />
      <Route path="/create" element={<CreateInvoicePage store={store} notify={notify} />} />
      <Route path="/edit"   element={<EditInvoicePage store={store} notify={notify} />} />
    </Routes>
  )
}`,
  },
  {
    id: 'events',
    title: 'Handling events',
    what: 'Click and submit handlers live next to the state they change. Async handlers await the simulated network call before showing a toast.',
    files: ['src/pages/DashboardPage.jsx', 'src/components/InvoiceForm.jsx'],
    live: { to: '/', label: 'Dashboard: Delete asks for confirmation, Transmit is async' },
    code: `// DashboardPage.jsx
const handleDelete = async (id) => {
  const label = labelFor(id)
  if (!window.confirm(\`Delete invoice \${label}? This cannot be undone.\`)) return
  try {
    await store.deleteInvoice(id) // waits for MockAPI to confirm
    notify(\`Invoice \${label} deleted.\`, 'info')
  } catch (err) {
    notify(\`Could not delete invoice \${label}: \${err.message}\`, 'error')
  }
}

// InvoiceForm.jsx: one submit handler, parameterised by the button pressed
const submit = (action) => (e) => {
  e.preventDefault()
  const problem = validate()
  if (problem) return setError(problem)
  onSubmit(payload, action) // 'draft' | 'transmit' | 'save'
}`,
  },
  {
    id: 'conditional',
    title: 'Conditional rendering',
    what: 'The same page shows a spinner, an error banner, an empty state or the data depending on state. Buttons appear only when the action makes sense for that status.',
    files: ['src/pages/DashboardPage.jsx', 'src/components/InvoiceCard.jsx', 'src/components/InvoiceList.jsx'],
    live: { to: '/', label: 'Dashboard: only Drafts show Transmit, only Transmitted show Mark paid' },
    code: `// DashboardPage.jsx
{error && <ErrorBanner title="Could not load invoices" message={error} onRetry={store.retryLoad} />}

{loading ? (
  <LoadingSpinner label="Fetching invoices from the mock Access Point API..." />
) : (
  <InvoiceList invoices={visible} ... />
)}

// InvoiceCard.jsx: status AND role both decide what renders
const canTransmit = can(user, 'transmit', invoice)
{canTransmit && <button>{invoice.status === STATUS.FAILED ? 'Retry' : 'Transmit'}</button>}
{can(user, 'markPaid', invoice) && <button>Mark paid</button>}`,
  },
  {
    id: 'lists',
    title: 'Rendering lists and immutable updates',
    what: 'Arrays are rendered with map and a stable key. Arrays held in state are never mutated: updates build a new array with map, filter or spread.',
    files: ['src/components/SearchFilter.jsx', 'src/components/InvoiceForm.jsx', 'src/pages/CustomersPage.jsx'],
    live: { to: '/create', label: 'Create invoice: add and remove line items' },
    code: `// SearchFilter.jsx
{STATUS_FILTERS.map((s) => (
  <button key={s} onClick={() => onStatus(s)}>{s}</button>
))}

// InvoiceForm.jsx: line items are an array in state
const updateItem = (index, field, value) =>
  setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))

const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }])
const removeItem = (index) =>
  setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))`,
  },
  {
    id: 'context',
    title: 'Context API for the login session',
    what: 'The session is needed by the navbar, the route guard and the login page, which sit far apart in the tree. That is the one place Context earns its keep; everything else uses props.',
    files: ['src/context/AuthContext.jsx', 'src/components/RequireAuth.jsx', 'src/components/Navbar.jsx'],
    live: { to: '/login', label: 'Login page, then the user chip in the navbar' },
    code: `// AuthContext.jsx
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const login = useCallback(async (username, password) => { /* sha256 check */ }, [])
  const logout = useCallback(() => setUser(null), [])
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

// RequireAuth.jsx: the route guard
const { isAuthenticated } = useAuth()
if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />`,
  },
  {
    id: 'router',
    title: 'Client-side routing with React Router',
    what: 'BrowserRouter gives clean URLs. Routes nest: the login and tour pages are public, everything under /* is wrapped in RequireAuth. NavLink highlights the active page and useSearchParams reads ?id= for editing.',
    files: ['src/main.jsx', 'src/App.jsx', 'src/components/Navbar.jsx', 'src/pages/EditInvoicePage.jsx'],
    live: { to: '/customers', label: 'Customers, then "New e-invoice for this buyer" (prefilled via the URL)' },
    code: `// main.jsx
<BrowserRouter basename={import.meta.env.BASE_URL}>

// App.jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/tour" element={<TourPage />} />
  <Route path="/*" element={<RequireAuth><AppShell /></RequireAuth>} />
</Routes>

// Navbar.jsx
<NavLink to="/customers" className={({ isActive }) => (isActive ? 'bg-slate-800 text-white' : '...')}>
  Customers
</NavLink>

// EditInvoicePage.jsx
const [params] = useSearchParams()
const invoice = store.invoices.find((i) => i.id === params.get('id'))`,
  },
  {
    id: 'hooks',
    title: 'Custom hooks',
    what: 'Repeated logic is extracted into hooks: useFetch wraps fetch + loading + error + abort (and can take either a URL or an API-layer function), useInvoices wraps the reducer and every MockAPI call.',
    files: ['src/hooks/useFetch.js', 'src/hooks/useInvoices.js'],
    live: { to: '/customers', label: 'Customers: two useFetch calls joined on one screen' },
    code: `// FxRatesCard.jsx
const { data, loading, error, refetch } = useFetch(FX_API)

// CustomersPage.jsx: an API-layer function (MockAPI or static fallback) and a free public API
const customers = useFetch(listCustomers)
const contacts = useFetch(CONTACTS_API, { transform: (j) => j.results })

// AppShell.jsx
const store = useInvoices(user?.username)`,
  },
  {
    id: 'endpoints',
    title: 'Data endpoints: Invoices, Customers, Products (+ hardcoded Users)',
    what: 'Invoices and reference data (customers + products, told apart by a `type` field) live in a MockAPI project, shared by everyone using the app. Users stay hardcoded in code, with roles (VIEW_ONLY / EDIT) controlling what each account can do.',
    files: ['src/api/invoices.js', 'src/api/referenceData.js', 'src/data/users.js', 'src/data/roles.js'],
    live: { to: '/products', label: 'Products page, then "Add to new invoice"' },
    code: `// Endpoint 1: invoices (src/api/invoices.js) -> reducer store in useInvoices.js
export function listInvoices(signal) {
  return hasMockApi() ? request('/invoices', { signal }) : loadStaticInvoices(signal)
}

// Endpoints 2 & 3: customers + products share one MockAPI resource, "referenceData"
// (src/api/referenceData.js), told apart by a type field.
export async function listCustomers(signal) {
  const rows = await request('/referenceData', { signal })
  return rows.filter((row) => row.type === 'customer')
}

// Users: hardcoded with SHA-256 password digests and a role (users.js)
export const USERS = [{ username: 'john', name: 'John', role: ROLES.EDIT, passwordHash: 'b4b5...' }]`,
  },
  {
    id: 'persist',
    title: 'Persisting data (MockAPI, shared across browsers)',
    what: 'On first load the store GETs invoices from MockAPI. Every change (create, edit, transmit, delete) is a POST/PUT/DELETE, and the reducer only updates once the API confirms, so a failed write leaves the list exactly as it was. Without a MockAPI project configured, the app falls back to read-only static demo JSON.',
    files: ['src/hooks/useInvoices.js', 'src/api/client.js', 'src/api/invoices.js'],
    live: { to: '/', label: 'Dashboard: create an invoice, refresh, it is still there for everyone' },
    code: `// useInvoices.js
const load = useCallback(async (signal) => {
  dispatch({ type: 'load/start' })
  try {
    const invoices = await invoicesApi.listInvoices(signal)
    dispatch({ type: 'load/success', invoices })
  } catch (err) {
    if (err.name !== 'AbortError') dispatch({ type: 'load/error', error: err.message })
  }
}, [])

const deleteInvoice = useCallback(async (id) => {
  await invoicesApi.deleteInvoice(id) // dispatch only after the API confirms
  dispatch({ type: 'remove', id })
}, [])`,
  },
  {
    id: 'roles',
    title: 'Roles and permissions',
    what: 'A single can(user, action, invoice) function is the one place permission rules live. It both hides/disables buttons and guards the /create and /edit routes, so the UI and the guard can never disagree.',
    files: ['src/data/roles.js', 'src/components/InvoiceCard.jsx', 'src/pages/CreateInvoicePage.jsx'],
    live: { to: '/', label: 'Log in as viewer (view-only) vs john (editor) and compare the buttons shown' },
    code: `// roles.js
export function can(user, action, invoice) {
  if (!user || user.role !== ROLES.EDIT) return false
  switch (action) {
    case 'create': return true
    case 'edit':
    case 'transmit': return invoice?.status === STATUS.DRAFT || invoice?.status === STATUS.FAILED
    case 'markPaid': return invoice?.status === STATUS.TRANSMITTED
    case 'delete': return invoice?.status !== STATUS.PAID
    default: return false
  }
}

// InvoiceCard.jsx: same check drives which buttons render
const canEdit = can(user, 'edit', invoice)
{canEdit && <button onClick={() => onEdit(invoice.id)}>Edit</button>}`,
  },
]

export const TREE = `main.jsx
└─ <BrowserRouter basename="/easyinvoice/">
   └─ <AuthProvider>                      Context: session
      └─ App                              Routes
         ├─ /login   LoginPage            useState, useAuth(), useNavigate
         ├─ /tour    TourPage             this page (public)
         └─ /*       RequireAuth          route guard (useAuth)
            └─ AppShell                   useInvoices() store, toast, hints toggle
               ├─ Navbar                  NavLink, useAuth()
               ├─ /          DashboardPage      useState (search, filter), props from store
               │   ├─ StatCards              derived values from props
               │   ├─ FxRatesCard            useFetch (Frankfurter API)
               │   ├─ SearchFilter           controlled input, list.map
               │   └─ InvoiceList            list with key, empty state
               │       └─ InvoiceCard        props in, callbacks out, conditional buttons
               ├─ /create    CreateInvoicePage  useSearchParams prefill
               │   └─ InvoiceForm            controlled inputs, array state, validation
               ├─ /edit      EditInvoicePage    useSearchParams, key resets form
               │   └─ InvoiceForm
               ├─ /customers CustomersPage      two useFetch calls (mock JSON + randomuser.me)
               ├─ /products  ProductsPage       useFetch (products.json), Link with query params
               └─ Toast                     useEffect timer with cleanup`

export const CHECKLIST = [
  ['Built with Vite', 'vite.config.js, package.json'],
  ['Functional components and hooks throughout', 'every file in src/'],
  ['Multiple sensibly scoped components, props passed cleanly', '14 components, 7 pages'],
  ['At least two client-side routes with React Router', '/login, /tour, /, /create, /edit, /customers, /products'],
  ['Shared state with useState / useReducer; Context only where it helps', 'useInvoices (reducer), AuthContext'],
  ['Fetches or persists data with loading and error handling', 'useFetch, useInvoices, 3 endpoints, 2 free APIs'],
  ['Endpoints: Invoices, Customers, Products (MockAPI); users + roles hardcoded', 'src/api/*.js, src/data/users.js, src/data/roles.js'],
  ['Form with controlled inputs to create a new item', 'InvoiceForm on /create'],
  ['Displays the collection (Read) and deletes an item', 'InvoiceList and InvoiceCard on /'],
  ['Bonus: editing an existing item (Update)', 'EditInvoicePage on /edit?id='],
  ['Deployed to a public URL', 'artificialintelligence.sg/easyinvoice/'],
]
