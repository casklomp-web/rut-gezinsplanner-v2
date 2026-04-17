export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Welkom bij Rut
        </h1>
        <p className="text-muted mb-8">
          Slimme maaltijdplanning voor je gezin.
        </p>
        
        <div className="space-y-4">
          <a 
            href="/setup" 
            className="block w-full bg-primary text-white py-3 px-4 rounded-xl text-center font-medium hover:bg-primary-600 transition-colors"
          >
            Nieuw huishouden starten
          </a>
          
          <a 
            href="/join" 
            className="block w-full bg-white border-2 border-primary text-primary py-3 px-4 rounded-xl text-center font-medium hover:bg-primary-50 transition-colors"
          >
            Bestaand huishouden joinen
          </a>
        </div>
      </div>
    </main>
  )
}
