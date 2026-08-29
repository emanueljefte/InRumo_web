import React, { useState } from 'react';
import { Compass, IdCard, ArrowLeft, Clock, ArrowRight } from 'lucide-react';

export default function ValidateStudentCodePage() {
  const [studentCode, setStudentCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'pending' | 'verified'>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) return;

    // Simulação de verificação
    setStatus('verifying');
    setTimeout(() => {
      // Podes alterar para 'verified' se a validação for instantânea via API
      setStatus('pending'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f2fd] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans antialiased">
      <div className="w-full max-w-160 bg-white rounded-3xl border border-[#e8e7f1] shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        
        {/* Conteúdo */}
        <div className="p-6 sm:p-8 md:p-10">
          
          {/* Topo: Logo & Indicador de Progresso (Passo 2 de 3) */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#7e5700] rounded-lg flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-heading text-lg font-bold text-[#1a1b22] tracking-tight">
                InRumo
              </span>
            </div>

            {/* Progresso: Passo 2 ativo */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-[#eeedf7]" />
              <div className="w-6 h-1.5 rounded-full bg-[#7e5700]" />
              <div className="w-6 h-1.5 rounded-full bg-[#eeedf7]" />
            </div>
          </div>

          {/* Estado Inicial ou Em Verificação */}
          {status !== 'pending' && status !== 'verified' && (
            <div>
              <div className="space-y-2 mb-6">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
                  Validar Matrícula no INSTIC
                </h1>
                <p className="font-body text-sm sm:text-base text-[#504536] leading-relaxed">
                  Insere o teu número de estudante para vincularmos a tua conta aos registos académicos do instituto.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="studentCode" className="block text-xs font-semibold text-[#1a1b22]">
                    Código / Nº de Estudante
                  </label>
                  <div className="relative flex items-center">
                    <IdCard className="absolute left-4 w-4 h-4 text-[#827564] pointer-events-none" />
                    <input
                      id="studentCode"
                      type="text"
                      placeholder="Ex: 20240192"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      required
                      className="w-full bg-[#f4f2fd]/60 text-sm text-[#1a1b22] pl-11 pr-4 py-3.5 rounded-2xl border focus:border-[#7e5700] focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#fbf5e8] rounded-2xl border border-[#d4c4b0]/50 text-xs text-[#504536] leading-relaxed">
                  💡 <strong>Nota:</strong> O código de estudante garante acesso aos módulos de orientação personalizados para o teu curso oficial.
                </div>

                <button
                  type="submit"
                  disabled={status === 'verifying' || !studentCode.trim()}
                  className="w-full bg-[#7e5700] hover:bg-[#604100] disabled:opacity-50 text-white font-semibold text-sm py-3.5 rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {status === 'verifying' ? 'A verificar com o INSTIC...' : 'Confirmar Código'}
                </button>
              </form>
            </div>
          )}

          {/* Estado: Aguardando Confirmação da Instituição */}
          {status === 'pending' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-[#fbf5e8] text-[#7e5700] rounded-full flex items-center justify-center mx-auto border border-[#d4c4b0]/60">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-[#1a1b22]">
                Aguardando Confirmação
              </h2>

              <p className="font-body text-sm text-[#504536] max-w-md mx-auto leading-relaxed">
                O teu código <strong className="font-mono text-[#1a1b22]">{studentCode}</strong> foi submetido. Estamos a validar os teus dados com a base do INSTIC.
              </p>

              <div className="p-4 bg-[#f4f2fd] rounded-2xl text-xs text-[#827564] text-left space-y-2">
                <p className="font-semibold text-[#1a1b22]">O que acontece a seguir?</p>
                <p>• Podes avançar para personalizar as tuas preferências de carreira.</p>
                <p>• O acesso completo ao histórico do curso será libertado assim que a validação for concluída.</p>
              </div>

              <button
                type="button"
                className="w-full bg-[#7e5700] hover:bg-[#604100] text-white font-semibold text-sm py-3.5 rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 mt-4"
              >
                Continuar para Passo 3
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Rodapé */}
        <div className="bg-[#f4f2fd]/60 border-t border-[#e8e7f1] p-4 sm:px-8 sm:py-4 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-[#504536] hover:text-[#1a1b22] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Passo 1
          </button>
        </div>

      </div>
    </div>
  );
}