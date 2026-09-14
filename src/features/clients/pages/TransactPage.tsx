import { ShieldAlert } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'
import { transactApi } from '@/api/transact'
import { ErrorState, PageHeader } from '@/components/common'
import { Skeleton, Tabs } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import type { TransactProduct } from '@/types'
import { FixedDepositForm } from '../components/transact/FixedDepositForm'
import { MutualFundForm } from '../components/transact/MutualFundForm'
import { productTabs } from '../components/transact/options'

function isProduct(value: string | null): value is TransactProduct {
  return productTabs.some((tab) => tab.value === value)
}

function TransactSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]" aria-busy>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-80" />
    </div>
  )
}

export default function TransactPage() {
  const { clientId = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const productParam = searchParams.get('product')
  const product: TransactProduct = isProduct(productParam) ? productParam : 'mutual-funds'

  const {
    data: client,
    error,
    loading,
    refetch,
  } = useQuery(`transact:client:${clientId}`, () => transactApi.client(clientId), Boolean(clientId))

  const kycBlocked = client && (client.kycStatus === 'rejected' || client.kycStatus === 'expired')

  return (
    <div className="flex flex-col gap-5 pb-24 lg:pb-0">
      <PageHeader
        title="Transact"
        description={client ? `${client.name} · ${client.id}` : undefined}
        backTo={`/clients/${clientId}`}
        crumbs={[
          { label: 'Client Management', to: '/clients' },
          { label: 'Client profile', to: `/clients/${clientId}` },
          { label: 'Transact' },
        ]}
      />

      {loading && !client ? (
        <TransactSkeleton />
      ) : error || !client ? (
        <ErrorState error={error} title="Could not load client" onRetry={() => void refetch()} />
      ) : (
        <>
          {kycBlocked && (
            <div className="flex items-start gap-2 rounded-control border border-danger/30 bg-danger-tint px-3.5 py-3 text-sm text-danger">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <p>
                {client.name}&apos;s KYC is {client.kycStatus}. You can prepare an order, but
                payment links can only be sent once KYC is verified.
              </p>
            </div>
          )}
          <Tabs
            value={product}
            onChange={(next) =>
              setSearchParams(next === 'mutual-funds' ? {} : { product: next }, { replace: true })
            }
            items={productTabs}
          />
          {product === 'mutual-funds' ? (
            <MutualFundForm key={client.id} client={client} />
          ) : (
            <FixedDepositForm key={client.id} client={client} />
          )}
        </>
      )}
    </div>
  )
}
