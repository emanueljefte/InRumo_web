import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // service role: função corre no servidor, não sujeita a RLS do utilizador
);

const SYSTEM_PROMPT = `És o Orientador IA do InRumo, assistente de orientação vocacional do INSTIC.
Ajudas estudantes e candidatos a esclarecer dúvidas sobre os cursos disponíveis (Engenharia Informática,
Engenharia de Telecomunicações, Informática de Gestão), o processo de admissão e a escolha vocacional.
Sê breve, claro e acolhedor. Se a questão exigir apoio humano mais aprofundado, sugere falar com um orientador.
Nunca inventes informação sobre notas de acesso, propinas ou prazos que não tenhas — nesse caso, orienta o
estudante a confirmar com a Administração Académica.`;

Deno.serve(async (req) => {
  try {
    const { chatId, content } = await req.json();

    // busca histórico recente para dar contexto à IA (últimas 10 mensagens)
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('sender, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) throw historyError;

    const messages = [...(history ?? [])].reverse().map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [...messages, { role: 'user', content }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n');

    const { error: insertError } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, sender: 'ai', content: aiReply });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ai-chat-reply error:', error);
    return new Response(JSON.stringify({ error: 'Falha ao gerar resposta' }), {
      status: 500,
      headers: { ...corsHeaders,  'Content-Type': 'application/json' },
    });
  }
});