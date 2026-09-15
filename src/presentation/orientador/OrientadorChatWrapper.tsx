import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import ChatPage from '../chat/ChatPage';
import { StudentResultBanner } from './StudentResultBanner';

type ChatWithProfileRow = {
  user_id: string;
  profiles: { nome: string } | null;
};

export default function OrientadorChatWrapper() {
  const { chatId } = useParams<{ chatId: string }>();
  const [studentInfo, setStudentInfo] = useState<{ userId: string; nome: string } | null>(null);


  useEffect(() => {
    if (!chatId) return;
    supabase.from('chats').select('user_id, profiles(nome)').eq('id', chatId).single()
      .then(({ data }) => {
        const row = data as ChatWithProfileRow | null;
        setStudentInfo(row ? { userId: row.user_id, nome: row.profiles?.nome ?? 'Estudante' } : null);
      });
  }, [chatId]);

  if (!chatId) return null;

  return (
    <div>
      {studentInfo && <StudentResultBanner userId={studentInfo.userId} />}
      <ChatPage allowEscalation={false} chatId={chatId} senderRole="orientador" studentNome={studentInfo?.nome} />
    </div>
  );
}