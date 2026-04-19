'use client'

import { 
  ChevronRight, 
  Users, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  Settings,
  LogOut,
  Leaf
} from 'lucide-react'
import { mockHousehold } from '@/lib/app-data'

const menuItems = [
  {
    id: 'household',
    label: 'Huishouden',
    description: `${mockHousehold.adults} volwassenen, ${mockHousehold.children} kinderen`,
    icon: Users,
  },
  {
    id: 'preferences',
    label: 'Voorkeuren',
    description: 'Dieetwensen & allergieën',
    icon: Leaf,
  },
  {
    id: 'notifications',
    label: 'Meldingen',
    description: 'Herinneringen & updates',
    icon: Bell,
  },
  {
    id: 'subscription',
    label: 'Abonnement',
    description: 'Rut Premium',
    icon: CreditCard,
    badge: 'Pro',
  },
  {
    id: 'settings',
    label: 'Instellingen',
    description: 'App voorkeuren',
    icon: Settings,
  },
  {
    id: 'help',
    label: 'Help & Feedback',
    description: 'Vragen of suggesties',
    icon: HelpCircle,
  },
]

export function ProfileView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background pt-6 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="font-serif text-2xl text-primary">
                {mockHousehold.name.charAt(0)}
              </span>
            </div>
            
            <div>
              <h1 className="font-serif text-xl tracking-tight text-foreground">
                {mockHousehold.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Rut Premium sinds maart 2025
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <p className="text-2xl font-semibold text-foreground">47</p>
              <p className="text-xs text-muted-foreground mt-1">Recepten gekookt</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <p className="text-2xl font-semibold text-foreground">12</p>
              <p className="text-xs text-muted-foreground mt-1">Weken gepland</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <p className="text-2xl font-semibold text-foreground">8</p>
              <p className="text-xs text-muted-foreground mt-1">Favorieten</p>
            </div>
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left"
                style={{
                  borderBottom: index < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                  borderBottomColor: 'rgb(from var(--border) r g b / 0.3)',
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </button>
            )
          })}
        </div>

        {/* Sign Out */}
        <button className="w-full flex items-center justify-center gap-2 mt-6 p-4 rounded-xl text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Uitloggen</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Rut versie 1.0.0
        </p>
      </main>
    </div>
  )
}