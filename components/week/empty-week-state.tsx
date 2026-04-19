'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Sparkles, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyWeekStateProps {
  onAutoFill?: () => void
}

export function EmptyWeekState({ onAutoFill }: EmptyWeekStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Calendar className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
      </div>

      {/* Content */}
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
        Deze week nog niets gepland
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        Plan je maaltijden voor deze week en Rut maakt automatisch je boodschappenlijst. 
        Gezond eten zonder de dagelijkse stress.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button 
          onClick={onAutoFill}
          className="flex-1 h-12 rounded-xl gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Vul automatisch in
        </Button>
        <Button 
          variant="outline"
          asChild
          className="flex-1 h-12 rounded-xl gap-2"
        >
          <Link href="/recepten">
            <ChefHat className="h-4 w-4" />
            Kies zelf
          </Link>
        </Button>
      </div>

      {/* Secondary hint */}
      <p className="text-sm text-muted-foreground mt-6">
        Tip: Je kunt ook handmatig recepten toewijzen door op een dag te klikken
      </p>
    </div>
  )
}