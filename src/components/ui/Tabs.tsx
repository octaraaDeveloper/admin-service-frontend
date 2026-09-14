import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
  count?: number
}

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  items: TabItem<T>[]
  variant?: 'underline' | 'pills'
  className?: string
  children?: ReactNode
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  variant = 'underline',
  className,
  children,
}: TabsProps<T>) {
  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={(next) => onChange(next as T)}
      className={className}
    >
      <TabsPrimitive.List
        className={cn(
          'scrollbar-none flex max-w-full overflow-x-auto',
          variant === 'underline'
            ? 'gap-6 border-b border-border'
            : 'w-fit gap-1 rounded-control bg-surface-sunken p-1',
        )}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 font-medium whitespace-nowrap focus-ring transition-colors',
              variant === 'underline'
                ? '-mb-px border-b-2 border-transparent pb-3 text-base text-text-muted hover:text-text-primary data-[state=active]:border-brand data-[state=active]:text-brand'
                : 'rounded-lg px-4 py-2 text-sm text-text-muted hover:text-text-primary data-[state=active]:bg-surface-raised data-[state=active]:text-brand data-[state=active]:shadow-sm',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="rounded-full bg-surface-sunken px-1.5 py-0.5 text-2xs font-semibold text-text-muted">
                {item.count}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {children}
    </TabsPrimitive.Root>
  )
}

export const TabPanel = TabsPrimitive.Content
