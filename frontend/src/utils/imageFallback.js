// Shared fallback for <img> tags across the app.
// If an image fails to load (e.g. the uploaded file is missing on this
// machine because `backend/uploads/` is gitignored and wasn't carried over
// between environments), swap it for a neutral placeholder instead of
// showing the browser's broken-image icon.

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#1a2230"/>
      <g stroke="#5c6773" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="40" y="50" width="120" height="100" rx="8"/>
        <circle cx="75" cy="85" r="12"/>
        <path d="M40 135 L85 100 L115 125 L140 105 L160 120"/>
      </g>
    </svg>
  `)

export function onImageError(event) {
  if (event.target.dataset.fallbackApplied) return // avoid infinite loop
  event.target.dataset.fallbackApplied = 'true'
  event.target.src = PLACEHOLDER
  event.target.classList.add('img-fallback')
}
