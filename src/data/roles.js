import { STATUS } from './constants.js'

// Maker-checker (PRD E5, D8-D10) is deferred: for now EDIT can do everything directly, VIEW_ONLY
// can only look. Paid invoices are read-only for everyone.
export const ROLES = {
  VIEW_ONLY: 'VIEW_ONLY',
  EDIT: 'EDIT',
}

export function can(user, action, invoice) {
  if (!user || user.role !== ROLES.EDIT) return false
  switch (action) {
    case 'create':
      return true
    case 'edit':
    case 'transmit':
      return invoice?.status === STATUS.DRAFT || invoice?.status === STATUS.FAILED
    case 'markPaid':
      return invoice?.status === STATUS.TRANSMITTED
    case 'delete':
      return invoice?.status !== STATUS.PAID
    default:
      return false
  }
}
