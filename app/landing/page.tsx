'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, ArrowRight, Sparkles, Calendar, Users, ShoppingCart, CheckSquare, Star, Zap, Play } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7F4] via-[#F8FBFA] to-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <ChefHat className="w-6 h-6 text-[#4A90A4]" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Rut</span>
            </div>
            <Link
              href="/auth?mode=login"
              className="text-gray-700 font-medium hover:text-[#4A90A4] transition-colors"
            >
              Inloggen →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-[#4A90A4]/20 via-[#7CB342]/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#E17055]/20 via-[#FDCB6E]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative w-full px-6 lg:px-12 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#4A90A4] text-sm font-medium mb-6 shadow-sm"
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
                    className="inline-flex items-center px-8 py-4 bg-[#4A90A4] text-white rounded-2xl font-semibold hover:bg-[#3a7a8c] transition-all hover:scale-105"
                  >
                    Start gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <button className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all">
                    <Play className="w-5 h-5 mr-2 text-[#4A90A4]" />
                    Bekijk demo
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {['#4A90A4', '#7CB342', '#E17055', '#FDCB6E'].map((c, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="w-10 h-10 rounded-full border-2 border-white" 
                        style={{ backgroundColor: c }} 
                      />
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

              {/* Right - App preview */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl shadow-xl p-6 lg:p-8"
                >
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

                  <div className="space-y-3">
                    {[
                      { day: 'Ma', meal: 'Pasta Carbonara', color: 'bg-[#FFE4D6]', accent: '#E17055' },
                      { day: 'Di', meal: 'Gegrilde zalm', color: 'bg-[#E8F4F8]', accent: '#4A90A4' },
                      { day: 'Wo', meal: 'Stamppot', color: 'bg-[#E8F5E9]', accent: '#7CB342' },
                      { day: 'Do', meal: 'Thaise curry', color: 'bg-[#FFF8E1]', accent: '#F9A825' },
                      { day: 'Vr', meal: 'Pizza night', color: 'bg-[#FCE4EC]', accent: '#E91E63' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className={`flex items-center gap-4 p-4 ${item.color} rounded-2xl cursor-pointer transition-all`}
                      >
                        <span className="font-bold text-gray-700 w-8">{item.day}</span>
                        <span className="text-gray-700 font-medium flex-1">{item.meal}</span>
                        <motion.div 
                          whileHover={{ rotate: 180 }}
                          className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
                        >
                          <Zap className="w-4 h-4" style={{ color: item.accent }} />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating card */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <CheckSquare className="w-6 h-6 text-green-600" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-gray-900">Taak voltooid!</p>
                      <p className="text-sm text-gray-500">Boodschappen gedaan</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4"
              >
                Alles wat je nodig hebt
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600"
              >
                Geen gedoe meer met losse apps
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Calendar, title: 'Maaltijdplanning', desc: 'Plan je week in minuten', color: 'bg-[#E8F4F8]', iconColor: 'text-[#4A90A4]', delay: 0 },
                { icon: CheckSquare, title: 'Gezinstaken', desc: 'Wie doet wat?', color: 'bg-[#E8F5E9]', iconColor: 'text-[#7CB342]', delay: 0.1 },
                { icon: ShoppingCart, title: 'Boodschappen', desc: 'Slimme lijst', color: 'bg-[#FFF8E1]', iconColor: 'text-[#F9A825]', delay: 0.2 },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: f.delay }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`${f.color} rounded-3xl p-8 cursor-pointer`}
                >
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                  >
                    <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 text-lg">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24">
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
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + s * 0.05 }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
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

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-gradient-to-r from-[#4A90A4] to-[#7CB342]" 
        />
        <div className="relative w-full px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
            >
              Start vandaag
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 mb-8"
            >
              Gratis. Geen creditcard. Binnen 2 minuten.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/auth?mode=register"
                className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-xl"
              >
                Maak gratis account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <ChefHat className="w-6 h-6 text-[#4A90A4]" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rut</span>
            </div>
            <p className="text-gray-500 text-sm">© 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
