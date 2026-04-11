import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export const Location: React.FC = () => {
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
          <div className="flex items-center justify-center gap-3 mb-4 text-brand-gray">
            <MapPin className="w-6 h-6" />
            <span className="uppercase tracking-widest font-semibold text-sm">Localização</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">A Arena</h2>
          <p className="text-brand-metallic text-lg max-w-2xl mx-auto">
            Todos os jogos acontecerão na <span className="text-brand-white font-semibold">Koa House Beach Sports</span> em Hortolândia. Infraestrutura impecável, quadras premium e clima de alto nível.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-brand-surface border border-brand-surface-light p-2 md:p-3"
        >
          <div className="relative w-full h-[400px] md:h-[500px] bg-brand-black overflow-hidden border border-brand-surface-light/50">
            {/* CSS Filter to make normal Google Maps look Dark Mode naturally */}
            <iframe
              src="https://maps.google.com/maps?q=Koa%20House%20Beach%20Sports%20Hortolandia&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                /* Magic filter for dark mode: inverts colors and reverts hue so grass is green/blue and water is dark */
                filter: 'invert(100%) hue-rotate(180deg) contrast(1.1) brightness(0.8) grayscale(0.2)' 
              }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Koa House Beach Sports"
            ></iframe>
          </div>
        </motion.div>
        
        {/* Adress Bar Details below Map */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="mt-6 flex flex-col md:flex-row justify-between items-center bg-brand-surface border border-brand-surface-light p-6"
        >
           <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-brand-white font-bold text-lg">Koa House Beach Sports</p>
              <p className="text-brand-metallic text-sm">Hortolândia - SP</p>
           </div>
           <a 
             href="https://www.google.com/maps/search/?api=1&query=Koa+House+Beach+Sports+Hortolandia" 
             target="_blank" 
             rel="noopener noreferrer"
             className="px-6 py-3 border border-brand-surface-light text-brand-white text-sm uppercase tracking-widest font-bold hover:bg-brand-white hover:text-brand-black transition-colors"
           >
             Traçar Rota
           </a>
        </motion.div>

      </div>
    </section>
  );
};
