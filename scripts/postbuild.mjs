// The site is plain nginx with no SPA fallback rule, so a refresh on /easyinvoice/create
// would 404. Copy index.html into one folder per client-side route so deep links resolve.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const ROUTES = ['login', 'tour', 'create', 'edit', 'customers', 'products']
const html = readFileSync('dist/index.html', 'utf8')
for (const route of ROUTES) {
  mkdirSync(`dist/${route}`, { recursive: true })
  writeFileSync(`dist/${route}/index.html`, html)
}
console.log(`postbuild: wrote index.html for routes: ${ROUTES.join(', ')}`)
