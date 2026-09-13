import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, GraduationCap, Upload, CheckCircle2 } from 'lucide-react';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';
import { SupabaseAdmissionVerificationRepository } from '../../data/supabase/SupabaseAdmissionVerificationRepository';
import { SupabaseEnrollmentDocumentRepository } from '../../data/supabase/SupabaseEnrollmentDocumentRepository';
import type { CourseId } from '../../domain/test/TestQuestion';
import { completeMatriculadoVerification, } from '../../application/auth/registerMatriculado';

// Expressões Regulares para validação
const REGEX = {
    // Permite letras (incluindo acentos), espaços e pelo menos nome + sobrenome
    NOME_COMPLETO: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\s-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
    // Padrão RFC 5322 simplificado para e-mail
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Número de processo académico (ex: 20240192 ou números de 4 a 12 dígitos)
    NUMERO_PROCESSO: /^\d{4,12}$/,
    // Mínimo 8 caracteres: pelo menos uma letra maiúscula, uma minúscula e um número
    SENHA_FORTE: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

// Mapeamento de erros do Supabase / Backend para Português amigável
const translateErrorMessage = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes('user already registered') || msg.includes('already exists')) {
        return 'Este e-mail já está registado. Tenta iniciar sessão.';
    }
    if (msg.includes('password should be at least')) {
        return 'A palavra-passe deve ter pelo menos 8 caracteres.';
    }
    if (msg.includes('invalid email')) {
        return 'O endereço de e-mail introduzido é inválido.';
    }
    if (msg.includes('rate limit')) {
        return 'Muitas tentativas seguidas. Aguarda um momento antes de tentar novamente.';
    }
    if (msg.includes('network error') || msg.includes('failed to fetch')) {
        return 'Erro de ligação ao servidor. Verifica a tua rede.';
    }
    return errorMsg || 'Ocorreu um erro inesperado ao criar a conta.';
};

