import { useParams } from 'react-router-dom';
import ChatPage from '../chat/ChatPage';

export default function OrientadorChatWrapper() {
  const { chatId } = useParams<{ chatId: string }>();
  if (!chatId) return null;
  return <ChatPage allowEscalation={false} chatId={chatId} senderRole="orientador" />;
}