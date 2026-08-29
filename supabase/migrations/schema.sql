
-- profiles table + trigger para criar perfil automaticamente no signup
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  verification_status text not null default 'not_applicable'
  check (verification_status in ('not_applicable', 'verified', 'pending', 'rejected')),
  situacao text not null default 'ingressante' check (situacao in ('ingressante', 'matriculado')),
  curso_id text references courses(id), -- só preenchido quando matriculado
  numero_processo text,
  created_at timestamptz not null default now()
);

create table courses (
  id text primary key, -- 'eng-informatica', 'eng-telecom', 'informatica-gestao'
  name text not null,
  created_at timestamptz not null default now()
);

create table test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recommended_course_id text not null references courses(id),
  is_tie boolean not null default false,
  runner_up_course_id text references courses(id),
  all_scores jsonb not null, -- guarda o array completo de percentagens por curso, para histórico/auditoria
  created_at timestamptz not null default now()
);

create table admitted_students (
  numero_processo text primary key,
  nome text not null,
  curso_id text not null references courses(id),
  data_nascimento date, -- campo extra para reforçar a comparação, se disponível
  created_at timestamptz not null default now()
);

create table chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'ai_only' check (status in ('ai_only', 'escalated', 'closed')),
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  sender text not null check (sender in ('user', 'ai', 'orientador')),
  content text not null,
  created_at timestamptz not null default now()
);

create table enrollment_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null, -- caminho no Supabase Storage
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table test_results enable row level security;
alter table enrollment_documents enable row level security;

create policy "users manage own profile"
  on profiles for all
  using (auth.uid() = id);

-- trigger: cria a linha em profiles assim que alguém se regista, lendo o nome do metadata do signUp
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, new.raw_user_meta_data->>'nome');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create index idx_messages_chat_id on messages(chat_id);


create policy "users manage own chats"
  on chats for all
  using (auth.uid() = user_id);

create policy "users see messages of own chats"
  on messages for select
  using (chat_id in (select id from chats where user_id = auth.uid()));

create policy "users insert own user messages"
  on messages for insert
  with check (
    sender = 'user'
    and chat_id in (select id from chats where user_id = auth.uid())
  );

-- só matriculados podem escalar (RNF05: reforçado no backend, não só na UI)
create policy "only matriculados can escalate chat"
  on chats for update
  using (
    auth.uid() = user_id
    and (
      status != 'escalated'
      or exists (select 1 from profiles where id = auth.uid() and situacao = 'matriculado')
    )
  );

create index idx_test_results_user_id on test_results(user_id);

-- RLS: cada utilizador só vê os seus próprios resultados (RNF02)

create policy "users can view own test results"
  on test_results for select
  using (auth.uid() = user_id);

create policy "users can insert own test results"
  on test_results for insert
  with check (auth.uid() = user_id);

create policy "users see own documents"
  on enrollment_documents for select
  using (auth.uid() = user_id);

create policy "users upload own documents"
  on enrollment_documents for insert
  with check (auth.uid() = user_id);

-- só a Administração Académica pode rever (assume-se um campo/tabela de papéis; simplificado aqui)
create policy "admin reviews documents"
  on enrollment_documents for update
  using (exists (select 1 from profiles where id = auth.uid() and situacao = 'admin_academica'));