import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log(supabaseUrl, supabaseKey);


export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, 
  },
});

// Função para testar a conexão
export async function checkConnection() {
  try {
    // 1. Testa a chave de API e o endpoint de autenticação
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Erro de conexão com o Supabase:', error.message);
      return false;
    }

    console.log('✅ Supabase conectado com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Erro inesperado ao conectar ao Supabase:', err);
    return false;
  }
}

// Executa o teste ao carregar o módulo
checkConnection();