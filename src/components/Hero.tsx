import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden z-10">
      
      {/* Visual glowing geometric element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] border-[1px] border-brand-surface rounded-full opacity-30 animate-[spin_60s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] border-[1px] border-brand-gray/20 rounded-full opacity-40 animate-[spin_40s_linear_infinite_reverse]" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex items-center gap-3 bg-brand-surface/80 backdrop-blur-sm border border-brand-surface-light px-4 py-2 rounded-full"
        >
          <Trophy className="w-5 h-5 text-brand-metallic" />
          <span className="text-sm md:text-base text-brand-metallic font-medium tracking-wide uppercase">Edição 1 • Hortolândia</span>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src="/images/LFH-Logo-Vetorizado.svg"
          alt="LFH Logo"
          className="w-48 md:w-64 lg:w-80 mb-2 mx-auto relative z-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-white via-brand-white to-brand-gray tracking-tighter leading-tight !mt-0 mb-4 relative z-20"
        >
          LIGA DE FUTEVÔLEI
          <br />
          <span className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text bg-gradient-to-r from-brand-metallic to-brand-gray">DE HORTOLÂNDIA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-brand-metallic font-light tracking-wide mb-10"
        >
          A revolução da areia chegou.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="text-left border-l-2 border-brand-surface-light pl-4 py-1">
            <p className="text-brand-gray text-xs uppercase tracking-widest font-semibold mb-1">Data do Evento</p>
            <p className="text-brand-white text-lg font-bold">04 e 05 de Julho, 2026</p>
          </div>
          
          <Link
            to="/inscricao"
            className="group relative w-full sm:w-auto px-8 py-4 bg-brand-white text-brand-black font-bold uppercase tracking-widest text-sm rounded-none overflow-hidden block text-center"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Inscrever-se Agora
            </span>
            <div className="absolute inset-0 bg-brand-metallic transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </Link>
          
          <Link 
            to="/ranking" 
            className="w-full sm:w-auto text-center px-8 py-4 bg-transparent border border-brand-surface-light text-brand-white font-bold uppercase tracking-widest text-sm hover:border-brand-gray hover:bg-brand-surface transition-colors"
          >
            Ver Ranking
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="text-brand-gray w-8 h-8 opacity-50" />
      </motion.div>
    </section>
  );
};
