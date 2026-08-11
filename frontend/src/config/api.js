const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = (configuredBaseUrl || '').replace(/\/$/, '')
const SESSION_KEY = 'le-admin-session'

export function apiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_BASE_URL')
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export async function apiRequest(path, options = {}, authenticated = true) {
  const session = getSession()
  const headers = new Headers(options.headers || {})

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (authenticated && session?.token) {
    headers.set('Authorization', `Bearer ${session.token}`)
  }

  const response = await fetch(apiUrl(path), { ...options, headers })
  const payload = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      clearSession()
    }

    const error = new Error(payload?.message || 'No fue posible completar la solicitud.')
    error.status = response.status
    error.code = payload?.code
    throw error
  }

  return payload
}
