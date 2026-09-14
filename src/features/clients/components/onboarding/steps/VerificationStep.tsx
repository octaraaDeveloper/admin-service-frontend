import { AlertCircle, Check, Mail, Smartphone } from 'lucide-react'
import type { Client, VerificationLinkResult } from '@/types'

export function VerificationPromptState({ client }: { client: Client }) {
  const rows = [
    { icon: Mail, label: 'Email', detail: client.email },
    { icon: Smartphone, label: 'Mobile', detail: client.mobile },
  ]
  return (
    <div className="flex flex-col items-center px-2 py-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-accent text-white">
        <AlertCircle className="size-10" strokeWidth={2.25} />
      </span>
      <h3 className="mt-6 text-2xl font-medium text-text-primary">Send Verification Link</h3>
      <p className="mt-3 max-w-sm text-md text-text-muted">
        A verification link will be sent to the client to verify their Aadhaar number.
      </p>
      <dl className="mt-6 w-full max-w-sm divide-y divide-border card text-left">
        {rows.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3">
            <Icon className="size-4 shrink-0 text-text-muted" />
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="ml-auto truncate text-sm font-medium text-text-primary">{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function VerificationSentState({ result }: { result: VerificationLinkResult }) {
  return (
    <div role="status" className="flex flex-col items-center px-2 py-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-success text-white">
        <Check className="size-9" strokeWidth={3} />
      </span>
      <h3 className="mt-6 text-2xl font-medium text-text-primary">
        Verification link sent successfully
      </h3>
      <p className="mt-3 max-w-sm text-md text-text-muted">
        A secure link has been sent to <span className="text-text-primary">{result.email}</span> and{' '}
        <span className="text-text-primary">{result.mobile}</span>. Ask the client to follow the
        instructions in the message to continue.
      </p>
    </div>
  )
}
