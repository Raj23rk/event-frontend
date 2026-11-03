import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { InternshipBooking, InternshipStats } from '../types';
import {
  ShieldCheck,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Send,
  Users,
  Building2,
  GraduationCap,
  ArrowLeft,
  X,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

interface InternshipAdminPageProps {
  onBackToLanding: () => void;
  onGoToWorkshop: () => void;
}

export const InternshipAdminPage: React.FC<InternshipAdminPageProps> = ({
  onBackToLanding,
  onGoToWorkshop,
}) => {
  const [bookings, setBookings] = useState<InternshipBooking[]>([]);
  const [stats, setStats] = useState<InternshipStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [seeding, setSeeding] = useState(false);

  // Selected Booking for Modal View
  const [selectedBooking, setSelectedBooking] = useState<InternshipBooking | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [list, s] = await Promise.all([
        api.getInternshipBookings(),
        api.getInternshipStats(),
      ]);
      setBookings(list);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      await api.seedInternshipDemo();
      await loadData();
      setActionNotice('Demo internship bookings seeded successfully!');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const handleResendReceipt = async (id: string, email: string) => {
    try {
      setResendingId(id);
      const res = await api.resendInternshipReceipt(id);
      setActionNotice(`Email receipt re-dispatched to ${email}!`);
      await loadData();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e: any) {
      setActionNotice(e.message || 'Failed to resend receipt');
    } finally {
      setResendingId(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Booking ID',
      'Student Name',
      'Mobile',
      'WhatsApp',
      'Email',
      'College Name',
      'Department',
      'Year',
      'Parents Phone',
      'Internship Track',
      'Training Mode',
      'Pre-booking Amount',
      'Payment Status',
      'Payment Method',
      'Transaction ID',
      'Date of Booking',
    ];

    const rows = bookings.map((b) => [
      b.bookingId,
      `"${b.studentName}"`,
      b.mobile,
      b.whatsapp,
      b.email,
      `"${b.collegeName}"`,
      `"${b.department}"`,
      `"${b.year}"`,
      b.parentsMobile,
      `"${b.internshipDomain}"`,
      `"${b.mode}"`,
      b.prebookingAmount || 1000,
      b.paymentStatus,
      `"${b.paymentMethod || 'N/A'}"`,
      `"${b.transactionId || 'N/A'}"`,
      new Date(b.createdAt).toLocaleDateString('en-IN'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WeGrow_Internship_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.studentName.toLowerCase().includes(term) ||
      b.bookingId.toLowerCase().includes(term) ||
      b.mobile.includes(term) ||
      b.email.toLowerCase().includes(term) ||
      b.collegeName.toLowerCase().includes(term) ||
      (b.transactionId && b.transactionId.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || b.paymentStatus === statusFilter;
    const matchesDomain = domainFilter === 'all' || b.internshipDomain === domainFilter;

    return matchesSearch && matchesStatus && matchesDomain;
  });

  const paidCount = bookings.filter((b) => b.paymentStatus === 'paid').length;
  const pendingCount = bookings.filter((b) => b.paymentStatus === 'pending').length;
  const totalRevenue = paidCount * 1000;

  return (
    <div className="max-w-7xl mx-auto my-6 px-4">
      {/* Top Action Ribbon */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded">
                Admin Center
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Internship Applications & ₹1000 Pre-bookings
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              WeGrow Skill Campus • Sivakasi Campus • Helpline Enquiry: <strong className="text-orange-400">9344337331</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            title="Download Excel / CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Register</span>
          </button>

          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-xl hover:from-orange-600 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{seeding ? 'Generating...' : 'Seed 5 Demo'}</span>
          </button>

          <button
            onClick={onBackToLanding}
            className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange-600" />
            <span>Internship Page</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 mb-6 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Total Bookings */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
            <span>Total Applied</span>
            <Users className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono">
            {bookings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Student registrations</div>
        </div>

        {/* Prebooking Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase mb-1">
            <span>Pre-booking Collected</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {paidCount} Students Paid ₹1,000
          </div>
        </div>

        {/* Paid Seats */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 uppercase mb-1">
            <span>Confirmed Seats</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900 font-mono">
            {paidCount}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Email receipts delivered</div>
        </div>

        {/* Pending Pre-booking */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase mb-1">
            <span>Pending Payment</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Helpline: <strong>9344337331</strong>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student, booking ID, mobile, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl p-2 bg-white font-bold text-slate-700"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="paid">Paid ₹1,000 ({paidCount})</option>
            <option value="pending">Pending Payment ({pendingCount})</option>
          </select>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl p-2 bg-white font-medium text-slate-700"
          >
            <option value="all">All Internship Tracks</option>
            <option value="Fullstack Web Development (React & NestJS)">Fullstack Web (React & NestJS)</option>
            <option value="Python, Data Science & AI">Python & AI</option>
            <option value="Frontend UI/UX & Web Design">Frontend UI/UX</option>
            <option value="Mobile App Development (Flutter / React Native)">Mobile Apps</option>
          </select>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">College & Dept</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Contacts (Student / Parents)</th>
                <th className="py-3.5 px-4">Domain Track</th>
                <th className="py-3.5 px-4 text-center">Payment Status</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
                <th className="py-3.5 px-4 text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((b) => {
                const isPaid = b.paymentStatus === 'paid';
                return (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition">
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {b.bookingId}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{b.studentName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                        ✉️ {b.email}
                      </div>
                    </td>

                    {/* College & Department */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate" title={b.collegeName}>
                        {b.collegeName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={b.department}>
                        {b.department}
                      </div>
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600">
                      {b.year}
                    </td>

                    {/* Contacts */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                      <div>
                        <span className="text-slate-400">Mobile: </span>
                        <a href={`tel:${b.mobile}`} className="font-mono font-bold text-slate-800 hover:text-blue-600">
                          {b.mobile}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400">Parents: </span>
                        <a href={`tel:${b.parentsMobile}`} className="font-mono text-slate-600 hover:text-blue-600">
                          {b.parentsMobile}
                        </a>
                      </div>
                    </td>

                    {/* Track */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {b.internshipDomain}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isPaid ? (
                        <div>
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Paid ₹1,000</span>
                          </span>
                          <span className="block text-[9px] text-blue-700 font-semibold mt-0.5">
                            {b.paymentMethod || 'Razorpay / UPI'}
                          </span>
                          <span className="block text-[9px] text-slate-400 font-mono">
                            {b.transactionId ? b.transactionId.slice(-10) : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Email Receipt Delivery */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isPaid ? (
                        <span
                          className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                          title={b.emailDeliveryStatus || 'Resend'}
                        >
                          Resend Sent ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Awaiting Payment</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right no-print whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-bold rounded-lg border border-blue-200 transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-blue-600" />
                          <span>Receipt</span>
                        </button>

                        {isPaid && (
                          <button
                            disabled={resendingId === b._id}
                            onClick={() => handleResendReceipt(b._id, b.email)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition inline-flex items-center gap-1 disabled:opacity-50"
                            title="Resend email receipt to student"
                          >
                            <Send className="w-3 h-3" />
                            <span>{resendingId === b._id ? 'Sending...' : 'Email'}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No internship bookings found matching your search.
          </div>
        )}
      </div>

      {/* RECEIPT PREVIEW MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <img src="/wegrow-logo.png" alt="WeGrow" className="h-8 object-contain" />
                <span className="font-extrabold text-blue-950 text-sm">Official Internship Booking Receipt</span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Pre-booking Fee Received</span>
                <div className="text-3xl font-black text-emerald-700 font-mono">₹1,000.00</div>
                <div className="text-xs text-emerald-800 font-medium">Status: {selectedBooking.paymentStatus.toUpperCase()}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-mono font-bold text-blue-900">{selectedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold">{selectedBooking.transactionId || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold">{selectedBooking.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">College:</span>
                  <span className="font-bold">{selectedBooking.collegeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold">{selectedBooking.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Year:</span>
                  <span className="font-bold">{selectedBooking.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Mobile:</span>
                  <span className="font-bold">{selectedBooking.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parents Phone:</span>
                  <span className="font-bold">{selectedBooking.parentsMobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Email:</span>
                  <span className="font-bold">{selectedBooking.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Track:</span>
                  <span className="font-bold text-orange-600">{selectedBooking.internshipDomain}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => handleResendReceipt(selectedBooking._id, selectedBooking.email)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Resend Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

