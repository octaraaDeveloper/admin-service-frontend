import { CalendarDays } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import { controlClass, controlSizes, Field } from './Field'
import { Popover } from './Popover'

interface DatePickerProps {
  value: Date | undefined
  onChange: (value: Date | undefined) => void
  label?: ReactNode
  error?: ReactNode
  hint?: ReactNode
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  hint,
  placeholder = 'Select date',
  required,
  disabled,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Field label={label} error={error} hint={hint} required={required}>
      {(id, describedBy) => (
        <Popover
          open={open}
          onOpenChange={setOpen}
          className="p-2"
          trigger={
            <button
              id={id}
              type="button"
              disabled={disabled}
              aria-describedby={describedBy}
              className={cn(
                controlClass,
                controlSizes.md,
                'inline-flex items-center justify-between gap-2 text-left',
                !value && 'text-text-placeholder',
                className,
              )}
            >
              <span>{value ? formatDate(value) : placeholder}</span>
              <CalendarDays className="size-4 shrink-0 text-text-muted" />
            </button>
          }
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date)
              setOpen(false)
            }}
            defaultMonth={value}
            captionLayout="dropdown"
            startMonth={minDate ?? new Date(1940, 0)}
            endMonth={maxDate ?? new Date(new Date().getFullYear() + 5, 11)}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            className="octaraa-day-picker"
          />
        </Popover>
      )}
    </Field>
  )
}
