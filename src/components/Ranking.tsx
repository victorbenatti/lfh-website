import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface RankingEntry {
  atleta_1: string;
  atleta_2: string;
  total_pontos: number;
}

export const Ranking: React.FC = () => {
  const [rankingData, setRankingData] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // 1. Pega apenas os IDs das duplas que pagaram
        const { data: paidInscricoes, error: paidError } = await supabase
          .from('inscricoes')
          .select('dupla_id')
          .eq('status', 'PAGO');
          
        if (paidError) throw paidError;
        
        const paidIds = (paidInscricoes || []).map(p => p.dupla_id);

        // Se ninguém pagou ainda, retorna vazio.
        if (paidIds.length === 0) {
          setRankingData([]);
          return;
        }

        // 2. Busca o ranking com IN() usando a array gerada
        const { data, error } = await supabase
          .from('ranking_anual')
          .select('*')
          .in('dupla_id', paidIds)
          .order('total_pontos', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRankingData(data || []);
      } catch (err) {
        console.error('Erro ao carregar ranking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <section className="py-32 px-4 relative z-10 bg-brand-surface/30 border-y border-brand-surface-light">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 text-brand-gray">
              <Trophy className="w-6 h-6" />
              <span className="uppercase tracking-widest font-semibold text-sm">Circuito 2026</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Ranking Anual</h2>
          </div>
          <p className="text-brand-metallic text-sm md:text-right max-w-xs">
            Acompanhe a corrida pelo título. Os melhores do ano se enfrentam no Finals.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-brand-surface border border-brand-surface-light rounded-sm overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center text-brand-metallic">Carregando ranking...</div>
          ) : rankingData.length > 0 ? (
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
                  {rankingData.map((item, idx) => {
                    const pos = idx + 1;
                    return (
                      <motion.tr 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="border-b border-brand-surface-light hover:bg-brand-surface-light/30 transition-colors"
                      >
                        <td className="py-5 px-6 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${pos <= 3 ? 'bg-brand-white text-brand-black' : 'bg-brand-surface-light text-brand-metallic'}`}>
                            {pos}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-medium text-brand-white text-lg">{item.atleta_1} & {item.atleta_2}</td>
                        <td className="py-5 px-6 font-mono text-right text-brand-metallic">
                          <span className="text-brand-white font-bold">{item.total_pontos}</span> pts
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-brand-surface-light rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-brand-metallic" />
              </div>
              <p className="text-brand-metallic max-w-md mx-auto">
                Nenhuma dupla inscrita ainda. Seja o primeiro a liderar o Ranking!
              </p>
            </div>
          )}
          
          <div className="p-4 bg-brand-surface-light/20 text-center border-t border-brand-surface-light">
            <Link to="/ranking" className="text-brand-gray hover:text-brand-white text-sm font-semibold uppercase tracking-wider transition-colors inline-block pb-1 border-b border-transparent hover:border-brand-white">
              Ver Ranking Completo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

