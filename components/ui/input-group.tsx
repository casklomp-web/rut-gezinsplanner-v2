import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center rounded-md border border-input bg-transparent focus-within:ring-1 focus-within:ring-ring",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
InputGroup.displayName = "InputGroup"

export { InputGroup }
