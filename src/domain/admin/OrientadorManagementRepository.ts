import type { CreateOrientadorInput, OrientadorSummary } from "./OrientadorManagement";

export type CreateOrientadorResult = { userId: string; tempPassword?: string };

export type OrientadorManagementRepository = {
  listOrientadores(): Promise<OrientadorSummary[]>;
  createOrientador(input: CreateOrientadorInput): Promise<CreateOrientadorResult>;
  removeOrientador(id: string): Promise<void>;
};