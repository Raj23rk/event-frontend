import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { WeGrowIntroHero } from './components/WeGrowIntroHero';
import { RegistrationForm } from './components/RegistrationForm';
import { WorkshopNextOptions } from './components/WorkshopNextOptions';
import { AssessmentPortal } from './components/AssessmentPortal';
import { StudentScorecard } from './components/StudentScorecard';
import { QuestionWiseReport } from './components/QuestionWiseReport';
import { QuestionBankManager } from './components/QuestionBankManager';
import { WorkshopRoster } from './components/WorkshopRoster';
import { RegistrationQRCodeModal } from './components/RegistrationQRCodeModal';
import { InternshipLandingPage } from './components/InternshipLandingPage';
import { InternshipAdminPage } from './components/InternshipAdminPage';
import { api } from './services/api';
import { Student, AssessmentSession } from './types';
import { MapPin, Sparkles } from 'lucide-react';

// Home / Registration Page (Second Image View)
const HomePage: React.FC<{
  registeredCount: number;
  onRegistered: (student: Student) => void;
  onOpenQR: () => void;
}> = ({ registeredCount, onRegistered, onOpenQR }) => {
  const navigate = useNavigate();

  const handleScrollToForm = () => {
    const el = document.getElementById('registration-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoToAssessment = (studentId: string) => {
    navigate(`/assessment/${studentId}`);
  };

  const handleSelectOption = (tab: string) => {
    if (tab === 'assessment') navigate('/assessment');
    else if (tab === 'scorecard') navigate('/scorecard');
    else if (tab === 'question-wise') navigate('/question-wise');
    else if (tab === 'question-bank') navigate('/question-bank');
    else if (tab === 'roster') navigate('/admin');
    else navigate('/');
  };

  return (
    <div className="space-y-4">
      {/* 1. FIRST: Explain WeGrow & Workshop Background */}
      <WeGrowIntroHero
        onScrollToForm={handleScrollToForm}
        onSelectOption={handleSelectOption}
        registeredCount={registeredCount}
        onOpenQR={onOpenQR}
      />

      {/* 2. THEN: Student Details Registration Form */}
      <RegistrationForm
        onRegistered={onRegistered}
        onGoToAssessment={handleGoToAssessment}
      />

      {/* 3. NEXT: Available Workshop Portals & Options */}
      <WorkshopNextOptions
        onSelectOption={handleSelectOption}
        onScrollToForm={handleScrollToForm}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStudentId, setActiveStudentId] = useState<string>('');
  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  useEffect(() => {
    fetchCount();
  }, [location.pathname]);

  const fetchCount = async () => {
    try {
      const summary = await api.getWorkshopOverview();
      setRegisteredCount(summary.totalRegistered || 0);
    } catch (e) {
      // ignore
    }
  };

  const handleStudentRegistered = (student: Student) => {
    setActiveStudentId(student._id);
    fetchCount();
  };

  const handleAssessmentCompleted = (session: AssessmentSession) => {
    setActiveSession(session);
    setActiveStudentId(session.studentId);
    navigate(`/scorecard/${session.studentId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navbar with brand assets & route detection */}
      <Navbar
        registeredCount={registeredCount}
        onOpenQR={() => setShowQRModal(true)}
      />

      {/* Global QR Code Modal for Second Image URL */}
      <RegistrationQRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        registeredCount={registeredCount}
      />

      {/* Main Content Area with Separate Routing */}
      <main className="flex-1 pb-16">
        <Routes>
          {/* Main Landing & Student Registration Routes (Second Image URL) */}
          <Route
            path="/"
            element={
              <HomePage
                registeredCount={registeredCount}
                onRegistered={handleStudentRegistered}
                onOpenQR={() => setShowQRModal(true)}
              />
            }
          />
          <Route
            path="/register"
            element={
              <HomePage
                registeredCount={registeredCount}
                onRegistered={handleStudentRegistered}
                onOpenQR={() => setShowQRModal(true)}
              />
            }
          />
          <Route
            path="/registration"
            element={
              <HomePage
                registeredCount={registeredCount}
                onRegistered={handleStudentRegistered}
                onOpenQR={() => setShowQRModal(true)}
              />
            }
          />

          {/* Admin Attendance & Roster Routes (First Image URL) */}
          <Route
            path="/admin"
            element={
              <WorkshopRoster
                onSelectStudentScorecard={(studentId) => navigate(`/scorecard/${studentId}`)}
                onGoToRegistration={() => navigate('/#registration-form')}
              />
            }
          />
          <Route
            path="/roster"
            element={
              <WorkshopRoster
                onSelectStudentScorecard={(studentId) => navigate(`/scorecard/${studentId}`)}
                onGoToRegistration={() => navigate('/#registration-form')}
              />
            }
          />
          <Route
            path="/attendance"
            element={
              <WorkshopRoster
                onSelectStudentScorecard={(studentId) => navigate(`/scorecard/${studentId}`)}
                onGoToRegistration={() => navigate('/#registration-form')}
              />
            }
          />

          {/* Skill Assessment Portal Routes */}
          <Route
            path="/assessment"
            element={
              <AssessmentPortal
                initialStudentId={activeStudentId}
                onAssessmentCompleted={handleAssessmentCompleted}
                onGoToRegistration={() => navigate('/')}
              />
            }
          />
          <Route
            path="/assessment/:studentId"
            element={
              <AssessmentPortal
                onAssessmentCompleted={handleAssessmentCompleted}
                onGoToRegistration={() => navigate('/')}
              />
            }
          />

          {/* Student Scorecard & Certificate Routes */}
          <Route
            path="/scorecard"
            element={
              <StudentScorecard
                initialSession={activeSession}
                onRetakeOrNew={() => navigate('/')}
              />
            }
          />
          <Route
            path="/scorecard/:studentId"
            element={
              <StudentScorecard
                onRetakeOrNew={() => navigate('/')}
              />
            }
          />

          {/* Question-Wise Analytics Route */}
          <Route path="/question-wise" element={<QuestionWiseReport />} />
          <Route path="/admin/question-wise" element={<QuestionWiseReport />} />

          {/* Question Bank Manager Route */}
          <Route path="/question-bank" element={<QuestionBankManager />} />
          <Route path="/admin/question-bank" element={<QuestionBankManager />} />

          {/* Internship Student Landing Page (with Form, Payment Gateway, Receipt) */}
          <Route
            path="/internship"
            element={
              <InternshipLandingPage
                onGoToAdmin={() => navigate('/internship-admin')}
                onGoToWorkshop={() => navigate('/')}
              />
            }
          />
          <Route
            path="/internships"
            element={
              <InternshipLandingPage
                onGoToAdmin={() => navigate('/internship-admin')}
                onGoToWorkshop={() => navigate('/')}
              />
            }
          />

          {/* Internship Admin Page (Bookings, Pre-booking revenue, Resend receipts) */}
          <Route
            path="/internship-admin"
            element={
              <InternshipAdminPage
                onBackToLanding={() => navigate('/internship')}
                onGoToWorkshop={() => navigate('/')}
              />
            }
          />
          <Route
            path="/internships-admin"
            element={
              <InternshipAdminPage
                onBackToLanding={() => navigate('/internship')}
                onGoToWorkshop={() => navigate('/')}
              />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 no-print text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src="/wegrow-logo.png" alt="WeGrow Logo" className="h-10 object-contain bg-white p-1 rounded" />
                <span className="font-extrabold text-white text-base">WeGrow Skill Campus</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Building Skills. Growing Futures. Empowering college passouts with practical industry engineering, web technologies, and personalized placement roadmaps.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Event Details • 31 October 2026
              </h4>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>193/1A, Ground Floor, Ayyappan Kovil Opp, Police Station Road, Sivakasi - 626 123</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Career Guidance & HTML/CSS Skill Evaluation Workshop</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Workshop Operations
              </h4>
              <div className="space-y-2 text-[11px] text-slate-400">
                <div>
                  <strong className="text-slate-200">Tech Stack:</strong> React Frontend, Nest.js Backend, MongoDB
                </div>
                <div>
                  <strong className="text-slate-200">Assessment Integrity:</strong> Per-student randomized question distribution & shuffled options
                </div>
                <div>
                  <strong className="text-slate-200">Max Reporting:</strong> Question-wise analytics, accuracy ratings & custom question authoring
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
            <span>© 2026 WeGrow Skill Campus & B School, Sivakasi. All rights reserved.</span>
            <span className="text-orange-400 font-semibold">Career Guidance Workshop • Oct 31, 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
