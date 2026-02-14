import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

/**
 * Reusable destructive alert. Use on any page for error/validation messages.
 * @param {string} title - Short heading (e.g. "Error", "Payment failed")
 * @param {string} description - Longer message shown below the title
 * @param {string} [className] - Optional extra classes (e.g. "max-w-md")
 */
export function AlertDestructive({ title, description, className = "" }) {
  return (
    <Alert variant="destructive" className={className || "max-w-md"}>
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
