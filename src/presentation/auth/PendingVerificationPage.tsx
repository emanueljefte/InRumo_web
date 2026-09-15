import { useEffect, useState } from 'react';
import {
  Clock,
  ArrowLeft,
  LogOut,
  Mail,
  RefreshCw,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../api/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../application/auth/useAuth';

export default function PendingVerificationPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (profile?.verificationStatus === 'verified') {
      navigate('/student', { replace: true });
    } else if (profile?.verificationStatus === 'rejected') {
      navigate('/enrollment-rejected', { replace: true }); 
    }
  }, [profile, navigate]);

  // Recarregar a página para verificar se a conta já foi aprovada
  const handleCheckStatus = async () => {
    setChecking(true);
    // Simula uma pequena checagem (podes re-executar auth check ou reload)
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Terminar sessão para poder trocar de conta
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest/60 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Elementos Decorativos de Fundo (Glow Effect) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-6 shadow-xl relative z-10 animate-scaleIn">
        
        {/* Ícone com Animação e Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px] uppercase tracking-wider border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Em Validação
          </span>
        </div>

        {/* Mensagem Principal */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            Conta em Análise
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            O teu comprovativo de matrícula foi enviado com sucesso e está a ser analisado pela <strong className="text-on-surface">Administração Académica</strong>.
          </p>
        </div>

        {/* Cartão Informativo de Passos Seguintes */}
        <div className="bg-surface-container-low/80 border border-outline-variant/40 rounded-2xl p-4 space-y-2 text-left">
          <p className="font-heading text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-primary" />
            O que acontece agora?
          </p>
          <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc list-inside">
            <li>Receberás uma notificação por e-mail após a validação.</li>
            <li>O processo de verificação costuma demorar até 24 horas úteis.</li>
          </ul>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3 pt-2">
          
          {/* Botão de Verificar Atualização */}
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'A verificar...' : 'Verificar Estado da Conta'}</span>
          </button>

          {/* Opção Voltar para Home / Terminar Sessão */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold text-xs px-3 py-2.5 rounded-xl transition-all border border-outline-variant/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Página Inicial</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 bg-error/10 hover:bg-error/20 text-error font-semibold text-xs px-3 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta</span>
            </button>
          </div>

        </div>

        {/* Rodapé de Suporte */}
        <div className="border-t border-outline-variant/30 pt-4 text-center">
          <a
            href="mailto:suporte@inrumo.edu.ao"
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant/80 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Precisa de ajuda? Contacte o suporte</span>
          </a>
        </div>

      </div>
    </div>
  );
}