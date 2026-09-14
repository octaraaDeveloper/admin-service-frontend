import { isValidEmail } from '@/lib/validation'

const MIN_PASSWORD_LENGTH = 8

export function emailError(value: string) {
  if (!value.trim()) return 'Email address is required'
  if (!isValidEmail(value)) return 'Enter a valid email address'
  return undefined
}

export function passwordError(value: string) {
  if (!value) return 'Password is required'
  if (value.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  return undefined
}

export function confirmPasswordError(value: string, password: string) {
  if (!value) return 'Confirm your new password'
  if (value !== password) return 'Passwords do not match'
  return undefined
}
