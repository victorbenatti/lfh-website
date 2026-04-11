import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../components/ParticleBackground';
import { Footer } from '../components/Footer';
import { Trophy, ArrowLeft, Info as InfoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_RANKING = [
  { pos: 1, name: 'Lucas & Matheus', points: 1000 },
  { pos: 2, name: 'Rafael & João', points: 800 },
  { pos: 3, name: 'Pedro & Thiago', points: 650 },
  { pos: 4, name: 'Gabriel & Felipe', points: 500 },
  { pos: 5, name: 'Bruno & Diego', points: 100 },
  { pos: 6, name: 'Caio & Henrique', points: 100 },
];

const CATEGORIES = [
  { name: 'Masculino', levels: ['Estreante', 'Iniciante', 'Intermediário', 'A+B'] },
  { name: 'Misto', levels: ['Estreante', 'Iniciante'] },
  { name: 'Feminino', levels: ['Livre'] },
];

export const RankingPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('Masculino');
  const [selectedLevel, setSelectedLevel] = useState('A+B');

  const currentLevels = CATEGORIES.find(c => c.name === selectedCat)?.levels || [];

  const handleCatChange = (cat: string) => {
    setSelectedCat(cat);
    setSelectedLevel(CATEGORIES.find(c => c.name === cat)?.levels[0] || '');
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black flex flex-col">
      <ParticleBackground />
      
      <main className="relative flex-1 z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="relative flex flex-col md:flex-row items-center mb-16 gap-8 md:gap-0">
            <div className="w-full md:w-1/3 flex justify-start">
              <Link to="/" className="text-brand-gray hover:text-brand-white flex items-center gap-2 transition-colors uppercase tracking-widest text-xs font-bold">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início
              </Link>
            </div>
            
            <div className="w-full md:w-1/3 flex justify-center">
              <Link to="/">
                <img
                  src="/images/LFH-Logo-Vetorizado.svg"
                  alt="LFH Logo"
                  className="w-32 md:w-40 -my-4 lg:-my-8 origin-center"
                />
              </Link>
            </div>
            
            <div className="hidden md:block w-full md:w-1/3" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-brand-gray">
              <Trophy className="w-6 h-6 border-brand-surface-light" />
              <span className="uppercase tracking-widest font-semibold text-sm">Circuito Anual</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Ranking Completo</h1>
            <p className="text-brand-metallic text-lg max-w-2xl mx-auto">
              Acompanhe a pontuação de todos os atletas. O desempenho de cada etapa define quem chegará ao Finals.
            </p>
          </motion.div>

          {/* Points Rules Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-brand-surface border border-brand-surface-light p-6 md:p-8 mb-16 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-shrink-0 bg-brand-surface-light p-4 rounded-full">
              <InfoIcon className="w-8 h-8 text-brand-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-widest">Sistema de Pontuação</h3>
              <p className="text-brand-metallic mb-4 text-sm md:text-base leading-relaxed">
                Nossa liga recompensa tanto a participação quanto a alta performance. Apenas por entrar em quadra, o atleta já garante pontos valiosos.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="border border-brand-surface-light p-3 text-center">
                  <div className="font-bold text-brand-white text-lg">100</div>
                  <div className="text-brand-gray text-xs uppercase">Por Jogar</div>
                </div>
                <div className="border border-brand-surface-light p-3 text-center bg-brand-surface-light/30">
                  <div className="font-bold text-brand-white text-lg">500</div>
                  <div className="text-brand-gray text-xs uppercase">4º Lugar</div>
                </div>
                <div className="border border-brand-surface-light p-3 text-center bg-brand-surface-light/50">
                  <div className="font-bold text-brand-white text-lg">650</div>
                  <div className="text-brand-gray text-xs uppercase">3º Lugar</div>
                </div>
                <div className="border border-brand-surface-light p-3 text-center bg-brand-surface-light/80">
                  <div className="font-bold text-brand-white text-lg">800</div>
                  <div className="text-brand-gray text-xs uppercase">2º Lugar</div>
                </div>
                <div className="border-t-2 border-brand-white bg-brand-white text-brand-black p-3 text-center">
                  <div className="font-black text-lg">1.000</div>
                  <div className="text-xs uppercase font-bold">1º Lugar</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => handleCatChange(cat.name)}
                  className={`px-6 py-2 border font-bold uppercase tracking-widest text-sm transition-colors ${
                    selectedCat === cat.name 
                    ? 'bg-brand-white text-brand-black border-brand-white' 
                    : 'border-brand-surface-light text-brand-metallic hover:text-brand-white hover:border-brand-gray bg-brand-surface'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {currentLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-5 py-2 border font-semibold tracking-wide text-sm transition-colors ${
                    selectedLevel === level
                    ? 'border-brand-gray text-brand-white bg-brand-surface-light'
                    : 'border-transparent text-brand-gray hover:text-brand-white bg-brand-surface/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <motion.div 
             key={selectedCat + selectedLevel}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-brand-surface border border-brand-surface-light rounded-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-brand-surface-light/50 border-b border-brand-surface-light">
                    <th className="py-4 px-6 text-brand-gray font-semibold text-sm uppercase tracking-wider w-24 text-center">Pos</th>
                    <th className="py-4 px-6 text-brand-gray font-semibold text-sm uppercase tracking-wider">Atleta / Dupla</th>
                    <th className="py-4 px-6 text-brand-gray font-semibold text-sm uppercase tracking-wider text-right">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RANKING.map((item, idx) => (
                    <tr 
                      key={idx}
                      className="border-b border-brand-surface-light hover:bg-brand-surface-light/30 transition-colors"
                    >
                      <td className="py-5 px-6 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${item.pos === 1 ? 'bg-brand-white text-brand-black ring-4 ring-brand-white/20' : item.pos <= 3 ? 'bg-brand-surface-light text-brand-white' : 'bg-transparent text-brand-metallic'}`}>
                          {item.pos}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-medium text-brand-white text-lg">{item.name}</td>
                      <td className="py-5 px-6 font-mono text-right text-brand-metallic">
                        <span className="text-brand-white font-bold">{item.points}</span> pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};
