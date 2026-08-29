import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';

export function useProfileData() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState<string | null>(null);
  const [studentCode, setStudentCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);

    const { data: student } = await supabase
      .from('students')
      .select('name, course_id, student_code')
      .eq('id', session.user.id)
      .single();

    if (student) {
      setStudentName(student.name);
      setStudentCode(student.student_code);

      if (student.course_id) {
        const { data: course } = await supabase.from('courses').select('name').eq('id', student.course_id).single();
        setCourseName(course?.name ?? null);
      } else {
        setCourseName(null);
      }
    }

    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }, [navigate]);

  return {
    userName: studentName,
    email: session?.user?.email ?? '',
    courseName,
    studentCode,
    loading,
    logout,
    refresh: load,
  };
}