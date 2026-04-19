import * as React from "react"

import { cn } from "@/lib/utils"

interface EmptyProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

function Empty({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon,
  action,
  className,
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { Empty }
