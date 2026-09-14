import { Link2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { FormError } from '@/components/common'
import { Button, Card } from '@/components/ui'
import type { ApiError } from '@/api/client'

interface OrderLayoutProps {
  form: ReactNode
  summary: ReactNode
  aside: ReactNode
  error?: ApiError | string | null
  submitLabel: string
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
  onClear: () => void
}

export function OrderLayout({
  form,
  summary,
  aside,
  error,
  submitLabel,
  canSubmit,
  submitting,
  onSubmit,
  onClear,
}: OrderLayoutProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (canSubmit && !submitting) onSubmit()
        }}
        className="flex min-w-0 flex-col gap-4"
      >
        <Card className="flex flex-col gap-5 border-border-strong p-4 md:p-6">{form}</Card>
        {summary}
        <FormError
          error={
            typeof error === 'string' || !error || Object.keys(error.fieldErrors).length === 0
              ? error
              : null
          }
        />
        <div className="fixed inset-x-0 bottom-[calc(62px+env(safe-area-inset-bottom))] z-20 flex gap-3 border-t border-border bg-surface-raised/95 p-4 backdrop-blur lg:static lg:inset-auto lg:z-auto lg:justify-end lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClear}
            disabled={submitting}
            className="flex-1 border-brand text-brand hover:bg-brand-tint lg:min-w-[120px] lg:flex-none"
          >
            Clear
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            leftIcon={<Link2 className="size-4" />}
            className="flex-[1.6] lg:flex-none"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
      <div className="min-w-0">{aside}</div>
    </div>
  )
}
