export async function sha256(text) {
  if (!globalThis.crypto || !globalThis.crypto.subtle) {
    throw new Error('Your browser blocked the check. Please open the page over HTTPS.')
  }
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
