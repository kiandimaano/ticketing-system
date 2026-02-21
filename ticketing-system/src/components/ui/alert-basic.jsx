import { useEffect, useRef } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

/**
 * Top-right toast success alert that auto-dismisses after 3 seconds.
 * Does not block interaction with the rest of the page.
 * @param {string} title - Short heading (e.g. "Success", "Done")
 * @param {string} description - Longer message shown below the title
 * @param {function} onDismiss - Called when the modal closes (required for auto-dismiss)
 * @param {number} [duration=3000] - How long to show in ms before dismissing
 */
export function AlertBasic({ title, description, onDismiss, duration = 3000 }) {
    const onDismissRef = useRef(onDismiss)
    onDismissRef.current = onDismiss

    useEffect(() => {
        const timer = onDismissRef.current ? setTimeout(() => onDismissRef.current(), duration) : null
        return () => timer != null && clearTimeout(timer)
    }, [duration])

    return (
        <div className="fixed top-4 right-4 z-50 mx-4 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
            <Alert className="shadow-xl">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>
        </div>
    )
}
