import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '../components/ParticleBackground';
import { Hero } from '../components/Hero';
import { Info } from '../components/Info';
import { Categories } from '../components/Categories';
import { Ranking } from '../components/Ranking';
import { Location } from '../components/Location';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Exibe o botão após 400px de scroll (aprox. quando o usuário passa do Hero)
      if (window.scrollY > 400) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black relative">
      <ParticleBackground />
      
      <main className="relative flex flex-col">
        <Hero />
        <Info />
        <Categories />
        <Ranking />
        <Location />
      </main>

      <Footer />

      {/* Sticky CTA Button */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
          >
            <Link
              to="/inscricao"
              className="group relative w-full px-8 py-4 bg-brand-white text-brand-black font-black uppercase tracking-widest text-sm text-center shadow-[0_0_40px_rgba(255,255,255,0.15)] flex justify-center items-center overflow-hidden border border-brand-white"
            >
              <span className="relative z-10">Garantir Inscrição</span>
              <div className="absolute inset-0 bg-brand-metallic transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
