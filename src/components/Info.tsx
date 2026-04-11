import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, ShieldCheck, Apple, Star, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    title: 'Fotógrafo Profissional',
    desc: 'Cobertura fotográfica premium de todos os jogos. Tenha cliques impecáveis de cada lance seu garantidos na areia.'
  },
  {
    icon: ShieldCheck,
    title: 'Arbitagram VIP',
    desc: 'Arbitragem profissional em todos os jogos com sistema de pontos ao vivo para não perder nenhum detalhe do placar.'
  },
  {
    icon: Star,
    title: 'Estrutura de Ponta',
    desc: 'Obtenha a melhor experiência de jogo nas 5 quadras de areia perfeitas da Koa House, com iluminação de estádio, bar completo e lounge.'
  },
  {
    icon: Video,
    title: 'Videomaker',
    desc: 'Reels, highlights e lances de tirar o fôlego registrados por nossos profissionais de vídeo cobrindo as melhores quadras.'
  },
  {
    icon: Apple,
    title: 'Água e Frutas',
    desc: 'Mesa contínua de hidratação e nutrição à disposição de todos os atletas participantes, assegurando sua performance sempre máxima.'
  },
  {
    icon: Trophy,
    title: 'Premiação de Elite',
    desc: 'Um complexo Sistema de Ranking Anual listando seu nome e garantindo prêmios insanos para os maiores destaques de cada Etapa.'
  }
];

export const Info: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPos = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollPos / width);
    setActiveIndex(newIndex);
  };

  return (
    <section className="py-24 md:py-32 relative z-10 bg-brand-surface/30 border-y border-brand-surface-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-block px-4 py-1.5 bg-brand-surface border border-brand-surface-light text-brand-metallic text-xs font-black tracking-widest uppercase mb-4">
            Estrutura & Benefícios
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-widest">Torneio Premium</h2>
          <p className="text-brand-metallic text-lg max-w-2xl mx-auto mb-4">
            A arena está preparada para fornecer todo o suporte. Navegue e descubra o que preparamos para você e sua dupla nesta edição LFH.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group w-full focus:outline-none">
          
          {/* Track */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURES.map((feature, idx) => (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                key={feature.title} 
                className="w-full flex-shrink-0 snap-center flex justify-center py-4"
              >
                <div className="w-full md:w-[90%] lg:w-[85%] bg-brand-black border border-brand-surface-light flex flex-col md:flex-row items-center h-auto md:h-[480px] overflow-hidden group-hover/card shadow-2xl">
                   
                   {/* Left Visual Area */}
                   <div className="w-full md:w-5/12 bg-brand-surface/50 border-b md:border-b-0 md:border-r border-brand-surface-light p-12 md:p-16 h-64 md:h-full flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                      <div className="absolute top-6 left-6 text-brand-white/10 font-black text-6xl tracking-tighter">0{idx + 1}</div>
                      <feature.icon className="w-48 h-48 text-brand-white/5 absolute -right-12 -bottom-12 transform -rotate-12 group-hover/card:rotate-0 transition-transform duration-700" />
                      <feature.icon className="w-24 h-24 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                   </div>

                   {/* Right Content Area */}
                   <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center h-full text-left relative">
                      <h3 className="text-2xl md:text-4xl font-black uppercase tracking-widest mb-6 leading-tight max-w-[90%]">{feature.title}</h3>
                      <div className="w-12 h-1 bg-yellow-500 mb-6"></div>
                      <p className="text-brand-metallic sm:text-lg leading-relaxed md:leading-loose">
                        {feature.desc}
                      </p>
                   </div>
                   
                </div>
              </motion.div>
            ))}
          </div>

          {/* Absolute Navigation Overlay */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between pointer-events-none px-0 sm:px-2 md:-mx-6">
             <button 
                onClick={scrollLeft} 
                disabled={activeIndex === 0}
                className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 bg-brand-white text-brand-black flex items-center justify-center hover:bg-yellow-400 disabled:opacity-0 disabled:pointer-events-none transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-transparent"
             >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
             </button>
             <button 
                onClick={scrollRight} 
                disabled={activeIndex === FEATURES.length - 1}
                className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 bg-brand-white text-brand-black flex items-center justify-center hover:bg-yellow-400 disabled:opacity-0 disabled:pointer-events-none transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-transparent"
             >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
             </button>
          </div>
          
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {FEATURES.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1.5 transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-yellow-500' : 'w-4 bg-brand-surface-light'}`}
             />
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
};
