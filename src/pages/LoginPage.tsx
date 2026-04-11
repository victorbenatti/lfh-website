import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ParticleBackground } from '../components/ParticleBackground';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Sucesso no login, redireciona para a página de admin
      navigate('/admin');
    } catch (err: any) {
      console.error('Erro de login:', err.message);
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex items-center justify-center p-4">
      <ParticleBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-surface border border-brand-surface-light p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <img 
            src="/images/LFH-Logo-Vetorizado.svg" 
            alt="LFH Logo" 
            className="w-32 mx-auto mb-6"
          />
          <h1 className="text-2xl font-black uppercase tracking-widest mb-2">Acesso Restrito</h1>
          <p className="text-brand-metallic text-sm uppercase tracking-wider">Painel Administrativo da LFH</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">
              E-mail Administrativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-brand-metallic" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-brand-black border border-brand-surface-light py-4 pl-12 pr-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                placeholder="admin@lfh.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-gray text-xs uppercase tracking-widest font-semibold mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-brand-metallic" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-brand-black border border-brand-surface-light py-4 pl-12 pr-4 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder:text-brand-surface-light"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-brand-white text-brand-black font-black uppercase tracking-widest text-sm hover:bg-brand-gray transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
