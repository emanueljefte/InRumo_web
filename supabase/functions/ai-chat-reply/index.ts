// supabase/functions/ai-chat-reply/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const MAX_REQUESTS_PER_HOUR = 10;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { chatId, content } = await req.json();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('chat_id', chatId)
      .eq('sender', 'user')
      .gte('created_at', oneHourAgo);

    if (countError) throw countError;

    if ((count ?? 0) >= MAX_REQUESTS_PER_HOUR) {
      return new Response(
        JSON.stringify({ error: `Atingiste o limite de ${MAX_REQUESTS_PER_HOUR} mensagens por hora. Tenta novamente mais tarde.` }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('sender, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) throw historyError;

    const { data: courses } = await supabase.from('courses').select('name, description');

    const { data: chatData } = await supabase.from('chats').select('user_id').eq('id', chatId).single();

    const { data: latestResult } = await supabase
      .from('test_results')
      .select('recommended_area_id, recommended_course_id')
      .eq('user_id', chatData?.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let resultContext = '';

    if (latestResult?.recommended_area_id) {
      const { data: areaData } = await supabase
        .from('areas')
        .select('nome')
        .eq('id', latestResult.recommended_area_id)
        .maybeSingle();
      resultContext = `\n\nO estudante já fez o teste vocacional e a área recomendada foi: ${areaData?.nome ?? latestResult.recommended_area_id}.`;
    } else if (latestResult?.recommended_course_id) {
      const { data: courseData } = await supabase
        .from('courses')
        .select('name')
        .eq('id', latestResult.recommended_course_id)
        .maybeSingle();
      resultContext = `\n\nO candidato já fez o teste vocacional e o curso recomendado foi: ${courseData?.name ?? latestResult.recommended_course_id}.`;
    }

    const coursesContext = (courses ?? [])
      .map((c) => `- ${c.name}: ${c.description}`)
      .join('\n');

    const SYSTEM_PROMPT = `És o Orientador IA do InRumo, assistente de orientação vocacional do INSTIC.

Cursos disponíveis no INSTIC:
${coursesContext}

Ajudas estudantes e candidatos a esclarecer dúvidas sobre estes cursos, o processo de admissão e a escolha vocacional.

Regras de formato:
- Sê breve e directo. Respostas devem ter no máximo 3-4 frases curtas, salvo se a pessoa pedir explicitamente mais detalhe.
- Termina sempre as tuas frases por completo, nunca cortes uma ideia a meio.

Regras de conteúdo:
- Usa APENAS a informação sobre os cursos fornecida acima. Não acrescentes especializações, áreas, disciplinas específicas, ou qualquer outro detalhe que não tenha sido explicitamente dado a ti.
- Se perguntarem só "quais são os cursos", responde apenas com os 3 nomes e a descrição breve dada — não elabores sobre áreas internas de cada curso, salvo se perguntarem especificamente sobre isso.
- Só respondas sobre o processo de candidatura, requisitos de acesso, propinas ou prazos SE tiveres essa informação explicitamente fornecida acima. Não tens essa informação agora — nesses casos, diz claramente que não tens esse dado e orienta a pessoa a confirmar com a Administração Académica.
- O agendamento de sessões individuais com orientador só está disponível para estudantes já matriculados, dentro do painel deles — não prometas agendamento a quem ainda não é matriculado.
- Se a questão exigir apoio humano mais aprofundado, sugere usar a opção "Falar com Humano" (só disponível a matriculados).

${resultContext}
`;

    // Gemini usa "user"/"model" (não "assistant"), e não aceita "system" dentro de "contents" — vai à parte em "system_instruction"
    const contents = [...(history ?? [])].reverse().map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    contents.push({ role: 'user', parts: [{ text: content }] });

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': Deno.env.get('GEMINI_API_KEY')!,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 800, temperature: 0.3 },
        }),
      }
    );



    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error detail:', errText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('\n') ?? '';

    if (!aiReply) {
      throw new Error('Resposta vazia do Gemini.');
    }

    const { error: insertError } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, sender: 'ai', content: aiReply });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ai-chat-reply error:', error);
    const message = error instanceof Error ? error.message : 'Falha ao gerar resposta';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});