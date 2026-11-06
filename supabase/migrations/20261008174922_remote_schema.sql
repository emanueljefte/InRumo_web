SET local check_function_bodies = off;

CREATE TABLE "public"."admitted_students" (
  "numero_processo" text                     NOT NULL,
  "nome"            text                     NOT NULL,
  "curso_id"        text                     NOT NULL,
  "data_nascimento" date,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "telefone"        text,
  "turno"           text,
  "ano_academico"   text,
  CONSTRAINT "admitted_students_pkey" PRIMARY KEY (numero_processo),
  CONSTRAINT "admitted_students_turno_check" CHECK ((turno = ANY (ARRAY['Manhã'::text, 'Tarde'::text, 'Pós-Laboral'::text])))
);

CREATE TABLE "public"."areas" (
  "id"       text NOT NULL,
  "nome"     text NOT NULL,
  "curso_id" text NOT NULL,
  CONSTRAINT "areas_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."areas"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."chats" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "status"     text                     NOT NULL DEFAULT 'ai_only'::text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "chats_pkey" PRIMARY KEY (id),
  CONSTRAINT "chats_status_check" CHECK ((status = ANY (ARRAY['ai_only'::text, 'escalated'::text, 'closed'::text])))
);

ALTER TABLE "public"."chats"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."courses" (
  "id"          text                     NOT NULL,
  "name"        text                     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "curriculum"  jsonb                    DEFAULT '[]'::jsonb,
  "description" text,
  CONSTRAINT "courses_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."courses"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."documents" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "session_id"  uuid,
  "uploaded_by" uuid                     NOT NULL,
  "file_path"   text                     NOT NULL,
  "file_name"   text                     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "file_size"   bigint,
  "chat_id"     uuid,
  CONSTRAINT "documents_pkey" PRIMARY KEY (id),
  CONSTRAINT "documents_session_or_chat" CHECK (((session_id IS NOT NULL) OR (chat_id IS NOT NULL)))
);

ALTER TABLE "public"."documents"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."enrollment_documents" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid                     NOT NULL,
  "file_path"   text                     NOT NULL,
  "status"      text                     NOT NULL DEFAULT 'pending'::text,
  "reviewed_by" uuid,
  "reviewed_at" timestamp with time zone,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "file_name"   text,
  CONSTRAINT "enrollment_documents_pkey" PRIMARY KEY (id),
  CONSTRAINT "enrollment_documents_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
);

ALTER TABLE "public"."enrollment_documents"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."messages" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "chat_id"    uuid                     NOT NULL,
  "sender"     text                     NOT NULL,
  "content"    text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "messages_pkey" PRIMARY KEY (id),
  CONSTRAINT "messages_sender_check" CHECK ((sender = ANY (ARRAY['user'::text, 'ai'::text, 'orientador'::text])))
);

ALTER TABLE "public"."messages"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."notifications" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "tipo"       text                     NOT NULL,
  "conteudo"   text                     NOT NULL,
  "lida"       boolean                  NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "notifications_pkey" PRIMARY KEY (id),
  CONSTRAINT "notifications_tipo_check"
    CHECK
    ((tipo = ANY (ARRAY['sessao_marcada'::text, 'sessao_cancelada'::text, 'chat_escalado'::text, 'chat_resposta_orientador'::text, 'matricula_aprovada'::text,
    'matricula_rejeitada'::text])))
);

