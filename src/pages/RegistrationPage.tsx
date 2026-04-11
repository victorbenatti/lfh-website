import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../components/ParticleBackground';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users, Trophy, AlertTriangle, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const CATEGORY_UI = [
  { name: 'Masculino', levels: ['Estreante', 'Iniciante', 'Intermediário', 'A+B'] },
  { name: 'Misto', levels: ['Estreante', 'Iniciante'] },
  { name: 'Feminino', levels: ['Livre'] },
];

const CATEGORY_MAP: Record<string, string> = {
  'Masculino - Estreante': 'MASC_ESTREANTE',
  'Masculino - Iniciante': 'MASC_INICIANTE',
  'Masculino - Intermediário': 'MASC_INTERMEDIARIO',
  'Masculino - A+B': 'MASC_BC',
  'Misto - Estreante': 'MISTO_ESTREANTE',
  'Misto - Iniciante': 'MISTO_INICIANTE',
  'Feminino - Livre': 'FEMININO'
};

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const formatPhone = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v.length <= 10) {
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
  }
  return v.substring(0, 15);
};

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  // Form states Atleta 1
  const [player1Name, setPlayer1Name] = useState('');
  const [player1Phone, setPlayer1Phone] = useState('');
  const [player1Cpf, setPlayer1Cpf] = useState('');
  const [player1Dob, setPlayer1Dob] = useState('');

  // Form states Atleta 2
  const [player2Name, setPlayer2Name] = useState('');
  const [player2Phone, setPlayer2Phone] = useState('');
  const [player2Cpf, setPlayer2Cpf] = useState('');
  const [player2Dob, setPlayer2Dob] = useState('');
  
  const [category, setCategory] = useState('Masculino');
  const [level, setLevel] = useState('Estreante');

  const currentLevels = CATEGORY_UI.find(c => c.name === category)?.levels || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    setLevel(CATEGORY_UI.find(c => c.name === val)?.levels[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 0. Buscar Edição Ativa (Mais recente)
      const { data: edicaoData, error: edicaoError } = await supabase
        .from('edicoes')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (edicaoError) throw edicaoError;
      if (!edicaoData) {
        throw new Error('Nenhuma edição de torneio encontrada no banco de dados. O administrador deve criar uma etapa primeiro em "edicoes".');
      }

      // 1. Criar Atleta 1
      const { data: p1Data, error: p1Error } = await supabase
        .from('atletas')
        .insert({ 
          nome_completo: player1Name, 
          whatsapp: player1Phone,
          cpf: player1Cpf,
          data_nascimento: player1Dob 
        })
        .select('id')
        .single();
      if (p1Error) throw p1Error;

      // 2. Criar Atleta 2
      const { data: p2Data, error: p2Error } = await supabase
        .from('atletas')
        .insert({ 
          nome_completo: player2Name, 
          whatsapp: player2Phone,
          cpf: player2Cpf,
          data_nascimento: player2Dob 
        })
        .select('id')
        .single();
      if (p2Error) throw p2Error;

      // 3. Criar Dupla garantindo a regra de ordem (atleta_1_id < atleta_2_id)
      const ids = [p1Data.id, p2Data.id].sort();
      const atleta1_id = ids[0];
      const atleta2_id = ids[1];

      const { data: duplaData, error: duplaError } = await supabase
        .from('duplas')
        .insert({
          atleta_1_id: atleta1_id,
          atleta_2_id: atleta2_id
        })
        .select('id')
        .single();
        
      // Ignorar erro se a dupla já existe (violação UNIQUE), e puxar o ID existente
      let finalDuplaId = duplaData?.id;
      if (duplaError && duplaError.code === '23505') { // Postgres Unique Violation
        const { data: existingDupla } = await supabase
          .from('duplas')
          .select('id')
          .eq('atleta_1_id', atleta1_id)
          .eq('atleta_2_id', atleta2_id)
          .single();
        finalDuplaId = existingDupla?.id;
      } else if (duplaError) {
        throw duplaError;
      }

      // 4. Criar Inscrição usando o ENUM adequado
      const categoriaDb = CATEGORY_MAP[`${category} - ${level}`];
      if (!categoriaDb) throw new Error('Mapeamento de categoria inválido.');

      const { error: subError } = await supabase
        .from('inscricoes')
        .insert({
          dupla_id: finalDuplaId,
          edicao_id: edicaoData.id,
          categoria: categoriaDb,
          status: 'PENDENTE'
        });
        
      // Ignorar erro se eles já estão inscritos nessa mesma edição e categoria
      if (subError && subError.code === '23505') {
        throw new Error('Esta dupla já está inscrita nesta categoria para esta edição.');
      } else if (subError) {
        throw subError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao realizar inscrição:', err);
      // Extrair a mensagem apropriada
      const msg = err?.message || 'Ocorreu um erro ao processar sua inscrição. Tente novamente mais tarde.';
      if (msg.includes('duplicate key value violates unique constraint "atletas_cpf_key"')) {
         alert('Erro: Um dos CPFs já está cadastrado no sistema.');
      } else {
         alert(`Erro: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const wppMsg = encodeURIComponent("Olá! Fiz a inscrição para a LFH pelo site, segue comprovante:");
    const orgPhone = "5519982796873"; // Mude para o número do organizador
    const pixKey = "ligafutevoleihortolandia@gmail.com"; // Mude para a chave real

    return (
      <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black flex flex-col items-center justify-center p-4">
        <ParticleBackground />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="relative z-10 bg-brand-surface border border-yellow-500/30 p-8 md:p-10 max-w-xl w-full text-center shadow-[0_0_40px_rgba(234,179,8,0.05)]"
        >
          <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">Quase lá!</h2>
          <p className="text-brand-metallic mb-8">
            Sua dupla foi pré-registrada na categoria <strong className="text-brand-white">{category} - {level}</strong>. 
            Para <strong>confirmar definitivamente</strong> sua inscrição, faça o pagamento via PIX e envie no WhatsApp.
          </p>
          
          <div className="bg-brand-black border border-brand-surface-light p-6 mb-8 text-left">
            <div className="flex flex-col mb-6">
              <div className="text-sm text-brand-gray uppercase tracking-widest font-bold mb-3">Valor da Inscrição</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-brand-surface border border-brand-surface-light p-4 flex flex-col justify-center">
                   <div className="text-brand-metallic text-xs uppercase font-bold tracking-widest mb-1">Por Atleta</div>
                   <div className="text-2xl font-black text-white">R$ 160,00</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 flex flex-col justify-center">
                   <div className="text-yellow-500 text-xs uppercase font-bold tracking-widest mb-1">Dupla Completa</div>
                   <div className="text-2xl font-black text-yellow-500">R$ 320,00</div>
                </div>
              </div>
              <p className="text-xs text-brand-metallic mt-3">* Você pode efetuar o pagamento da sua parte isolada ou da dupla integral no mesmo comprovante.</p>
            </div>
            
            <div className="text-sm text-brand-gray uppercase tracking-widest font-bold mb-2">Chave PIX (E-mail)</div>
            <div className="bg-brand-surface p-4 border border-brand-surface-light mb-4 w-full flex items-center justify-center">
               <span className="font-mono text-brand-white text-xs sm:text-sm md:text-lg tracking-wider font-bold select-all break-all text-center">{pixKey}</span>
            </div>
            
            <div className="bg-brand-surface-light/10 p-4 border-l-2 border-yellow-500">
              <p className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-1">Beneficiário:</p>
              <p className="text-sm text-brand-white font-medium mb-3">Victor Benatti Alves Dos Santos</p>
              <p className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-1">Instituição:</p>
              <p className="text-sm text-brand-white font-medium">Mercado Pago</p>
            </div>
          </div>

          <a 
            href={`https://wa.me/${orgPhone}?text=${wppMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#20bd5a] transition-colors mb-6"
          >
            <MessageCircle className="w-5 h-5" /> Enviar Comprovante no WhatsApp
          </a>

          <button 
            onClick={() => navigate('/')} 
            className="text-brand-gray text-xs hover:text-brand-white uppercase tracking-widest font-bold underline"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black flex flex-col">
      <ParticleBackground />
      
      <main className="relative flex-1 z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-12">
            <Link to="/" className="text-brand-gray hover:text-brand-white flex items-center gap-2 transition-colors self-start uppercase tracking-widest text-xs font-bold inline-flex">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">Inscrição de Dupla</h1>
            <p className="text-brand-metallic text-lg">
              Preencha os dados dos dois atletas. A dupla fixada aqui servirá como base para o Ranking Anual da LFH.
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-brand-surface border border-brand-surface-light p-6 md:p-10 space-y-10"
          >
            {/* Modalidade */}
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-brand-surface-light pb-4">
                <Trophy className="w-5 h-5 text-brand-metallic" /> Categoria do Torneio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Categoria</label>
                  <select 
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors"
                    value={category}
                    onChange={handleCategoryChange}
                    required
                  >
                    {CATEGORY_UI.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Nível</label>
                  <select 
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    required
                  >
                    {currentLevels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Atleta 1 */}
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-brand-surface-light pb-4">
                <User className="w-5 h-5 text-brand-metallic" /> Atleta 1
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João da Silva"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player1Name}
                    onChange={e => setPlayer1Name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player1Phone}
                    onChange={e => setPlayer1Phone(formatPhone(e.target.value))}
                    maxLength={15}
                    required
                  />
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">CPF</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player1Cpf}
                    onChange={e => setPlayer1Cpf(formatCPF(e.target.value))}
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Data de Nascimento</label>
                  <input 
                    type="date"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player1Dob}
                    onChange={e => setPlayer1Dob(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Atleta 2 */}
            <div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-brand-surface-light pb-4">
                <Users className="w-5 h-5 text-brand-metallic" /> Atleta 2
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Maria Souza"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player2Name}
                    onChange={e => setPlayer2Name(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player2Phone}
                    onChange={e => setPlayer2Phone(formatPhone(e.target.value))}
                    maxLength={15}
                    required
                  />
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">CPF</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player2Cpf}
                    onChange={e => setPlayer2Cpf(formatCPF(e.target.value))}
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Data de Nascimento</label>
                  <input 
                    type="date"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player2Dob}
                    onChange={e => setPlayer2Dob(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-6">
              {/* Resumo do Valor */}
              <div className="bg-brand-black border border-brand-surface-light p-6 text-center">
                <div className="text-xs text-brand-gray uppercase tracking-widest font-bold mb-2">Valor Total da Inscrição</div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-3xl md:text-4xl font-black text-yellow-500">R$ 320,00</span>
                  <span className="text-lg text-brand-white font-medium self-end pb-1">a dupla</span>
                </div>
                <div className="text-sm text-brand-metallic">(Equivalente a R$ 160,00 por atleta)</div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full px-8 py-5 bg-brand-white text-brand-black font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processando Inscrição...' : 'Confirmar Inscrição da Dupla'}
              </button>
            </div>
            
          </motion.form>
        </div>
      </main>
    </div>
  );
};
