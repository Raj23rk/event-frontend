import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Question } from '../types';
import {
  HelpCircle,
  PlusCircle,
  Trash2,
  Code2,
  Sparkles,
  CheckCircle2,
  Save,
  BookOpen,
  Filter,
} from 'lucide-react';

export const QuestionBankManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [onlyCustom, setOnlyCustom] = useState(false);

  // New Question Form state
  const [form, setForm] = useState({
    questionText: '',
    codeSnippet: '',
    category: 'HTML' as const,
    difficulty: 'Intermediate' as const,
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctAnswer: 'A',
    explanation: '',
    tags: 'html, custom',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions();
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (id: string, text: string) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!form.questionText.trim()) {
      setError('Please provide the question prompt.');
      return;
    }

    if (form.options.some((o) => !o.text.trim())) {
      setError('All 4 options (A, B, C, D) must have text.');
      return;
    }

    if (!form.explanation.trim()) {
      setError('Please provide an explanation of the correct answer.');
      return;
    }

    try {
      setSaving(true);
      const newQuestion = await api.createQuestion({
        questionText: form.questionText,
        codeSnippet: form.codeSnippet,
        category: form.category,
        difficulty: form.difficulty,
        options: form.options,
        correctAnswer: form.correctAnswer,
        explanation: form.explanation,
        isCustom: true,
        tags: form.tags.split(',').map((t) => t.trim()),
      });

      setSuccessMsg('Custom Question added successfully! It is now part of the assessment pool.');
      setQuestions([newQuestion, ...questions]);
      setShowAddForm(false);
      // reset form
      setForm({
        questionText: '',
        codeSnippet: '',
        category: 'HTML',
        difficulty: 'Intermediate',
        options: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' },
        ],
        correctAnswer: 'A',
        explanation: '',
        tags: 'html, custom',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this question from the bank?')) return;
    try {
      await api.deleteQuestion(id);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = questions.filter((q) => {
    if (filterCat !== 'all' && q.category !== filterCat) return false;
    if (onlyCustom && !q.isCustom) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-blue-950">
              Question Bank & Custom Question Studio
            </h2>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {questions.length} Total Questions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create custom HTML/CSS questions for your 31 October workshop. The system will randomize them across the 30 students.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Close Editor' : 'Create Custom Question'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* CREATE CUSTOM QUESTION FORM */}
      {showAddForm && (
        <div className="bg-white border-2 border-orange-300 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-orange-700 font-extrabold text-sm uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Author New Custom Question</span>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Question Text <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Which CSS pseudo-class matches when an element is checked or toggled?"
                value={form.questionText}
                onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e: any) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="HTML">HTML</option>
                  <option value="CSS">CSS</option>
                  <option value="Responsive Design">Responsive Design</option>
                  <option value="Web Basics">Web Basics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e: any) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-900" />
                <span>Code Snippet (Optional - For practical code questions)</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. <div class='container'>\n  <p>Sample HTML snippet</p>\n</div>"
                value={form.codeSnippet}
                onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl bg-slate-900 text-emerald-300 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* 4 Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Answer Options (A, B, C, D) & Mark Correct Option <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {form.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                      form.correctAnswer === opt.id
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <label className="flex items-center gap-1 cursor-pointer font-bold text-xs font-mono">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={opt.id}
                        checked={form.correctAnswer === opt.id}
                        onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={form.correctAnswer === opt.id ? 'text-emerald-700' : 'text-slate-700'}>
                        {opt.id}
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${opt.id} text...`}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                      className="flex-1 p-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Explanation & Learning Note <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Explain why the selected option is correct so students learn from their test..."
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Question...' : 'Save to Question Bank'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg p-1.5 bg-white font-medium"
          >
            <option value="all">All Domains</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Responsive Design">Responsive Design</option>
            <option value="Web Basics">Web Basics</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={onlyCustom}
              onChange={(e) => setOnlyCustom(e.target.checked)}
              className="text-orange-500 focus:ring-orange-400 rounded"
            />
            <span>Show Only Custom Questions</span>
          </label>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} of {questions.length} Questions
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {filtered.map((q, idx) => (
          <div
            key={q._id || idx}
            className={`bg-white p-4 rounded-xl border transition ${
              q.isCustom ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {q.category}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {q.difficulty}
                  </span>
                  {q.isCustom && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">
                      ★ Custom Question
                    </span>
                  )}
                </div>

                <div className="text-xs md:text-sm font-bold text-slate-900 leading-snug">
                  {q.questionText}
                </div>

                {q.codeSnippet && (
                  <pre className="p-2.5 bg-slate-950 text-emerald-300 font-mono text-[11px] rounded-lg overflow-x-auto my-2">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px]">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-1.5 rounded border ${
                        opt.id === q.correctAnswer
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="font-mono">{opt.id}:</span> {opt.text}
                      {opt.id === q.correctAnswer && <span className="ml-1 text-emerald-600">✓</span>}
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>

              {q.isCustom && (
                <button
                  onClick={() => handleDelete(q._id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                  title="Delete Custom Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

