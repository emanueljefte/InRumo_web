import type { AvailabilitySlot, OrientadorInfo, OrientationSession } from "./OrientationSession";

export type ScheduleRepository = {
  getAvailability(): Promise<AvailabilitySlot[]>;
  getOrientadores(): Promise<OrientadorInfo[]>;
  getUpcomingSessions(orientadorIds: string[], from: Date, to: Date): Promise<OrientationSession[]>;
  createSession(matriculadoId: string, orientadorId: string, dataHora: string): Promise<void>;
  getSessionsForMatriculado(matriculadoId: string): Promise<OrientationSession[]>;
  cancelSession(sessionId: string): Promise<void>;
  getMyAvailability(orientadorId: string): Promise<AvailabilitySlot[]>;      // novo
  addAvailability(orientadorId: string, diaSemana: number, horaInicio: string, horaFim: string): Promise<void>; // novo
  removeAvailability(slotId: string): Promise<void>;                        // novo
  getSessionsForOrientador(orientadorId: string): Promise<OrientationSessionWithNome[]>; // novo
  concludeSession(sessionId: string): Promise<void>;                        // novo
};

export type OrientationSessionWithNome = OrientationSession & { matriculadoNome: string };