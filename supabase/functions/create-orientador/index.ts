// supabase/functions/create-orientador/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders }); // responde ao preflight
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders }); // responde ao preflight
  }
  try {
    const { nome, email, especialidade, requesterId } = await req.json();

    // valida que quem chama é mesmo administrador_academico, antes de criar seja o que for
    const { data: requester, error: requesterError } = await supabaseAdmin
      .from('profiles')
      .select('papel')
      .eq('id', requesterId)
      .single();

    if (requesterError || requester?.papel !== 'administrador_academico') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 403, headers: {...corsHeaders, 'Content-Type': 'application/json'}});
    }

    const tempPassword = crypto.randomUUID().slice(0, 12);

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // já confirmado, não passa pelo fluxo normal de confirmação
      user_metadata: { nome },
    });

    if (createError || !newUser.user) {
      return new Response(JSON.stringify({ error: createError?.message ?? 'Falha ao criar utilizador' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, });
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ papel: 'orientador', especialidade, aprovado_pela_instituicao: true })
      .eq('id', newUser.user.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, });
    }

    // envia email de recuperação de senha, que serve aqui como "definir a tua senha"
    await supabaseAdmin.auth.resetPasswordForEmail(email);

    return new Response(JSON.stringify({ success: true, userId: newUser.user.id }), {
      headers: {...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('create-orientador error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, });
  }
});