import { useMemo, useReducer, useRef, useState } from 'react'
import { onboardingApi } from '@/api/onboarding'
import { FormError } from '@/components/common'
import { Button, Modal, Stepper } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { cn } from '@/lib/utils'
import { useInvalidate } from '@/hooks/useQuery'
import { toast } from '@/store/toast'
import type { Client, OnboardingData, OnboardingFormOptions, OnboardingStep } from '@/types'
import {
  createWizardState,
  ONBOARDING_STEPS,
  wizardReducer,
  type FieldErrors,
} from './onboardingState'
import { BankDetailsStep } from './steps/BankDetailsStep'
import { BankVerifiedState, BankVerifyingState } from './steps/BankVerificationState'
import { FatcaDetailsStep } from './steps/FatcaDetailsStep'
import { NomineeDetailsStep } from './steps/NomineeDetailsStep'
import { PersonalDetailsStep } from './steps/PersonalDetailsStep'
import { VerificationPromptState, VerificationSentState } from './steps/VerificationStep'
import { validateBank, validateFatca, validateNominees, validatePersonal } from './validation'

interface OnboardingWizardProps {
  open: boolean
  onClose: () => void
  client: Client
  options: OnboardingFormOptions
  initial: OnboardingData
}

const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0

export function OnboardingWizard({
  open,
  onClose,
  client,
  options,
  initial,
}: OnboardingWizardProps) {
  const [state, dispatch] = useReducer(wizardReducer, initial, createWizardState)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    // Start over when the modal is reopened after the flow was completed.
    if (open && state.linkResult) dispatch({ type: 'reset', data: state.data })
  }
  const saveStep = useMutation(onboardingApi.saveStep)
  const verifyBank = useMutation(onboardingApi.verifyBank)
  const sendLink = useMutation(onboardingApi.sendVerificationLink)
  const invalidate = useInvalidate()

  const step = ONBOARDING_STEPS[state.stepIndex]
  const verifying = state.bankPhase === 'verifying'
  const linkSent = state.linkResult !== null
  const busy = saveStep.loading || verifyBank.loading || sendLink.loading
  const mutationError = saveStep.error ?? verifyBank.error ?? sendLink.error
  const errors = useMemo<FieldErrors>(
    () => ({ ...mutationError?.fieldErrors, ...state.errors }),
    [mutationError, state.errors],
  )

  const resetMutations = () => {
    saveStep.reset()
    verifyBank.reset()
    sendLink.reset()
  }

  const showErrors = (next: FieldErrors) => {
    dispatch({ type: 'set-errors', errors: next })
    requestAnimationFrame(() => {
      bodyRef.current
        ?.querySelector('[aria-invalid="true"], .text-danger')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })
  }

  const goTo = (stepIndex: number) => {
    resetMutations()
    dispatch({ type: 'go', stepIndex })
  }

  // FATCA inherits the PEP answer from the personal step until it is changed explicitly.
  const fatca = { ...state.data.fatca, pep: state.data.fatca.pep ?? state.data.personal.pep }

  const persist = async <S extends OnboardingStep>(
    key: S,
    data: OnboardingData[S] = state.data[key],
  ) => {
    const result = await saveStep.mutate(client.id, key, data)
    return result !== undefined
  }

  const finish = () => {
    toast.success(`Verification link sent to ${client.name}`)
    invalidate(`onboarding:draft:${client.id}`)
    invalidate('clients')
    onClose()
  }

  const handleContinue = async () => {
    switch (step.key) {
      case 'personal': {
        const next = validatePersonal(state.data.personal)
        if (hasErrors(next)) return showErrors(next)
        if (await persist('personal')) goTo(state.stepIndex + 1)
        return
      }
      case 'bank': {
        if (state.bankPhase === 'verified') {
          if (await persist('bank')) goTo(state.stepIndex + 1)
          return
        }
        const next = validateBank(state.data.bank)
        if (hasErrors(next)) return showErrors(next)
        resetMutations()
        dispatch({ type: 'bank-phase', phase: 'verifying' })
        const verification = await verifyBank.mutate(client.id, state.data.bank)
        if (verification) dispatch({ type: 'bank-phase', phase: 'verified', verification })
        else dispatch({ type: 'bank-phase', phase: 'form' })
        return
      }
      case 'fatca': {
        const next = validateFatca(fatca)
        if (hasErrors(next)) return showErrors(next)
        if (await persist('fatca', fatca)) goTo(state.stepIndex + 1)
        return
      }
      case 'nominees': {
        const next = validateNominees(state.data.nominees.nominees)
        if (hasErrors(next)) return showErrors(next)
        if (await persist('nominees')) goTo(state.stepIndex + 1)
        return
      }
      case 'verification': {
        const result = await sendLink.mutate(client.id)
        if (result) dispatch({ type: 'link-sent', result })
      }
    }
  }

  const handleBack = () => {
    if (state.stepIndex === 0) return onClose()
    if (step.key === 'bank' && state.bankPhase === 'verified') {
      resetMutations()
      return dispatch({ type: 'bank-phase', phase: 'form' })
    }
    goTo(state.stepIndex - 1)
  }

  const renderStep = () => {
    switch (step.key) {
      case 'personal':
        return (
          <PersonalDetailsStep
            value={state.data.personal}
            onChange={(patch) => dispatch({ type: 'update', step: 'personal', patch })}
            errors={errors}
            options={options}
          />
        )
      case 'bank':
        if (verifying) return <BankVerifyingState />
        if (state.bankPhase === 'verified' && state.bankVerification)
          return <BankVerifiedState verification={state.bankVerification} />
        return (
          <BankDetailsStep
            value={state.data.bank}
            onChange={(patch) => dispatch({ type: 'update', step: 'bank', patch })}
            errors={errors}
            options={options}
          />
        )
      case 'fatca':
        return (
          <FatcaDetailsStep
            value={fatca}
            onChange={(patch) => dispatch({ type: 'update', step: 'fatca', patch })}
            errors={errors}
            options={options}
          />
        )
      case 'nominees':
        return (
          <NomineeDetailsStep
            nominees={state.data.nominees.nominees}
            onChange={(id, patch) => dispatch({ type: 'update-nominee', id, patch })}
            onAdd={() => dispatch({ type: 'add-nominee' })}
            onRemove={(id) => dispatch({ type: 'remove-nominee', id })}
            errors={errors}
            errorsVersion={state.validationCount}
            options={options}
          />
        )
      case 'verification':
        if (state.linkResult) return <VerificationSentState result={state.linkResult} />
        return <VerificationPromptState client={client} />
    }
  }

  const footer = linkSent ? (
    <Button size="lg" onClick={finish} className="w-full">
      Done
    </Button>
  ) : verifying ? null : (
    <div
      className={cn(
        'grid w-full gap-3',
        step.key === 'verification' ? 'grid-cols-[auto_1fr]' : 'grid-cols-2',
      )}
    >
      <Button variant="outline" size="lg" onClick={handleBack} disabled={busy}>
        {state.stepIndex === 0 ? 'Cancel' : 'Back'}
      </Button>
      <Button size="lg" onClick={handleContinue} loading={busy}>
        {step.key === 'verification' ? 'Send verification link' : 'Continue'}
      </Button>
    </div>
  )

  return (
    <Modal
      open={open}
      onClose={verifying ? () => {} : onClose}
      title={linkSent ? 'Verification link sent' : step.title}
      description={`Step ${state.stepIndex + 1} of ${ONBOARDING_STEPS.length} · ${client.name}`}
      size="lg"
      hideClose={verifying}
      footer={footer}
    >
      <div ref={bodyRef} className="flex flex-col gap-5">
        {!linkSent && (
          <Stepper steps={ONBOARDING_STEPS.map((item) => item.label)} current={state.stepIndex} />
        )}
        {mutationError && !verifying && <FormError error={mutationError} />}
        {renderStep()}
      </div>
    </Modal>
  )
}
