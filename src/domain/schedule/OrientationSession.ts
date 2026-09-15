export type SessionStatus = 'marcada' | 'concluida' | 'cancelada';

export type AvailabilitySlot = {
  id: string;
  orientadorId: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
};

export type OrientationSession = {
  id: string;
  matriculadoId: string;
  orientadorId: string;
  dataHora: string;
  estado: SessionStatus;
  modo: 'presencial' | 'online';
  local: string | null;
  notasOrientador: string | null;
  motivoCancelamento: string | null;
};

export type OrientadorInfo = { id: string; nome: string };