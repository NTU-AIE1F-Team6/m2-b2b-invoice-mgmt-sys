export const GST_RATE = 0.09 // Singapore GST rate since 1 Jan 2024

export const STATUS = {
  DRAFT: 'Draft',
  QUEUED: 'Queued',
  TRANSMITTED: 'Transmitted',
  PAID: 'Paid',
  FAILED: 'Failed',
}

export const STATUS_FILTERS = ['All', STATUS.DRAFT, STATUS.TRANSMITTED, STATUS.PAID, STATUS.FAILED]

// Singapore UEN formats: 8 digits + letter (ROB), 9 digits + letter (ROC),
// or T/S/R + 2 digits + 2 letters + 4 digits + letter (other entities, e.g. LLPs).
export const UEN_PATTERN = /^(\d{8}[A-Z]|\d{9}[A-Z]|[TSR]\d{2}[A-Z]{2}\d{4}[A-Z])$/

// Free public APIs (no key, CORS enabled). Frankfurter moved to api.frankfurter.dev/v1; the old
// api.frankfurter.app host only answers with a redirect that browsers block for cross-origin fetches.
export const FX_API = 'https://api.frankfurter.dev/v1/latest?base=SGD&symbols=USD,EUR,MYR,JPY,CNY'
export const CONTACTS_API = 'https://randomuser.me/api/?results=6&seed=invoicenow-sg&nat=au,gb,us,nz&inc=name,email,phone,picture'
