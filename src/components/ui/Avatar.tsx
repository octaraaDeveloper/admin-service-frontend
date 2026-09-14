import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, initialsOf } from '@/lib/utils'

const sizes = {
  xs: 'size-6 text-2xs',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-md',
  xl: 'size-20 text-xl',
}

interface AvatarProps {
  name: string
  src?: string | null
  size?: keyof typeof sizes
  shape?: 'circle' | 'rounded'
  className?: string
}

export function Avatar({ name, src, size = 'md', shape = 'circle', className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex shrink-0 overflow-hidden bg-brand-tint select-none',
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        sizes[size],
        className,
      )}
    >
      {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback
        delayMs={src ? 400 : 0}
        className="flex size-full items-center justify-center font-semibold text-brand"
      >
        {initialsOf(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
