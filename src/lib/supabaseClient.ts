import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente do Vite
// Como fallback para o app rodar sem travar enquanto o usuário não configura o .env:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJh...';

export const supabase = createClient(supabaseUrl, supabaseKey);
