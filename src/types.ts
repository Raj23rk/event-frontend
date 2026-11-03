export interface OptionItem {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  _id?: string;
  questionId?: string;
  questionText: string;
  codeSnippet?: string;
  category: 'HTML' | 'CSS' | 'Responsive Design' | 'Web Basics';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  options: OptionItem[];
  correctAnswer: string;
  explanation: string;
  isCustom?: boolean;
  tags?: string[];
  active?: boolean;
}

export interface Student {
  _id: string;
  studentName: string;
  dob?: string;
  age?: number;
  gender?: string;
  parentName?: string;
  parentOccupation?: string;
  mobile: string;
  whatsapp?: string;
  parentMobile?: string;
  email: string;
  residentialAddress?: string;
  city?: string;
  pincode?: string;
  collegeName: string;
  courseYear: string;
  boardUniversity?: string;
  medium?: string;
  lastExamPercentage?: string;
  favouriteSubjects?: string;
  careerInterests: string[];
  dreamCareer?: string;
  workshopExpectation?: string;
  attendedBefore?: string;
  hearAbout?: string;
  selectedDomain: string;
  registrationNumber: string;
  status: 'registered' | 'assessment_started' | 'completed';
  assessmentSessionId?: string;
  assessmentScore?: number;
  assessmentPercentage?: number;
  createdAt: string;
}

export interface AssessmentQuestion {
  _id?: string;
  questionId: string;
  questionText: string;
  codeSnippet?: string;
  category: string;
  difficulty: string;
  options: OptionItem[];
  selectedAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  explanation?: string;
  isCustom?: boolean;
  timeSpentSeconds?: number;
}

export interface CategoryStat {
  score: number;
  total: number;
  percentage: number;
}

export interface CareerRecommendation {
  roleTitle: string;
  description: string;
  suitableTracks: string[];
  strengths: string[];
  growthAreas: string[];
  actionPlan: string[];
}

export interface AssessmentSession {
  _id: string;
  studentId: string;
  registrationNumber: string;
  studentName: string;
  selectedDomain: string;
  questions: AssessmentQuestion[];
  totalQuestions: number;
  score: number;
  maxScore: number;
  percentage: number;
  categoryBreakdown?: Record<string, CategoryStat>;
  skillBand?: string;
  careerRecommendation?: CareerRecommendation;
  status: 'in-progress' | 'submitted';
  startedAt: string;
  submittedAt?: string;
  timeTakenSeconds?: number;
}

export interface QuestionWiseStat {
  questionId: string;
  questionText: string;
  codeSnippet: string;
  category: string;
  difficulty: string;
  isCustom: boolean;
  correctAnswer: string;
  explanation: string;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  difficultyRating: string;
  optionDistribution: Record<string, number>;
  successfulStudents: Array<{ regNo: string; name: string }>;
  strugglingStudents: Array<{ regNo: string; name: string; chosenAnswer: string }>;
}

export interface WorkshopOverview {
  quotaTarget: number;
  totalRegistered: number;
  completedAssessments: number;
  pendingAssessments: number;
  classAveragePercentage: number;
  highestScorePercentage: number;
  lowestScorePercentage: number;
  domainAverages: Record<string, number>;
  scoreDistribution: Record<string, number>;
  careerInterestsDistribution: Record<string, number>;
}

export interface RosterStudent {
  id: string;
  registrationNumber: string;
  studentName: string;
  mobile: string;
  email: string;
  collegeName: string;
  courseYear: string;
  selectedDomain: string;
  careerInterests: string[];
  dreamCareer: string;
  status: string;
  score: number;
  maxScore: number;
  percentage: number;
  skillBand: string;
  timeTakenSeconds: number;
  categoryBreakdown: Record<string, CategoryStat>;
  hasCompleted: boolean;
  assessmentSessionId?: string;
  rank?: number | null;
}


export interface InternshipBooking {
  _id: string;
  bookingId: string;
  studentName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  collegeName: string;
  department: string;
  year: string;
  parentsMobile: string;
  internshipDomain: string;
  mode: string;
  prebookingAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: string;
  receiptSent?: boolean;
  emailDeliveryStatus?: string;
  receiptHtml?: string;
  enquiryPhone: string;
  notes?: string;
  createdAt: string;
}

export interface InternshipStats {
  totalApplications: number;
  paidCount: number;
  pendingCount: number;
  totalRevenue: number;
  domainBreakdown: Record<string, number>;
  departmentBreakdown: Record<string, number>;
  enquiryContact: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  bookingId: string;
  studentName: string;
  email: string;
  mobile: string;
}

export interface VerifyRazorpayPaymentPayload {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
