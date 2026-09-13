-- 1. Criação de Cursos e Áreas
create table courses (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

ALTER TABLE courses ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;

create table areas (
  id text primary key,
  nome text not null,
  curso_id text not null references courses(id) on delete cascade
);

-- Inserção dos cursos obrigatórios PRIMEIRO
insert into courses (id, name) values
  ('eng-informatica', 'Engenharia Informática'),
  ('eng-telecom', 'Engenharia de Telecomunicações'),
  ('informatica-gestao', 'Informática de Gestão');

-- Inserção das áreas DEPOIS que os cursos já existem
insert into areas (id, nome, curso_id) values
  ('dev-software', 'Desenvolvimento de Software', 'eng-informatica'),
  ('eng-software', 'Engenharia de Software', 'eng-informatica'),
  ('ia', 'Inteligência Artificial', 'eng-informatica'),
  ('ciencia-dados', 'Ciência de Dados', 'eng-informatica'),
  ('ciberseguranca', 'Cibersegurança', 'eng-informatica'),
  ('bases-dados', 'Bases de Dados', 'eng-informatica'),
  ('dev-web-mobile', 'Desenvolvimento Web/Mobile', 'eng-informatica'),
  ('sistemas-infraestrutura', 'Sistemas e Infraestrutura', 'eng-informatica'),
  ('redes-computadores', 'Redes de Computadores', 'eng-telecom'),
  ('redes-moveis', 'Redes Móveis e Comunicações Sem Fio', 'eng-telecom'),
  ('fibra-otica', 'Fibra Ótica e Sistemas de Transmissão', 'eng-telecom'),
  ('infraestrutura-telecom', 'Infraestrutura e Equipamentos de Telecom', 'eng-telecom'),
  ('seguranca-redes', 'Segurança de Redes', 'eng-telecom'),
  ('comunicacao-satelite', 'Sistemas de Comunicação por Satélite/RF', 'eng-telecom'),
  ('sistemas-informacao', 'Sistemas de Informação Empresarial', 'informatica-gestao'),
  ('business-intelligence', 'Análise de Dados para Negócio', 'informatica-gestao'),
  ('gestao-projetos-ti', 'Gestão de Projetos de TI', 'informatica-gestao'),
  ('processos-organizacionais', 'Processos e Eficiência Organizacional', 'informatica-gestao'),
  ('empreendedorismo-digital', 'Empreendedorismo e Inovação Digital', 'informatica-gestao'),
  ('consultoria-tecnologica', 'Consultoria Tecnológica para Gestão', 'informatica-gestao');

-- 2. Perfis e Tabelas Secundárias
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  verification_status text not null default 'not_applicable'
    check (verification_status in ('not_applicable', 'verified', 'pending', 'rejected')),
  papel text not null default 'utilizador' check (papel in ('utilizador', 'orientador', 'administrador_academico')),
  situacao text not null default 'candidate' check (situacao in ('candidate', 'matriculado')),
  registration_intent text check (registration_intent in ('candidate', 'matriculado')),
  curso_id text references courses(id),
  numero_processo text,
  created_at timestamptz not null default now()
);

alter table profiles add column aprovado_pela_instituicao boolean not null default true;
alter table profiles add column email text;
alter table profiles add column especialidade text;
alter table profiles add column telefone text;
alter table profiles add column turno text;
alter table profiles add column ano_academico text;

create table test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recommended_course_id text references courses(id),
  is_tie boolean not null default false,
  runner_up_course_id text references courses(id),
  all_scores jsonb not null,
  recommended_area_id text references areas(id),
  runner_up_area_id text references areas(id),
  created_at timestamptz not null default now()
);

create table admitted_students (
  numero_processo text primary key,
  nome text not null,
  curso_id text not null references courses(id),
  data_nascimento date,
  created_at timestamptz not null default now()
);

alter table admitted_students add column telefone text;
alter table admitted_students add column turno text check (turno in ('Manhã', 'Tarde', 'Pós-Laboral'));
alter table admitted_students add column ano_academico text;

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
  file_path text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table enrollment_documents drop constraint enrollment_documents_user_id_fkey;
