'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, ArrowRight, Sparkles, Calendar, Users, ShoppingCart, CheckSquare, Star, Zap, Heart, Play } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8faf9] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4A90A4] rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rut</span>
            </div>
            <Link
              href="/auth?mode=login"
              className="text-gray-600 font-medium hover:text-[#4A90A4] transition-colors"
            >
              Inloggen →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Light, colorful, full bleed */}
      <section className="relative min-h-screen pt-16 overflow-hidden">
        {/* Soft background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#4A90A4]/10 via-[#7CB342]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#E17055]/10 via-[#FDCB6E]/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative w-full px-6 lg:px-12 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A90A4]/10 rounded-full text-[#4A90A4] text-sm font-medium mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  Nieuw: Slimme weekplanning
                </motion.div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[0.95] mb-6">
                  Je gezin,
                  <br />
                  <span className="text-[#4A90A4]">georganiseerd</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-md">
                  Plan maaltijden, verdeel taken en houd je hele huishouden op één plek.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <Link
                    href="/auth?mode=register"
                    className="inline-flex items-center px-8 py-4 bg-[#4A90A4] text-white rounded-2xl font-semibold hover:bg-[#3a7a8c] transition-colors"
                  >
                    Start gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <button className="inline-flex items-center px-8 py-4 text-gray-700 hover:text-[#4A90A4] transition-colors">
                    <Play className="w-5 h-5 mr-2" />
                    Bekijk demo
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {['#4A90A4', '#7CB342', '#E17055', '#FDCB6E'].map((c, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">4.9/5 van 2.000+ gezinnen</p>
                  </div>
                </div>
              </motion.div>

              {/* Right - App preview with colorful cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-400">Week 12, 2025</p>
                      <h3 className="text-2xl font-bold text-gray-900">Deze week</h3>
                    </div>
                    <div className="flex -space-x-2">
                      {['#4A90A4', '#7CB342', '#E17055'].map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Colorful meal cards */}
                  <div className="space-y-3">
                    {[
                      { day: 'Ma', meal: 'Pasta Carbonara', color: 'bg-[#FFE4D6]', text: 'text-[#E17055]' },
                      { day: 'Di', meal: 'Gegrilde zalm', color: 'bg-[#E8F4F8]', text: 'text-[#4A90A4]' },
                      { day: 'Wo', meal: 'Stamppot', color: 'bg-[#E8F5E9]', text: 'text-[#7CB342]' },
                      { day: 'Do', meal: 'Thaise curry', color: 'bg-[#FFF8E1]', text: 'text-[#F9A825]' },
                      { day: 'Vr', meal: 'Pizza night', color: 'bg-[#FCE4EC]', text: 'text-[#E91E63]' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`flex items-center gap-4 p-4 ${item.color} rounded-2xl`}
                      >
                        <span className={`font-bold ${item.text} w-8`}>{item.day}</span>
                        <span className="text-gray-700 font-medium flex-1">{item.meal}</span>
                        <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                          <Zap className={`w-4 h-4 ${item.text}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating notification */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Taak voltooid!</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Colorful cards */}
      <section className="relative py-24 overflow-hidden">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
                Alles wat je nodig hebt
              </h2>
              <p className="text-xl text-gray-600">Geen gedoe meer met losse apps</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Calendar, title: 'Maaltijdplanning', desc: 'Plan je week in minuten', color: 'bg-[#E8F4F8]', iconColor: 'text-[#4A90A4]' },
                { icon: CheckSquare, title: 'Gezinstaken', desc: 'Wie doet wat?', color: 'bg-[#E8F5E9]', iconColor: 'text-[#7CB342]' },
                { icon: ShoppingCart, title: 'Boodschappen', desc: 'Slimme lijst', color: 'bg-[#FFF8E1]', iconColor: 'text-[#F9A825]' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`${f.color} rounded-3xl p-8`}
                >
                  <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                    <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 text-lg">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Soft gradient */}
      <section className="relative py-24 bg-gradient-to-b from-[#f8faf9] to-white">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Duizenden gezinnen
                <br />
                <span className="text-gray-400">gebruiken Rut</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: 'Sarah', r: 'Moeder van 2', t: 'Eindelijk overzicht in ons drukke gezin!' },
                { n: 'Mark', r: 'Vader', t: 'De boodschappenlijst genereert zichzelf.' },
                { n: 'Lisa', r: 'Alleengaand', t: 'Ook voor mijzelf helpt het enorm.' },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6">"{r.t}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4A90A4] to-[#7CB342] rounded-full flex items-center justify-center text-white font-medium">
                      {r.n[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{r.n}</p>
                      <p className="text-sm text-gray-500">{r.r}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Gradient */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A90A4] to-[#7CB342]" />
        <div className="relative w-full px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Start vandaag
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Gratis. Geen creditcard. Binnen 2 minuten.
            </p>
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
            >
              Maak gratis account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4A90A4] rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Rut</span>
            </div>
            <p className="text-gray-400 text-sm">© 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
