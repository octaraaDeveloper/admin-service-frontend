import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md'
  className?: string
}

export function RatingStars({ rating, size = 'sm', className }: RatingStarsProps) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating
        return (
          <Star
            key={index}
            aria-hidden
            className={cn(
              size === 'sm' ? 'size-3' : 'size-4',
              filled ? 'fill-accent text-accent' : 'fill-border text-border',
            )}
          />
        )
      })}
    </span>
  )
}
