import type { Profile } from "../../application/auth/AuthContext";
import type { CourseId } from "../test/TestQuestion";

export type UpdateProfileInput = { nome?: string, situacao?: 'matriculado' | 'candidate', cursoId?: CourseId, numeroProcesso?: string };

export type ProfileRepository = {
  getProfile(userId: string): Promise<Profile>;
  updateProfile(userId: string, input: UpdateProfileInput): Promise<void>;
};