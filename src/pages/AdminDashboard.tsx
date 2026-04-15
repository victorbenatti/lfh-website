import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Settings, Check, Clock, Link as LinkIcon, Filter, Search, Download, Trash2, Edit2, Users, User, DollarSign, Wallet, X, LogOut, Shirt } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
  tamanho_p1: string | null;
  tamanho_p2: string | null;
  duplas: Dupla;
}

export const AdminDashboard: React.FC = () => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoria, setFilterCategoria] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Inscricao | null>(null);
  const [editCategoria, setEditCategoria] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editTamanhoP1, setEditTamanhoP1] = useState('');
  const [editTamanhoP2, setEditTamanhoP2] = useState('');

  // Delete Modal & Success States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Inscricao | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const CATEGORIAS = [
    'TODAS', 'MASC_ESTREANTE', 'MASC_INICIANTE', 'MASC_INTERMEDIARIO', 
    'MASC_AB', 'MISTO_ESTREANTE', 'MISTO_INICIANTE', 'FEMININO'
  ];

  const fetchInscricoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inscricoes')
      .select(`
        id, categoria, status, created_at, valor_inscricao, tamanho_p1, tamanho_p2,
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
      alert('Erro ao atualizar status do pagamento.');
    } else {
      setInscricoes(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub));
    }
  };

  const confirmDelete = (item: Inscricao) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from('inscricoes').delete().eq('id', itemToDelete.id);

    if (error) {
      alert('Erro ao excluir inscrição: ' + error.message);
    } else {
      setInscricoes(prev => prev.filter(sub => sub.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 2500); // Auto close
    }
  };

  const openEditModal = (item: Inscricao) => {
    setEditItem(item);
    setEditCategoria(item.categoria);
    setEditStatus(item.status);
    setEditTamanhoP1(item.tamanho_p1 || '');
    setEditTamanhoP2(item.tamanho_p2 || '');
    setIsEditModalOpen(true);
  };

  const handeSaveEdit = async () => {
    if (!editItem) return;
    const { error } = await supabase
      .from('inscricoes')
      .update({ categoria: editCategoria, status: editStatus, tamanho_p1: editTamanhoP1 || null, tamanho_p2: editTamanhoP2 || null })
      .eq('id', editItem.id);

    if (error) {
      alert('Erro ao salvar as modificações.');
    } else {
      setInscricoes(prev => prev.map(sub => 
        sub.id === editItem.id ? { ...sub, categoria: editCategoria, status: editStatus, tamanho_p1: editTamanhoP1 || null, tamanho_p2: editTamanhoP2 || null } : sub
      ));
      setIsEditModalOpen(false);
    }
  };

  const formatCategoria = (cat: string) => {
    return cat.replace(/_/g, ' ').replace('MASC', 'MASCULINO');
  };

  const exportToCSV = () => {
    if (inscricoes.length === 0) return;
    const headers = ['Data', 'Categoria', 'Atleta 1', 'Atleta 2', 'WhatsApps', 'Tamanho Atleta 1', 'Tamanho Atleta 2', 'Valor (R$)', 'Status'];
    
    const rows = inscricoes.map(sub => {
       const w1 = sub.duplas?.atleta_1?.whatsapp || '';
       const w2 = sub.duplas?.atleta_2?.whatsapp || '';
       return [
          new Date(sub.created_at).toLocaleDateString('pt-BR'),
          formatCategoria(sub.categoria),
          `"${sub.duplas?.atleta_1?.nome_completo || ''}"`,
          `"${sub.duplas?.atleta_2?.nome_completo || ''}"`,
          `"${w1} e ${w2}"`,
          sub.tamanho_p1 || '',
          sub.tamanho_p2 || '',
          sub.valor_inscricao,
          sub.status
       ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Relatorio_LFH_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalDuplas = inscricoes.length;
  const totalInscritos = inscricoes.length * 2;
  const valorTotal = inscricoes.reduce((acc, curr) => acc + (curr.valor_inscricao || 0), 0);
  const valorPago = inscricoes.filter(i => i.status === 'PAGO').reduce((acc, curr) => acc + (curr.valor_inscricao || 0), 0);

  // Uniform size counts
  const sizeCounts: Record<string, number> = { P: 0, M: 0, G: 0, GG: 0 };
  inscricoes.forEach(sub => {
    if (sub.tamanho_p1 && sizeCounts[sub.tamanho_p1] !== undefined) sizeCounts[sub.tamanho_p1]++;
    if (sub.tamanho_p2 && sizeCounts[sub.tamanho_p2] !== undefined) sizeCounts[sub.tamanho_p2]++;
  });

  // Filters
  const filteredInscricoes = inscricoes.filter(sub => {
     const fullName1 = sub.duplas?.atleta_1?.nome_completo?.toLowerCase() || '';
     const fullName2 = sub.duplas?.atleta_2?.nome_completo?.toLowerCase() || '';
     const matchText = fullName1.includes(searchTerm.toLowerCase()) || fullName2.includes(searchTerm.toLowerCase());
     const matchCat = filterCategoria === 'TODAS' || sub.categoria === filterCategoria;
     return matchText && matchCat;
  });

  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black p-4 md:p-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-brand-surface-light pb-6">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Settings className="w-8 h-8 text-brand-metallic" /> LFH Admin
            </h1>
            <p className="text-brand-metallic text-sm tracking-widest uppercase font-semibold mt-2">Gestão de Inscrições e Vendas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/" className="px-5 py-2 border border-brand-surface-light text-brand-gray text-sm hover:text-brand-white hover:border-brand-gray transition-colors flex items-center gap-2 font-bold uppercase tracking-widest">
              <LinkIcon className="w-4 h-4" /> Ver Site
            </Link>
            <button onClick={handleLogout} className="px-5 py-2 border border-red-500/30 text-red-400 text-sm hover:text-white hover:bg-red-500 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
           <div className="bg-brand-surface border border-brand-surface-light p-4 xl:p-6 flex items-center gap-4 xl:gap-6">
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full border border-brand-surface-light bg-brand-black flex items-center justify-center text-purple-400 shrink-0">
                 <Users className="w-5 h-5 xl:w-6 xl:h-6" />
              </div>
              <div>
                 <p className="text-[10px] xl:text-[11px] text-brand-gray font-bold uppercase tracking-widest mb-1 line-clamp-1">Duplas</p>
                 <h3 className="text-2xl xl:text-3xl font-black">{totalDuplas}</h3>
              </div>
           </div>

           <div className="bg-brand-surface border border-brand-surface-light p-4 xl:p-6 flex items-center gap-4 xl:gap-6">
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full border border-brand-surface-light bg-brand-black flex items-center justify-center text-yellow-500 shrink-0">
                 <User className="w-5 h-5 xl:w-6 xl:h-6" />
              </div>
              <div>
                 <p className="text-[10px] xl:text-[11px] text-brand-gray font-bold uppercase tracking-widest mb-1 line-clamp-1">Atletas</p>
                 <h3 className="text-2xl xl:text-3xl font-black">{totalInscritos}</h3>
              </div>
           </div>
           
           <div className="bg-brand-surface border border-brand-surface-light p-4 xl:p-6 flex items-center gap-4 xl:gap-6">
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full border border-brand-surface-light bg-brand-black flex items-center justify-center text-blue-400 shrink-0">
                 <DollarSign className="w-5 h-5 xl:w-6 xl:h-6" />
              </div>
              <div>
                 <p className="text-[10px] xl:text-[11px] text-brand-gray font-bold uppercase tracking-widest mb-1 line-clamp-1">A Receber</p>
                 <h3 className="text-lg xl:text-2xl font-black text-brand-white">R$ {valorTotal},00</h3>
              </div>
           </div>

           <div className="bg-brand-surface border border-brand-surface-light p-4 xl:p-6 flex items-center gap-4 xl:gap-6">
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full border border-brand-surface-light bg-brand-black flex items-center justify-center text-green-500 shrink-0">
                 <Wallet className="w-5 h-5 xl:w-6 xl:h-6" />
              </div>
              <div>
                 <p className="text-[10px] xl:text-[11px] text-brand-gray font-bold uppercase tracking-widest mb-1 line-clamp-1">Valor Pago</p>
                 <h3 className="text-lg xl:text-2xl font-black text-brand-white">R$ {valorPago},00</h3>
              </div>
           </div>

           {/* Uniform Sizes Card */}
           <div className="bg-brand-surface border border-brand-surface-light p-4 xl:p-6 flex items-center gap-4 xl:gap-6">
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full border border-brand-surface-light bg-brand-black flex items-center justify-center text-pink-400 shrink-0">
                 <Shirt className="w-5 h-5 xl:w-6 xl:h-6" />
              </div>
              <div>
                 <p className="text-[10px] xl:text-[11px] text-brand-gray font-bold uppercase tracking-widest mb-1 line-clamp-1">Uniformes</p>
                 <div className="flex items-center gap-2 text-sm font-bold text-brand-white flex-wrap">
                    <span className="text-pink-300">P:{sizeCounts.P}</span>
                    <span className="text-blue-300">M:{sizeCounts.M}</span>
                    <span className="text-yellow-300">G:{sizeCounts.G}</span>
                    <span className="text-green-300">GG:{sizeCounts.GG}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 bg-brand-surface border border-brand-surface-light p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
             <div className="flex items-center bg-brand-black border border-brand-surface-light px-3 py-2 w-full sm:w-64">
                <Search className="w-4 h-4 text-brand-gray mr-3" />
                <input 
                   type="text" 
                   placeholder="Buscar atleta..." 
                   className="bg-transparent border-none outline-none text-sm text-brand-white w-full placeholder:text-brand-surface-light"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-brand-metallic hidden sm:block" />
                <select 
                   className="w-full bg-brand-black border border-brand-surface-light p-2 text-brand-white focus:outline-none focus:border-brand-white transition-colors uppercase text-xs font-semibold tracking-wider"
                   value={filterCategoria}
                   onChange={(e) => setFilterCategoria(e.target.value)}
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat === 'TODAS' ? 'Todas Categorias' : formatCategoria(cat)}</option>
                  ))}
                </select>
             </div>
          </div>
          
          <button 
             onClick={exportToCSV}
             className="w-full xl:w-auto px-6 py-2 bg-yellow-500 text-brand-black hover:bg-yellow-400 transition-colors uppercase font-bold text-xs tracking-widest flex items-center justify-center gap-2 border border-transparent shadow-lg shadow-yellow-500/20"
          >
             <Download className="w-4 h-4" /> Exportar Planilha
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-20 text-brand-metallic animate-pulse">Carregando dados financeiros e inscrições...</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-surface border border-brand-surface-light overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px] border-collapse">
                <thead className="bg-brand-surface-light/50 border-b border-brand-surface-light text-brand-gray uppercase tracking-wider text-xs font-bold">
                  <tr>
                    <th className="py-4 px-6">Categoria</th>
                    <th className="py-4 px-6">Atleta 1</th>
                    <th className="py-4 px-6">Atleta 2</th>
                    <th className="py-4 px-6 text-center">Uniformes</th>
                    <th className="py-4 px-6 text-center">Valor / Status</th>
                    <th className="py-4 px-6 text-right">Data</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-surface-light">
                  {filteredInscricoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-brand-metallic">Nenhuma inscrição combinando com os filtros.</td>
                    </tr>
                  ) : filteredInscricoes.map((sub) => (
                    <tr key={sub.id} className="hover:bg-brand-surface-light/20 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold">{formatCategoria(sub.categoria)}</div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="font-medium text-brand-white">{sub.duplas?.atleta_1?.nome_completo}</div>
                        <div className="text-brand-metallic font-mono text-[10px] sm:text-xs">{sub.duplas?.atleta_1?.whatsapp}</div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="font-medium text-brand-white">{sub.duplas?.atleta_2?.nome_completo}</div>
                        <div className="text-brand-metallic font-mono text-[10px] sm:text-xs">{sub.duplas?.atleta_2?.whatsapp}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-bold text-sm text-brand-white">{sub.tamanho_p1 || '—'} / {sub.tamanho_p2 || '—'}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="font-mono text-sm text-brand-white font-bold mb-1">R$ {sub.valor_inscricao},00</div>
                        <button 
                          onClick={() => togglePaymentStatus(sub.id, sub.status)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                            sub.status === 'PAGO' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20'
                          }`}
                        >
                          {sub.status === 'PAGO' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {sub.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right text-brand-gray text-[10px] sm:text-xs font-mono">
                        {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-6 text-center">
                         <div className="flex items-center justify-center gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditModal(sub)}
                              title="Editar Inscrição"
                              className="p-2 border border-brand-surface-light text-brand-metallic hover:text-brand-white hover:bg-brand-surface-light transition-colors"
                            >
                               <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => confirmDelete(sub)}
                              title="Excluir Definitivamente"
                              className="p-2 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500 transition-colors"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO */}
      <AnimatePresence>
         {isEditModalOpen && editItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-black/90 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-brand-surface border border-brand-surface-light w-full max-w-lg p-6 sm:p-8"
               >
                  <div className="flex items-center justify-between border-b border-brand-surface-light pb-4 mb-6">
                     <h2 className="text-xl font-bold uppercase tracking-widest text-brand-white flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-yellow-500" />
                        Editar Inscrição
                     </h2>
                     <button onClick={() => setIsEditModalOpen(false)} className="text-brand-metallic hover:text-brand-white">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <p className="text-brand-gray text-[10px] uppercase font-bold tracking-widest mb-1">Dupla</p>
                        <p className="font-semibold text-brand-white">
                           {editItem.duplas?.atleta_1?.nome_completo} <span className="text-brand-metallic font-normal line-through px-1">X</span> {editItem.duplas?.atleta_2?.nome_completo}
                        </p>
                     </div>

                     <div>
                        <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Mudar Categoria</label>
                        <select 
                           className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors uppercase text-sm font-semibold tracking-wider"
                           value={editCategoria}
                           onChange={(e) => setEditCategoria(e.target.value)}
                        >
                           {CATEGORIAS.filter(c => c !== 'TODAS').map(cat => (
                              <option key={cat} value={cat}>{formatCategoria(cat)}</option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Mudar Status</label>
                        <select 
                           className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors uppercase text-sm font-semibold tracking-wider"
                           value={editStatus}
                           onChange={(e) => setEditStatus(e.target.value)}
                        >
                           <option value="PENDENTE">Pendente</option>
                           <option value="PAGO">Pago</option>
                           <option value="CANCELADO">Cancelado</option>
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Uniforme Atleta 1</label>
                           <select 
                              className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors uppercase text-sm font-semibold tracking-wider"
                              value={editTamanhoP1}
                              onChange={(e) => setEditTamanhoP1(e.target.value)}
                           >
                              <option value="">—</option>
                              <option value="P">P</option>
                              <option value="M">M</option>
                              <option value="G">G</option>
                              <option value="GG">GG</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">Uniforme Atleta 2</label>
                           <select 
                              className="w-full bg-brand-black border border-brand-surface-light p-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors uppercase text-sm font-semibold tracking-wider"
                              value={editTamanhoP2}
                              onChange={(e) => setEditTamanhoP2(e.target.value)}
                           >
                              <option value="">—</option>
                              <option value="P">P</option>
                              <option value="M">M</option>
                              <option value="G">G</option>
                              <option value="GG">GG</option>
                           </select>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 pt-4 border-t border-brand-surface-light">
                        <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border border-brand-surface-light text-brand-gray uppercase text-xs font-bold tracking-widest hover:text-brand-white transition-colors">
                           Cancelar
                        </button>
                        <button onClick={handeSaveEdit} className="flex-1 py-3 bg-brand-white text-brand-black hover:bg-gray-200 transition-colors uppercase text-xs font-bold tracking-widest">
                           Salvar Alterações
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* MODAL DE EXCLUSÃO */}
      <AnimatePresence>
         {isDeleteModalOpen && itemToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-black/90 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-brand-surface border border-red-500/30 w-full max-w-lg p-6 sm:p-8 relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-4 mb-8">
                     <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                        <Trash2 className="w-8 h-8" />
                     </div>
                     <h2 className="text-2xl font-black uppercase tracking-widest text-brand-white">Excluir Inscrição?</h2>
                     <p className="text-brand-metallic text-sm leading-relaxed">
                        Você está prestes a remover <strong className="text-brand-white">{itemToDelete.duplas?.atleta_1?.nome_completo}</strong> e <strong className="text-brand-white">{itemToDelete.duplas?.atleta_2?.nome_completo}</strong> no formato <strong className="text-brand-white">Definitivo</strong> do sistema. Esta ação não pode ser desfeita.
                     </p>
                  </div>

                  <div className="flex items-center gap-4">
                     <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 border border-brand-surface-light text-brand-gray uppercase text-xs font-bold tracking-widest hover:text-brand-white transition-colors">
                        Cancelar
                     </button>
                     <button onClick={executeDelete} className="flex-1 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors uppercase text-xs font-bold tracking-widest shadow-lg shadow-red-500/20">
                        Sim, Excluir
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* MODAL DE SUCESSO PÓS-EXCLUSÃO */}
      <AnimatePresence>
         {isSuccessModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-brand-black/90 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-brand-surface border border-green-500/30 w-full max-w-sm p-6 sm:p-8 relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-4 mb-2">
                     <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                        <Check className="w-8 h-8" />
                     </div>
                     <h2 className="text-xl font-black uppercase tracking-widest text-brand-white">Excluída.</h2>
                     <p className="text-brand-metallic text-xs leading-relaxed pb-4">
                        A inscrição da dupla foi limpa perfeitamente do sistema de cruzamento de chaves e não ocupa mais vaga.
                     </p>
                  </div>

                  <button onClick={() => setIsSuccessModalOpen(false)} className="w-full py-3 bg-green-500 text-brand-black hover:bg-green-600 transition-colors uppercase text-xs font-bold tracking-widest shadow-lg shadow-green-500/20">
                     Continuar
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};
