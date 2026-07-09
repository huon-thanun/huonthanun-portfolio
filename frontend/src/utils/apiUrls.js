const DEFAULT_API_ORIGIN = 'https://huonthanun-portfolio.onrender.com'

export function getApiOrigin() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || `${DEFAULT_API_ORIGIN}/api`

    try {
        return new URL(baseUrl).origin
    } catch {
        return DEFAULT_API_ORIGIN
    }
}

export function resolveMediaUrl(path) {
    if (!path) return ''
    if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
        return path
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${getApiOrigin()}${normalizedPath}`
}