import type { CreateOrientadorInput, OrientadorSummary } from "./OrientadorManagement";

export type OrientadorManagementRepository = {
  listOrientadores(): Promise<OrientadorSummary[]>;
  createOrientador(input: CreateOrientadorInput): Promise<void>;
  removeOrientador(id: string): Promise<void>;
};