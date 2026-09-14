import { Check, X } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'
import { passwordStrength, type PasswordStrength } from '@/lib/validation'

interface PasswordRule {
  label: string
  test: (value: string) => boolean
}

const rules: PasswordRule[] = [
  { label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { label: 'At least 1 digit', test: (value) => /\d/.test(value) },
  { label: 'At least 1 upper case character', test: (value) => /[A-Z]/.test(value) },
  { label: 'At least 1 lower case character', test: (value) => /[a-z]/.test(value) },
  { label: 'At least 1 special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

type StrengthLevel = PasswordStrength | 'very-strong'

interface LevelStyle {
  label: string
  segments: number
  tone: 'danger' | 'accent' | 'success'
  text: string
}

const levels: Record<StrengthLevel, LevelStyle> = {
  weak: { label: 'Weak', segments: 1, tone: 'danger', text: 'text-danger' },
  medium: { label: 'Medium', segments: 2, tone: 'accent', text: 'text-accent' },
  strong: { label: 'Strong', segments: 3, tone: 'success', text: 'text-success' },
  'very-strong': { label: 'Very strong', segments: 4, tone: 'success', text: 'text-success' },
}

const SEGMENTS = 4
const VERY_STRONG_LENGTH = 12

function resolveLevel(password: string, passed: boolean[]): StrengthLevel {
  const strength = passwordStrength(password)
  const everyRuleMet = passed.every(Boolean) && password.length >= VERY_STRONG_LENGTH
  return strength === 'strong' && everyRuleMet ? 'very-strong' : strength
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const passed = rules.map((rule) => rule.test(password))
  const level = levels[resolveLevel(password, passed)]
  const filled = password ? level.segments : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: SEGMENTS }, (_, index) => (
            <ProgressBar
              key={index}
              value={index < filled ? 100 : 0}
              tone={level.tone}
              className="h-1 flex-1"
            />
          ))}
        </div>
        <p className={cn('min-h-[18px] self-end text-xs font-medium', level.text)} role="status">
          {password ? level.label : ''}
        </p>
      </div>
      <div>
        <p className="text-base font-medium text-text-primary">The password must contain</p>
        <ul className="mt-2 space-y-2">
          {rules.map((rule, index) => (
            <li
              key={rule.label}
              className={cn(
                'flex items-center gap-3 text-base',
                passed[index] ? 'text-success' : 'text-text-secondary',
              )}
            >
              {passed[index] ? (
                <Check className="size-4 shrink-0" aria-label="Met" />
              ) : (
                <X className="size-4 shrink-0" aria-label="Not met" />
              )}
              {rule.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
