import { Repeat, Trash2, Users } from 'lucide-react'
import { Breadcrumbs } from '@/components/common'
import { Avatar, Button, IconButton, LinkButton } from '@/components/ui'
import type { ClientProfile } from '@/types'
import { KycStatusText } from './KycStatusText'

interface ClientProfileHeaderProps {
  client: ClientProfile
  onDelete: () => void
}

export function ClientProfileHeader({ client, onDelete }: ClientProfileHeaderProps) {
  const familyTo = `/clients/${client.id}/family`
  const transactTo = `/clients/${client.id}/transact`

  return (
    <header className="flex flex-col gap-4">
      <Breadcrumbs
        crumbs={[{ label: 'Client Management', to: '/clients' }, { label: 'Client profile' }]}
        className="md:hidden"
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <Avatar
            name={client.name}
            src={client.avatarUrl}
            size="lg"
            className="bg-brand md:size-16 md:text-lg [&>span]:text-brand-foreground"
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-text-primary md:text-2xl">
              {client.name}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-sm text-text-muted">{client.id}</span>
              <KycStatusText status={client.kycStatus} prefix className="text-xs md:text-sm" />
            </div>
          </div>
          <IconButton label="Delete user" variant="danger" className="md:hidden" onClick={onDelete}>
            <Trash2 />
          </IconButton>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LinkButton to={familyTo} variant="outline" leftIcon={<Users className="size-4" />}>
            Family tree
          </LinkButton>
          <LinkButton to={transactTo} leftIcon={<Repeat className="size-4" />}>
            Transact now
          </LinkButton>
          <Button
            variant="ghost"
            className="text-danger hover:bg-danger-tint hover:text-danger"
            leftIcon={<Trash2 className="size-4" />}
            onClick={onDelete}
          >
            Delete User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:hidden">
        <LinkButton to={familyTo} variant="outline" leftIcon={<Users className="size-4" />}>
          Family tree
        </LinkButton>
        <LinkButton to={transactTo} leftIcon={<Repeat className="size-4" />}>
          Transact now
        </LinkButton>
      </div>
    </header>
  )
}
