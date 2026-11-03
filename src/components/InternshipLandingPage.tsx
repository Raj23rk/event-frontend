import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { InternshipBooking } from '../types';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  Printer,
  Mail,
  User,
  BookOpen,
  Laptop,
  Flame,
  Award,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  Send,
  Zap,
  Lock,
  AlertCircle,
} from 'lucide-react';

interface InternshipLandingPageProps {
  onGoToAdmin: () => void;
  onGoToWorkshop: () => void;
}

export const InternshipLandingPage: React.FC<InternshipLandingPageProps> = ({
  onGoToAdmin,
  onGoToWorkshop,
}) => {
  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    mobile: '',
    whatsapp: '',
    email: '',
    collegeName: '',
    department: 'Computer Science & Engineering',
    year: 'Final Year',
    parentsMobile: '',
    internshipDomain: 'Fullstack Web Development (React & NestJS)',
    mode: 'In-Campus (Sivakasi)',
    notes: '',
  });

  // Flow State: 'form' | 'payment' | 'success'
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Booking
  const [activeBooking, setActiveBooking] = useState<InternshipBooking | null>(null);

  // Payment Options State: 'razorpay' (default) | 'upi'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'upi'>('razorpay');
  const [customTxnId, setCustomTxnId] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const departmentsList = [
    'Computer Science & Engineering (CSE)',
    'Information Technology (IT)',
    'BCA (Computer Applications)',
    'B.Sc Computer Science',
    'B.Sc Information Technology',
    'Artificial Intelligence & Data Science (AI & DS)',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'MCA (Master of Computer Applications)',
    'Mechanical / Civil Engineering',
    'Commerce / Management / Others',
  ];

  const domainsList = [
    {
      id: 'Fullstack Web Development (React & NestJS)',
      title: 'Fullstack Web Development',
      stack: 'React 18, NestJS, Node.js, MongoDB, REST APIs',
      duration: '30 / 60 Days',
      badge: 'High Demand',
    },
    {
      id: 'Python, Data Science & AI',
      title: 'Python, Data Science & Machine Learning',
      stack: 'Python, Pandas, Scikit-Learn, AI Models, APIs',
      duration: '30 / 60 Days',
      badge: 'Trending',
    },
    {
      id: 'Frontend UI/UX & Web Design',
      title: 'Frontend UI/UX & Modern Web Engineering',
      stack: 'Figma, Tailwind CSS, React, Responsive Layouts',
      duration: '30 Days',
      badge: 'Creative',
    },
    {
      id: 'Mobile App Development (Flutter / React Native)',
      title: 'Mobile App Development',
      stack: 'Flutter, React Native, Mobile Architecture',
      duration: '30 / 60 Days',
      badge: 'Industry Project',
    },
  ];

  // Dynamically load Razorpay SDK safely
  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof (window as any).Razorpay !== 'undefined') {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        if (typeof (window as any).Razorpay !== 'undefined') {
          resolve(true);
          return;
        }
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        setTimeout(() => {
          resolve(typeof (window as any).Razorpay !== 'undefined');
        }, 1500);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);

      setTimeout(() => {
        resolve(typeof (window as any).Razorpay !== 'undefined');
      }, 4000);
    });
  };

  // Pre-load Razorpay checkout script on component mount
  useEffect(() => {
    loadRazorpaySDK();
  }, []);

  const cleanMobile = formData.mobile.replace(/\D/g, '');
  const cleanParentsMobile = formData.parentsMobile.replace(/\D/g, '');
  const isSamePhone = Boolean(cleanMobile && cleanParentsMobile && cleanMobile === cleanParentsMobile);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.studentName.trim()) {
      setError('Student Name is required');
      return;
    }
    if (cleanMobile.length < 10) {
      setError('Please provide a valid 10-digit mobile number for the student');
      return;
    }
    if (!formData.whatsapp.trim()) {
      setError('Please provide WhatsApp number');
      return;
    }
    if (cleanParentsMobile.length < 10) {
      setError('Please provide a valid 10-digit parents contact phone number');
      return;
    }
    if (cleanMobile === cleanParentsMobile) {
      setError('Student Mobile Number and Parents Phone Number cannot be the same. Please provide parent/guardian phone number.');
      return;
    }
    if (!formData.collegeName.trim()) {
      setError('College name is required');
      return;
    }

    try {
      setLoading(true);
      const booking = await api.createInternshipBooking(formData);
      setActiveBooking(booking);
      setStep('payment');
      // Scroll to payment gateway
      setTimeout(() => {
        const el = document.getElementById('payment-step-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithRazorpay = async () => {
    if (!activeBooking) return;
    try {
      setProcessingPayment(true);
      setError(null);

      // 1. Ensure Razorpay Checkout SDK is loaded
      const sdkReady = await loadRazorpaySDK();
      if (!sdkReady && typeof (window as any).Razorpay === 'undefined') {
        // Wait 1 second extra if network was slow
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error('Razorpay Checkout SDK is loading or blocked by an ad-blocker. Please disable extensions or use the Direct UPI QR option below.');
      }

      // 2. Create order on NestJS backend
      const orderData = await api.createRazorpayOrder(activeBooking.bookingId);

      // 3. Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'WeGrow Skill Campus & B School',
        description: `Internship Pre-booking Fee (₹1,000) - ${activeBooking.bookingId}`,
        image: '/wegrow-logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: activeBooking.studentName,
          email: activeBooking.email,
          contact: activeBooking.mobile,
        },
        notes: {
          bookingId: activeBooking.bookingId,
          college: activeBooking.collegeName,
          domain: activeBooking.internshipDomain,
        },
        theme: {
          color: '#0f172a',
        },
        handler: async function (response: any) {
          try {
            setProcessingPayment(true);
            // 4. Verify payment signature on backend
            const verifiedBooking = await api.verifyRazorpayPayment({
              bookingId: activeBooking.bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 5. Confetti celebration
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });

            setActiveBooking(verifiedBooking);
            setStep('success');

            setTimeout(() => {
              const el = document.getElementById('receipt-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          } catch (verifyErr: any) {
            setError(verifyErr.message || 'Payment verification failed. Please contact helpline 9344337331.');
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (failRes: any) {
        setError(`Razorpay payment failed: ${failRes.error?.description || 'Transaction cancelled'}`);
        setProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Could not initiate Razorpay payment');
      setProcessingPayment(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!activeBooking) return;
    try {
      setProcessingPayment(true);
      const paymentMethodName =
        selectedPaymentMethod === 'upi'
          ? 'UPI Direct Transfer (9344337331)'
          : 'Razorpay Online';

      const confirmed = await api.confirmInternshipPayment({
        bookingId: activeBooking.bookingId,
        paymentMethod: paymentMethodName,
        transactionId: customTxnId || undefined,
      });

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setActiveBooking(confirmed);
      setStep('success');

      setTimeout(() => {
        const el = document.getElementById('receipt-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top High-Impact Enquiry Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-2.5 px-4 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white text-orange-700 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Enquiry Helpline
            </span>
            <span className="font-bold">
              WeGrow Skill Campus & B School, Sivakasi:
            </span>
            <a
              href="tel:9344337331"
              className="font-extrabold text-white underline hover:text-amber-200 flex items-center gap-1 font-mono text-sm"
            >
              <Phone className="w-3.5 h-3.5" /> 9344337331
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919344337331?text=Hello%20WeGrow,%20I%20am%20interested%20in%20the%20Internship%20Program"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 9344337331</span>
            </a>

            <button
              onClick={onGoToAdmin}
              className="bg-slate-900/80 hover:bg-slate-900 text-white font-bold px-3 py-1 rounded-full text-xs border border-white/20 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Internship Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow inline-block">
                  <img
                    src="/wegrow-logo.png"
                    alt="WeGrow Skill Campus"
                    className="h-10 sm:h-12 object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 block">
                    WeGrow Skill Campus & B School
                  </span>
                  <span className="text-xs font-semibold text-slate-300 italic">
                    Building Skills. Growing Futures.
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 border border-orange-500/40 px-3.5 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Industry Internship Program 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Hands-on Industry <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                  Internship For College Students
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Transform classroom theory into real-world software engineering. Work on live enterprise applications, gain direct mentor guidance, and receive an official Industry Internship Certificate & placement referral from <strong>WeGrow Skill Campus, Sivakasi</strong>.
              </p>

              {/* Quick Perks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="font-bold text-orange-400 flex items-center gap-1.5 mb-1">
                    <Laptop className="w-4 h-4" /> Live Projects
                  </div>
                  <div className="text-slate-300 text-[11px]">Real codebase & Git deployment</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <Award className="w-4 h-4" /> Verified Certificate
                  </div>
                  <div className="text-slate-300 text-[11px]">Industry-recognized credential</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4" /> ₹1000 Pre-booking
                  </div>
                  <div className="text-slate-300 text-[11px]">Instant seat reservation</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    const el = document.getElementById('internship-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transform transition hover:scale-105"
                >
                  <span>Apply Now & Pre-book Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:9344337331"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 font-mono"
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                  <span>Call Enquiry: 9344337331</span>
                </a>

                <button
                  onClick={onGoToWorkshop}
                  className="px-4 py-3.5 text-xs text-slate-300 hover:text-white underline font-medium"
                >
                  View Career Guidance Workshop →
                </button>
              </div>
            </div>

            {/* Right Mascot & Campus Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-blue-900/90 to-slate-900/90 border border-blue-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-blue-800">
                  <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-400/40 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/wegrow-mascot.webp"
                      alt="WeGrow Mascot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-200">
                    <div className="font-extrabold text-orange-400 text-sm">
                      WeGrow Admissions Desk
                    </div>
                    <p className="italic text-[11px] mt-0.5 text-slate-300">
                      "Pre-book your internship seat with ₹1,000 reservation fee. Instant official email receipt sent to your inbox!"
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">WeGrow Skill Campus & B School</strong>
                      <span className="text-[11px] text-slate-400">
                        193/1A Ground Floor, Ayyappan Kovil Opp, Police Station Rd, Sivakasi - 626 123
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-slate-400">Direct Enquiry Helpline: </span>
                      <a href="tel:9344337331" className="text-white font-extrabold font-mono hover:text-orange-400 text-sm">
                        9344337331
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-400">Eligible: </span>
                      <span className="text-white font-semibold">1st, 2nd, 3rd, Final Year & Passed Out Students</span>
                    </div>
                  </div>
                </div>

                {/* Prebooking Price Tag */}
                <div className="mt-5 p-3.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-300 block">
                      Seat Pre-Booking Fee
                    </span>
                    <span className="text-2xl font-black text-white font-mono">₹1,000</span>
                  </div>
                  <span className="bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow">
                    Instant Seat Lock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNSHIP TRACKS DISPLAY */}
      <section className="max-w-7xl mx-auto my-12 px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Specialized Domains
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 mt-2">
            Choose Your Internship Specialization
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Industry-aligned technical tracks designed to make college graduates hireable on Day 1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainsList.map((d, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    {d.duration}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                    {d.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-blue-950 text-sm mb-1.5">
                  {d.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  <strong className="text-slate-700">Tech Stack:</strong> {d.stack}
                </p>
              </div>

              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, internshipDomain: d.id }));
                  const el = document.getElementById('internship-form-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 hover:border-orange-300 font-bold text-xs rounded-xl transition"
              >
                Select This Track
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FORM & PAYMENT CONTAINER */}
      <section id="internship-form-section" className="max-w-4xl mx-auto my-12 px-4 scroll-mt-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Step 1: Student Details & Pre-booking
                </span>
                <h2 className="text-2xl font-black text-white">
                  Internship Student Registration Form
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Fill in your details below to reserve your internship seat with the ₹1,000 prebooking fee.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pre-booking Fee</span>
                <span className="text-2xl font-black text-orange-400 font-mono">₹1,000</span>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 mx-6 sm:mx-8 mt-6 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs font-semibold rounded-r-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 font-bold text-xs uppercase underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* APPLICATION FORM */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-orange-500" /> Student Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name as per College Records"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit primary mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp number for updates"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com (Receipt will be sent here)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Parents Phone Number <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-semibold text-slate-400">
                        (Different from student mobile)
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Father / Mother phone number"
                      value={formData.parentsMobile}
                      onChange={(e) => setFormData({ ...formData, parentsMobile: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-2 outline-none transition ${
                        isSamePhone
                          ? 'border-red-500 ring-2 ring-red-200 bg-red-50/60 text-red-900'
                          : 'border-slate-300 focus:ring-blue-600 bg-white'
                      }`}
                    />
                    {isSamePhone && (
                      <p className="text-[11px] text-red-600 font-bold mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Parents phone number cannot be the same as student mobile number.</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education Info */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-orange-500" /> College & Academic Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      College Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayya Nadar Janaki Ammal College / Mepco Schlenk / SFR College"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Department / Degree <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      {departmentsList.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Year of Study <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Passed Out">Passed Out (Graduate)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Internship Track Preference */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-orange-500" /> Selected Internship Domain & Mode
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Domain Track
                    </label>
                    <select
                      value={formData.internshipDomain}
                      onChange={(e) => setFormData({ ...formData, internshipDomain: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      {domainsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Training Mode
                    </label>
                    <select
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="In-Campus (Sivakasi)">In-Campus (Sivakasi Campus)</option>
                      <option value="Online Hybrid">Online Hybrid with Mentor Review</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Prebooking summary banner */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-orange-900 block">
                    Pre-booking Seat Reservation: ₹1,000
                  </span>
                  <span className="text-slate-600">
                    Once submitted, you will be taken to the payment gateway to pay ₹1000 and receive your instant email receipt.
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-orange-600 shrink-0">
                  ₹1,000.00
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-950 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Saving Application Details...</span>
                ) : (
                  <>
                    <span>Proceed to Pre-booking Payment (₹1,000)</span>
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY */}
          {step === 'payment' && activeBooking && (
            <div id="payment-step-section" className="p-6 sm:p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-800">Booking Reference</span>
                  <div className="font-mono text-lg font-black text-blue-950">{activeBooking.bookingId}</div>
                  <div className="text-xs text-slate-600">{activeBooking.studentName} • {activeBooking.collegeName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Amount Due</span>
                  <div className="text-2xl font-black text-orange-600 font-mono">₹1,000</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
                  Choose Payment Gateway:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('razorpay')}
                    className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      selectedPaymentMethod === 'razorpay'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-black text-blue-900 text-sm">
                        <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span>Razorpay Gateway</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-700 text-white px-2 py-0.5 rounded-full">
                        Instant & Automated
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">UPI, Cards, Netbanking & Wallets</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Instant confirmation + Automated Resend email receipt</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      selectedPaymentMethod === 'upi'
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <QrCode className="w-4 h-4 text-orange-600" />
                        <span>Direct UPI Transfer</span>
                      </div>
                      <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        Scan & Pay
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">UPI QR / 9344337331</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Pay via GPay, PhonePe, Paytm with reference ID</div>
                  </button>
                </div>
              </div>

              {/* RAZORPAY ACTIVE VIEW */}
              {selectedPaymentMethod === 'razorpay' && (
                <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-blue-900/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          Official Gateway
                        </span>
                        <span className="text-xs font-semibold text-blue-200">256-Bit SSL Secured</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white mt-1">
                        Pay ₹1,000 via Razorpay
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-md">
                        Supports Google Pay, PhonePe, Paytm, BHIM UPI, Visa, Mastercard, RuPay, and all major Indian banks.
                      </p>
                    </div>

                    <div className="text-center sm:text-right shrink-0">
                      <div className="text-[11px] text-slate-400 uppercase font-bold">Total Amount</div>
                      <div className="text-3xl font-black text-orange-400 font-mono">₹1,000.00</div>
                    </div>
                  </div>

                  {/* Payment Feature Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6 text-[11px]">
                    <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Instant Seat Booking</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>Resend Automated Receipt</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2 col-span-2 sm:col-span-1">
                      <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>PCI-DSS Verified</span>
                    </div>
                  </div>

                  {/* Razorpay Trigger Button */}
                  <button
                    type="button"
                    disabled={processingPayment}
                    onClick={handlePayWithRazorpay}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {processingPayment ? (
                      <span>Processing Razorpay Checkout...</span>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 text-white fill-white" />
                        <span>Launch Razorpay & Pay ₹1,000 Now</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* UPI QR & Instructions */}
              {selectedPaymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
                    {/* Mock UPI QR */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-sm text-center shrink-0">
                      <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                        <QrCode className="w-24 h-24 text-white" />
                        <span className="text-[9px] font-mono text-orange-400 font-bold">UPI: 9344337331</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-1.5">
                        Scan to Pay ₹1,000
                      </span>
                    </div>

                    <div className="space-y-2 text-xs flex-1">
                      <div className="font-extrabold text-blue-950 text-sm">
                        UPI Payment Helpline & ID
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 flex items-center justify-between">
                        <span>UPI ID: <strong>wegrow@upi</strong></span>
                        <span className="text-orange-600 font-bold">9344337331</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Pay using any UPI app (Google Pay, PhonePe, Paytm, or BHIM) to <strong>9344337331</strong>. Once paid, enter your transaction reference below to confirm and receive your email receipt immediately.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      UPI / UTR Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI-123456789 or leave blank for auto-reference"
                      value={customTxnId}
                      onChange={(e) => setCustomTxnId(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={processingPayment}
                    onClick={handleConfirmPayment}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {processingPayment ? (
                      <span>Verifying & Sending Email Receipt...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Confirm ₹1,000 Manual UPI & Issue Receipt</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Back to details */}
              <div className="flex items-center justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  ← Edit Student Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & PRINTABLE RECEIPT */}
          {step === 'success' && activeBooking && (
            <div id="receipt-section" className="p-6 sm:p-8 space-y-6">
              {/* Green Confirmation Hero */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950 mb-1">
                  Internship Pre-booking Confirmed!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your seat reservation fee of ₹1,000 has been verified. An official booking receipt has been dispatched to <strong>{activeBooking.email}</strong>.
                </p>
                <div className="inline-flex items-center gap-2 mt-3 bg-white text-emerald-900 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resend Email: {activeBooking.emailDeliveryStatus?.includes('sent') ? 'Delivered to ' + activeBooking.email + ' ✓' : 'Dispatched to ' + activeBooking.email + ' ✓'}</span>
                </div>
              </div>

              {/* Official Printable Receipt Card */}
              <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm">
                {/* Receipt Header */}
                <div className="border-b-2 border-slate-200 pb-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/wegrow-logo.png" alt="WeGrow" className="h-12 object-contain" />
                    <div>
                      <h4 className="font-black text-blue-950 text-base">WeGrow Skill Campus</h4>
                      <p className="text-[11px] text-slate-500">Sivakasi Campus • 193/1A Police Station Road</p>
                      <p className="text-[10px] text-orange-600 font-bold">Helpline: 9344337331</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Receipt</span>
                    <span className="font-mono text-sm font-black text-blue-950">{activeBooking.bookingId}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Ref: {activeBooking.transactionId || 'TXN-WG-934433'}
                    </span>
                    {activeBooking.razorpayOrderId && (
                      <span className="text-[9px] text-blue-600 block font-mono">
                        RZP Order: {activeBooking.razorpayOrderId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount Box */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center mb-6">
                  <span className="text-[10px] uppercase font-bold text-orange-800">Pre-booking Fee Received</span>
                  <div className="text-3xl font-black text-orange-600 font-mono">₹1,000.00</div>
                  <span className="text-[11px] text-slate-600">Method: {activeBooking.paymentMethod || 'UPI Instant Pay'}</span>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Student Name:</span>
                    <span className="font-extrabold text-blue-950">{activeBooking.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Contact Mobile:</span>
                    <span className="font-bold text-slate-800">{activeBooking.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Parents Phone:</span>
                    <span className="font-bold text-slate-800">{activeBooking.parentsMobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">College Name:</span>
                    <span className="font-bold text-slate-800 truncate block">{activeBooking.collegeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Department:</span>
                    <span className="font-bold text-slate-800">{activeBooking.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Year of Study:</span>
                    <span className="font-bold text-slate-800">{activeBooking.year}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-semibold">Internship Specialization:</span>
                    <span className="font-bold text-orange-600">{activeBooking.internshipDomain}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Mode:</span>
                    <span className="font-bold text-slate-800">{activeBooking.mode}</span>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                  <span>Admissions Coordinator: <strong>9344337331</strong></span>
                  <span className="italic">Authorized System-Generated Digital Receipt</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 no-print">
                <button
                  onClick={handlePrintReceipt}
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Print / Download Receipt</span>
                </button>

                <button
                  onClick={() => {
                    setStep('form');
                    setActiveBooking(null);
                    setFormData({
                      studentName: '',
                      mobile: '',
                      whatsapp: '',
                      email: '',
                      collegeName: '',
                      department: 'Computer Science & Engineering',
                      year: 'Final Year',
                      parentsMobile: '',
                      internshipDomain: 'Fullstack Web Development (React & NestJS)',
                      mode: 'In-Campus (Sivakasi)',
                      notes: '',
                    });
                  }}
                  className="px-5 py-3 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition"
                >
                  Book for Another Student
                </button>

                <a
                  href="tel:9344337331"
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Enquiry: 9344337331</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FLOATING ENQUIRY WIDGET (Always visible on mobile & desktop) */}
      <aside aria-label="Quick Enquiry Helpline" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 no-print">
        <a
          href="https://wa.me/919344337331?text=Hi%20WeGrow,%20I%20have%20an%20enquiry%20regarding%20the%20Internship%20Program"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center transform transition hover:scale-110"
          title="Chat on WhatsApp: 9344337331"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        <a
          href="tel:9344337331"
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 transform transition hover:scale-105"
        >
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
          <div className="text-left">
            <span className="text-[9px] uppercase font-bold text-orange-400 block leading-none">
              Enquiry Helpline
            </span>
            <span className="text-xs font-mono font-black text-white">9344337331</span>
          </div>
        </a>
      </aside>
    </div>
  );
};

