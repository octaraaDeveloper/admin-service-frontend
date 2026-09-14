import { Check } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'

export default function ResetSuccessPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="flex size-[76px] items-center justify-center rounded-full bg-success-tint text-success"
        aria-hidden
      >
        <Check className="size-9" strokeWidth={2.5} />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-text-primary">
        Password reset successful
      </h2>
      <p className="mt-2 text-base text-text-muted">
        Your password has been updated. You can now sign in with your new credentials.
      </p>
      <LinkButton to="/login" size="lg" className="mt-7 w-full">
        Back to sign in
      </LinkButton>
    </div>
  )
}
