import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Settings, Check, Clock, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Atleta {
  id: string;
  nome_completo: string;
  whatsapp: string;
  cpf: string;
}

interface Dupla {
  id: string;
  atleta_1: Atleta;
  atleta_2: Atleta;
}

interface Inscricao {
  id: string;
  categoria: string;
  status: string;
  created_at: string;
  valor_inscricao: number;
  duplas: Dupla;
}

export const AdminDashboard: React.FC = () => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInscricoes = async () => {
    setLoading(true);
    // Buscando as inscrições e os dados aninhados
    const { data, error } = await supabase
      .from('inscricoes')
      .select(`
        id, categoria, status, created_at, valor_inscricao,
        duplas (
          id,
          atleta_1:atletas!duplas_atleta_1_id_fkey(id, nome_completo, whatsapp, cpf),
          atleta_2:atletas!duplas_atleta_2_id_fkey(id, nome_completo, whatsapp, cpf)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar inscrições:', error);
    } else {
      setInscricoes(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const togglePaymentStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDENTE' ? 'PAGO' : 'PENDENTE';
    const { error } = await supabase
      .from('inscricoes')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pagamento.');
    } else {
      setInscricoes(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status: newStatus } : sub
      ));
    }
  };

  const formatCategoria = (cat: string) => {
    return cat.replace(/_/g, ' ').replace('MASC', 'MASCULINO');
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black p-4 md:p-10">
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-brand-surface-light pb-6">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Settings className="w-8 h-8 text-brand-metallic" /> LFH Admin
            </h1>
            <p className="text-brand-metallic text-sm tracking-widest uppercase font-semibold mt-2">
              Gestão de Inscrições
            </p>
          </div>
          
          <Link to="/" className="px-6 py-2 border border-brand-surface-light text-brand-gray text-sm hover:text-brand-white hover:border-brand-gray transition-colors flex items-center gap-2 font-bold uppercase tracking-widest">
            <LinkIcon className="w-4 h-4" /> Ver Site
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-brand-metallic animate-pulse">Carregando inscrições...</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-surface border border-brand-surface-light overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px] border-collapse">
                <thead className="bg-brand-surface-light/50 border-b border-brand-surface-light text-brand-gray uppercase tracking-wider text-xs font-bold">
                  <tr>
                    <th className="py-4 px-6">Categoria</th>
                    <th className="py-4 px-6">Atleta 1 (Semente)</th>
                    <th className="py-4 px-6">Atleta 2</th>
                    <th className="py-4 px-6 text-center">Pagamento</th>
                    <th className="py-4 px-6 text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-surface-light">
                  {inscricoes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-brand-metallic">Nenhuma inscrição encontrada na edição.</td>
                    </tr>
                  ) : inscricoes.map((sub) => (
                    <tr key={sub.id} className="hover:bg-brand-surface-light/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold">{formatCategoria(sub.categoria)}</div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="font-medium text-brand-white">{sub.duplas?.atleta_1?.nome_completo}</div>
                        <div className="text-brand-gray font-mono text-xs">{sub.duplas?.atleta_1?.whatsapp}</div>
                        <div className="text-brand-gray font-mono text-[10px]">CPF: {sub.duplas?.atleta_1?.cpf}</div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="font-medium text-brand-white">{sub.duplas?.atleta_2?.nome_completo}</div>
                        <div className="text-brand-gray font-mono text-xs">{sub.duplas?.atleta_2?.whatsapp}</div>
                        <div className="text-brand-gray font-mono text-[10px]">CPF: {sub.duplas?.atleta_2?.cpf}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => togglePaymentStatus(sub.id, sub.status)}
                          className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors ${
                            sub.status === 'PAGO' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20'
                          }`}
                        >
                          {sub.status === 'PAGO' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {sub.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right text-brand-gray text-xs font-mono">
                        {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
