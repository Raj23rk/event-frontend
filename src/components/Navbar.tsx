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
  Briefcase,
  Phone,
  MessageCircle,
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
  const isWorkshopLanding = pathname === '/' || pathname === '/register' || pathname === '/registration';
  const isInternshipLanding = pathname === '/internship' || pathname === '/internships';
  const isInternshipAdmin = pathname === '/internship-admin' || pathname === '/internships-admin';
  const isWorkshopAdmin = pathname === '/admin' || pathname === '/roster' || pathname === '/attendance';

  // Determine current active module for badge
  const getModuleInfo = () => {
    if (isInternshipLanding) {
      return { label: 'Internship 2026 Portal', icon: Briefcase };
    }
    if (isInternshipAdmin) {
      return { label: 'Internship Admin & Pre-bookings', icon: ShieldCheck };
    }
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
    if (isWorkshopAdmin) {
      return { label: 'Admin: Exam Attendance & Roster', icon: Users };
    }
    return null;
  };

  const currentModule = getModuleInfo();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs no-print">
      {/* Top Brand Banner with Enquiry Helpline 9344337331 */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-orange-400">
              <Calendar className="w-3.5 h-3.5" /> WeGrow Skill Campus & B School, Sivakasi
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-300 hidden md:inline">
              193/1A Police Station Road (Opp. Ayyappan Kovil)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 text-[11px]">
              <Phone className="w-3 h-3 text-orange-400" />
              <span>For Enquiry: </span>
              <a href="tel:9344337331" className="text-white hover:text-amber-200 font-mono font-black underline">
                9344337331
              </a>
            </div>

            <a
              href="https://wa.me/919344337331"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>

            <span className="bg-blue-800 text-blue-200 px-2.5 py-0.5 rounded font-mono text-[11px] font-bold">
              Quota: {registeredCount}/30
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2.5 sm:py-3">
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group text-left cursor-pointer shrink-0"
            title="WeGrow Skill Campus - Home"
          >
            <div className="relative flex items-center">
              <img
                src="/wegrow-logo.png"
                alt="WeGrow Skill Campus"
                className="h-10 sm:h-12 object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="border-l border-slate-200 pl-3 hidden xs:block sm:block">
              <div className="text-[12px] font-black tracking-wider uppercase text-blue-950">
                Skill Campus & B School
              </div>
              <div className="text-[11px] text-orange-600 font-bold italic tracking-tight">
                Building Skills. Growing Futures.
              </div>
            </div>
          </Link>

          {/* Navigation Mode Switcher: Workshop vs Internship vs Admin */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {/* 1. Internship 2026 Button (New High-Value Portal) */}
            <Link
              to="/internship"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isInternshipLanding
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-300'
                  : 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-orange-600" />
              <span>Internship 2026</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${isInternshipLanding ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>
                ₹1000
              </span>
            </Link>

            {/* 2. Career Guidance Workshop (Original) */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isWorkshopLanding
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Oct 31 Workshop</span>
              <span className="sm:hidden">Workshop</span>
            </Link>

            {/* 3. Internship Admin Portal Button */}
            <Link
              to="/internship-admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isInternshipAdmin
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-orange-400'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Admin view of ₹1000 pre-bookings & students"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden md:inline">Internship Admin</span>
              <span className="md:hidden">Admin</span>
            </Link>

            {/* 4. Workshop Attendance Portal */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isWorkshopAdmin
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 border border-slate-200 hidden lg:flex'
              }`}
              title="Workshop 30-student attendance list"
            >
              <Users className="w-3.5 h-3.5 text-blue-900" />
              <span>Workshop Roster</span>
            </Link>

            {/* Quick Registration QR Button */}
            {onOpenQR && (
              <button
                type="button"
                onClick={onOpenQR}
                className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1.5 shrink-0"
                title="Scan QR Code"
              >
                <QrCode className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline">QR</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
