import { useEffect, useState } from "react";
import type { CourseRepository } from "../../domain/course/CourseRepository";
import type { CourseId } from "../../domain/test/TestQuestion";
import type { Course } from "../../domain/course/Course";

export function useCourse(id: CourseId | undefined, courseRepository: CourseRepository) {
  const [course, setCourse] = useState<Course | null>(null);
 useEffect(() => {
    if (!id) return;

    let ignore = false;

    courseRepository.getCourse(id).then((c) => {
      if (!ignore) setCourse(c);
    });

    return () => {
      ignore = true;
    };
  }, [id, courseRepository]);

  const loading = course?.id !== id; // deriva do estado atual, sem setState explícito

  return { course, loading };
}