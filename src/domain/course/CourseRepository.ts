import type { CourseId } from "../test/TestQuestion";
import type { Course } from "./Course";

export type CourseRepository = {
  getCourse(id: CourseId): Promise<Course>;
};