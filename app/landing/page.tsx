'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Calendar, CheckSquare, ShoppingCart, ArrowRight, Sparkles, Users, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A90A4]/5 via-white to-[#7CB342]/5">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4A90A4] rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#2D3436]">Rut</span>
            </div>
            <Link
              href="/auth?mode=login"
              className="text-sm font-medium text-gray-600 hover:text-[#4A90A4] transition-colors"
            >
              Inloggen
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D3436] leading-tight mb-6">
                Je gezin,
                <span className="text-[#4A90A4]"> georganiseerd</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg">
                Plan maaltijden, verdeel taken en houd je hele huishouden op één plek. 
                Samen werken aan een ontspannen gezinsleven.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth?mode=register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#4A90A4] text-white rounded-xl font-semibold hover:bg-[#3a7a8c] transition-all hover:scale-105"
                >
                  Start gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <p className="text-sm text-gray-500 flex items-center">
                  Geen creditcard nodig
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#4A90A4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D3436]">Deze week</p>
                    <p className="text-sm text-gray-500">Week 12, 2025</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { day: 'Ma', meal: 'Pasta Carbonara', color: 'bg-orange-100' },
                    { day: 'Di', meal: 'Gegrilde zalm', color: 'bg-blue-100' },
                    { day: 'Wo', meal: 'Stamppot', color: 'bg-green-100' },
                    { day: 'Do', meal: 'Thaise curry', color: 'bg-yellow-100' },
                    { day: 'Vr', meal: 'Pizza night', color: 'bg-red-100' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-500 w-8">{item.day}</span>
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.meal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">3 gezinsleden</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D3436] mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Geen gedoe meer met losse apps en briefjes. Alles voor je gezin op één plek.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Maaltijdplanning',
                description: 'Plan je week in minuten. Automatische boodschappenlijst en gezonde variatie.',
                color: 'bg-[#4A90A4]',
              },
              {
                icon: CheckSquare,
                title: 'Gezinstaken',
                description: 'Wie doet wat? Verdeel taken eerlijk en houd overzicht wie wat heeft gedaan.',
                color: 'bg-[#7CB342]',
              },
              {
                icon: ShoppingCart,
                title: 'Boodschappen',
                description: 'Slimme lijst gebaseerd op je weekplanning. Nooit meer iets vergeten.',
                color: 'bg-[#E17055]',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3436] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-20 bg-gradient-to-br from-[#4A90A4]/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D3436] mb-4">
              Voor elk gezin
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Drukke ouders',
                description: 'Werk en gezin balanceren? Wij helpen je structuur te houden.',
              },
              {
                icon: Clock,
                title: 'Alleengaanden',
                description: 'Ook voor jezelf plannen helpt je gezonder en bewuster te leven.',
              },
              {
                icon: Shield,
                title: 'Grote gezinnen',
                description: 'Meer mensen, meer structuur nodig. Perfect voor 4+ personen.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <item.icon className="w-10 h-10 text-[#4A90A4] mx-auto mb-4" />
                <h3 className="font-semibold text-[#2D3436] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4A90A4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start vandaag nog
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
              Gratis gebruiken. Geen creditcard nodig. Binnen 2 minuten aan de slag.
            </p>
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#4A90A4] rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105"
            >
              Maak gratis account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#4A90A4] rounded flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#2D3436]">Rut</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Rut App. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
