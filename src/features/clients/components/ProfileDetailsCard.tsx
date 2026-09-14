import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { formatDate } from '@/lib/format'
import type { ClientProfile } from '@/types'
import { KycStatusText } from './KycBadge'

function formatMobile(mobile: string) {
  return mobile.length === 10 ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` : mobile
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0 last:pb-0">
      <dt className="shrink-0 text-sm text-text-muted">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium break-words text-text-primary">
        {children}
      </dd>
    </div>
  )
}

export function ProfileDetailsCard({
  client,
  className,
}: {
  client: ClientProfile
  className?: string
}) {
  return (
    <Card className={className}>
      <div className="p-4 md:p-5">
        <h3 className="text-base font-medium text-text-primary">Profile details</h3>
        <dl className="mt-2">
          <DetailRow label="User ID">{client.id}</DetailRow>
          <DetailRow label="Email">{client.email}</DetailRow>
          <DetailRow label="Mobile">{formatMobile(client.mobile)}</DetailRow>
          <DetailRow label="PAN">{client.pan}</DetailRow>
          <DetailRow label="KYC status">
            <KycStatusText status={client.kycStatus} className="justify-end" />
          </DetailRow>
          <DetailRow label="Joined on">{formatDate(client.joinedAt)}</DetailRow>
          <DetailRow label="Address">{client.address}</DetailRow>
        </dl>
      </div>
    </Card>
  )
}

export { formatMobile }
