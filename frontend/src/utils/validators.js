// Small, dependency-free validation helpers used across public + admin forms.

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export function isUrl(value) {
  if (!value) return true // optional field
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function minLength(value, len) {
  return String(value || '').trim().length >= len
}

/**
 * Runs a set of { field: [rule, message][] } validators against a form object.
 * Returns an errors object: { field: 'message' } for the first failing rule per field.
 */
export function validate(form, schema) {
  const errors = {}
  for (const field in schema) {
    for (const [rule, message] of schema[field]) {
      if (!rule(form[field])) {
        errors[field] = message
        break
      }
    }
  }
  return errors
}
