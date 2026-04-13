import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const bannerVariants = cva(
  'relative w-full flex flex-col items-center justify-center text-center overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-border bg-background text-foreground',
      },
      size: {
        sm: 'px-6 py-8 gap-3',
        default: 'px-8 py-16 gap-4',
        lg: 'px-10 py-24 gap-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof bannerVariants> {
  as?: React.ElementType
}

const Banner = React.forwardRef<HTMLElement, BannerProps>(
  ({ className, variant, size, as: Comp = 'section', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(bannerVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Banner.displayName = 'Banner'

const BannerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl', className)}
    {...props}
  />
))
BannerTitle.displayName = 'BannerTitle'

const BannerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('max-w-2xl text-base opacity-90 sm:text-lg', className)}
    {...props}
  />
))
BannerDescription.displayName = 'BannerDescription'

const BannerActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-wrap items-center justify-center gap-3 mt-2', className)}
    {...props}
  />
))
BannerActions.displayName = 'BannerActions'

export { Banner, BannerTitle, BannerDescription, BannerActions, bannerVariants }
