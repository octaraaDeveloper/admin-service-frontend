import { Check, IndianRupee } from 'lucide-react'
import type { BankVerification } from '@/types'

export function BankVerifyingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center px-4 py-10 text-center"
    >
      <span className="flex size-20 items-center justify-center rounded-full bg-info-tint text-text-primary">
        <IndianRupee className="size-8" strokeWidth={2.5} />
      </span>
      <h3 className="mt-6 text-2xl font-medium text-text-primary">Depositing ₹1</h3>
      <p className="mt-3 max-w-xs text-md text-text-muted">
        We are depositing ₹1 to verify the bank account. Please do not close this window.
      </p>
      <span aria-hidden className="mt-6 flex items-center gap-2">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: `${delay}ms` }}
            className="size-2 animate-bounce rounded-full bg-brand"
          />
        ))}
      </span>
    </div>
  )
}

export function BankVerifiedState({ verification }: { verification: BankVerification }) {
  const rows = [
    ['Account holder', verification.accountHolderName],
    ['Bank', verification.bankName],
    ['Account number', verification.accountNumber],
    ['IFSC code', verification.ifsc],
  ]
  return (
    <div className="flex flex-col items-center px-2 py-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-success text-white">
        <Check className="size-9" strokeWidth={3} />
      </span>
      <h3 className="mt-6 text-2xl font-medium text-text-primary">Bank account verified</h3>
      <p className="mt-3 max-w-sm text-md text-text-muted">
        ₹1 was deposited successfully and the account holder name matches the client.
      </p>
      <dl className="mt-6 w-full max-w-sm divide-y divide-border card text-left">
        {rows.map(([label, detail]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="text-sm font-medium text-text-primary">{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
