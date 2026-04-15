import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ParticleBackground } from '../components/ParticleBackground';
import { Footer } from '../components/Footer';

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const pixKey = "ligafutevoleihortolandia@gmail.com";
  const whatsappNumber = "5519982796873";

  useEffect(() => {
    const fetchInscricao = async () => {
      try {
        if (!id) throw new Error("ID inválido");

        const { data: inscricao, error } = await supabase
          .from('inscricoes')
          .select(`
            id,
            valor_inscricao,
            categoria,
            status,
            tamanho_p1,
            tamanho_p2,
            duplas (
              atleta1:atleta_1_id (nome_completo),
              atleta2:atleta_2_id (nome_completo)
            )
          `)
          .eq('id', id)
          .single();

        if (error || !inscricao) {
          setErrorNotFound(true);
        } else {
          setData(inscricao);
        }
      } catch (err) {
        setErrorNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInscricao();
  }, [id]);

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const atleta1Nome = data?.duplas?.atleta1?.nome_completo || 'Atleta 1';
  const atleta2Nome = data?.duplas?.atleta2?.nome_completo || 'Atleta 2';
  const formatCategoria = data?.categoria?.replace('_', ' ');

  const generateWhatsappLink = () => {
    const text = `Olá! Realizei a inscrição e quero enviar o comprovante de pagamento.\nDupla: ${atleta1Nome} e ${atleta2Nome}\nCategoria: ${formatCategoria}\nID: ${id}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col">
      <ParticleBackground />
      
      <main className="relative flex-1 z-10 py-20 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          
          <Link to="/" className="text-brand-gray hover:text-brand-white flex items-center gap-2 transition-colors uppercase tracking-widest text-xs font-bold mb-12">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>

          {loading ? (
            <div className="flex justify-center items-center h-64 text-brand-metallic">
              Buscando dados da Inscrição...
            </div>
          ) : errorNotFound ? (
            <div className="bg-brand-surface border border-brand-surface-light p-10 text-center flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-brand-metallic mb-6" />
              <h2 className="text-2xl font-bold mb-4">Inscrição Não Encontrada</h2>
              <p className="text-brand-metallic">Verifique se o link está correto ou entre em contato com o suporte.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-surface border border-brand-surface-light rounded-sm overflow-hidden"
            >
              {/* Header Status */}
              <div className="bg-green-500/10 border-b border-brand-surface-light p-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
                <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Inscrição Registrada!</h1>
                <p className="text-brand-metallic">Seus dados já estão no sistema. Guarde este link para consultar sua inscrição a qualquer momento.</p>
              </div>

              {/* Data Summary */}
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-brand-gray mb-1">Dupla Registrada</h3>
                    <p className="font-medium text-lg flex items-center gap-2">
                      {atleta1Nome}
                      {data?.tamanho_p1 && <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-surface-light text-brand-metallic px-2 py-0.5 rounded-sm">Tam. {data.tamanho_p1}</span>}
                    </p>
                    <p className="font-medium text-lg flex items-center gap-2">
                      {atleta2Nome}
                      {data?.tamanho_p2 && <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-surface-light text-brand-metallic px-2 py-0.5 rounded-sm">Tam. {data.tamanho_p2}</span>}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-brand-gray mb-1">Status Atual</h3>
                    <div className="inline-block px-3 py-1 bg-brand-surface-light text-brand-metallic font-bold text-xs uppercase tracking-widest rounded-sm">
                      {data?.status || 'PENDENTE'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-surface-light pt-8">
                  <div className="bg-brand-black border border-brand-surface-light p-6 text-center mb-8">
                    <div className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-2">Valor da Inscrição</div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-4xl font-black text-yellow-500">R$ {data?.valor_inscricao},00</span>
                      <span className="text-lg text-brand-white font-medium self-end pb-1">/ dupla</span>
                    </div>
                    <div className="text-sm text-brand-metallic">
                      {data?.valor_inscricao === 320 
                        ? '(R$ 160,00 por atleta)' 
                        : data?.valor_inscricao === 260 
                          ? '(Desconto de 2ª Modalidade aplicado a 1 atleta)' 
                          : data?.valor_inscricao === 200 
                            ? '(Desconto Multi-Categoria aplicado a ambos)' 
                            : ''}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Pagamento via PIX</h3>
                  <p className="text-brand-metallic text-sm mb-6">
                    Para garantir sua vaga na chave, realize a transferência PIX para a chave abaixo e envie o comprovante no WhatsApp oficial da organização.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1 bg-brand-black border border-brand-surface-light p-4 flex items-center justify-between">
                      <code className="text-brand-white font-mono text-sm sm:text-base break-all">
                        {pixKey}
                      </code>
                    </div>
                    <button 
                      onClick={copyPix}
                      className="bg-brand-surface-light hover:bg-brand-gray text-brand-white transition-colors p-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs whitespace-nowrap min-w-[140px]"
                    >
                      {copied ? (
                        <><Check className="w-4 h-4" /> Copiado</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copiar Chave</>
                      )}
                    </button>
                  </div>

                  <div className="bg-brand-surface-light/10 p-4 border-l-2 border-yellow-500 mb-8">
                    <p className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-1">Beneficiário:</p>
                    <p className="text-sm text-brand-white font-medium mb-3">Victor Benatti Alves Dos Santos</p>
                    <p className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-1">Instituição:</p>
                    <p className="text-sm text-brand-white font-medium">Mercado Pago</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center pt-8 border-t border-brand-surface-light">
                    <a 
                      href={generateWhatsappLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-brand-white text-brand-black hover:bg-gray-200 transition-colors py-4 flex justify-center items-center gap-3 font-bold uppercase tracking-widest text-sm"
                    >
                      Enviar Comprovante
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