export default function RegisterMatriculadoPage() {
    const navigate = useNavigate();
    const authRepository = useMemo(() => new SupabaseAuthRepository(), []);
    const admissionRepo = useMemo(() => new SupabaseAdmissionVerificationRepository(), []);
    const documentRepo = useMemo(() => new SupabaseEnrollmentDocumentRepository(), []);

    // Estados do Formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [numeroProcesso, setNumeroProcesso] = useState('');
    const [cursoId, setCursoId] = useState<CourseId>('eng-informatica');
    const [documento, setDocumento] = useState<File | null>(null);

    // Estados de Controlo e Erro por Campo
    const [needsDocument, setNeedsDocument] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [createdUserId, setCreatedUserId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validação isolada
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        const cleanNome = nome.trim();
        if (!cleanNome) {
            errors.nome = 'O nome completo é obrigatório.';
        } else if (!REGEX.NOME_COMPLETO.test(cleanNome)) {
            errors.nome = 'Introduz o teu nome e sobrenome válidos.';
        }

        const cleanProcesso = numeroProcesso.trim();
        if (!cleanProcesso) {
            errors.numeroProcesso = 'O número de processo é obrigatório.';
        } else if (!REGEX.NUMERO_PROCESSO.test(cleanProcesso)) {
            errors.numeroProcesso = 'O processo deve conter apenas números (ex: 20240192).';
        }

        const cleanEmail = email.trim();
        if (!cleanEmail) {
            errors.email = 'O e-mail é obrigatório.';
        } else if (!REGEX.EMAIL.test(cleanEmail)) {
            errors.email = 'Introduz um endereço de e-mail válido (ex: aluno@instic.ao).';
        }

        if (!senha) {
            errors.senha = 'A palavra-passe é obrigatória.';
        } else if (!REGEX.SENHA_FORTE.test(senha)) {
            errors.senha = 'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número.';
        }

        if (needsDocument && !documento) {
            errors.documento = 'É obrigatório anexar o comprovativo para prosseguir.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitClick = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError(null);
        setShowConfirm(false);

        // Executa a validação por Regex antes de chamar os repositórios
        if (!validateForm()) return;

        setLoading(true);
        try {
            let result;

            if (createdUserId) {
                // 2.º submit: conta já existe, só falta completar verificação com o documento
                result = await completeMatriculadoVerification(
                    createdUserId,
                    { nome, numeroProcesso, cursoId, documento: documento ?? undefined },
                    admissionRepo, documentRepo,
                );
            } else {
                // 1.º submit: cria a conta
                const { userId } = await authRepository.signUp({ nome, email, senha, intent: 'matriculado' });
                setCreatedUserId(userId);
                result = await completeMatriculadoVerification(
                    userId,
                    { nome, numeroProcesso, cursoId, documento: documento ?? undefined },
                    admissionRepo, documentRepo,
                );
            }

            if (result.status === 'verified') {
                navigate('/student', { replace: true });
            } else if (result.status === 'pending') {
                navigate('/pending-verification', { replace: true });
            } else {
                setNeedsDocument(true);
                setGeneralError('Não te encontrámos na lista automática de admitidos. Anexa o teu comprovativo de matrícula.');
            }
        } catch (err) {
            const rawMessage = err instanceof Error ? err.message : 'Erro ao criar conta.';
            setGeneralError(translateErrorMessage(rawMessage));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen w-full flex bg-[#fbf8ff] antialiased">
            {/* LADO ESQUERDO: Painel Institucional */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden flex-col justify-between p-12 xl:p-16">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 filter brightness-[0.98] contrast-[0.95]"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#fbf8ff]/95 via-[#fbf8ff]/45 to-[#fbf8ff]/65 z-10" />

                <div className="relative z-20">
                    <div className="bg-white/90 backdrop-blur-md w-16 h-16 rounded-xl p-3 shadow-sm border border-white/60 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-primary">
                            <div className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center relative">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                            </div>
                            <span className="text-[8px] font-bold tracking-tight text-[#1a1b22] mt-0.5">InRumo</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 max-w-lg mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-semibold uppercase tracking-wider mb-4">
                        <GraduationCap className="w-4 h-4" />
                        <span>Estudante INSTIC</span>
                    </div>
                    <h1 className="font-heading text-4xl xl:text-[42px] leading-[1.15] font-bold text-[#1a1b22] tracking-tight mb-4">
                        Potencia a tua caminhada académica.
                    </h1>
                    <p className="font-body text-base text-[#504536] leading-relaxed max-w-md">
                        Conecta a tua conta de aluno para aceder ao assistente de IA, agendamento de mentorias com docentes e acompanhamento de carreira.
                    </p>
                </div>
            </div>

            {/* LADO DIREITO: Formulário de Cadastro */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 my-auto">
                <div className="w-full max-w-md space-y-6">

                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#504536] hover:text-primary transition-colors mb-2"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Alterar tipo de perfil</span>
                    </Link>

                    <div>
                        <h2 className="font-heading text-2xl sm:text-[28px] font-bold text-[#1a1b22] tracking-tight">
                            Criar Conta de Aluno
                        </h2>
                        <p className="font-body text-sm text-[#504536] mt-1.5">
                            Valida os teus dados de matrícula para ativar o acesso ao INSTIC.
                        </p>
                    </div>

                    <form onSubmit={handleSubmitClick} className="space-y-4" noValidate>
                        {/* Alerta de Erro Geral */}
                        {generalError && (
                            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs font-medium text-red-600 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{generalError}</span>
                            </div>
                        )}

                        {/* Nome Completo */}
                        <div className="space-y-1.5">
                            <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => {
                                    setNome(e.target.value);
                                    if (fieldErrors.nome) setFieldErrors((prev) => ({ ...prev, nome: '' }));
                                }}
                                placeholder="Ex: Emanuel João"
                                className={`w-full bg-white border ${fieldErrors.nome ? 'border-red-500 focus:ring-red-100' : 'border-[#e8e7f1] focus:border-primary focus:ring-primary/10'} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all`}
                            />
                            {fieldErrors.nome && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.nome}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* N.º de Processo */}
                            <div className="space-y-1.5">
                                <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                                    N.º de Processo
                                </label>
                                <input
                                    type="text"
                                    value={numeroProcesso}
                                    onChange={(e) => {
                                        setNumeroProcesso(e.target.value);
                                        if (fieldErrors.numeroProcesso) setFieldErrors((prev) => ({ ...prev, numeroProcesso: '' }));
                                    }}
                                    placeholder="Ex: 20240192"
                                    className={`w-full bg-white border ${fieldErrors.numeroProcesso ? 'border-red-500 focus:ring-red-100' : 'border-[#e8e7f1] focus:border-primary focus:ring-primary/10'} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all`}
                                />
                                {fieldErrors.numeroProcesso && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.numeroProcesso}</p>}
                            </div>

                            {/* Seleção do Curso */}
                            <div className="space-y-1.5">
                                <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                                    Curso
                                </label>
                                <select
                                    value={cursoId}
                                    onChange={(e) => setCursoId(e.target.value as CourseId)}
                                    className="w-full bg-white border border-[#e8e7f1] rounded-xl px-3 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                                >
                                    <option value="eng-informatica">Engenharia Informática</option>
                                    <option value="eng-telecom">Engenharia de Telecomunicações</option>
                                    <option value="informatica-gestao">Informática de Gestão</option>
                                </select>
                            </div>
                        </div>

                        {/* E-mail */}
                        <div className="space-y-1.5">
                            <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                                E-mail Institucional ou Pessoal
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                                }}
                                placeholder="exemplo@instic.ao"
                                className={`w-full bg-white border ${fieldErrors.email ? 'border-red-500 focus:ring-red-100' : 'border-[#e8e7f1] focus:border-primary focus:ring-primary/10'} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all`}
                            />
                            {fieldErrors.email && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.email}</p>}
                        </div>

                        {/* Palavra-passe */}
                        <div className="space-y-1.5">
                            <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                                Palavra-passe
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => {
                                    setSenha(e.target.value);
                                    if (fieldErrors.senha) setFieldErrors((prev) => ({ ...prev, senha: '' }));
                                }}
                                placeholder="Mínimo 8 chars (ex: Exemplo123)"
                                className={`w-full bg-white border ${fieldErrors.senha ? 'border-red-500 focus:ring-red-100' : 'border-[#e8e7f1] focus:border-primary focus:ring-primary/10'} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all`}
                            />
                            {fieldErrors.senha && <p className="text-[11px] font-medium text-red-500 mt-1">{fieldErrors.senha}</p>}
                        </div>

                        {/* Upload de comprovativo caso a pré-admissão falhe */}
                        {needsDocument && (
                            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                                <div className="flex items-start gap-2.5 text-amber-900">
                                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs font-medium leading-relaxed">
                                        Não localizámos o teu processo na lista de pré-admitidos. Por favor, anexa o comprovativo de matrícula (PDF ou imagem).
                                    </p>
                                </div>
                                <label className="flex items-center justify-center gap-2 w-full bg-white border border-dashed border-amber-300 rounded-lg p-3 text-xs font-semibold text-amber-900 hover:bg-amber-100/40 transition-colors cursor-pointer">
                                    {documento ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="truncate max-w-50">{documento.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 text-amber-600" />
                                            <span>Carregar Comprovativo</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                            setDocumento(e.target.files?.[0] ?? null);
                                            if (fieldErrors.documento) setFieldErrors((prev) => ({ ...prev, documento: '' }));
                                        }}
                                        className="hidden"
                                    />
                                </label>
                                {fieldErrors.documento && <p className="text-[11px] font-medium text-red-500">{fieldErrors.documento}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-on-primary font-bold text-sm py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-primary/20 disabled:opacity-50 cursor-pointer active:scale-[0.99] mt-2"
                        >
                            {loading ? 'A verificar registo...' : 'Criar Conta de Aluno'}
                        </button>

                        {showConfirm && (
                            <div className="fixed inset-0 z-60 bg-surface/40 flex items-center justify-center p-4">
                                <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full space-y-4">
                                    <p className="font-heading text-headline-sm text-on-surface">Confirma os teus dados</p>
                                    <p className="font-body-sm text-on-surface-variant">
                                        Número de processo: <strong>{numeroProcesso}</strong><br />
                                        Nome no registo: <strong>{nome}</strong>
                                    </p>
                                    <p className="font-body-sm text-xs text-on-surface-variant">
                                        Certifica-te que estes dados coincidem exactamente com os do teu processo de admissão — erros de escrita podem atrasar a validação.
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm font-medium">Corrigir</button>
                                        <button onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold bg-primary-container text-on-primary-container rounded-lg">Está correto</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="text-center text-xs text-[#504536] pt-2">
                        Já tens conta de aluno?{' '}
                        <Link to="/login" className="font-bold text-primary hover:underline">
                            Iniciar sessão
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}