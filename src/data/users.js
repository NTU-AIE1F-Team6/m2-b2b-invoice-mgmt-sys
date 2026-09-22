// Demo accounts for the login gate. Passwords are never stored: only their SHA-256 hex digest,
// the same technique as the artificialintelligence.sg/citylife/ password gate.
// To change a password, run in a terminal:
//   node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSWORD').digest('hex'))"
// and paste the output into passwordHash below.
export const USERS = [
  {
    username: 'admin',
    name: 'Finance Manager',
    role: 'admin',
    passwordHash: '7f9dc7fa11f90a6b73fa073a0648e5ac7149ed65f8dfa61c7d20208a7ffaf4c3',
  },
  {
    username: 'clerk',
    name: 'AR Officer',
    role: 'clerk',
    passwordHash: '0fe59304f9e25488f6d3ffff3bfb0293836054bbe998b198552d9e79bfc9f4c9',
  },
]
