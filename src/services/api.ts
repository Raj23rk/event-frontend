import {
  Student,
  Question,
  AssessmentSession,
  QuestionWiseStat,
  WorkshopOverview,
  RosterStudent,
  InternshipBooking,
  InternshipStats,
  RazorpayOrderResponse,
  VerifyRazorpayPaymentPayload,
} from '../types';

const rawBase =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || '/api');
const API_BASE = rawBase.replace(/\/+$/, '');

export const api = {
  // Students
  async registerStudent(studentData: any): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getStudents(params?: { search?: string; status?: string }): Promise<Student[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const res = await fetch(`${API_BASE}/students?${query.toString()}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async getStudentByRegNo(regNo: string): Promise<Student | null> {
    const res = await fetch(`${API_BASE}/students/by-reg/${regNo}`);
    if (!res.ok) return null;
    return res.json();
  },

  // Assessment
  async startAssessment(studentId: string): Promise<AssessmentSession> {
    const res = await fetch(`${API_BASE}/assessment/start/${studentId}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to start assessment');
    }
    return res.json();
  },

  async submitAssessment(
    sessionId: string,
    answers: Array<{ questionId: string; selectedAnswer: string; timeSpentSeconds?: number }>,
    totalTimeSeconds?: number,
  ): Promise<AssessmentSession> {
    const res = await fetch(`${API_BASE}/assessment/submit/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, totalTimeSeconds }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit assessment');
    }
    return res.json();
  },

  async getAssessmentSession(sessionId: string): Promise<AssessmentSession> {
    const res = await fetch(`${API_BASE}/assessment/session/${sessionId}`);
    if (!res.ok) throw new Error('Session not found');
    return res.json();
  },

  async getStudentAssessment(studentId: string): Promise<AssessmentSession | null> {
    const res = await fetch(`${API_BASE}/assessment/student/${studentId}`);
    if (!res.ok) return null;
    return res.json();
  },

  // Questions
  async getQuestions(category?: string, difficulty?: string, isCustom?: boolean): Promise<Question[]> {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (difficulty) query.append('difficulty', difficulty);
    if (isCustom !== undefined) query.append('isCustom', String(isCustom));
    const res = await fetch(`${API_BASE}/questions?${query.toString()}`);
    return res.json();
  },

  async createQuestion(questionData: any): Promise<Question> {
    const res = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create question');
    }
    return res.json();
  },

  async deleteQuestion(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Reports
  async getWorkshopOverview(): Promise<WorkshopOverview> {
    try {
      const res = await fetch(`${API_BASE}/students/batch-summary`);
      if (res.ok) {
        const data = await res.json();
        return {
          quotaTarget: data.quotaTarget ?? 30,
          totalRegistered: data.totalRegistered ?? 0,
          completedAssessments: data.completed ?? 0,
          pendingAssessments: data.notStarted ?? (data.totalRegistered - (data.completed ?? 0)),
          classAveragePercentage: data.averagePercentage ?? 0,
          highestScorePercentage: data.highestPercentage ?? 0,
          lowestScorePercentage: data.lowestPercentage ?? 0,
          domainAverages: {},
          scoreDistribution: {},
          careerInterestsDistribution: {},
        };
      }
    } catch {
      // fallback to legacy endpoint
    }
    const res = await fetch(`${API_BASE}/reports/workshop-overview`);
    return res.json();
  },

  async getQuestionWiseReport(): Promise<QuestionWiseStat[]> {
    const res = await fetch(`${API_BASE}/reports/question-wise`);
    return res.json();
  },

  async getStudentRoster(): Promise<RosterStudent[]> {
    const res = await fetch(`${API_BASE}/reports/student-roster`);
    return res.json();
  },

  async seedDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/seed-demo`, { method: 'POST' });
    return res.json();
  },

  // Internship Endpoints
  async createInternshipBooking(data: any): Promise<InternshipBooking> {
    const res = await fetch(`${API_BASE}/internships/register-and-book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit internship application');
    }
    return res.json();
  },

  async confirmInternshipPayment(data: { bookingId: string; paymentMethod: string; transactionId?: string }): Promise<InternshipBooking> {
    const res = await fetch(`${API_BASE}/internships/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Payment confirmation failed');
    }
    return res.json();
  },

  async createRazorpayOrder(bookingId: string): Promise<RazorpayOrderResponse> {
    const res = await fetch(`${API_BASE}/internships/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to initialize Razorpay payment');
    }
    return res.json();
  },

  async verifyRazorpayPayment(payload: VerifyRazorpayPaymentPayload): Promise<InternshipBooking> {
    const res = await fetch(`${API_BASE}/internships/verify-razorpay-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Razorpay payment verification failed');
    }
    return res.json();
  },

  async getInternshipBookings(params?: { search?: string; paymentStatus?: string; department?: string; internshipDomain?: string }): Promise<InternshipBooking[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.paymentStatus && params.paymentStatus !== 'all') query.append('paymentStatus', params.paymentStatus);
    if (params?.department && params.department !== 'all') query.append('department', params.department);
    if (params?.internshipDomain && params.internshipDomain !== 'all') query.append('internshipDomain', params.internshipDomain);

    const res = await fetch(`${API_BASE}/internships/bookings?${query.toString()}`);
    return res.json();
  },

  async getInternshipStats(): Promise<InternshipStats> {
    const res = await fetch(`${API_BASE}/internships/stats`);
    return res.json();
  },

  async getInternshipBookingById(id: string): Promise<InternshipBooking> {
    const res = await fetch(`${API_BASE}/internships/bookings/${id}`);
    if (!res.ok) throw new Error('Booking not found');
    return res.json();
  },

  async resendInternshipReceipt(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/internships/resend-receipt/${id}`, { method: 'POST' });
    return res.json();
  },

  async seedInternshipDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/internships/seed-demo`, { method: 'POST' });
    return res.json();
  },
};

export { studentApi } from './studentApi';


