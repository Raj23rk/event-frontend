import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { AssessmentSession, Student } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Send,
  Code2,
  Sparkles,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';

interface AssessmentPortalProps {
  initialStudentId?: string;
  onAssessmentCompleted?: (session: AssessmentSession) => void;
  onGoToRegistration?: () => void;
}

export const AssessmentPortal: React.FC<AssessmentPortalProps> = ({
  initialStudentId,
  onAssessmentCompleted,
  onGoToRegistration,
}) => {
  const { studentId: routeStudentId } = useParams<{ studentId?: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(routeStudentId || initialStudentId || '');
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Fetch registered students to allow selection
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const list = await api.getStudents();
      setStudents(list);
      if (!selectedStudentId && list.length > 0) {
        // default to first active or uncompleted student
        const pending = list.find((s) => s.status !== 'completed');
        if (pending) {
          setSelectedStudentId(pending._id);
        } else {
          setSelectedStudentId(list[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If initialStudentId was passed or changed, start/load session
  useEffect(() => {
    if (selectedStudentId) {
      handleStartOrResume(selectedStudentId);
    }
  }, [selectedStudentId]);

  // Timer countdown
  useEffect(() => {
    if (!session || session.status === 'submitted') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const handleStartOrResume = async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const activeSession = await api.startAssessment(studentId);
      setSession(activeSession);

      // Pre-fill existing answers if resuming
      const initialAnswers: Record<string, string> = {};
      activeSession.questions.forEach((q) => {
        if (q.selectedAnswer) {
          initialAnswers[q.questionId] = q.selectedAnswer;
        }
      });
      setAnswers(initialAnswers);
      setCurrentIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!session) return;
    try {
      setSubmitting(true);
      const submissionAnswers = session.questions.map((q) => ({
        questionId: q.questionId,
        selectedAnswer: answers[q.questionId] || '',
        timeSpentSeconds: 30,
      }));

      const totalTime = 20 * 60 - timeLeft;
      const completedSession = await api.submitAssessment(
        session._id,
        submissionAnswers,
        totalTime,
      );

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSession(completedSession);
      setShowSubmitModal(false);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(completedSession);
      } else {
        navigate(`/scorecard/${completedSession.studentId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If no session started yet or selecting student
  if (!session) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FileQuestion className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-blue-950">
            WeGrow Assessment Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Career Guidance Workshop • Sivakasi • 31 October 2026
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Select Registered Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">-- Choose student by Name / Reg No --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.registrationNumber} - {s.studentName} ({s.collegeName}) - [{s.status}]
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleStartOrResume(selectedStudentId)}
            disabled={!selectedStudentId || loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Preparing Unique Question Set...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start Skill Assessment Test</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 mb-2">Haven't registered yet?</p>
            <button
              onClick={onGoToRegistration || (() => navigate('/#registration-form'))}
              className="text-xs font-bold text-blue-900 hover:underline"
            >
              Fill out the Student Details Registration Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalCount = session.questions.length;
  const progressPercent = Math.round((answeredCount / totalCount) * 100);

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      {/* Top Bar: Student Info & Timer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Student Profile Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              {session.studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-blue-950 text-base">
                  {session.studentName}
                </h3>
                <span className="bg-blue-100 text-blue-900 font-mono text-xs font-bold px-2 py-0.5 rounded">
                  {session.registrationNumber}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Track: <strong className="text-orange-600">{session.selectedDomain}</strong>
              </div>
            </div>
          </div>

          {/* Time Remaining Clock */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold shadow-sm ${
              timeLeft < 300
                ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                : 'bg-orange-50 text-orange-900 border border-orange-200'
            }`}>
              <Clock className="w-4 h-4 text-orange-600" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finish & Submit</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
            <span>
              Question {currentIndex + 1} of {totalCount}
            </span>
            <span>
              {answeredCount} of {totalCount} Answered ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-700 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Panel (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
            {/* Header tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {currentQuestion.category}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {currentQuestion.difficulty}
                </span>
                {currentQuestion.isCustom && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200">
                    ★ Custom Question
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleFlag(currentQuestion.questionId)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border transition ${
                  flagged[currentQuestion.questionId]
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{flagged[currentQuestion.questionId] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-4 leading-relaxed">
              <span className="text-orange-600 mr-2 font-mono">Q{currentIndex + 1}.</span>
              {currentQuestion.questionText}
            </h4>

            {/* Code Snippet block if present */}
            {currentQuestion.codeSnippet && (
              <div className="mb-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200">
                <div className="bg-slate-900 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex items-center justify-between border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-orange-400" /> Code Snippet
                  </span>
                  <span>HTML / CSS</span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Options list */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.questionId] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.questionId, option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 shadow-sm text-slate-950'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isSelected
                          ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {option.id}
                    </div>
                    <div className="text-sm font-medium pt-0.5 leading-snug">
                      {option.text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => {
                  setAnswers((prev) => {
                    const copy = { ...prev };
                    delete copy[currentQuestion.questionId];
                    return copy;
                  });
                }}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition"
              >
                Clear Selection
              </button>

              {currentIndex < totalCount - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 font-bold text-xs text-white shadow-md flex items-center gap-1.5"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white shadow-md shadow-orange-500/25 flex items-center gap-1.5"
                >
                  Review & Submit <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Question Navigator (1 col) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sticky top-20">
            <h5 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider mb-3">
              Question Navigator
            </h5>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 pb-3 border-b border-slate-100 text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span>Unanswered ({totalCount - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Marked Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-900" />
                <span>Current</span>
              </div>
            </div>

            {/* Grid of 15 buttons */}
            <div className="grid grid-cols-5 gap-2">
              {session.questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = !!answers[q.questionId];
                const isMarked = !!flagged[q.questionId];

                let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                if (isAnswered) {
                  btnClass = 'bg-emerald-500 text-white font-bold hover:bg-emerald-600 border-emerald-600';
                }
                if (isMarked) {
                  btnClass = 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-500 border-amber-500 ring-2 ring-amber-200';
                }
                if (isCurrent) {
                  btnClass = 'bg-blue-900 text-white font-black ring-2 ring-orange-500';
                }

                return (
                  <button
                    key={q.questionId}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono font-bold transition flex items-center justify-center relative ${btnClass}`}
                  >
                    {idx + 1}
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-blue-950 text-center mb-1">
              Submit Assessment?
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Are you sure you want to finalize your exam answers and generate your skill report card?
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900">{totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-semibold">Answered:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700 font-semibold">Unanswered:</span>
                <span className="font-bold text-amber-700">{totalCount - answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time Left:</span>
                <span className="font-mono font-bold text-blue-900">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Continue Test
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmitAssessment}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 disabled:opacity-50"
              >
                {submitting ? 'Scoring...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

