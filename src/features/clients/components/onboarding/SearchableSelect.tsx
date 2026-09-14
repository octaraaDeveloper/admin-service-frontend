import { Check, Search } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { controlClass, controlSizes, Field, Popover, SearchInput } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface SearchableOption<T extends string> {
  value: T
  label: string
  leading?: ReactNode
}

interface SearchableSelectProps<T extends string> {
  value: T | undefined
  onChange: (value: T) => void
  options: SearchableOption<T>[]
  label?: ReactNode
  placeholder?: string
  searchPlaceholder?: string
  error?: ReactNode
  hint?: ReactNode
  required?: boolean
}

export function SearchableSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select',
  searchPlaceholder = 'Search…',
  error,
  hint,
  required,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selected = options.find((option) => option.value === value)
  const needle = query.trim().toLowerCase()
  const visible = needle
    ? options.filter((option) => option.label.toLowerCase().includes(needle))
    : options

  const select = (next: T) => {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  return (
    <Field label={label} error={error} hint={hint} required={required}>
      {(id, describedBy) => (
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setQuery('')
          }}
          className="w-(--radix-popover-trigger-width) p-1.5"
          trigger={
            <button
              id={id}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              // oxlint-disable-next-line jsx-a11y/role-supports-aria-props -- mirrors the Select trigger
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              className={cn(
                controlClass,
                controlSizes.md,
                'inline-flex items-center justify-between gap-2 text-left',
                !selected && 'text-text-placeholder',
              )}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                {selected?.leading}
                <span className="truncate">{selected?.label ?? placeholder}</span>
              </span>
              <Search className="size-4 shrink-0 text-text-muted" />
            </button>
          }
        >
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={searchPlaceholder}
            debounceMs={0}
            autoFocus
          />
          <div
            role="listbox"
            aria-label={searchPlaceholder}
            className="mt-1.5 max-h-60 overflow-y-auto"
          >
            {visible.map((option) => {
              const active = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => select(option.value)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-base text-text-primary focus-ring transition-colors hover:bg-surface-sunken',
                    active && 'bg-surface-sunken font-medium',
                  )}
                >
                  {option.leading}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {active && <Check className="size-4 shrink-0 text-brand" />}
                </button>
              )
            })}
            {visible.length === 0 && (
              <p className="px-2.5 py-6 text-center text-sm text-text-muted">
                No results for “{query.trim()}”
              </p>
            )}
          </div>
        </Popover>
      )}
    </Field>
  )
}
