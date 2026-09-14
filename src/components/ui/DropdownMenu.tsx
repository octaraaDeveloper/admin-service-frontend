import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MenuItem {
  label: ReactNode
  icon?: ReactNode
  onSelect?: () => void
  tone?: 'default' | 'danger'
  disabled?: boolean
  separatorBefore?: boolean
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: MenuItem[]
  align?: 'start' | 'end' | 'center'
  className?: string
}

export function DropdownMenu({ trigger, items, align = 'end', className }: DropdownMenuProps) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger asChild>{trigger}</MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Content
          align={align}
          sideOffset={6}
          className={cn(
            'z-50 min-w-44 rounded-control border border-border bg-surface-raised p-1 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            className,
          )}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.separatorBefore && <MenuPrimitive.Separator className="my-1 h-px bg-border" />}
              <MenuPrimitive.Item
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-base outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-sunken [&_svg]:size-4',
                  item.tone === 'danger' ? 'text-danger' : 'text-text-primary',
                )}
              >
                {item.icon}
                {item.label}
              </MenuPrimitive.Item>
            </div>
          ))}
        </MenuPrimitive.Content>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
