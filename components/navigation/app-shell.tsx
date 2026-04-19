'use client'

import { BottomNav } from './bottom-nav'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  )
}