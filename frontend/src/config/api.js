const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = (configuredBaseUrl || '').replace(/\/$/, '')

export function apiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_BASE_URL')
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
