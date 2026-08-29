import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './presentation/auth/LoginPage';
import RegisterPage from './presentation/auth/RegisterPage';
import SelectCoursePage from './presentation/auth/SelectCourse';
import DashboardLayout from './layouts/DashboardLayout';
import TestsPage from './presentation/student/Tests';
import SchedulePage from './presentation/student/Schedule';
import DocumentsPage from './presentation/student/Documents';
import ProfilePage from './presentation/student/Profile';
import SplashPage from './presentation/Splash';
import OnboardingPage from './presentation/Onboarding';
import ForgotPasswordPage from './presentation/auth/ForgotPasswordPage';
import ResetPasswordPage from './presentation/auth/ResetPasswordPage';
import ResultDetailPage from './presentation/results/ResultDetail';
import NewSessionPage from './presentation/schedule/New';
import InRumo from './presentation/landing/InRumoLandingPage';
import ValidateStudentCodePage from './presentation/auth/ValidateStudentCode';
import StudentHomePage from './presentation/student/StudentHome';
import CandidateHomePage from './presentation/candidate/CandidateHomePage';
import CandidateResultsPage from './presentation/candidate/CandidateResults';
import CandidateProfilePage from './presentation/candidate/CandidateProfilePage';
import CoursesCatalogPage from './presentation/candidate/CourseCatalog';
import CourseDetailPage from './presentation/candidate/CourseDetail';
import NotFoundPage from './components/NotFoundPage';
import { useAuth } from './application/auth/useAuth';
import { AuthProvider } from './application/auth/AuthProvider';
import VocationalTestPage from './presentation/test/VocationalTestPage';
import CandidateTopNavLayout from './presentation/candidate/CandidateTopNavLayout';
import ChatPage from './presentation/chat/ChatPage';
import ResultsPage from './presentation/test/ResultsPage';
import CompleteEnrollmentPage from './presentation/auth/CompleteEnrollmentPage';

function ProtectedRoute({ children, allow }: { children: React.ReactNode; allow?: 'candidate' | 'student' }) {
  const { session, profile, initializing } = useAuth();
  if (initializing) return null;
  if (!session) return <Navigate to="/login" replace />;
  if (allow && profile?.situacao !== allow) return <Navigate to="/" replace />;
  if (allow === 'student' && profile?.verificationStatus === 'pending') {
  return <Navigate to="/pending-verification" replace />;
}
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/landingpage" element={<InRumo />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-enrollment" element={<ProtectedRoute><CompleteEnrollmentPage /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/select-course" element={<SelectCoursePage />} />
          <Route path="/validate-code" element={<ValidateStudentCodePage />} />
          <Route path="/course" element={<CoursesCatalogPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/test" element={<VocationalTestPage />} /> {/* modo anónimo */}

          <Route path="/results" element={<ResultsPage />} />

          <Route path="/candidate" element={<ProtectedRoute allow="candidate"><CandidateTopNavLayout /></ProtectedRoute>}>
            <Route index element={<CandidateHomePage />} />
            <Route path="results" element={<CandidateResultsPage />} />
            <Route path="chat" element={<ChatPage allowEscalation={false} />} />
            <Route path="course" element={<CoursesCatalogPage />} />
            <Route path="course/:id" element={<CourseDetailPage />} />
            <Route path="profile" element={<CandidateProfilePage />} />
          </Route>

          <Route path="/student" element={<ProtectedRoute allow="student"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<StudentHomePage />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="results" element={<Navigate to="/results/history" replace />} />
            <Route path="results/history" element={<ResultsPage />} />
            <Route path="results/:id" element={<ResultDetailPage />} />
            <Route path="chat" element={<ChatPage allowEscalation={true} />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="schedule/new" element={<NewSessionPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}