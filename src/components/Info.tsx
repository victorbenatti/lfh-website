import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sun, MonitorPlay, Star } from 'lucide-react';

export const Info: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-32 px-4 relative z-10 bg-brand-surface/30 border-y border-brand-surface-light">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Estrutura de Elite</h2>
          <p className="text-brand-metallic text-lg max-w-2xl mx-auto">
            Sediado na prestigiada <span className="text-brand-white font-semibold">@koahousebeachsports</span>. Preparamos uma arena completa para proporcionar a melhor experiência para atletas e espectadores.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-8 border border-brand-surface-light group hover:border-brand-gray transition-colors">
            <div className="bg-brand-surface-light w-14 h-14 flex items-center justify-center mb-6 text-brand-white group-hover:scale-110 transition-transform">
              <Sun className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">5 Quadras</h3>
            <p className="text-brand-metallic text-sm leading-relaxed">
              Quadras de areia de alta qualidade, perfeitamente iluminadas para jogos diurnos e noturnos.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-8 border border-brand-surface-light group hover:border-brand-gray transition-colors">
            <div className="bg-brand-surface-light w-14 h-14 flex items-center justify-center mb-6 text-brand-white group-hover:scale-110 transition-transform">
              <MonitorPlay className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Telão de LED</h3>
            <p className="text-brand-metallic text-sm leading-relaxed">
              Acompanhe as chaves, pontuações em tempo real e replays dos melhores momentos.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-8 border border-brand-surface-light group hover:border-brand-gray transition-colors">
            <div className="bg-brand-surface-light w-14 h-14 flex items-center justify-center mb-6 text-brand-white group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ambiente Premium</h3>
            <p className="text-brand-metallic text-sm leading-relaxed">
              Infraestrutura completa com bares, banheiros confortáveis e área de descanso para atletas.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-8 border border-brand-surface-light group hover:border-brand-gray transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/foto-1.png')] bg-cover bg-center opacity-20 grayscale mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="bg-brand-white text-brand-black w-14 h-14 flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Localização</h3>
              <p className="text-brand-white font-semibold text-sm mb-1">Koa House</p>
              <p className="text-brand-metallic text-xs uppercase tracking-wider">Hortolândia - SP</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