ALTER TABLE "public"."notifications"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."orientador_availability" (
  "id"            uuid                   NOT NULL DEFAULT gen_random_uuid(),
  "orientador_id" uuid                   NOT NULL,
  "dia_semana"    integer                NOT NULL,
  "hora_inicio"   time without time zone NOT NULL,
  "hora_fim"      time without time zone NOT NULL,
  CONSTRAINT "orientador_availability_dia_semana_check" CHECK (((dia_semana >= 0) AND (dia_semana <= 6))),
  CONSTRAINT "orientador_availability_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."orientador_availability"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."orientation_sessions" (
  "id"                  uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "matriculado_id"      uuid                     NOT NULL,
  "orientador_id"       uuid                     NOT NULL,
  "data_hora"           timestamp with time zone NOT NULL,
  "estado"              text                     NOT NULL DEFAULT 'marcada'::text,
  "created_at"          timestamp with time zone NOT NULL DEFAULT now(),
  "modo"                text                     DEFAULT 'presencial'::text,
  "local"               text,
  "notas_orientador"    text,
  "motivo_cancelamento" text,
  CONSTRAINT "orientation_sessions_estado_check" CHECK ((estado = ANY (ARRAY['marcada'::text, 'concluida'::text, 'cancelada'::text]))),
  CONSTRAINT "orientation_sessions_modo_check" CHECK ((modo = ANY (ARRAY['presencial'::text, 'online'::text]))),
  CONSTRAINT "orientation_sessions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."orientation_sessions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"                        uuid                     NOT NULL,
  "nome"                      text                     NOT NULL,
  "verification_status"       text                     NOT NULL DEFAULT 'not_applicable'::text,
  "papel"                     text                     NOT NULL DEFAULT 'utilizador'::text,
  "situacao"                  text                     NOT NULL DEFAULT 'candidate'::text,
  "registration_intent"       text,
  "curso_id"                  text,
  "numero_processo"           text,
  "created_at"                timestamp with time zone NOT NULL DEFAULT now(),
  "aprovado_pela_instituicao" boolean                  NOT NULL DEFAULT true,
  "email"                     text,
  "especialidade"             text,
  "telefone"                  text,
  "turno"                     text,
  "ano_academico"             text,
  "avatar_url"                text,
  CONSTRAINT "profiles_papel_check" CHECK ((papel = ANY (ARRAY['utilizador'::text, 'orientador'::text, 'administrador_academico'::text]))),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_registration_intent_check" CHECK ((registration_intent = ANY (ARRAY['candidate'::text, 'matriculado'::text]))),
  CONSTRAINT "profiles_situacao_check" CHECK ((situacao = ANY (ARRAY['candidate'::text, 'matriculado'::text]))),
  CONSTRAINT "profiles_verification_status_check" CHECK ((verification_status = ANY (ARRAY['not_applicable'::text, 'verified'::text, 'pending'::text, 'rejected'::text])))
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."test_results" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"               uuid                     NOT NULL,
  "recommended_course_id" text,
  "is_tie"                boolean                  NOT NULL DEFAULT false,
  "runner_up_course_id"   text,
  "all_scores"            jsonb                    NOT NULL,
  "recommended_area_id"   text,
  "runner_up_area_id"     text,
  "created_at"            timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "test_results_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."test_results"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  insert into public.profiles (id, nome, email, situacao, registration_intent)
  values (new.id, new.raw_user_meta_data->>'nome', new.email, 'candidate', new.raw_user_meta_data->>'registration_intent');
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  AS $function$
  select exists (select 1 from profiles where id = auth.uid() and papel = 'administrador_academico');
$function$;

CREATE OR REPLACE FUNCTION public.is_orientador()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  AS $function$
  select exists (select 1 from profiles where id = auth.uid() and papel = 'orientador');
$function$;

ALTER TABLE "public"."admitted_students"
  ADD CONSTRAINT "admitted_students_curso_id_fkey" FOREIGN KEY (curso_id) REFERENCES public.courses(id);

ALTER TABLE "public"."areas"
  ADD CONSTRAINT "areas_curso_id_fkey" FOREIGN KEY (curso_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE "public"."documents"
  ADD CONSTRAINT "documents_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

ALTER TABLE "public"."enrollment_documents"
  ADD CONSTRAINT "enrollment_documents_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);

ALTER TABLE "public"."messages"
  ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

ALTER TABLE "public"."documents"
  ADD CONSTRAINT "documents_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.orientation_sessions(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_curso_id_fkey" FOREIGN KEY (curso_id) REFERENCES public.courses(id);

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."chats"
  ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."documents"
  ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."enrollment_documents"
  ADD CONSTRAINT "enrollment_documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."notifications"
  ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."orientador_availability"
  ADD CONSTRAINT "orientador_availability_orientador_id_fkey" FOREIGN KEY (orientador_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."orientation_sessions"
  ADD CONSTRAINT "orientation_sessions_matriculado_id_fkey" FOREIGN KEY (matriculado_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."orientation_sessions"
  ADD CONSTRAINT "orientation_sessions_orientador_id_fkey" FOREIGN KEY (orientador_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."test_results"
  ADD CONSTRAINT "test_results_recommended_area_id_fkey" FOREIGN KEY (recommended_area_id) REFERENCES public.areas(id);

ALTER TABLE "public"."test_results"
  ADD CONSTRAINT "test_results_recommended_course_id_fkey" FOREIGN KEY (recommended_course_id) REFERENCES public.courses(id);

ALTER TABLE "public"."test_results"
  ADD CONSTRAINT "test_results_runner_up_area_id_fkey" FOREIGN KEY (runner_up_area_id) REFERENCES public.areas(id);

ALTER TABLE "public"."test_results"
  ADD CONSTRAINT "test_results_runner_up_course_id_fkey" FOREIGN KEY (runner_up_course_id) REFERENCES public.courses(id);

ALTER TABLE "public"."test_results"
  ADD CONSTRAINT "test_results_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_messages_chat_id ON public.messages USING btree (chat_id);

CREATE INDEX idx_test_results_user_id ON public.test_results USING btree (user_id);

CREATE UNIQUE INDEX orientation_sessions_orientador_horario_unique ON public.orientation_sessions USING btree (orientador_id, data_hora)
  WHERE (estado <> 'cancelada'::text);

CREATE UNIQUE INDEX profiles_numero_processo_verified_unique ON public.profiles USING btree (numero_processo)
  WHERE (verification_status = 'verified'::text);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "areas sao publicas para leitura" ON "public"."areas"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "only verified matriculados can escalate chat" ON "public"."chats"
  FOR UPDATE
  TO PUBLIC
  USING (((auth.uid() = user_id) AND ((status <> 'escalated'::text) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.situacao = 'matriculado'::text) AND (profiles.verification_status = 'verified'::text)))))))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "orientador fecha chats escalados" ON "public"."chats"
  FOR UPDATE
  TO PUBLIC
  USING (((status = 'escalated'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text))))))
  WITH CHECK ((status = 'closed'::text));

