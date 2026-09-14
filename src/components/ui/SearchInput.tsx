import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { controlClass, controlSizes } from './Field'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  debounceMs = 350,
  autoFocus,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  const update = (next: string, immediate = false) => {
    setDraft(next)
    clearTimeout(timer.current)
    if (immediate) onChange(next)
    else timer.current = setTimeout(() => onChange(next), debounceMs)
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" />
      <input
        type="search"
        value={draft}
        autoFocus={autoFocus}
        onChange={(event) => update(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(controlClass, controlSizes.md, 'bg-surface-sunken pr-9 pl-10')}
      />
      {draft && (
        <button
          type="button"
          onClick={() => update('', true)}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md text-text-muted focus-ring hover:text-text-primary"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
