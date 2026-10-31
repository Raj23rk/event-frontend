import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AssessmentSession, Student } from '../types';
import {
  Award,
  CheckCircle,
  XCircle,
  Printer,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Code2,
} from 'lucide-react';

interface StudentScorecardProps {
  initialSession?: AssessmentSession | null;
  onRetakeOrNew?: () => void;
}

export const StudentScorecard: React.FC<StudentScorecardProps> = ({
  initialSession,
  onRetakeOrNew,
}) => {
  const { studentId: routeStudentId } = useParams<{ studentId?: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<AssessmentSession | null>(initialSession || null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(routeStudentId || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
    } else if (routeStudentId) {
      setSelectedStudentId(routeStudentId);
      loadStudentAssessment(routeStudentId);
      loadStudents();
    } else {
      loadStudents();
    }
  }, [initialSession, routeStudentId]);

  const handleBackToHome = () => {
    if (onRetakeOrNew) {
      onRetakeOrNew();
    } else {
      navigate('/');
    }
  };

  const loadStudents = async () => {
    try {
      const list = await api.getStudents();
      const completed = list.filter((s) => s.status === 'completed');
      setStudents(completed);
      if (completed.length > 0 && !selectedStudentId) {
        setSelectedStudentId(completed[0]._id);
        loadStudentAssessment(completed[0]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadStudentAssessment = async (studentId: string) => {
    try {
      setLoading(true);
      const res = await api.getStudentAssessment(studentId);
      setSession(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!session) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Award className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-blue-950 mb-2">
          View Student Scorecard & Career Guidance
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Select a completed assessment to view the detailed evaluation and download the official WeGrow Certificate.
        </p>

        {students.length > 0 ? (
          <div className="space-y-4">
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                loadStudentAssessment(e.target.value);
              }}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.registrationNumber} - {s.studentName} ({s.assessmentScore}/15 - {s.assessmentPercentage}%)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs mb-4">
            No completed assessments found yet. Take an assessment to view the scorecard!
          </div>
        )}

        <button
          onClick={onRetakeOrNew}
          className="mt-6 px-6 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-950 transition"
        >
          Go to Registration / Assessment
        </button>
      </div>
    );
  }

  const rec = session.careerRecommendation;

  return (
    <div className="max-w-5xl mx-auto my-6 px-4">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeOrNew}
            className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1"
          >
            ← Register or Switch Student
          </button>
          {students.length > 1 && (
            <select
              value={session.studentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                loadStudentAssessment(e.target.value);
              }}
              className="text-xs border border-slate-300 rounded-lg p-1.5 font-medium bg-white"
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.registrationNumber} - {s.studentName}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-950 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4 text-orange-400" />
          <span>Print Official Certificate & Scorecard</span>
        </button>
      </div>

      {/* CERTIFICATE / REPORT CARD CONTAINER */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl p-6 sm:p-10 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Decorative Watermark for Brand */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-12 translate-y-12 no-print">
          <img src="/wegrow-logo.png" alt="watermark" className="w-96" />
        </div>

        {/* Header - WeGrow Skill Campus */}
        <div className="border-b-2 border-blue-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <img
                src="/wegrow-logo.png"
                alt="WeGrow Logo"
                className="h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                  WeGrow Skill Campus & B School
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  193/1A, Ground Floor, Ayyappan Kovil Opp, Police Station Road, Sivakasi - 626 123
                </p>
                <p className="text-xs font-bold text-orange-600 tracking-wide mt-0.5">
                  Building Skills. Growing Futures.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/wegrow-mascot.webp"
                alt="WeGrow Mascot"
                className="w-16 h-16 object-contain"
              />
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Document ID
                </span>
                <span className="font-mono text-sm font-extrabold text-blue-900">
                  {session.registrationNumber}
                </span>
                <span className="block text-[11px] text-slate-500 font-medium">
                  31 October 2026
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-600">
            <span>Official Career Guidance & Skill Assessment Scorecard</span>
            <span>Batch: College Students Passed Out (30 Quota)</span>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Student Name:</span>
              <span className="text-base font-extrabold text-blue-950">
                {session.studentName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Registration No:</span>
              <span className="text-base font-mono font-bold text-orange-600">
                {session.registrationNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Assessed Track:</span>
              <span className="font-bold text-slate-800">
                {session.selectedDomain}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Evaluation Date:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-900" /> 31 Oct 2026
              </span>
            </div>
          </div>
        </div>

        {/* Performance Score Summary Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Score Circle */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden flex flex-col items-center justify-center">
            <div className="text-xs uppercase font-bold tracking-widest text-orange-400 mb-2">
              Overall Assessment Score
            </div>
            <div className="text-5xl font-black tracking-tight mb-1">
              {session.score}
              <span className="text-2xl text-slate-400 font-normal"> / {session.maxScore}</span>
            </div>
            <div className="text-2xl font-extrabold text-orange-400 font-mono mb-2">
              {session.percentage}%
            </div>
            <div className="inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full font-semibold border border-white/20">
              {session.skillBand}
            </div>
          </div>

          {/* Category Breakdown (HTML, CSS, Responsive) */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" /> Skill Competency Breakdown
            </h4>

            <div className="space-y-4">
              {session.categoryBreakdown &&
                Object.entries(session.categoryBreakdown).map(([category, stat]) => (
                  <div key={category}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">{category}</span>
                      <span className="text-blue-900 font-mono">
                        {stat.score}/{stat.total} ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          stat.percentage >= 75
                            ? 'bg-emerald-500'
                            : stat.percentage >= 50
                            ? 'bg-orange-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Time Taken: {Math.round((session.timeTakenSeconds || 0) / 60)} minutes</span>
              <span className="font-semibold text-emerald-600">✓ Evaluated by WeGrow Engine</span>
            </div>
          </div>
        </div>

        {/* Personalized Career Guidance Section */}
        {rec && (
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-blue-50 border border-orange-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 text-orange-800 font-extrabold text-sm uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Personalized Career Guidance & Recommendation</span>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-black text-blue-950 mb-1">
                Recommended Role: {rec.roleTitle}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {rec.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-3 border-t border-orange-200/60">
              <div className="bg-white/80 p-3.5 rounded-xl border border-orange-200">
                <span className="font-bold text-blue-900 block mb-1.5 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-orange-500" /> Recommended Career Tracks:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {rec.suitableTracks.map((track, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{track}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-orange-200">
                <span className="font-bold text-emerald-800 block mb-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {rec.strengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-orange-200">
                <span className="font-bold text-purple-900 block mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Actionable Next Steps:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {rec.actionPlan.map((step, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Question-By-Question Detailed Review */}
        <div className="mb-8">
          <h4 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-500" /> Complete Question Review & Solutions
          </h4>

          <div className="space-y-4">
            {session.questions.map((q, idx) => {
              const isCorrect = q.isCorrect;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs leading-relaxed transition ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-bold text-slate-900 text-sm">
                      <span className="text-slate-500 font-mono mr-1.5">Q{idx + 1}.</span>
                      {q.questionText}
                    </div>
                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Correct (+1)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                        </span>
                      )}
                    </div>
                  </div>

                  {q.codeSnippet && (
                    <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-lg overflow-x-auto my-2">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-500 font-medium">Your Selected Answer: </span>
                      <span
                        className={`font-bold ${
                          isCorrect ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {q.selectedAnswer || 'Not Answered'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Correct Answer: </span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200 text-[11px]">
                    <strong className="text-slate-800">Concept Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer & Official Signatures */}
        <div className="pt-8 border-t-2 border-slate-300 mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-xs text-center">
          <div>
            <div className="h-10 flex items-center justify-center font-serif italic text-blue-900 text-sm">
              WeGrow Workshop Mentor
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
              Evaluator Signature
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="w-16 h-16 border-2 border-dashed border-orange-400 rounded-full mx-auto flex items-center justify-center text-[9px] uppercase font-bold text-orange-600 p-1">
              WeGrow Skill Campus Seal
            </div>
          </div>

          <div>
            <div className="h-10 flex items-center justify-center font-bold text-slate-800 text-xs">
              Sivakasi Campus Director
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