alter table enrollment_documents add constraint enrollment_documents_user_id_fkey
  foreign key (user_id) references profiles(id) on delete cascade;
alter table enrollment_documents add column file_name text;

create table orientador_availability (
  id uuid primary key default gen_random_uuid(),
  orientador_id uuid not null references profiles(id) on delete cascade,
  dia_semana int not null check (dia_semana between 0 and 6),
  hora_inicio time not null,
  hora_fim time not null
);

create table orientation_sessions (
  id uuid primary key default gen_random_uuid(),
  matriculado_id uuid not null references profiles(id) on delete cascade,
  orientador_id uuid not null references profiles(id) on delete cascade,
  data_hora timestamptz not null,
  estado text not null default 'marcada' check (estado in ('marcada', 'concluida', 'cancelada')),
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references orientation_sessions(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  file_path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tipo text not null check (tipo in ('sessao_marcada', 'sessao_cancelada', 'chat_escalado', 'chat_resposta_orientador', 'matricula_aprovada', 'matricula_rejeitada')),
  conteudo text not null,
  lida boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Triggers e Funções
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email, registration_intent)
  values (new.id, new.raw_user_meta_data->>'nome', new.email, new.raw_user_meta_data->>'registration_intent');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 4. Índices
create index idx_messages_chat_id on messages(chat_id);
create index idx_test_results_user_id on test_results(user_id);

-- 5. Row Level Security (RLS)
alter table courses enable row level security;
alter table areas enable row level security;
alter table profiles enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table test_results enable row level security;
alter table enrollment_documents enable row level security;
alter table orientador_availability enable row level security;
alter table orientation_sessions enable row level security;
alter table documents enable row level security;
alter table notifications enable row level security;

-- Políticas RLS
create policy "cursos sao publicos para leitura"
  on courses for select
  using (true);

create policy "areas sao publicas para leitura"
  on areas for select
  using (true);

create policy "users manage own profile"
  on profiles for all
  using (auth.uid() = id);

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

create policy "only matriculados can escalate chat"
  on chats for update
  using (
    auth.uid() = user_id
    and (
      status != 'escalated'
      or exists (select 1 from profiles where id = auth.uid() and situacao = 'matriculado')
    )
  );

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

create policy "admin reviews documents"
  on enrollment_documents for update
  using (exists (select 1 from profiles where id = auth.uid() and situacao = 'admin_academica'));

create policy "participantes da sessao veem documentos"
  on documents for select
  using (
    exists (
      select 1 from orientation_sessions
      where id = documents.session_id
      and (matriculado_id = auth.uid() or orientador_id = auth.uid())
    )
  );

create policy "participantes da sessao enviam documentos"
  on documents for insert
  with check (
    auth.uid() = uploaded_by
    and exists (
      select 1 from orientation_sessions
      where id = session_id
      and (matriculado_id = auth.uid() or orientador_id = auth.uid())
    )
  );

create policy "todos podem ver disponibilidade"
  on orientador_availability for select
  using (true);

create policy "orientador gere a propria disponibilidade"
  on orientador_availability for all
  using (auth.uid() = orientador_id);

create policy "matriculado ve as proprias sessoes"
  on orientation_sessions for select
  using (auth.uid() = matriculado_id or auth.uid() = orientador_id);

create policy "matriculado verificado cria sessao"
  on orientation_sessions for insert
  with check (
    auth.uid() = matriculado_id
    and exists (select 1 from profiles where id = auth.uid() and situacao = 'matriculado' and verification_status = 'verified')
  );

create policy "only verified matriculados can escalate chat"
  on chats for update
  using (
    auth.uid() = user_id
    and (
      status != 'escalated'
      or exists (select 1 from profiles where id = auth.uid() and situacao = 'matriculado' and verification_status = 'verified')
    )
  );

create policy "matriculado cancela a propria sessao"
  on orientation_sessions for update
  using (auth.uid() = matriculado_id)
  with check (estado = 'cancelada');

create policy "orientador ve chats escalados"
  on chats for select
  using (
    status = 'escalated'
    and exists (select 1 from profiles where id = auth.uid() and papel = 'orientador')
  );

create policy "orientador ve mensagens de chats escalados"
  on messages for select
  using (
    chat_id in (
      select id from chats where status = 'escalated'
    )
    and exists (select 1 from profiles where id = auth.uid() and papel = 'orientador')
  );

create policy "orientador envia mensagens em chats escalados"
  on messages for insert
  with check (
    sender = 'orientador'
    and chat_id in (select id from chats where status = 'escalated')
    and exists (select 1 from profiles where id = auth.uid() and papel = 'orientador')
  );

create policy "orientador conclui sessao"
  on orientation_sessions for update
  using (auth.uid() = orientador_id)
  with check (estado in ('concluida', 'cancelada'));

create policy "administrador ve documentos pendentes"
  on enrollment_documents for select
  using (
    exists (select 1 from profiles where id = auth.uid() and papel = 'administrador_academico')
  );

create policy "administrador aprova ou rejeita documentos"
  on enrollment_documents for update
  using (
    exists (select 1 from profiles where id = auth.uid() and papel = 'administrador_academico')
  );

  create policy "utilizador ve as proprias notificacoes"
  on notifications for select
  using (auth.uid() = user_id);

create policy "utilizador marca as proprias notificacoes como lidas"
  on notifications for update
  using (auth.uid() = user_id)
  with check (lida = true);

  create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and papel = 'administrador_academico');
