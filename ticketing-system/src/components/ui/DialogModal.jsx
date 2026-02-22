import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Reusable controlled dialog modal.
 *
 * @param {boolean} open - Whether the dialog is open
 * @param {function(boolean): void} onOpenChange - Called when open state should change (e.g. close)
 * @param {string} title - Dialog title
 * @param {string} [description] - Optional description below title
 * @param {React.ReactNode} children - Main content (scrollable area)
 * @param {boolean} [showFooter=true] - Whether to show the footer with Close button
 * @param {React.ReactNode} [footer] - Optional custom footer content (use with or without showFooter)
 * @param {string} [className] - Optional class for DialogContent
 */
export function DialogModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  showFooter = true,
  footer,
  className,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description != null && description !== "" && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          {children}
        </div>
        {(showFooter || footer) && (
          <DialogFooter>
            {footer ?? (
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
