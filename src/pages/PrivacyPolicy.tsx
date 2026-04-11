import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Footer } from '../components/Footer';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black flex flex-col">
      <ParticleBackground />
      
      <main className="relative flex-1 z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto bg-brand-surface border border-brand-surface-light p-8 md:p-12 shadow-2xl">
          
          <div className="mb-10">
            <Link to="/" className="text-brand-gray hover:text-brand-white flex items-center gap-2 transition-colors self-start uppercase tracking-widest text-xs font-bold inline-flex mb-8">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-brand-surface-light p-3 rounded-full">
                <ShieldCheck className="w-8 h-8 text-brand-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Política de Privacidade</h1>
            </div>
            <p className="text-brand-metallic text-sm uppercase tracking-widest">
              Em conformidade com a LGPD (Lei Geral de Proteção de Dados Pessoais)
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-brand-metallic leading-relaxed"
          >
            <section>
              <h2 className="text-xl font-bold text-brand-white mb-3">1. Coleta de Dados Pessoais</h2>
              <p>
                A Liga de Futevôlei de Hortolândia (LFH) coleta apenas as informações estritamente necessárias para a gestão esportiva e administrativa do nosso circuito. Os dados solicitados durante a inscrição incluem:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                <li>Nome Completo</li>
                <li>WhatsApp</li>
                <li>CPF (Cadastro de Pessoas Físicas)</li>
                <li>Data de Nascimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-white mb-3">2. Uso Exclusivo e Finalidade</h2>
              <p>
                Nossa política é baseada na transparência e no respeito à sua privacidade. Reiteramos que <strong>nenhum dado pessoal será comercializado ou repassado a terceiros</strong>. As informações coletadas servem <strong className="text-brand-white">estrita e unicamente</strong> para:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
                <li>Identificação única do atleta para a montagem e chaveamento do torneio (via CPF).</li>
                <li>Comunicação direta para envio de informações, confirmações de pagamento e horários de jogos (via WhatsApp).</li>
                <li>Cálculo e registro das pontuações da dupla no nosso Sistema de Ranking Anual.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-white mb-3">3. Armazenamento e Segurança (Painel Administrativo)</h2>
              <p>
                Os seus dados de inscrição e comprovantes de pagamentos são enviados para um banco de dados fechado (Supabase). O acesso ao nosso Painel Administrativo é altamente protegido via sistema de autenticação, sendo de uso exclusivo da comissão organizadora da LFH.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-white mb-3">4. Exclusão e Modificação</h2>
              <p>
                Você possui o direito, garantido por lei (LGPD), de solicitar a correção de dados incompletos, inexatos ou desatualizados, bem como a exclusão ou anonimização de suas informações, desde que o torneio já tenha sido encerrado. Para isso, basta entrar em contato direto com a organização via WhatsApp.
              </p>
            </section>
            
            <section className="pt-6 border-t border-brand-surface-light">
              <p className="text-sm">
                Ao prosseguir com sua inscrição e confirmar presença no circuito LFH, você concorda expressamente com as diretrizes descritas nesta Política de Privacidade.
              </p>
            </section>
          </motion.div>
        
        </div>
      </main>

      <Footer />
    </div>
  );
};