$$ language sql security definer stable;

create policy "administrador ve todos os profiles"
  on profiles for select
  using (is_admin());

create or replace function is_orientador()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and papel = 'orientador');
$$ language sql security definer stable;

create policy "orientador ve profiles de matriculados e candidatos"
  on profiles for select
  using (is_orientador());

create policy "sistema cria notificacoes para qualquer utilizador"
  on notifications for insert
  with check (
    -- quem insere é administrador, orientador, ou o próprio sistema a notificar-se (ex. IA no chat)
    exists (select 1 from profiles where id = auth.uid() and papel in ('administrador_academico', 'orientador'))
    or auth.uid() = user_id
  );

create policy "sistema cria notificacoes para qualquer utilizador"
  on notifications for insert
  with check (
    exists (select 1 from profiles where id = auth.uid() and papel in ('administrador_academico', 'orientador'))
    or auth.uid() = user_id
    or exists (
      -- quem escala um chat pode notificar orientadores
      select 1 from chats where user_id = auth.uid() and status = 'escalated'
    )
  );

  -- eng-telecom (68 disciplinas)
update courses set curriculum = to_jsonb(ARRAY['Cálculo I', 'Física I', 'Circuitos Eléctricos I', 'Electrónica Analógica I', 'Orientação Profissional', 'Metodologia Científica I', 'Língua Portuguesa', 'Inglês I', 'Cálculo II', 'Cálculo Numérico', 'Física II', 'Computação I', 'Circuitos Eléctricos II', 'Electrónica Analógica II', 'Inglês II', 'Metodologia Científica II', 'Cálculo III', 'Álgebra e Análise Vectorial', 'Probabilidade e Estatística', 'Computação II', 'Electrónica Digital', 'Redes de Computadores I', 'Inglês III', 'Análise Matemática de Sinais e Sistemas', 'Física III', 'Computação III', 'Microprocessadores', 'Redes de Computadores II', 'Economia I', 'Empreendedorismo I', 'Inglês IV', 'Circuitos Eléctricos III', 'Propagação e Antenas', 'Linhas de Transmissão e Microondas', 'Sistemas de Comunicações I', 'Humanidades', 'Redes de Telecomunicações I', 'Projecto de Bacharelato', 'Circuitos de Rádio Frequência', 'Sistemas Rádio', 'Comunicações Ópticas', 'Comunicações Móveis', 'Redes de Telecomunicações II', 'Administração I', 'Processos Estocásticos', 'Computação IV', 'Processamento Digital de Sinais I', 'Redes de Telecomunicações III', 'Sistemas de Comunicações II', 'Economia II', 'Suprimento de Energia em Telecomunicações', 'Processamento Digital de Sinais II', 'Redes de Telecomunicações IV', 'Sistemas de Comunicações III', 'Administração II', 'Tópicos Especiais I', 'Sistemas de Comunicações IV', 'Gestão de Projectos I', 'Projecto de Redes de Telecomunicações I', 'Projecto de Antenas', 'Tópicos Especiais II', 'Projecto de Licenciatura', 'Sistemas de Comunicações V', 'Gestão de Projectos II', 'Projecto de Redes de Telecomunicações II', 'Projecto de Circuitos de Rádio Frequência', 'Empreendedorismo II', 'Tópicos Especiais III']) where id = 'eng-telecom';

