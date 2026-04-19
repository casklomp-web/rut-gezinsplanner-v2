'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Calendar className="w-9 h-9 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      {/* Content */}
      <h2 className="font-serif text-2xl text-foreground mb-2">
        Je lijst is nog leeg
      </h2>
      <p className="text-muted-foreground max-w-xs mb-8 leading-relaxed">
        Plan maaltijden voor deze week en Rut stelt automatisch je boodschappenlijst samen.
      </p>

      {/* Action */}
      <Button 
        asChild
        className="rounded-xl px-6 h-12 gap-2 shadow-sm"
      >
        <Link href="/week">
          Weekmenu plannen
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>

      {/* Secondary hint */}
      <button className="text-sm text-muted-foreground hover:text-foreground mt-6 transition-colors">
        Of voeg handmatig een item toe
      </button>
    </div>
  )
}