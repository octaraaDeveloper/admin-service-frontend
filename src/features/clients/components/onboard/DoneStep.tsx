import { Check } from 'lucide-react'

export function DoneStep({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-success-tint text-success">
        <Check className="size-8" strokeWidth={2.5} aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-text-primary">User added successfully</h3>
      <p className="mt-2 max-w-xs text-sm text-text-muted">
        New client has been onboarded. A KYC verification link has been sent to their email.
      </p>
      <p className="mt-4 text-xs font-medium text-text-secondary">{name}</p>
    </div>
  )
}
