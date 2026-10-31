import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';
import { RosterStudent, WorkshopOverview } from '../types';
import { RegistrationQRCodeModal } from './RegistrationQRCodeModal';
import {
  Users,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  QrCode,
  Maximize2,
  Copy,
  Check,
  UserPlus,
} from 'lucide-react';

interface WorkshopRosterProps {
  onSelectStudentScorecard?: (studentId: string) => void;
  onGoToRegistration?: () => void;
}

export const WorkshopRoster: React.FC<WorkshopRosterProps> = ({
  onSelectStudentScorecard,
  onGoToRegistration,
}) => {
  const navigate = useNavigate();
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [overview, setOverview] = useState<WorkshopOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [seeding, setSeeding] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Second image URL (Student Registration Form URL)
  const registrationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register`
    : 'http://localhost:3000/register';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rData, ovData] = await Promise.all([
        api.getStudentRoster(),
        api.getWorkshopOverview(),
      ]);
      setRoster(rData);
      setOverview(ovData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      await api.seedDemo();
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(registrationUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleRegisterNavigation = () => {
    if (onGoToRegistration) {
      onGoToRegistration();
    } else {
      navigate('/#registration-form');
    }
  };

  const handleStudentAction = (studentId: string, isCompleted: boolean) => {
    if (onSelectStudentScorecard) {
      onSelectStudentScorecard(studentId);
    } else {
      if (isCompleted) {
        navigate(`/scorecard/${studentId}`);
      } else {
        navigate(`/assessment/${studentId}`);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Rank',
      'Registration Number',
      'Student Name',
      'College Name',
      'Course',
      'Mobile',
      'Email',
      'Domain Track',
      'Attendance Status',
      'Score',
      'Max Score',
      'Percentage',
      'Skill Band',
    ];

    const rows = roster.map((s) => {
      let attendText = 'Pending';
      if (s.status === 'completed') attendText = 'Present (Completed Exam)';
      else if (s.status === 'assessment_started') attendText = 'Present (Writing Exam)';

      return [
        s.rank || 'N/A',
        s.registrationNumber,
        `"${s.studentName}"`,
        `"${s.collegeName}"`,
        `"${s.courseYear}"`,
        s.mobile,
        s.email,
        `"${s.selectedDomain}"`,
        `"${attendText}"`,
        s.score,
        s.maxScore,
        `${s.percentage}%`,
        `"${s.skillBand}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WeGrow_Exam_Attendance_Roster_31Oct2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = roster.filter((s) => s.status === 'completed').length;
  const inProgressCount = roster.filter((s) => s.status === 'assessment_started').length;
  const pendingCount = roster.filter((s) => s.status === 'registered').length;
  const totalEnrolled = roster.length;

  const filtered = roster.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const quotaProgress = Math.min(100, Math.round((totalEnrolled / 30) * 100));

  return (
    <div className="max-w-7xl mx-auto my-6 px-4">
      {/* Registration QR Code Modal */}
      <RegistrationQRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        registeredCount={totalEnrolled}
      />

      {/* Admin Title & Workshop Quota Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                  Admin Dashboard
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-blue-950">
                  Student Exam Attendance & Marks Roster
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                WeGrow Skill Campus • 31 October 2026 Workshop • College Passouts Batch (30 Quota)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            {/* Show Registration QR Code for Second Image URL */}
            <button
              onClick={() => setShowQRModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs border border-slate-700"
              title="Show student registration QR code for mobile phones"
            >
              <QrCode className="w-4 h-4 text-orange-400" />
              <span>Registration QR</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs"
              title="Print official attendance register"
            >
              <Printer className="w-4 h-4 text-blue-900" />
              <span>Print Attendance</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              title="Download CSV spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleRegisterNavigation}
              className="px-3.5 py-2 bg-blue-900 text-white text-xs font-bold rounded-xl hover:bg-blue-950 transition flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Register Student</span>
            </button>

            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-xl hover:from-orange-600 transition flex items-center gap-1 shadow-xs disabled:opacity-50"
              title="Populates realistic sample students for demo"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? 'Generating...' : 'Seed 20 Demo'}</span>
            </button>
          </div>
        </div>

        {/* 4 Attendance Status KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Total Enrolled */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
              <span>Total Enrolled</span>
              <Users className="w-4 h-4 text-blue-900" />
            </div>
            <div className="text-2xl font-black text-blue-950 font-mono">
              {totalEnrolled} <span className="text-xs text-slate-400 font-normal">/ 30 Quota</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {quotaProgress}% capacity filled
            </div>
          </div>

          {/* Attended & Completed */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase mb-1">
              <span>Attended & Scored</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {completedCount}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              Exam submitted & evaluated
            </div>
          </div>

          {/* Currently Writing Exam */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase mb-1">
              <span>Currently In Exam</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 font-mono">
              {inProgressCount}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-1">
              Active test sessions
            </div>
          </div>

          {/* Pending Attendance */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 uppercase mb-1">
              <span>Pending Test</span>
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-900 font-mono">
              {pendingCount}
            </div>
            <div className="text-[11px] text-blue-800 font-medium mt-1">
              Registered, not yet taken
            </div>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-slate-600">
              Workshop Quota: {totalEnrolled} / 30 Students Enrolled
            </span>
            <span className="text-orange-600 font-mono font-bold">
              Class Average: {overview?.classAveragePercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-900 via-indigo-700 to-orange-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${quotaProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* STUDENT SELF-REGISTRATION QR STATION (FOR SECOND IMAGE URL) */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 mb-6 text-white shadow-xl border border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-5 no-print">
        <div className="flex items-center gap-4">
          <div
            onClick={() => setShowQRModal(true)}
            className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 cursor-pointer hover:ring-4 hover:ring-orange-400/40 transition group"
            title="Click to expand QR Code"
          >
            <QRCodeSVG
              value={registrationUrl}
              size={96}
              level="H"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                Student Self-Registration Station
              </span>
              <span className="text-orange-300 font-bold text-xs">
                QR Code for Second Image URL ({totalEnrolled}/30 Registered)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Scan with Mobile Phone to Open Registration Form
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Display or project this QR code on the classroom screen. Students scan with their smartphone camera to instantly open and fill the Student Details Form.
            </p>
            <div className="text-[11px] font-mono text-orange-300 mt-2 flex items-center gap-2">
              <span className="bg-black/40 border border-slate-700 px-2 py-0.5 rounded">
                {registrationUrl}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition transform hover:scale-105"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Projector Mode</span>
          </button>
          <button
            onClick={handleCopyUrl}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, reg no, mobile, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl p-2 bg-white font-bold text-slate-700 w-full sm:w-auto"
          >
            <option value="all">All Students ({roster.length})</option>
            <option value="completed">Attended & Completed ({completedCount})</option>
            <option value="assessment_started">Currently In Exam ({inProgressCount})</option>
            <option value="registered">Registered / Pending ({pendingCount})</option>
          </select>
        </div>
      </div>

      {/* Student Attendance & Marks Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Reg No</th>
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">College & Degree</th>
                <th className="py-3.5 px-4 text-center">Attendance Status</th>
                <th className="py-3.5 px-4 text-center">Marks Score</th>
                <th className="py-3.5 px-4">Skill Band</th>
                <th className="py-3.5 px-4 text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((student) => {
                const isCompleted = student.status === 'completed';
                const isTesting = student.status === 'assessment_started';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition"
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-bold">
                      {student.rank ? (
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono text-[11px] ${
                            student.rank === 1
                              ? 'bg-amber-100 text-amber-800 font-black ring-2 ring-amber-400'
                              : student.rank === 2
                              ? 'bg-slate-200 text-slate-800 font-bold'
                              : student.rank === 3
                              ? 'bg-orange-100 text-orange-800 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {student.rank}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Reg No */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {student.registrationNumber}
                    </td>

                    {/* Student Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        {student.studentName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        📞 {student.mobile}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        ✉️ {student.email}
                      </div>
                    </td>

                    {/* College & Degree */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-slate-800 font-semibold" title={student.collegeName}>
                        {student.collegeName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={student.courseYear}>
                        {student.courseYear}
                      </div>
                    </td>

                    {/* Attendance Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Present (Completed)</span>
                        </span>
                      ) : isTesting ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Present (In Exam)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Registered (Pending)</span>
                        </span>
                      )}
                    </td>

                    {/* Marks Score */}
                    <td className="py-3.5 px-4 text-center">
                      {isCompleted ? (
                        <div>
                          <span className="font-mono font-black text-sm text-blue-950">
                            {student.score}
                            <span className="text-slate-400 font-normal text-xs">/{student.maxScore}</span>
                          </span>
                          <span className="block text-[10px] font-mono font-bold text-orange-600">
                            {student.percentage}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono">-</span>
                      )}
                    </td>

                    {/* Skill Band */}
                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            student.percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.percentage >= 60
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {student.skillBand}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not Evaluated</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right no-print whitespace-nowrap">
                      {isCompleted ? (
                        <button
                          onClick={() => handleStudentAction(student.id, true)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-bold rounded-lg border border-blue-200 transition inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>Scorecard</span>
                          <ExternalLink className="w-3 h-3 text-orange-500" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStudentAction(student.id, false)}
                          className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold rounded-lg border border-orange-200 transition inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>Launch Test</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
export default WorkshopRoster;
