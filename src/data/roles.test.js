import { can, ROLES } from './roles.js'
import { STATUS } from './constants.js'

const editUser = { username: 'john', role: ROLES.EDIT }
const viewOnlyUser = { username: 'viewer', role: ROLES.VIEW_ONLY }

const draft = { status: STATUS.DRAFT }
const failed = { status: STATUS.FAILED }
const transmitted = { status: STATUS.TRANSMITTED }
const paid = { status: STATUS.PAID }

describe('can', () => {
  it('denies every action with no user', () => {
    expect(can(null, 'create')).toBe(false)
    expect(can(undefined, 'edit', draft)).toBe(false)
  })

  it('VIEW_ONLY can do nothing', () => {
    expect(can(viewOnlyUser, 'create')).toBe(false)
    expect(can(viewOnlyUser, 'edit', draft)).toBe(false)
    expect(can(viewOnlyUser, 'transmit', draft)).toBe(false)
    expect(can(viewOnlyUser, 'markPaid', transmitted)).toBe(false)
    expect(can(viewOnlyUser, 'delete', draft)).toBe(false)
  })

  it('EDIT can always create', () => {
    expect(can(editUser, 'create')).toBe(true)
  })

  it('EDIT can edit/transmit only Draft or Failed invoices', () => {
    expect(can(editUser, 'edit', draft)).toBe(true)
    expect(can(editUser, 'edit', failed)).toBe(true)
    expect(can(editUser, 'edit', transmitted)).toBe(false)
    expect(can(editUser, 'edit', paid)).toBe(false)

    expect(can(editUser, 'transmit', draft)).toBe(true)
    expect(can(editUser, 'transmit', failed)).toBe(true)
    expect(can(editUser, 'transmit', transmitted)).toBe(false)
    expect(can(editUser, 'transmit', paid)).toBe(false)
  })

  it('EDIT can mark paid only Transmitted invoices', () => {
    expect(can(editUser, 'markPaid', transmitted)).toBe(true)
    expect(can(editUser, 'markPaid', draft)).toBe(false)
    expect(can(editUser, 'markPaid', failed)).toBe(false)
    expect(can(editUser, 'markPaid', paid)).toBe(false)
  })

  it('EDIT can delete anything except Paid invoices', () => {
    expect(can(editUser, 'delete', draft)).toBe(true)
    expect(can(editUser, 'delete', failed)).toBe(true)
    expect(can(editUser, 'delete', transmitted)).toBe(true)
    expect(can(editUser, 'delete', paid)).toBe(false)
  })

  it('rejects an unknown action', () => {
    expect(can(editUser, 'archive', draft)).toBe(false)
  })
})
