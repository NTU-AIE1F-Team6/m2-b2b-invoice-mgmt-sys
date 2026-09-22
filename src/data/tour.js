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
    what: 'The invoice list has many kinds of change (add, update, delete, status). A reducer keeps every transition in one place and the pages only dispatch actions.',
    files: ['src/hooks/useInvoices.js'],
    live: { to: '/', label: 'Dashboard: Transmit, Mark paid, Delete all dispatch actions' },
    code: `// useInvoices.js
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, invoices: [action.invoice, ...state.invoices] }
    case 'delete':
      return { ...state, invoices: state.invoices.filter((i) => i.id !== action.id) }
    case 'status':
      return { ...state, invoices: state.invoices.map((i) =>
        i.id === action.id ? { ...i, status: action.status } : i) }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, initialState)
const deleteInvoice = useCallback((id) => dispatch({ type: 'delete', id }), [])`,
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
const handleDelete = (id) => {
  if (window.confirm(\`Delete invoice \${id}? This cannot be undone.\`)) {
    store.deleteInvoice(id)
    notify(\`Invoice \${id} deleted.\`, 'info')
  }
}

const handleTransmit = async (id) => {
  const ok = await store.transmitInvoice(id)
  if (ok) notify(\`Invoice \${id} routed via the InvoiceNow Access Point.\`)
  else notify(\`Invoice \${id} was rejected by the Access Point.\`, 'error')
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

// InvoiceCard.jsx
const canTransmit = invoice.status === STATUS.DRAFT || invoice.status === STATUS.FAILED
{canTransmit && <button>{invoice.status === STATUS.FAILED ? 'Retry' : 'Transmit'}</button>}
{invoice.status === STATUS.TRANSMITTED && <button>Mark paid</button>}`,
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
    what: 'Repeated logic is extracted into hooks: useFetch wraps fetch + loading + error + abort, useInvoices wraps the reducer, the mock API load and localStorage persistence.',
    files: ['src/hooks/useFetch.js', 'src/hooks/useInvoices.js'],
    live: { to: '/customers', label: 'Customers: two useFetch calls joined on one screen' },
    code: `// FxRatesCard.jsx
const { data, loading, error, refetch } = useFetch(FX_API)

// CustomersPage.jsx: a mock JSON endpoint and a free public API
const customers = useFetch(\`\${import.meta.env.BASE_URL}api/customers.json\`, { transform: (j) => j.customers })
const contacts = useFetch(CONTACTS_API, { transform: (j) => j.results })

// AppShell.jsx
const store = useInvoices()`,
  },
  {
    id: 'endpoints',
    title: 'Data endpoints: Invoices, Customers, Products (+ hardcoded Users)',
    what: 'The course suggests three endpoints with hardcoded users. Each endpoint is a JSON file served next to the app and fetched with the same hook; users stay hardcoded because the login runs entirely in the browser on a static host.',
    files: ['public/api/invoices.json', 'public/api/customers.json', 'public/api/products.json', 'src/data/users.js'],
    live: { to: '/products', label: 'Products page, then "Add to new invoice"' },
    code: `// Endpoint 1: invoices (useInvoices.js) -> reducer store, persisted to localStorage
const API_URL = \`\${import.meta.env.BASE_URL}api/invoices.json\`

// Endpoint 2: customers (CustomersPage.jsx, InvoiceForm.jsx) -> buyer autocomplete fills the UEN
const customers = useFetch(\`\${import.meta.env.BASE_URL}api/customers.json\`, { transform: (j) => j.customers })

// Endpoint 3: products (ProductsPage.jsx, InvoiceForm.jsx) -> line-item dropdown fills description + price
const products = useFetch(\`\${import.meta.env.BASE_URL}api/products.json\`, { transform: (j) => j.products })
const pickProduct = (index, sku) => {
  const product = products.data?.find((p) => p.sku === sku)
  setItems((prev) => prev.map((item, i) =>
    i === index ? { ...item, description: product.description, unitPrice: product.unitPrice } : item))
}

// Users: hardcoded with SHA-256 password digests (users.js)
export const USERS = [{ username: 'admin', name: 'Finance Manager', passwordHash: '7f9d...' }]`,
  },
  {
    id: 'persist',
    title: 'Persisting data (mock API + localStorage)',
    what: 'On first load the store fetches seed invoices from a mock JSON API. After that, an effect writes every change to localStorage so the demo survives a refresh. Reset demo clears it.',
    files: ['src/hooks/useInvoices.js', 'public/api/invoices.json'],
    live: { to: '/', label: 'Dashboard: create an invoice, refresh, it is still there' },
    code: `// useInvoices.js
const API_URL = \`\${import.meta.env.BASE_URL}api/invoices.json\`

useEffect(() => {
  const controller = new AbortController()
  load(controller.signal) // cache hit, or fetch(API_URL)
  return () => controller.abort()
}, [load])

useEffect(() => {
  if (!state.loaded) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.invoices))
}, [state.invoices, state.loaded])`,
  },
]

export const TREE = `main.jsx
└─ <BrowserRouter basename="/invoicenow/">
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
  ['Endpoints: Invoices, Customers, Products; users hardcoded', 'public/api/*.json, src/data/users.js'],
  ['Form with controlled inputs to create a new item', 'InvoiceForm on /create'],
  ['Displays the collection (Read) and deletes an item', 'InvoiceList and InvoiceCard on /'],
  ['Bonus: editing an existing item (Update)', 'EditInvoicePage on /edit?id='],
  ['Deployed to a public URL', 'artificialintelligence.sg/invoicenow/'],
]
