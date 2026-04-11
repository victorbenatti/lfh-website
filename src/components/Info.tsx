import React from 'react';
import { motion } from 'framer-motion';
import { Sun, MonitorPlay, Star } from 'lucide-react';

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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-10 border border-brand-surface-light group hover:border-brand-gray transition-colors flex flex-col items-center text-center">
            <div className="bg-brand-surface-light w-16 h-16 flex items-center justify-center mb-6 text-brand-white group-hover:scale-110 transition-transform rounded-full">
              <Sun className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">5 Quadras</h3>
            <p className="text-brand-metallic text-base leading-relaxed">
              Quadras de areia de <strong className="text-brand-white font-medium">alta qualidade</strong>, perfeitamente iluminadas para <strong className="text-brand-white font-medium">jogos diurnos e noturnos</strong>.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-10 border border-brand-surface-light group hover:border-brand-gray transition-colors flex flex-col items-center text-center">
            <div className="bg-brand-surface-light w-16 h-16 flex items-center justify-center mb-6 text-brand-white group-hover:scale-110 transition-transform rounded-full">
              <MonitorPlay className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Telão de LED</h3>
            <p className="text-brand-metallic text-base leading-relaxed">
              Acompanhe as chaves, <strong className="text-brand-white font-medium">pontuações em tempo real</strong> e replays dos <strong className="text-brand-white font-medium">melhores momentos</strong>.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-brand-surface p-10 border border-brand-surface-light group hover:border-brand-gray transition-colors flex flex-col items-center text-center">
            <div className="bg-brand-surface-light w-16 h-16 flex items-center justify-center mb-6 text-brand-white group-hover:scale-110 transition-transform rounded-full">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ambiente Premium</h3>
            <p className="text-brand-metallic text-base leading-relaxed">
              Infraestrutura completa com <strong className="text-brand-white font-medium">bares, banheiros confortáveis</strong> e ampla área de descanso para espectadores e atletas.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
