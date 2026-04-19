"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OnboardingFlowProps {
  onComplete: (data: { householdName: string; members: number }) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [householdName, setHouseholdName] = useState("")
  const [members, setMembers] = useState(2)

  const handleNext = () => {
    if (step === 2) {
      onComplete({ householdName, members })
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Welkom bij Rut" : "Huisgenoten"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Laten we beginnen met het instellen van je huishouden."
              : "Hoeveel personen eten er mee?"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <div className="space-y-2">
              <Label htmlFor="household">Naam huishouden</Label>
              <Input
                id="household"
                placeholder="Bijv. Gezin De Vries"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="members">Aantal personen</Label>
              <Input
                id="members"
                type="number"
                min={1}
                max={20}
                value={members}
                onChange={(e) => setMembers(parseInt(e.target.value) || 1)}
              />
            </div>
          )}
          <Button
            className="w-full"
            onClick={handleNext}
            disabled={step === 1 && !householdName}
          >
            {step === 1 ? "Volgende" : "Afronden"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
