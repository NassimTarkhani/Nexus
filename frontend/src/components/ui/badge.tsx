import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30",
                secondary: "bg-zinc-800 text-zinc-300 border border-zinc-700",
                destructive: "bg-red-600/20 text-red-400 border border-red-600/30",
                outline: "text-zinc-400 border border-zinc-800",
                success: "bg-green-600/20 text-green-400 border border-green-600/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
