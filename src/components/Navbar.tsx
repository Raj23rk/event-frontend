import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Award,
  BarChart3,
  HelpCircle,
  Users,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  registeredCount?: number;
  onOpenQR?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  registeredCount = 0,
  onOpenQR,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const isLandingPage = pathname === '/' || pathname === '/register' || pathname === '/registration';

  // Determine current active module for badge
  const getModuleInfo = () => {
    if (pathname.startsWith('/assessment')) {
      return { label: 'Skill Assessment Portal', icon: CheckCircle2 };
    }
    if (pathname.startsWith('/scorecard')) {
      return { label: 'Student Scorecard & Certificate', icon: Award };
    }
    if (pathname.startsWith('/question-wise')) {
      return { label: 'Question-Wise Analytics', icon: BarChart3 };
    }
    if (pathname.startsWith('/question-bank')) {
      return { label: 'Question Bank Studio', icon: HelpCircle };
    }
    if (pathname.startsWith('/admin') || pathname.startsWith('/roster') || pathname.startsWith('/attendance')) {
      return { label: 'Admin: Exam Attendance & Roster', icon: Users };
    }
    return null;
  };

  const currentModule = getModuleInfo();

  const handleNavigate = (path: string, tabName?: string) => {
    if (setActiveTab && tabName) {
      setActiveTab(tabName);
    }
    navigate(path);
  };

  const handleScrollToForm = () => {
    if (isLandingPage) {
      const el = document.getElementById('registration-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleNavigate('/#registration-form', 'registration');
      setTimeout(() => {
        const el = document.getElementById('registration-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs no-print">
      {/* Top Brand Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-orange-400">
              <Calendar className="w-3.5 h-3.5" /> 31 October 2026
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 hidden sm:inline">
              WeGrow Skill Campus & B School, Sivakasi (Opp. Ayyappan Kovil, Police Station Rd)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-orange-400" /> Career Guidance Workshop
            </span>
            <span className="bg-blue-800 text-blue-200 px-2.5 py-0.5 rounded font-mono text-[11px] font-bold">
              Quota: {registeredCount}/30 Students
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo Brand */}
          <Link
            to="/"
            onClick={() => setActiveTab && setActiveTab('registration')}
            className="flex items-center gap-3 group text-left cursor-pointer"
            title="WeGrow Skill Campus - Home"
          >
            <div className="relative flex items-center">
              <img
                src="/wegrow-logo.png"
                alt="WeGrow Skill Campus"
                className="h-11 sm:h-12 object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="text-[12px] font-black tracking-wider uppercase text-blue-950">
                Assessment & Career Guidance
              </div>
              <div className="text-[11px] text-orange-600 font-bold italic tracking-tight">
                Building Skills. Growing Futures.
              </div>
            </div>
          </Link>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Registration QR Button (Always available for instant scanning) */}
            {onOpenQR && (
              <button
                type="button"
                onClick={onOpenQR}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1.5 shadow-xs"
                title="Open Student Form QR Code for mobile phones"
              >
                <QrCode className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline">Registration QR</span>
                <span className="sm:hidden">QR</span>
              </button>
            )}

            {!isLandingPage ? (
              <>
                {currentModule && (
                  <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200">
                    <currentModule.icon className="w-3.5 h-3.5 text-orange-500" />
                    <span>{currentModule.label}</span>
                  </div>
                )}

                {/* Show Attendance List button if not currently on admin/roster */}
                {pathname !== '/admin' && pathname !== '/roster' && pathname !== '/attendance' && (
                  <button
                    onClick={() => handleNavigate('/admin', 'roster')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-900" />
                    <span className="hidden sm:inline">Attendance List</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavigate('/', 'registration')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-950 hover:to-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition transform hover:scale-[1.02]"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
                  <span>Back to Home</span>
                </button>
              </>
            ) : (
              /* On landing page: Provide Student Form button and QR */
              <>
                <button
                  onClick={handleScrollToForm}
                  className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
                >
                  <span>Student Form</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">↓</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
