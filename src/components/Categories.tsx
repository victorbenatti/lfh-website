import React from 'react';
import { motion } from 'framer-motion';

export const Categories: React.FC = () => {
  const categories = [
    {
      title: 'Masculino',
      levels: ['Estreante', 'Iniciante', 'Intermediário', 'A+B'],
    },
    {
      title: 'Misto',
      levels: ['Estreante', 'Iniciante'],
    },
    {
      title: 'Feminino',
      levels: ['Livre'],
    }
  ];

  return (
    <section className="py-32 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Escolha sua Categoria</h2>
          <p className="text-brand-metallic text-lg max-w-2xl mx-auto">
            Vagas limitadas. Garanta seu lugar na arena e mostre seu jogo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="bg-brand-surface border border-brand-surface-light hover:border-brand-gray transition-colors"
            >
              <div className="p-6 border-b border-brand-surface-light bg-brand-surface-light/30">
                <h3 className="text-2xl font-black uppercase tracking-widest text-center">{cat.title}</h3>
              </div>
              <ul className="p-6 space-y-4">
                {cat.levels.map((level) => (
                  <li key={level} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 bg-brand-gray rounded-full group-hover:bg-brand-white transition-colors" />
                    <span className="text-brand-metallic group-hover:text-brand-white transition-colors text-lg font-medium">{level}</span>
                  </li>
                ))}
              </ul>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
