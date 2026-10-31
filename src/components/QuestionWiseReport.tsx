import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { QuestionWiseStat, WorkshopOverview } from '../types';
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Flame,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const QuestionWiseReport: React.FC = () => {
  const [stats, setStats] = useState<QuestionWiseStat[]>([]);
  const [overview, setOverview] = useState<WorkshopOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customOnly, setCustomOnly] = useState<boolean>(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qStats, ov] = await Promise.all([
        api.getQuestionWiseReport(),
        api.getWorkshopOverview(),
      ]);
      setStats(qStats);
      setOverview(ov);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // Filtered list
  const filtered = stats.filter((item) => {
    const matchesSearch =
      item.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCustom = !customOnly || item.isCustom;
    const matchesDiff =
      difficultyFilter === 'all' ||
      (difficultyFilter === 'challenging' && item.accuracyRate < 50 && item.totalAttempts > 0) ||
      (difficultyFilter === 'moderate' && item.accuracyRate >= 50 && item.accuracyRate < 75) ||
      (difficultyFilter === 'easy' && item.accuracyRate >= 75);

    return matchesSearch && matchesCat && matchesCustom && matchesDiff;
  });

  const customQuestionsCount = stats.filter((s) => s.isCustom).length;
  const totalAttemptsCount = stats.reduce((sum, s) => sum + s.totalAttempts, 0);

  return (
    <div className="max-w-7xl mx-auto my-6 px-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-10 -translate-y-6">
          <img src="/wegrow-mascot.webp" alt="mascot" className="w-64 h-64 object-contain" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
                Comprehensive Workshop Intelligence
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Question-Wise & Custom Question Analytics
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                Detailed performance metrics, answer distributions, and student misconception tracking across all HTML & CSS questions.
              </p>
            </div>

            <button
              onClick={loadData}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <span>Refresh Metrics</span>
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-800/80">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Total Questions
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {stats.length}
              </span>
              <span className="text-[10px] text-orange-400 block font-semibold">
                HTML, CSS & Responsive
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Custom Questions
              </span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {customQuestionsCount}
              </span>
              <span className="text-[10px] text-slate-300 block">
                Created by Mentor
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Total Question Attempts
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {totalAttemptsCount}
              </span>
              <span className="text-[10px] text-slate-300 block">
                Across 30 Student Batch
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Workshop Average
              </span>
              <span className="text-2xl font-black text-orange-400 font-mono">
                {overview?.classAveragePercentage || 0}%
              </span>
              <span className="text-[10px] text-slate-300 block">
                Completed: {overview?.completedAssessments || 0}/30
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by question keywords, tags, or concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl p-2 bg-white font-medium text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="Responsive Design">Responsive Design</option>
              <option value="Web Basics">Web Basics</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl p-2 bg-white font-medium text-slate-700"
            >
              <option value="all">All Difficulties</option>
              <option value="challenging">Challenging (&lt;50% accuracy)</option>
              <option value="moderate">Moderate (50-75%)</option>
              <option value="easy">Easy (&gt;75%)</option>
            </select>

            <button
              onClick={() => setCustomOnly(!customOnly)}
              className={`text-xs px-3 py-2 rounded-xl border font-bold flex items-center gap-1.5 transition ${
                customOnly
                  ? 'bg-purple-600 text-white border-purple-600 shadow'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Questions Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filtered.map((item, index) => {
          const isExpanded = expandedQuestionId === item.questionId;
          const accuracy = item.accuracyRate;

          return (
            <div
              key={item.questionId}
              className={`bg-white rounded-2xl border transition shadow-xs hover:shadow-md ${
                item.isCustom
                  ? 'border-purple-300 ring-1 ring-purple-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="p-5">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <span className="bg-blue-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {item.difficulty}
                    </span>
                    {item.isCustom && (
                      <span className="bg-purple-100 text-purple-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> Custom Question
                      </span>
                    )}
                  </div>

                  {/* Accuracy Badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Accuracy Rate
                      </span>
                      <span
                        className={`text-base font-black font-mono ${
                          item.totalAttempts === 0
                            ? 'text-slate-400'
                            : accuracy >= 75
                            ? 'text-emerald-600'
                            : accuracy >= 50
                            ? 'text-orange-500'
                            : 'text-red-500'
                        }`}
                      >
                        {item.totalAttempts > 0 ? `${accuracy}%` : 'Unattempted'}
                      </span>
                    </div>

                    <div
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        item.totalAttempts === 0
                          ? 'bg-slate-100 text-slate-600'
                          : accuracy >= 75
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : accuracy >= 50
                          ? 'bg-orange-50 text-orange-800 border border-orange-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {item.difficultyRating}
                    </div>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 leading-relaxed">
                  {item.questionText}
                </h3>

                {/* Code Snippet if present */}
                {item.codeSnippet && (
                  <pre className="p-3 bg-slate-950 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto my-2 border border-slate-800">
                    <code>{item.codeSnippet}</code>
                  </pre>
                )}

                {/* Attempt Progress Bar & Option Distribution */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Student Responses ({item.totalAttempts} total)</span>
                      <span className="font-mono">
                        <strong className="text-emerald-600">{item.correctCount} Correct</strong> /{' '}
                        <strong className="text-red-500">{item.incorrectCount} Wrong</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-2.5 transition-all"
                        style={{
                          width: `${item.totalAttempts > 0 ? (item.correctCount / item.totalAttempts) * 100 : 0}%`,
                        }}
                      />
                      <div
                        className="bg-red-400 h-2.5 transition-all"
                        style={{
                          width: `${item.totalAttempts > 0 ? (item.incorrectCount / item.totalAttempts) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Option Distribution Bars */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">
                      Option Distribution:
                    </div>
                    <div className="flex items-center gap-2">
                      {['A', 'B', 'C', 'D'].map((opt) => {
                        const count = item.optionDistribution[opt] || 0;
                        const isCorrectOpt = item.correctAnswer === opt;
                        return (
                          <div
                            key={opt}
                            className={`flex-1 p-1 rounded text-center border text-[11px] ${
                              isCorrectOpt
                                ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="font-mono font-bold">{opt}: </span>
                            <span className="font-semibold">{count}</span>
                            {isCorrectOpt && <span className="text-[9px] text-emerald-700 ml-0.5">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                  <strong className="text-slate-900">Key Concept:</strong> {item.explanation}
                </div>

                {/* Expand Toggle */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => toggleExpand(item.questionId)}
                    className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1 transition"
                  >
                    <span>
                      {isExpanded ? 'Hide Student List' : `View Student Breakdown (${item.totalAttempts} Students)`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expandable Drilldown: Which students got it right / wrong */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    {/* Correct Students List */}
                    <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200">
                      <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Mastered by ({item.successfulStudents.length}):</span>
                      </div>
                      {item.successfulStudents.length > 0 ? (
                        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                          {item.successfulStudents.map((s, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] bg-white p-1.5 rounded border border-emerald-100 flex justify-between font-medium"
                            >
                              <span className="text-slate-800">{s.name}</span>
                              <span className="font-mono text-emerald-700">{s.regNo}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">No student answered correctly yet.</p>
                      )}
                    </div>

                    {/* Struggling Students List */}
                    <div className="bg-red-50/50 rounded-xl p-3 border border-red-200">
                      <div className="text-xs font-bold text-red-900 mb-2 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Needs Workshop Revision ({item.strugglingStudents.length}):</span>
                      </div>
                      {item.strugglingStudents.length > 0 ? (
                        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                          {item.strugglingStudents.map((s, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] bg-white p-1.5 rounded border border-red-100 flex justify-between font-medium"
                            >
                              <span className="text-slate-800">{s.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-red-500">Chose: {s.chosenAnswer}</span>
                                <span className="font-mono text-slate-400">{s.regNo}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-emerald-700 italic">100% success rate on this question!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No questions match your current search and filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

