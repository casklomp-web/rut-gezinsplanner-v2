'use client';

import Link from 'next/link';
import { ChefHat, Calendar, CheckSquare, ShoppingCart, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="w-20 h-20 bg-[#4A90A4] rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-4">
          Rut
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          De eenvoudige gezinsplanner
        </p>
        <p className="text-gray-500 mb-8">
          Plan je week, beheer je taken en houd je gezin georganiseerd.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth?mode=register"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors"
          >
            Start gratis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            href="/auth?mode=login"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#4A90A4] border-2 border-[#4A90A4] rounded-xl font-medium hover:bg-[#4A90A4]/5 transition-colors"
          >
            Inloggen
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-[#2D3436] mb-8">
          Wat je kunt doen met Rut
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#4A90A4]" />
            </div>
            <h3 className="font-semibold text-[#2D3436] mb-2">Weekplanning</h3>
            <p className="text-gray-600 text-sm">
              Plan je maaltijden en activiteiten voor de hele week in één overzicht.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center mb-4">
              <CheckSquare className="w-6 h-6 text-[#4A90A4]" />
            </div>
            <h3 className="font-semibold text-[#2D3436] mb-2">Gezinstaken</h3>
            <p className="text-gray-600 text-sm">
              Houd taken bij voor het hele gezin. Wie doet wat en wanneer?
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-[#4A90A4]" />
            </div>
            <h3 className="font-semibold text-[#2D3436] mb-2">Boodschappenlijst</h3>
            <p className="text-gray-600 text-sm">
              Genereer automatisch een boodschappenlijst van je weekplanning.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-12 h-12 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#4A90A4]" />
            </div>
            <h3 className="font-semibold text-[#2D3436] mb-2">Voor het hele gezin</h3>
            <p className="text-gray-600 text-sm">
              Eén account voor je hele huishouden. Iedereen weet wat er moet gebeuren.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-[#2D3436] mb-4">
          Klaar om te starten?
        </h2>
        <p className="text-gray-600 mb-6">
          Maak binnen 1 minuut je account aan en begin met plannen.
        </p>
        <Link
          href="/auth?mode=register"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors"
        >
          Maak gratis account
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
        <p>© 2025 Rut App</p>
      </div>
    </div>
  );
}
