import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function CardSmall({ title, description, content }) {
    return (
        <Card
            size="sm"
            className="w-full max-w-sm shrink-0 self-start gap-3 py-4 [&>div]:px-4"
        >
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
                <CardDescription className="text-center text-xl font-bold">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-lg">
                <p>
                    {content}
                </p>
            </CardContent>
        </Card>
    )
}