CREATE POLICY "orientador ve chats escalados" ON "public"."chats"
  FOR SELECT
  TO PUBLIC
  USING (((status = 'escalated'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text))))));

CREATE POLICY "users delete own chats" ON "public"."chats"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "users insert own chats" ON "public"."chats"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "users select own chats" ON "public"."chats"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "cursos sao publicos para leitura" ON "public"."courses"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "participantes da sessao enviam documentos" ON "public"."documents"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((auth.uid() = uploaded_by) AND (EXISTS ( SELECT 1
   FROM public.orientation_sessions
  WHERE ((orientation_sessions.id = documents.session_id) AND ((orientation_sessions.matriculado_id = auth.uid()) OR (orientation_sessions.orientador_id = auth.uid())))))));

CREATE POLICY "participantes da sessao veem documentos" ON "public"."documents"
  FOR SELECT
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.orientation_sessions
  WHERE ((orientation_sessions.id = documents.session_id) AND ((orientation_sessions.matriculado_id = auth.uid()) OR (orientation_sessions.orientador_id = auth.uid()))))));

CREATE POLICY "participantes do chat enviam documentos" ON "public"."documents"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((auth.uid() = uploaded_by) AND (chat_id IN ( SELECT chats.id
   FROM public.chats
  WHERE (chats.user_id = auth.uid())
UNION
 SELECT chats.id
   FROM public.chats
  WHERE ((chats.status = 'escalated'::text) AND (EXISTS ( SELECT 1
           FROM public.profiles
          WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text)))))))));

CREATE POLICY "participantes do chat veem documentos do chat" ON "public"."documents"
  FOR SELECT
  TO PUBLIC
  USING ((chat_id IN ( SELECT chats.id
   FROM public.chats
  WHERE (chats.user_id = auth.uid())
UNION
 SELECT chats.id
   FROM public.chats
  WHERE ((chats.status = 'escalated'::text) AND (EXISTS ( SELECT 1
           FROM public.profiles
          WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text))))))));

CREATE POLICY "admin reviews documents" ON "public"."enrollment_documents"
  FOR UPDATE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.situacao = 'admin_academica'::text)))));

CREATE POLICY "administrador aprova ou rejeita documentos" ON "public"."enrollment_documents"
  FOR UPDATE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'administrador_academico'::text)))));

CREATE POLICY "administrador ve documentos pendentes" ON "public"."enrollment_documents"
  FOR SELECT
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'administrador_academico'::text)))));

CREATE POLICY "users see own documents" ON "public"."enrollment_documents"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "users upload own documents" ON "public"."enrollment_documents"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "orientador insere mensagens em chats escalados" ON "public"."messages"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((sender = 'orientador'::text) AND (chat_id IN ( SELECT chats.id
   FROM public.chats
  WHERE (chats.status = 'escalated'::text))) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text))))));

CREATE POLICY "orientador ve mensagens de chats escalados" ON "public"."messages"
  FOR SELECT
  TO PUBLIC
  USING (((chat_id IN ( SELECT chats.id
   FROM public.chats
  WHERE (chats.status = 'escalated'::text))) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text))))));

