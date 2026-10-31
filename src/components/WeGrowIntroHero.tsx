import React from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  GraduationCap,
  Code2,
  Award,
  ArrowDown,
  Target,
  Users,
  QrCode,
  Smartphone,
} from 'lucide-react';

interface WeGrowIntroHeroProps {
  onScrollToForm: () => void;
  onSelectOption: (tab: string) => void;
  registeredCount: number;
  onOpenQR?: () => void;
}

export const WeGrowIntroHero: React.FC<WeGrowIntroHeroProps> = ({
  onScrollToForm,
  onSelectOption,
  registeredCount,
  onOpenQR,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-8 pb-16 px-4 sm:px-6">
      {/* Background Subtle Grid & Light Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
        <img src="/wegrow-logo.png" alt="watermark" className="w-[600px] object-contain" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              Event Date: 31 October 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Sivakasi Campus • Opp. Ayyappan Kovil
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenQR && (
              <button
                type="button"
                onClick={onOpenQR}
                className="inline-flex items-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs"
                title="Scan QR code to open form on phone"
              >
                <QrCode className="w-3.5 h-3.5 text-orange-400" />
                <span>Registration QR</span>
              </button>
            )}
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-slate-300">Workshop Capacity:</span>
              <span className="font-mono font-bold text-orange-400">{registeredCount} / 30 Enrolled</span>
            </div>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Explanation (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-md inline-block">
                <img
                  src="/wegrow-logo.png"
                  alt="WeGrow Skill Campus"
                  className="h-10 sm:h-12 object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 block">
                  Skill Campus & B School
                </span>
                <span className="text-sm font-semibold text-slate-300 italic">
                  Building Skills. Growing Futures.
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Career Guidance Workshop <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                For College Students Passed Out
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Welcome to <strong>WeGrow Skill Campus</strong>! We bridge the gap between college graduation and industry employment. On <strong>31 October 2026</strong>, 30 selected college graduates will undergo a specialized hands-on <strong>HTML & CSS Web Development Skill Assessment</strong>, discover their job-readiness skill band, and receive a personalized career growth roadmap.
            </p>

            {/* Quick 3-Pillar Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> 1. Skill Assessment
                </div>
                <div className="text-xs text-slate-300">
                  HTML5 semantic structure, modern CSS Box Model, Flexbox & Grid layouts.
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 2. Unique Questions
                </div>
                <div className="text-xs text-slate-300">
                  Each student gets a different, randomized 15-question set for anti-cheating integrity.
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 3. Verified Report
                </div>
                <div className="text-xs text-slate-300">
                  Instant scorecard, skill rating, and personalized placement recommendations.
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onScrollToForm}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transform transition hover:scale-105"
              >
                <span>Fill Student Details Form Below</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {onOpenQR && (
                <button
                  type="button"
                  onClick={onOpenQR}
                  className="px-5 py-3.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-xs"
                  title="Scan with mobile camera to open registration form"
                >
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <span>Scan to Register (QR)</span>
                </button>
              )}

              <button
                onClick={() => onSelectOption('assessment')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition flex items-center gap-2"
              >
                <span>Take Skill Assessment</span>
              </button>

              <button
                onClick={() => onSelectOption('question-wise')}
                className="px-4 py-3.5 text-xs text-slate-300 hover:text-white underline font-medium"
              >
                View Question-Wise Report →
              </button>
            </div>
          </div>

          {/* Right Column: Mascot & Campus Info Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-blue-900/80 to-slate-900/90 border border-blue-700/50 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
              {/* Mascot Bubble */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-blue-800/80">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-orange-400/20 to-blue-600/20 border border-orange-400/40 p-1 flex items-center justify-center">
                    <img
                      src="/wegrow-mascot.webp"
                      alt="WeGrow Mascot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    MENTOR
                  </span>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 relative text-xs text-slate-200">
                  <div className="font-bold text-orange-300 mb-0.5">
                    WeGrow Career Advisor:
                  </div>
                  <p className="italic text-[11px] leading-snug">
                    "Welcome graduates! Fill your details below to receive your unique registration number and start your customized HTML & CSS skill challenge!"
                  </p>
                </div>
              </div>

              {/* Sivakasi Campus Details */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">WeGrow Skill Campus & B School</strong>
                    <span className="text-[11px] text-slate-400 leading-snug block">
                      193/1A, Ground Floor, Ayyappan Kovil Opp, Police Station Road, Sivakasi - 626 123
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <GraduationCap className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <strong className="text-white">Eligible Batch: </strong>
                    <span className="text-[11px] text-slate-400">College Passouts (B.Sc CS, BCA, B.E., B.Tech, Arts & Science)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Target className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <strong className="text-white">Workshop Focus: </strong>
                    <span className="text-[11px] text-orange-300 font-semibold">HTML & CSS Core Competency & Job Tracks</span>
                  </div>
                </div>
              </div>

              {/* 30 Students Quota Progress Bar + QR Access */}
              <div className="mt-5 pt-4 border-t border-blue-800/80">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Workshop Registration Status</span>
                  <span className="text-orange-400 font-mono font-bold">{registeredCount} of 30 Students</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-orange-400 to-amber-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((registeredCount / 30) * 100))}%` }}
                  />
                </div>

                {onOpenQR && (
                  <button
                    type="button"
                    onClick={onOpenQR}
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>Need QR to Register on Mobile? Click Here</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
