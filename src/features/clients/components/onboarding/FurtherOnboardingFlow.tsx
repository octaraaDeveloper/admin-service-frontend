import { onboardingApi } from '@/api/onboarding'
import { ErrorState } from '@/components/common'
import { Modal, Skeleton } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import type { Client } from '@/types'
import { OnboardingWizard } from './OnboardingWizard'

interface FurtherOnboardingFlowProps {
  open: boolean
  onClose: () => void
  client: Client
}

/**
 * Pre-investment onboarding wizard (personal → bank → FATCA → nominees → verification link).
 * Loads the form options and the client's saved draft, then hands over to the wizard.
 */
export function FurtherOnboardingFlow({ open, onClose, client }: FurtherOnboardingFlowProps) {
  const options = useQuery('onboarding:options', onboardingApi.getFormOptions, open)
  const draft = useQuery(
    `onboarding:draft:${client.id}`,
    () => onboardingApi.getDraft(client.id),
    open,
  )

  if (options.data && draft.data) {
    return (
      <OnboardingWizard
        key={client.id}
        open={open}
        onClose={onClose}
        client={client}
        options={options.data}
        initial={draft.data}
      />
    )
  }

  const error = options.error ?? draft.error
  return (
    <Modal open={open} onClose={onClose} title="Complete onboarding" size="lg">
      {error ? (
        <ErrorState
          error={error}
          onRetry={() => {
            if (options.error) options.refetch()
            if (draft.error) draft.refetch()
          }}
        />
      ) : (
        <div className="flex flex-col gap-5" aria-busy>
          <Skeleton className="h-7 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
