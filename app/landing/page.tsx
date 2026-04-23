'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, ArrowRight, Sparkles, Calendar, Users, ShoppingCart, CheckSquare, Star, Zap, Heart, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation - Full width */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between h-16 max-w-[1920px] mx-auto">
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

      {/* Hero - Full bleed, asymmetric */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Full-width background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4A90A4]/5 via-transparent to-[#7CB342]/5" />
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-20 right-0 w-[800px] h-[800px] bg-[#4A90A4]/10 rounded-full blur-3xl"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7CB342]/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-4rem)]">
              {/* Text - Takes 5 columns */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 text-center lg:text-left"
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

                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#2D3436] leading-[0.95] mb-6">
                  Je gezin,
                  <br />
                  <span className="bg-gradient-to-r from-[#4A90A4] to-[#7CB342] bg-clip-text text-transparent">
                    georganiseerd
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
                  Plan maaltijden, verdeel taken en houd je hele huishouden op één plek. 
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/auth?mode=register"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#4A90A4] to-[#3a7a8c] text-white rounded-2xl font-semibold shadow-lg shadow-[#4A90A4]/25 hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Start gratis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="inline-flex items-center justify-center px-8 py-4 text-gray-700 hover:text-[#4A90A4] transition-colors">
                    <Play className="w-5 h-5 mr-2" />
                    Bekijk demo
                  </button>
                </div>

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

              {/* Visual - Takes 7 columns, extends to edge */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block lg:col-span-7 relative"
              >
                <div className="relative pl-8 xl:pl-16">
                  {/* Main mockup - larger, extends right */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 xl:p-8 border border-gray-100 w-full max-w-2xl xl:max-w-3xl ml-auto"
                  >
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Week 12, 2025</p>
                        <h3 className="text-2xl font-bold text-[#2D3436]">Deze week</h3>
                      </div>
                      <div className="flex -space-x-2">
                        {['#4A90A4', '#7CB342', '#E17055', '#FDCB6E'].map((color, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>

                    {/* Days - horizontal layout */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { day: 'Ma', meal: 'Pasta Carbonara', emoji: '🍝', color: 'bg-orange-50' },
                        { day: 'Di', meal: 'Gegrilde zalm', emoji: '🐟', color: 'bg-blue-50' },
                        { day: 'Wo', meal: 'Stamppot', emoji: '🥔', color: 'bg-green-50' },
                        { day: 'Do', meal: 'Thaise curry', emoji: '🍛', color: 'bg-yellow-50' },
                        { day: 'Vr', meal: 'Pizza night', emoji: '🍕', color: 'bg-red-50' },
                        { day: 'Za', meal: 'Gourmet', emoji: '🥩', color: 'bg-purple-50' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className={`flex items-center gap-3 p-3 ${item.color} rounded-xl`}
                        >
                          <span className="text-xl">{item.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">{item.day}</p>
                            <p className="font-medium text-gray-800 text-sm truncate">{item.meal}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                      {[
                        { label: 'Maaltijden', value: '21', icon: ChefHat },
                        { label: 'Taken', value: '12', icon: CheckSquare },
                        { label: 'Boodschappen', value: '8', icon: ShoppingCart },
                        { label: 'Gezinsleden', value: '4', icon: Users },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <stat.icon className="w-5 h-5 text-[#4A90A4] mx-auto mb-1" />
                          <p className="text-xl font-bold text-[#2D3436]">{stat.value}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Floating cards - positioned absolutely */}
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute top-10 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckSquare className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Taak voltooid!</p>
                        <p className="text-sm text-gray-500">Boodschappen gedaan</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 6, delay: 1 }}
                    className="absolute bottom-20 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-[#4A90A4]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">4 gezinsleden</p>
                        <p className="text-sm text-gray-500">Actief deze week</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                    className="absolute -bottom-4 right-20 bg-gradient-to-r from-[#4A90A4] to-[#7CB342] rounded-2xl shadow-xl p-4 text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium">Slimme planning</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Mobile visual */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:hidden"
              >
                <div className="bg-gradient-to-br from-[#4A90A4]/10 to-[#7CB342]/10 rounded-3xl p-8">
                  <div className="flex items-center justify-center gap-6">
                    {['🍽️', '✅', '🛒', '👨‍👩‍👧‍👦'].map((emoji, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                        className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl"
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Full bleed with gradient background */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        
        <div className="relative w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-[1920px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-[#2D3436] mb-4">
                Alles wat je nodig hebt
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                },
                {
                  icon: CheckSquare,
                  title: 'Gezinstaken',
                  description: 'Wie doet wat? Verdeel taken eerlijk en houd overzicht.',
                  color: 'from-[#7CB342] to-[#8CC352]',
                },
                {
                  icon: ShoppingCart,
                  title: 'Boodschappen',
                  description: 'Slimme lijst gebaseerd op je weekplanning.',
                  color: 'from-[#E17055] to-[#F18065]',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2D3436] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Full width dark section */}
      <section className="relative py-24 lg:py-32 bg-[#1a1a2e] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-[1920px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Duizenden gezinnen gebruiken Rut
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { name: 'Sarah', role: 'Moeder van 2', text: 'Eindelijk overzicht in ons drukke gezin! De weekplanning is een gamechanger.' },
                { name: 'Mark', role: 'Vader', text: 'De boodschappenlijst genereert zichzelf. Scheelt me zoveel tijd.' },
                { name: 'Lisa', role: 'Alleengaand', text: 'Ook voor mijzelf helpt het enorm om gestructureerd te eten.' },
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-4 leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4A90A4] to-[#7CB342] rounded-full flex items-center justify-center text-white font-medium">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{review.name}</p>
                      <p className="text-sm text-white/60">{review.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full bleed gradient */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A90A4] via-[#4A90A4] to-[#7CB342]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-[1920px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Start vandaag nog
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Gratis gebruiken. Geen creditcard nodig. Binnen 2 minuten aan de slag.
              </p>
              <Link
                href="/auth?mode=register"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#4A90A4] rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
              >
                Maak gratis account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Full width */}
      <footer className="bg-gray-900 py-12">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4A90A4] to-[#7CB342] rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Rut</span>
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
