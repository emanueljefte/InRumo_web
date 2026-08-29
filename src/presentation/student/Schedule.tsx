import React, { useState } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Video, 
  Info 
} from 'lucide-react';

interface Slot {
  time: string;
  available: boolean;
}

const AVAILABLE_SLOTS: Slot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: false },
  { time: '11:00', available: true },
  { time: '14:00', available: true },
  { time: '15:30', available: true },
  { time: '17:00', available: true },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(13);
  const [selectedTime, setSelectedTime] = useState<string>('11:00');

  // Dias do mês (Novembro 2023 / Mockup)
  const daysInMonth = Array.from({ length: 19 }, (_, i) => i + 1);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      
      {/* Topo Superior: Notificações & Perfil do Aluno */}
      <div className="flex justify-end items-center gap-3">
        <button 
          type="button"
          className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
          alt="Perfil Maria Santos"
          className="w-9 h-9 rounded-full object-cover border border-[#e8e7f1]"
        />
      </div>

      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Agendamento de Sessões
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Agende sua próxima conversa com um orientador vocacional.
        </p>
      </div>

      {/* Layout de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* LADO ESQUERDO: CALENDÁRIO & SELEÇÃO DE HORÁRIOS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Calendário */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-6">
            
            {/* Header do Mês */}
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-[#1a1b22]">
                Novembro 2023
              </h2>
              <div className="flex items-center gap-2 text-[#504536]">
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-[#f4f2fd] rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-[#f4f2fd] rounded-lg transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[#827564]">
              {weekDays.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Grelha de Dias */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center text-xs sm:text-sm font-medium">
              {/* Espaços vazios para alinhar a Terça-feira (Dia 1) */}
              <div />
              <div />

              {daysInMonth.map((day) => {
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#7e5700] text-white font-bold shadow-xs'
                        : 'text-[#1a1b22] hover:bg-[#f4f2fd]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: Horários Disponíveis */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-6">
            
            <div className="flex items-center gap-2 text-[#1a1b22]">
              <Clock className="w-5 h-5 text-[#7e5700]" />
              <h3 className="font-heading text-base font-bold">
                Horários para {selectedDay} de Nov
              </h3>
            </div>

            {/* Grelha de Slots de Horário */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVAILABLE_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.time && slot.available;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
                      !slot.available
                        ? 'bg-transparent text-[#827564]/50 border-[#e8e7f1] line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#fbf5e8] border-[#7e5700] text-[#7e5700]'
                        : 'bg-white border-[#d4c4b0]/70 text-[#1a1b22] hover:border-[#7e5700] hover:bg-[#fbf8ff]'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>

            {/* Botão de Confirmação */}
            <button
              type="button"
              disabled={!selectedTime}
              className="w-full bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold py-3.5 rounded-2xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 mt-4"
            >
              Confirmar Agendamento
              <CheckCircle2 className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* LADO DIREITO: PRÓXIMAS SESSÕES & DICA DE PREPARAÇÃO */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header das Próximas Sessões */}
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-[#1a1b22]">
              Próximas Sessões
            </h2>
            <button 
              type="button"
              className="text-xs font-bold text-[#7e5700] hover:underline"
            >
              Ver Histórico
            </button>
          </div>

          {/* Card da Sessão Agendada */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs space-y-5">
            
            {/* Tag + Foto do Orientador */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <span className="bg-[#e8f2fe] text-[#2b6cb0] text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                  ● Confirmado
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-[#1a1b22]">
                  Avaliação de Perfil
                </h3>
                <p className="font-body text-xs text-[#827564]">
                  Com Dra. Mariana Silva
                </p>
              </div>

              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
                alt="Dra. Mariana Silva"
                className="w-12 h-12 rounded-full object-cover border border-[#e8e7f1]"
              />
            </div>

            {/* Detalhes de Data e Hora */}
            <div className="space-y-2.5 pt-2 border-t border-[#e8e7f1]/60">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#504536]">
                <CalendarIcon className="w-4 h-4 text-[#827564]" />
                <span>Segunda-feira, 06 de Nov</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#504536]">
                <Clock className="w-4 h-4 text-[#827564]" />
                <span>14:00 - 15:00</span>
              </div>
            </div>

            {/* Link para Chamada */}
            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-[#f4f2fd] border border-[#d4c4b0] text-[#1a1b22] text-xs font-semibold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-center"
            >
              <Video className="w-4 h-4 text-[#7e5700]" />
              Entrar no Google Meet
            </a>

          </div>

          {/* Card de Preparação */}
          <div className="bg-[#f4f2fd]/60 rounded-3xl p-6 border border-[#e8e7f1] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#eeedf7] text-[#504536] flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>

            <h4 className="font-heading text-base font-bold text-[#1a1b22]">
              Preparação
            </h4>

            <p className="font-body text-xs text-[#504536] leading-relaxed max-w-xs mx-auto">
              Antes da sua sessão, lembre-se de preencher o questionário de interesses na aba "Testes".
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}