import React from 'react';
import {
  CheckCircle2,
  Award,
  BarChart3,
  HelpCircle,
  Users,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';

interface WorkshopNextOptionsProps {
  onSelectOption: (tab: string) => void;
  onScrollToForm: () => void;
}

export const WorkshopNextOptions: React.FC<WorkshopNextOptionsProps> = ({
  onSelectOption,
  onScrollToForm,
}) => {
  const options = [
    {
      id: 'assessment',
      title: 'Option 1: Take Skill Assessment',
      badge: 'Live Exam Portal',
      badgeColor: 'bg-orange-500 text-white',
      icon: CheckCircle2,
      description:
        'Launch the 15-question randomized HTML & CSS assessment. Features live 20-minute countdown, code snippets, option shuffling, and instant answer capture.',
      highlights: ['15 Questions per student', 'HTML5 & CSS Box Model', 'Live timer & code blocks'],
      buttonText: 'Launch Assessment Portal',
      buttonClass: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white',
    },
    {
      id: 'scorecard',
      title: 'Option 2: Scorecard & Certificate',
      badge: 'Results & Guidance',
      badgeColor: 'bg-blue-600 text-white',
      icon: Award,
      description:
        'View complete evaluation scores, domain mastery (HTML % vs CSS %), skill band rating, and print the official WeGrow certificate of participation.',
      highlights: ['Instant score & percentage', 'Personalized career roadmap', 'Printable A4 certificate'],
      buttonText: 'View Scorecard & Certificate',
      buttonClass: 'bg-blue-900 hover:bg-blue-950 text-white',
    },
    {
      id: 'question-wise',
      title: 'Option 3: Question-Wise Analysis',
      badge: 'Max Comprehensive Report',
      badgeColor: 'bg-purple-600 text-white',
      icon: BarChart3,
      description:
        'Explore question-by-question analytics across the entire 30-student batch. Check accuracy rates, option choice distributions, and student misconception drilldowns.',
      highlights: ['Accuracy % per question', 'A/B/C/D option distribution', 'Student error tracking'],
      buttonText: 'Open Question-Wise Analytics',
      buttonClass: 'bg-purple-700 hover:bg-purple-800 text-white',
    },
    {
      id: 'question-bank',
      title: 'Option 4: Question Bank & Custom Questions',
      badge: '36+ Questions Pool',
      badgeColor: 'bg-amber-600 text-white',
      icon: HelpCircle,
      description:
        'Manage the question library and create custom mentor questions with HTML/CSS code snippets. Custom questions are dynamically randomized into student tests.',
      highlights: ['36+ default questions', 'Author custom questions', 'Live code snippets'],
      buttonText: 'Open Question Studio',
      buttonClass: 'bg-slate-800 hover:bg-slate-900 text-white',
    },
    {
      id: 'roster',
      title: 'Option 5: Batch Roster & Ranks',
      badge: 'Quota: 30 Students',
      badgeColor: 'bg-emerald-600 text-white',
      icon: Users,
      description:
        'Monitor workshop enrollment, student rankings, score leaderboards, test progress, and download complete batch results in a one-click CSV spreadsheet.',
      highlights: ['Top student leaderboard', 'Live test completion status', 'One-click CSV download'],
      buttonText: 'View Batch Leaderboard',
      buttonClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto my-12 px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Workshop Portals & Next Steps
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
          Next Options: Explore the Complete Workshop Platform
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Once students are registered using the form above, proceed to any of the modules below to administer assessments, evaluate results, inspect question analytics, and export student reports.
        </p>
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between p-6 group hover:-translate-y-1"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition">
                    <Icon className="w-6 h-6 text-blue-900" />
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${opt.badgeColor}`}
                  >
                    {opt.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-blue-950 mb-2 group-hover:text-orange-600 transition">
                  {opt.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {opt.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {opt.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectOption(opt.id)}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${opt.buttonClass}`}
              >
                <span>{opt.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Back to Form Card */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-100/70 rounded-3xl border border-orange-200 p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-200 text-orange-900 px-2.5 py-1 rounded-full">
              Intake Process
            </span>
            <h3 className="text-base font-extrabold text-blue-950 mt-3 mb-2">
              Need to Register More Students?
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              WeGrow allows up to 30 college passouts for this workshop batch. Fill out the official Student Details Form above to enroll.
            </p>
          </div>

          <button
            onClick={onScrollToForm}
            className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>Scroll Back to Registration Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
