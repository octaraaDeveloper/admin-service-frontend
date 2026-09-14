import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function maskAccountNumber(value: string, visible = 4) {
  return `${'•'.repeat(Math.max(0, value.length - visible))}${value.slice(-visible)}`
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const FORMULA_PREFIX = /^[\s\t\r]*[=+@]|^[\s\t\r]*-(?![\d.])/

function escapeCsv(value: string | number) {
  const text = String(value)
  const safe = typeof value === 'string' && FORMULA_PREFIX.test(text) ? `'${text}` : text
  return `"${safe.replaceAll('"', '""')}"`
}
