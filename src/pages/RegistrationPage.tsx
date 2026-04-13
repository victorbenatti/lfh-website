import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../components/ParticleBackground';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Footer } from '../components/Footer';

const CATEGORY_UI = [
  { name: 'Masculino', levels: ['Estreante', 'Iniciante', 'Intermediário', 'A+B'] },
  { name: 'Misto', levels: ['Estreante', 'Iniciante'] },
  { name: 'Feminino', levels: ['Livre'] },
];

const CATEGORY_MAP: Record<string, string> = {
  'Masculino - Estreante': 'MASC_ESTREANTE',
  'Masculino - Iniciante': 'MASC_INICIANTE',
  'Masculino - Intermediário': 'MASC_INTERMEDIARIO',
  'Masculino - A+B': 'MASC_AB',
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

  // Form states Atleta 1
  const [player1Name, setPlayer1Name] = useState('');
  const [player1Email, setPlayer1Email] = useState('');
  const [player1Phone, setPlayer1Phone] = useState('');
  const [player1Cpf, setPlayer1Cpf] = useState('');
  const [player1Dob, setPlayer1Dob] = useState('');

  // Form states Atleta 2
  const [player2Name, setPlayer2Name] = useState('');
  const [player2Email, setPlayer2Email] = useState('');
  const [player2Phone, setPlayer2Phone] = useState('');
  const [player2Cpf, setPlayer2Cpf] = useState('');
  const [player2Dob, setPlayer2Dob] = useState('');
  
  const [category, setCategory] = useState('Masculino');
  const [level, setLevel] = useState('Estreante');

  const [activeEdicaoId, setActiveEdicaoId] = useState<string | null>(null);
  const [player1Discount, setPlayer1Discount] = useState(false);
  const [player2Discount, setPlayer2Discount] = useState(false);

  useEffect(() => {
    supabase.from('edicoes').select('id').order('created_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => setActiveEdicaoId(data?.id || null));
  }, []);

  const checkDiscount = async (cpf: string, edicaoId: string) => {
    if (cpf.length < 14) return false;
    const { data: atleta } = await supabase.from('atletas').select('id').eq('cpf', cpf).maybeSingle();
    if (!atleta) return false;
    
    const { data: duplas1 } = await supabase.from('duplas').select('id').eq('atleta_1_id', atleta.id);
    const { data: duplas2 } = await supabase.from('duplas').select('id').eq('atleta_2_id', atleta.id);
    const duplaIds = [...(duplas1 || []), ...(duplas2 || [])].map(d => d.id);
    
    if (duplaIds.length === 0) return false;

    const { data: inscricoes } = await supabase.from('inscricoes')
      .select('id')
      .eq('edicao_id', edicaoId)
      .in('dupla_id', duplaIds)
      .limit(1);

    return !!(inscricoes && inscricoes.length > 0);
  };

  useEffect(() => {
    if (!activeEdicaoId) return;
    if (player1Cpf.length === 14) {
      checkDiscount(player1Cpf, activeEdicaoId).then(setPlayer1Discount);
    } else {
      setPlayer1Discount(false);
    }
  }, [player1Cpf, activeEdicaoId]);

  useEffect(() => {
    if (!activeEdicaoId) return;
    if (player2Cpf.length === 14) {
      checkDiscount(player2Cpf, activeEdicaoId).then(setPlayer2Discount);
    } else {
      setPlayer2Discount(false);
    }
  }, [player2Cpf, activeEdicaoId]);

  const p1Cost = player1Discount ? 100 : 160;
  const p2Cost = player2Discount ? 100 : 160;
  const totalPrice = p1Cost + p2Cost;

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

      // 1. Obter Atleta 1
      let p1Id;
      const { data: p1Data, error: p1Error } = await supabase
        .from('atletas')
        .insert({ 
          nome_completo: player1Name,
          email: player1Email,
          whatsapp: player1Phone,
          cpf: player1Cpf,
          data_nascimento: player1Dob 
        })
        .select('id')
        .single();
        
      if (p1Error && p1Error.code === '23505') {
        const { data: existingP1 } = await supabase.from('atletas').select('id').eq('cpf', player1Cpf).single();
        p1Id = existingP1?.id;
      } else if (p1Error) {
        throw p1Error;
      } else {
        p1Id = p1Data?.id;
      }

      // 2. Obter Atleta 2
      let p2Id;
      const { data: p2Data, error: p2Error } = await supabase
        .from('atletas')
        .insert({ 
          nome_completo: player2Name,
          email: player2Email,
          whatsapp: player2Phone,
          cpf: player2Cpf,
          data_nascimento: player2Dob 
        })
        .select('id')
        .single();
        
      if (p2Error && p2Error.code === '23505') {
        const { data: existingP2 } = await supabase.from('atletas').select('id').eq('cpf', player2Cpf).single();
        p2Id = existingP2?.id;
      } else if (p2Error) {
        throw p2Error;
      } else {
        p2Id = p2Data?.id;
      }

      // 3. Criar Dupla garantindo a regra de ordem (atleta_1_id < atleta_2_id)
      if (!p1Id || !p2Id) throw new Error("Erro ao identificar UUIDs dos atletas.");
      const ids = [p1Id, p2Id].sort();
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

      const { data: inscricaoData, error: subError } = await supabase
        .from('inscricoes')
        .insert({
          dupla_id: finalDuplaId,
          edicao_id: edicaoData.id,
          categoria: categoriaDb,
          valor_inscricao: totalPrice,
          status: 'PENDENTE'
        })
        .select('id')
        .single();
        
      // Ignorar erro se eles já estão inscritos nessa mesma edição e categoria
      if (subError && subError.code === '23505') {
        throw new Error('Esta dupla já está inscrita nesta categoria para esta edição.');
      } else if (subError) {
        throw subError;
      }

      setPlayer1Name(''); setPlayer1Email(''); setPlayer1Phone(''); setPlayer1Cpf(''); setPlayer1Dob('');
      setPlayer2Name(''); setPlayer2Email(''); setPlayer2Phone(''); setPlayer2Cpf(''); setPlayer2Dob('');
      
      navigate(`/pagamento/${inscricaoData.id}`);
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
            <p className="text-brand-metallic text-lg mb-6">
              Preencha os dados dos dois atletas. A dupla fixada aqui servirá como base para o Ranking Anual da LFH.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-brand-surface border border-yellow-500/30 p-4 inline-flex">
              <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0 animate-pulse mt-1.5 sm:mt-0"></span>
              <p className="text-sm text-brand-white">
                Jogando mais de uma categoria? A inscrição da <strong>2ª categoria</strong> cai para <strong className="text-yellow-500">R$ 100,00</strong>. O desconto aplica no fim da página!
              </p>
            </div>
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

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-brand-white font-medium text-center">
                  ⚠ Atenção: O atleta ou dupla que competir em categoria técnica inferior ao seu nível real de jogo estará sujeito a <strong className="text-yellow-500">desclassificação imediata</strong> pelo comitê LFH.
                </p>
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
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">E-mail</label>
                  <input 
                    type="email" 
                    placeholder="Ex: joao@email.com"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player1Email}
                    onChange={e => setPlayer1Email(e.target.value)}
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
                  <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">E-mail</label>
                  <input 
                    type="email" 
                    placeholder="Ex: maria@email.com"
                    className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                    value={player2Email}
                    onChange={e => setPlayer2Email(e.target.value)}
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
                  <span className="text-3xl md:text-4xl font-black text-yellow-500">R$ {totalPrice},00</span>
                  <span className="text-lg text-brand-white font-medium self-end pb-1">a dupla</span>
                </div>
                <div className="text-sm text-brand-metallic">
                  {totalPrice === 320 
                    ? '(Equivalente a R$ 160,00 por atleta)' 
                    : totalPrice === 260 
                      ? '(Um dos atletas aplicou Desconto de 2ª Modalidade)' 
                      : '(O Desconto de 2ª Modalidade foi aplicado para ambos)'}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 flex items-center justify-center gap-3 font-black text-lg uppercase tracking-widest transition-all ${
                    loading 
                    ? 'bg-brand-surface-light text-brand-gray cursor-not-allowed'
                    : 'bg-brand-white text-brand-black hover:bg-gray-200'
                  }`}
                >
                  {loading ? 'Processando Inscrição...' : <>Confirmar Inscrição e Ir Para o Pagamento</>}
                </button>
                <p className="text-center text-xs text-brand-gray font-medium mt-4">
                  ⚠ Atenção: Em caso de desistência, não realizamos o estorno ou devolução do valor da inscrição.
                </p>
              </div>
            </div>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
