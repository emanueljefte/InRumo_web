import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './presentation/auth/LoginPage';
import RegisterPage from './presentation/auth/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import SplashPage from './presentation/Splash';
import ForgotPasswordPage from './presentation/auth/ForgotPasswordPage';
import ResetPasswordPage from './presentation/auth/ResetPasswordPage';
import CandidateHomePage from './presentation/candidate/CandidateHomePage';
import CandidateResultsPage from './presentation/candidate/CandidateResults';
import CandidateProfilePage from './presentation/candidate/CandidateProfilePage';
import NotFoundPage from './components/NotFoundPage';
import { useAuth } from './application/auth/useAuth';
import { AuthProvider } from './application/auth/AuthProvider';
import VocationalTestPage from './presentation/test/VocationalTestPage';
import CandidateTopNavLayout from './presentation/candidate/CandidateTopNavLayout';
import ChatPage from './presentation/chat/ChatPage';
import ResultsPage from './presentation/test/ResultsPage';
import CompleteEnrollmentPage from './presentation/auth/CompleteEnrollmentPage';
import PublicLayout from './presentation/layout/PublicLayout';
import CourseDetailPage from './presentation/course/CourseDetailPage';
import RegisterChoicePage from './presentation/auth/RegisterChoicePage';
import RegisterMatriculadoPage from './presentation/auth/RegisterMatriculadoPage';
import PendingVerificationPage from './presentation/auth/PendingVerificationPage';
import CoursesCatalogPage from './presentation/course/CoursesCatalogPage';
import InRumoLandingPage from './presentation/landing/InRumoLandingPage';
import MatriculadoTestPage from './presentation/test/MatriculadoTestPage';
import MatriculadoResultsPage from './presentation/test/MatriculadoResultsPage';
import StudentHomePage from './presentation/student/StudentHome';
import SchedulePage from './presentation/student/SchedulePage';
import DocumentsPage from './presentation/student/DocumentsPage';
import OrientadorChatWrapper from './presentation/orientador/OrientadorChatWrapper';
import OrientadorLayout from './presentation/orientador/OrientadorLayout';
import OrientadorChatsPage from './presentation/orientador/OrientadorChatsPage';
import OrientadorAvailabilityPage from './presentation/orientador/OrientadorAvailabilityPage';
import OrientadorSessionsPage from './presentation/orientador/OrientadorSessionsPage';
import OrientadorHomePage from './presentation/orientador/OrientadorHomePage';
import EnrollmentReviewPage from './presentation/admin/EnrollmentReviewPage';
import AdminLayout from './presentation/admin/AdminLayout';
import ImportAdmittedStudentsPage from './presentation/admin/ImportAdmittedStudentsPage.';
import OrientadoresPage from './presentation/admin/OrientadorPage';
import StudentProfilePage from './presentation/student/Profile';
import TestFormatSelectionPage from './presentation/test/TestFormatSelectionPage';
import { RequireTestCompleted } from './presentation/candidate/RequireTestCompleted';


function ProtectedRoute({ children, allow }: { children: React.ReactNode; allow?: 'candidate' | 'matriculado' | 'orientador' | 'administrador' }) {
  const { session, profile, initializing } = useAuth();
  if (initializing) return null;
  if (!session) return <Navigate to="/login" replace />;

  if (allow === 'candidate' && profile?.situacao !== 'candidate') return <Navigate to="/" replace />;
  if (allow === 'matriculado' && profile?.situacao !== 'matriculado') return <Navigate to="/" replace />;
  if (allow === 'orientador' && profile?.papel !== 'orientador') return <Navigate to="/" replace />;

  if (allow === 'administrador' && profile?.papel !== 'administrador_academico') return <Navigate to="/" replace />;

  if (allow === 'matriculado' && profile?.verificationStatus === 'pending') return <Navigate to="/pending-verification" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/landingpage" element={<InRumoLandingPage />} />
          <Route path="/test" element={<VocationalTestPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterChoicePage />} />
          <Route path="/register/candidate" element={<RegisterPage />} />
          <Route path="/register/matriculado" element={<RegisterMatriculadoPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pending-verification" element={<PendingVerificationPage />} />

          <Route element={<PublicLayout />}>
            <Route path="/course" element={<CoursesCatalogPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
          </Route>

          <Route path="/complete-enrollment" element={<ProtectedRoute><CompleteEnrollmentPage /></ProtectedRoute>} />

          <Route path="/candidate" element={<ProtectedRoute allow="candidate"><CandidateTopNavLayout /></ProtectedRoute>}>
            <Route index element={<CandidateHomePage />} />
            <Route path="results" element={<CandidateResultsPage />} />

            <Route path="chat" element={<RequireTestCompleted><ChatPage allowEscalation={false} /></RequireTestCompleted>} /> 
            <Route path="profile" element={<CandidateProfilePage />} />
          </Route>

          <Route path="/student" element={<ProtectedRoute allow="matriculado"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<StudentHomePage />} />
            <Route path="test/format" element={<TestFormatSelectionPage />} />
            <Route path="test" element={<MatriculadoTestPage />} />
            <Route path="results" element={<MatriculadoResultsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="chat" element={<ChatPage allowEscalation={true} />} />
            <Route path="profile" element={<StudentProfilePage />} />
          </Route>

          <Route path="/orientador" element={<ProtectedRoute allow="orientador"><OrientadorLayout /></ProtectedRoute>}>
            <Route index element={<OrientadorHomePage />} />
            <Route path="chats" element={<OrientadorChatsPage />} />
            <Route path="chats/:chatId" element={<OrientadorChatWrapper />} />
            <Route path="sessions" element={<OrientadorSessionsPage />} />
            <Route path="availability" element={<OrientadorAvailabilityPage />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allow="administrador"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/enrollments" replace />} />
            <Route path="orientadores" element={<OrientadoresPage />} />
            <Route path="enrollments" element={<EnrollmentReviewPage />} />
            <Route path="import-admitted" element={<ImportAdmittedStudentsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}