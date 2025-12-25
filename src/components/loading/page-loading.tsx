'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PageLoadingProps = {
  className?: string
  message?: string
  fullScreen?: boolean
}

export function PageLoading({
  className,
  message = 'Loading...',
  fullScreen = false,
}: PageLoadingProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          {message && (
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn('flex min-h-[400px] items-center justify-center p-8', className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo/Spinner */}
        <motion.div
          className="relative"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="relative h-16 w-16">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Inner spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div variants={item} className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-foreground">{message}</p>

          {/* Animated dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Optional: Skeleton preview */}
        <motion.div variants={item} className="mt-4 w-full max-w-md space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function PageLoadingSimple({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[200px] items-center justify-center', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function PageLoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[400px] items-center justify-center p-8', className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/40"
            animate={{
              scale: [1, 1.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.5,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Loading content...</p>
      </div>
    </div>
  )
}
