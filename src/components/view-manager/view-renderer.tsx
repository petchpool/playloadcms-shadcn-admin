'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { closeViewAtom, type ViewConfig } from '@/store/view-atoms'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

export function ViewRenderer({ config }: { config: ViewConfig }) {
  const closeView = useSetAtom(closeViewAtom)
  const Component = config.component
  const isOpen = config.isOpen ?? true

  // Dialog View
  if (config.type === 'dialog') {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeView(config.id)}>
        <DialogContent size={config.size}>
          {config.title && (
            <DialogHeader>
              <DialogTitle>{config.title}</DialogTitle>
              {config.description && <DialogDescription>{config.description}</DialogDescription>}
            </DialogHeader>
          )}
          <Component {...config.props} viewId={config.id} />
        </DialogContent>
      </Dialog>
    )
  }

  // Sidebar View
  if (config.type === 'sidebar-left' || config.type === 'sidebar-right') {
    const side = config.type === 'sidebar-left' ? 'left' : 'right'
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeView(config.id)}>
        <SheetContent side={side} className={config.mode === 'push' ? 'sheet-push' : ''}>
          {config.title && (
            <SheetHeader>
              <SheetTitle>{config.title}</SheetTitle>
              {config.description && <SheetDescription>{config.description}</SheetDescription>}
            </SheetHeader>
          )}
          <Component {...config.props} viewId={config.id} />
        </SheetContent>
      </Sheet>
    )
  }

  // Page View (full-screen modal)
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key={config.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <Component {...config.props} viewId={config.id} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

