import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useNewSession } from '../../features/scheduling/useNewSession';

export default function NewSessionPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { dates, timesForDate, booking, confirm } = useNewSession(selectedDate);
  const navigate = useNavigate();
  const timesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timesRef.current) {
      gsap.fromTo(
        timesRef.current.children,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, stagger: 0.02, ease: 'power1.out' },
      );
    }
  }, [selectedDate]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    await confirm(selectedDate, selectedTime);
    navigate('/schedule');
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl text-text mb-2">Marcar sessão</h1>
      <p className="text-textMuted text-sm mb-8">Escolhe um dia e horário disponível</p>

      <p className="text-textMuted text-xs mb-2">Dia</p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {dates.map((d) => (
          <button
            key={d.iso}
            onClick={() => { setSelectedDate(d.iso); setSelectedTime(null); }}
            className={`flex flex-col items-center rounded-md px-4 py-3 min-w-[56px] transition-colors ${
              selectedDate === d.iso ? 'bg-primary text-white' : 'bg-surface border border-border text-text hover:border-primary/40'
            }`}
          >
            <span className="text-[11px] opacity-70">{d.weekday}</span>
            <span className="font-heading text-base mt-0.5">{d.day}</span>
          </button>
        ))}
      </div>

      {selectedDate && (
        <>
          <p className="text-textMuted text-xs mb-2">Horário</p>
          {timesForDate.length === 0 ? (
            <p className="text-textMuted text-sm mb-6">Sem horários disponíveis nesse dia.</p>
          ) : (
            <div ref={timesRef} className="flex flex-wrap gap-2 mb-6">
              {timesForDate.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    selectedTime === time ? 'bg-primary text-white' : 'bg-surface border border-border text-text hover:border-primary/40'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime || booking}
        className="bg-primary text-white font-heading rounded-md px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {booking ? 'Marcando...' : 'Confirmar sessão'}
      </button>
    </div>
  );
}