-- eng-informatica (64 disciplinas)
update courses set curriculum = to_jsonb(ARRAY['Cálculo I', 'Construção de Algoritmos e Programação', 'Física I', 'Álgebra e Geometria Analítica', 'Metodologia Científica I', 'Língua Portuguesa', 'Inglês I', 'Cálculo II', 'Matemática Discreta', 'Física II', 'Linguagens de Programação', 'Empreendedorismo I', 'Inglês II', 'Metodologia Científica II', 'Cálculo Numérico', 'Circuitos Eléctricos', 'Probabilidade e Estatística', 'Estruturas de Dados I', 'Redes de Computadores I', 'Orientação Profissional', 'Inglês III', 'Estruturas de Dados II', 'Electrónica Digital', 'Redes de Computadores II', 'Bancos de Dados I', 'Economia I', 'Humanidades', 'Inglês IV', 'Arquitectura de Computadores I', 'Engenharia de Software I', 'Redes de Computadores III', 'Bancos de Dados II', 'Compiladores', 'Administração I', 'Projecto de Bacharelato', 'Sistemas Operacionais I', 'Programação Web', 'Computação Gráfica', 'Interface Homem Máquina', 'Multimédia e Hipermídia', 'Redes de Computadores IV', 'Processos Estocásticos', 'Arquitectura de Computadores II', 'Sistemas Operacionais II', 'Engenharia de Software II', 'Economia II', 'Inteligência Artificial', 'Sistemas de Tempo Real', 'Administração de Bancos de Dados', 'Empreendedorismo II', 'Administração II', 'Sistemas Distribuição e Paralelos', 'Tópicos Especiais I', 'Modelagem e Simulação', 'Redes Neurais', 'Gestão de Projectos I', 'Circuitos Reconfiguráveis', 'Tópicos Especiais II', 'Projecto de Licenciatura', 'Gestão de Projectos II', 'Sistemas Embarcados', 'Computação Ubíqua', 'Sistemas de Informação de Apoio à Gestão', 'Tópicos Especiais III']) where id = 'eng-informatica';

-- informatica-gestao (42 disciplinas)
update courses set curriculum = to_jsonb(ARRAY['Análise Matemática I', 'Fundamentos de Programação', 'Introdução às Tecnologias Informáticas', 'Fundamentos da Física', 'Português', 'Inglês I', 'Análise Matemática II', 'Arquitectura de Computadores', 'Linguagens de Programação I', 'Contabilidade Geral', 'Desenvolvimento das Capacidades da Expressão Oral e Escrita', 'Inglês Empresarial I', 'Bases de Dados', 'Instrumentos de Gestão', 'Investigação Operacional', 'Linguagens de Programação II', 'Sistemas Operativos', 'Análise e Concepção de Sistemas', 'Gestão Financeira', 'Algoritmia e Estrutura de Dados', 'Redes de Computadores', 'Sistemas de Suporte à Decisão', 'Arquitectura Avançada de Computadores', 'Engenharia de Software', 'Interacção Humano-Máquina', 'Sistemas Móveis Empresariais', 'Sistemas de Informação Multimédia', 'Arquitectura de Sistemas Empresariais', 'Auditoria de Sistemas de Informação', 'Controlo de Gestão', 'Inteligência Artificial', 'Introdução aos Sistemas ERP', 'Sistemas Digitais e Plataformas Tecnológicas', 'Computação Distribuída', 'Compiladores', 'Marketing', 'Data Mining', 'Segurança Informática', 'Psicossociologia das Organizações', 'Computação Gráfica', 'Direito Empresarial', 'Projecto Final/Trabalho de Fim de Curso']) where id = 'informatica-gestao';