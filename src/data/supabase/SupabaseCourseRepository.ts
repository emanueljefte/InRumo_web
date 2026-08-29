import { supabase } from "../../api/supabase";
import type { Course } from "../../domain/course/Course";
import type { CourseRepository } from "../../domain/course/CourseRepository";
import type { CourseId } from "../test/questionBank";

export class SupabaseCourseRepository implements CourseRepository {
  async getCourse(id: CourseId): Promise<Course> {
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      curriculum: data.curriculum ?? [],
      areas: data.areas ?? [],
    };
  }
}