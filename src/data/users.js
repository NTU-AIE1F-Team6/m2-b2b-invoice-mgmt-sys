import { ROLES } from './roles.js'

// Demo accounts for the login gate. Passwords are never stored: only their SHA-256 hex digest,
// the same technique as the artificialintelligence.sg/citylife/ password gate.
// To change a password, run in a terminal:
//   node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSWORD').digest('hex'))"
// and paste the output into passwordHash below. Demo passwords are listed in the README.
export const USERS = [
  {
    username: 'viewer',
    name: 'View-only User',
    role: ROLES.VIEW_ONLY,
    passwordHash: '65375049b9e4d7cad6c9ba286fdeb9394b28135a3e84136404cfccfdcc438894',
  },
  {
    username: 'john',
    name: 'John',
    role: ROLES.EDIT,
    passwordHash: 'b4b597c714a8f49103da4dab0266af0ee0ae4f8575250a84855c3d76941cd422',
  },
  {
    username: 'jenn',
    name: 'Jenn Fang',
    role: ROLES.EDIT,
    passwordHash: '2040e2bd127b8cfb34c41a32bb25b5cc65666e8cb7f26ab6e48fc18f5e0a54f9',
  },
  {
    username: 'ralph',
    name: 'Ralph',
    role: ROLES.EDIT,
    passwordHash: 'e9102d5b20acde5c028a9e6224125a9f29579feecd6b3ce53d0bd4c841b2781a',
  },
]
