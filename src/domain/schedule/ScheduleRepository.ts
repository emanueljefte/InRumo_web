import type { AvailabilitySlot, OrientadorInfo, OrientationSession } from "./OrientationSession";

export type ScheduleRepository = {
  getAvailability(): Promise<AvailabilitySlot[]>;
  getOrientadores(): Promise<OrientadorInfo[]>;
  getUpcomingSessions(orientadorIds: string[], from: Date, to: Date): Promise<OrientationSession[]>;
  createSession(matriculadoId: string, orientadorId: string, dataHora: string, modo: 'presencial' | 'online', local?: string): Promise<OrientationSession>
  getSessionsForMatriculado(matriculadoId: string): Promise<OrientationSession[]>;
  cancelSession(sessionId: string): Promise<void>;
  getMyAvailability(orientadorId: string): Promise<AvailabilitySlot[]>;  
  addAvailability(orientadorId: string, diaSemana: number, horaInicio: string, horaFim: string): Promise<void>; 
  removeAvailability(slotId: string): Promise<void>;   
  getSessionsForOrientador(orientadorId: string): Promise<OrientationSessionWithNome[]>; 
  concludeSession(sessionId: string): Promise<void>;
  cancelSessionByOrientador(sessionId: string, motivo: string): Promise<void>;
  concludeSessionWithNotes(sessionId: string, notas: string): Promise<void>;
};

export type OrientationSessionWithNome = OrientationSession & { matriculadoNome: string };