CREATE POLICY "users insert own user messages" ON "public"."messages"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((sender = 'user'::text) AND (chat_id IN ( SELECT chats.id
   FROM public.chats
  WHERE (chats.user_id = auth.uid())))));

CREATE POLICY "users see messages of own chats" ON "public"."messages"
  FOR SELECT
  TO PUBLIC
  USING ((chat_id IN ( SELECT chats.id
   FROM public.chats
  WHERE (chats.user_id = auth.uid()))));

CREATE POLICY "sistema cria notificacoes para qualquer utilizador" ON "public"."notifications"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = ANY (ARRAY['administrador_academico'::text, 'orientador'::text]))))) OR (auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM public.chats
  WHERE ((chats.user_id = auth.uid()) AND (chats.status = 'escalated'::text)))) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.situacao = 'matriculado'::text))))));

CREATE POLICY "utilizador marca as proprias notificacoes como lidas" ON "public"."notifications"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id))
  WITH CHECK ((lida = true));

CREATE POLICY "utilizador ve as proprias notificacoes" ON "public"."notifications"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "orientador gere a propria disponibilidade" ON "public"."orientador_availability"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = orientador_id));

CREATE POLICY "todos podem ver disponibilidade" ON "public"."orientador_availability"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "matriculado cancela a propria sessao" ON "public"."orientation_sessions"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = matriculado_id))
  WITH CHECK ((estado = 'cancelada'::text));

CREATE POLICY "matriculado ve as proprias sessoes" ON "public"."orientation_sessions"
  FOR SELECT
  TO PUBLIC
  USING (((auth.uid() = matriculado_id) OR (auth.uid() = orientador_id)));

CREATE POLICY "matriculado verificado cria sessao" ON "public"."orientation_sessions"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((auth.uid() = matriculado_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.situacao = 'matriculado'::text) AND (profiles.verification_status = 'verified'::text))))));

CREATE POLICY "administrador atualiza profiles de orientadores" ON "public"."profiles"
  FOR UPDATE
  TO PUBLIC
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "administrador ve todos os profiles" ON "public"."profiles"
  FOR SELECT
  TO PUBLIC
  USING (public.is_admin());

CREATE POLICY "orientador ve profiles de matriculados e candidatos" ON "public"."profiles"
  FOR SELECT
  TO PUBLIC
  USING (public.is_orientador());

CREATE POLICY "users manage own profile" ON "public"."profiles"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = id));

CREATE POLICY "orientador ve resultados de testes" ON "public"."test_results"
  FOR SELECT
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'orientador'::text)))));

CREATE POLICY "users can insert own test results" ON "public"."test_results"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "users can view own test results" ON "public"."test_results"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "administrador ve todos os comprovativos" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING (((bucket_id = 'enrollment-documents'::text) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.papel = 'administrador_academico'::text))))));

CREATE POLICY "avatares sao publicos para leitura" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'avatars'::text));

CREATE POLICY "participantes fazem download" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING (((bucket_id = 'session-documents'::text) AND (auth.uid() IS NOT NULL)));

CREATE POLICY "participantes fazem upload" ON "storage"."objects"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((bucket_id = 'session-documents'::text) AND (auth.uid() IS NOT NULL)));

CREATE POLICY "utilizador faz upload do proprio avatar" ON "storage"."objects"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

CREATE POLICY "utilizador faz upload do proprio comprovativo" ON "storage"."objects"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((bucket_id = 'enrollment-documents'::text) AND (auth.uid() IS NOT NULL) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

CREATE POLICY "utilizador ve o proprio comprovativo" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING (((bucket_id = 'enrollment-documents'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."messages";

ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."profiles";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_orientador"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_orientador"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_orientador"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_orientador"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admitted_students" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."admitted_students" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admitted_students" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admitted_students" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."areas" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."areas" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."areas" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."areas" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."chats" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."chats" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."chats" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."chats" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."courses" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."documents" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."documents" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."documents" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."documents" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enrollment_documents" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."enrollment_documents" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enrollment_documents" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enrollment_documents" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."messages" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."messages" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."messages" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."messages" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."notifications" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."notifications" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."notifications" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."notifications" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orientador_availability" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."orientador_availability" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orientador_availability" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orientador_availability" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orientation_sessions" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."orientation_sessions" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orientation_sessions" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orientation_sessions" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_results" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."test_results" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_results" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."test_results" TO "service_role";

