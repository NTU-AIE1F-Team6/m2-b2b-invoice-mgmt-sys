import { ROLES } from './roles.js'

// Demo accounts for the login gate. Passwords are never stored: only their SHA-256 hex digest,
// the same technique as the artificialintelligence.sg/citylife/ password gate.
// Every demo account shares the same password, Password123 - this is a learning-project demo
// gate, not production security. To change it, run in a terminal:
//   node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSWORD').digest('hex'))"
// and paste the output into every passwordHash below. Also update the README's login table.
const DEMO_PASSWORD_HASH = '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601' // Password123

export const USERS = [
  {
    username: 'viewer',
    name: 'View-only User',
    role: ROLES.VIEW_ONLY,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    username: 'john',
    name: 'John',
    role: ROLES.EDIT,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    username: 'jennfang',
    name: 'Jenn Fang',
    role: ROLES.EDIT,
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    username: 'ralph',
    name: 'Ralph',
    role: ROLES.EDIT,
    passwordHash: DEMO_PASSWORD_HASH,
  },
]
