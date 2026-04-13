import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const bannerVariants = cva(
  'relative w-full flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-foreground',
        accent: 'bg-accent text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      size: {
        sm: 'py-8 md:py-12',
        default: 'py-16 md:py-24',
        lg: 'py-24 md:py-32',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant, size, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(bannerVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Banner.displayName = 'Banner'

const BannerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative z-10 mx-auto w-full max-w-3xl space-y-4', className)}
    {...props}
  />
))
BannerContent.displayName = 'BannerContent'

const BannerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn('text-3xl font-bold tracking-tight md:text-5xl', className)}
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
    className={cn('text-base opacity-90 md:text-lg', className)}
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
    className={cn('flex flex-wrap items-center justify-center gap-3 pt-2', className)}
    {...props}
  />
))
BannerActions.displayName = 'BannerActions'

export { Banner, BannerContent, BannerTitle, BannerDescription, BannerActions, bannerVariants }
