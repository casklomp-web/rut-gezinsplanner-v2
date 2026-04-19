import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonGroupVariants = cva("inline-flex items-center justify-center")

interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  className?: string
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(buttonGroupVariants({ className }))}
        {...props}
      />
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup, buttonGroupVariants }
