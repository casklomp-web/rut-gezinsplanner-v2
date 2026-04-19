import Link from 'next/link'
import { ArrowRight, Calendar, ShoppingCart, ChefHat, Heart, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Nu gratis te proberen</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6">
            Geen stress meer
            <br />
            <span className="text-primary">wat eten we vandaag?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Rut plant automatisch je weekmenu en maakt je boodschappenlijst. 
            Gezond eten zonder gedoe, speciaal voor drukke gezinnen.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
              <Link href="/setup">
                Start gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg">
              <Link href="/login">
                Ik heb al een account
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Gratis basisversie</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Geen creditcard nodig</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Altijd opzegbaar</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">
            Zo werkt het
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            In 3 simpele stappen van "geen idee" naar "lekker eten"
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary/20 mb-4">01</div>
              <h3 className="font-semibold text-xl mb-3">Plan je week</h3>
              <p className="text-muted-foreground">
                Kies recepten voor elke dag. Rut suggereert gezonde maaltijden die bij jouw gezin passen.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary/20 mb-4">02</div>
              <h3 className="font-semibold text-xl mb-3">Automatische boodschappenlijst</h3>
              <p className="text-muted-foreground">
                Rut maakt je boodschappenlijst. Geen vergeten ingrediënten meer, geen dubbele aankopen.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary/20 mb-4">03</div>
              <h3 className="font-semibold text-xl mb-3">Lekker eten</h3>
              <p className="text-muted-foreground">
                Volg de stap-voor-stap instructies. Gezonde maaltijden in 20-40 minuten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Waarom gezinnen voor Rut kiezen
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Gezonder eten</h3>
                    <p className="text-muted-foreground">
                      Geen snelle ongezonde keuzes meer. Geplande maaltijden betekent betere voeding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Tijd besparen</h3>
                    <p className="text-muted-foreground">
                      Geen dagelijks "wat eten we?" stress. Plan één keer per week en klaar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Geld besparen</h3>
                    <p className="text-muted-foreground">
                      Geen impulsaankopen meer. Precies wat je nodig hebt, niets meer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual/Stats */}
            <div className="bg-card rounded-3xl p-8 border border-border/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-secondary/50 rounded-2xl">
                  <div className="text-4xl font-bold text-primary mb-2">30 min</div>
                  <p className="text-sm text-muted-foreground">Gemiddelde besparing per dag</p>
                </div>
                <div className="text-center p-6 bg-secondary/50 rounded-2xl">
                  <div className="text-4xl font-bold text-primary mb-2">€50</div>
                  <p className="text-sm text-muted-foreground">Gemiddeld bespaard per maand</p>
                </div>
                <div className="text-center p-6 bg-secondary/50 rounded-2xl">
                  <div className="text-4xl font-bold text-primary mb-2">200+</div>
                  <p className="text-sm text-muted-foreground">Gezonde recepten</p>
                </div>
                <div className="text-center p-6 bg-secondary/50 rounded-2xl">
                  <div className="text-4xl font-bold text-primary mb-2">4.8</div>
                  <p className="text-sm text-muted-foreground">Gemiddelde rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Start vandaag nog met gezonder eten
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Join duizenden gezinnen die al geen stress meer hebben over het avondeten. 
            Gratis proberen, geen verplichtingen.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full px-8 h-14 text-lg">
            <Link href="/setup">
              Maak gratis account aan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-serif text-primary-foreground font-bold">R</span>
            </div>
            <span className="font-serif text-xl font-bold">Rut</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Rut. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Voorwaarden</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}