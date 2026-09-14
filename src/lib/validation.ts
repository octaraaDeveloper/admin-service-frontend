export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/
export const MOBILE_PATTERN = /^[6-9]\d{9}$/

export type PasswordStrength = 'weak' | 'medium' | 'strong'

export function passwordStrength(password: string): PasswordStrength {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 12) score++
  if (score >= 4) return 'strong'
  if (score >= 2) return 'medium'
  return 'weak'
}

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim())
}
