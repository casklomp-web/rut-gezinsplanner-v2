'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, ArrowRight, Sparkles, Calendar, Users, ShoppingCart, CheckSquare, Star, Zap, Heart } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4A90A4] to-[#7CB342] rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4A90A4] to-[#7CB342] bg-clip-text text-transparent">Rut</span>
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

      {/* Hero Section - Desktop: Full width, Mobile: Compact */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-[#4A90A4]/10 rounded-full blur-3xl"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute top-1/2 -left-20 w-72 h-72 bg-[#7CB342]/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-24 items-center min-h-[calc(100vh-4rem)]">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A90A4]/10 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#4A90A4]" />
                <span className="text-sm font-medium text-[#4A90A4]">Nieuw: Slimme weekplanning</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#2D3436] leading-tight mb-6">
                Je gezin,
                <br />
                <span className="bg-gradient-to-r from-[#4A90A4] to-[#7CB342] bg-clip-text text-transparent">
                  georganiseerd
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Plan maaltijden, verdeel taken en houd je hele huishouden op één plek. 
                Samen werken aan een ontspannen gezinsleven.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth?mode=register"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#4A90A4] to-[#3a7a8c] text-white rounded-2xl font-semibold shadow-lg shadow-[#4A90A4]/25 hover:shadow-xl hover:shadow-[#4A90A4]/30 transition-all hover:-translate-y-1"
                >
                  Start gratis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                </div>
                <span className="text-sm text-gray-500">Gratis te gebruiken</span>
              </div>
            </motion.div>

            {/* Visual - Desktop: Large mockup, Mobile: Simplified */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative w-full"
            >
              <div className="relative flex justify-end">
                {/* Main App Preview */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100 backdrop-blur-sm w-full max-w-xl"
                  style={{ perspective: '1000px' }}
                >
                  {/* App Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Week 12, 2025</p>
                      <h3 className="text-xl font-bold text-[#2D3436]">Deze week</h3>
                    </div>
                    <div className="flex -space-x-2">
                      {['#4A90A4', '#7CB342', '#E17055'].map((color, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>

                  {/* Days */}
                  <div className="space-y-3">
                    {[
                      { day: 'Maandag', meal: 'Pasta Carbonara', emoji: '🍝', color: 'bg-orange-50' },
                      { day: 'Dinsdag', meal: 'Gegrilde zalm', emoji: '🐟', color: 'bg-blue-50' },
                      { day: 'Woensdag', meal: 'Stamppot', emoji: '🥔', color: 'bg-green-50' },
                      { day: 'Donderdag', meal: 'Thaise curry', emoji: '🍛', color: 'bg-yellow-50' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`flex items-center gap-4 p-4 ${item.color} rounded-2xl`}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{item.day}</p>
                          <p className="font-medium text-gray-800">{item.meal}</p>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-[#4A90A4]" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    {[
                      { label: 'Maaltijden', value: '21', icon: ChefHat },
                      { label: 'Taken', value: '12', icon: CheckSquare },
                      { label: 'Boodschappen', value: '8', icon: ShoppingCart },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <stat.icon className="w-5 h-5 text-[#4A90A4] mx-auto mb-1" />
                        <p className="text-2xl font-bold text-[#2D3436]">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -top-6 right-0 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Taak voltooid!</p>
                      <p className="text-xs text-gray-500">Boodschappen gedaan</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
                  className="absolute -bottom-6 left-0 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#4A90A4]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">3 gezinsleden</p>
                      <p className="text-xs text-gray-500">Actief deze week</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile: Simplified visual */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:hidden"
            >
              <div className="bg-gradient-to-br from-[#4A90A4]/5 to-[#7CB342]/5 rounded-3xl p-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {['🍽️', '✅', '🛒'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                      className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-gray-600 text-sm">
                  Alles voor je gezin in één app
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features - Desktop: Full width, Mobile: Stacked */}
      <section className="py-20 lg:py-32 bg-gray-50/50">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-20"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#2D3436] mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Geen gedoe meer met losse apps en briefjes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Calendar,
                title: 'Maaltijdplanning',
                description: 'Plan je week in minuten. Automatische boodschappenlijst en gezonde variatie.',
                color: 'from-[#4A90A4] to-[#5BA0B4]',
                features: ['Weekoverzicht', 'Automatische lijst', 'Gezonde recepten'],
              },
              {
                icon: CheckSquare,
                title: 'Gezinstaken',
                description: 'Wie doet wat? Verdeel taken eerlijk en houd overzicht.',
                color: 'from-[#7CB342] to-[#8CC352]',
                features: ['Toewijzen', 'Herhalend', 'Herinneringen'],
              },
              {
                icon: ShoppingCart,
                title: 'Boodschappen',
                description: 'Slimme lijst gebaseerd op je weekplanning.',
                color: 'from-[#E17055] to-[#F18065]',
                features: ['Per winkel', 'Delen', 'Afvinken'],
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#2D3436] mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4A90A4]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Full width */}
      <section className="py-20 lg:py-32">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2D3436] mb-4">
              Duizenden gezinnen gebruiken Rut
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah', role: 'Moeder van 2', text: 'Eindelijk overzicht in ons drukke gezin!' },
              { name: 'Mark', role: 'Vader', text: 'De boodschappenlijst is een gamechanger.' },
              { name: 'Lisa', role: 'Alleengaand', text: 'Ook voor mijzelf helpt het enorm.' },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4A90A4] rounded-full flex items-center justify-center text-white font-medium">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-[#4A90A4] to-[#3a7a8c] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        </div>
        
        <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Start vandaag nog
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Gratis gebruiken. Geen creditcard nodig. Binnen 2 minuten aan de slag.
            </p>
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#4A90A4] rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Maak gratis account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4A90A4] to-[#7CB342] rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Rut</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Rut App. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
