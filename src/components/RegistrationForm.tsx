import React, { useState } from 'react';
import { api } from '../services/api';
import { Student } from '../types';
import {
  User,
  GraduationCap,
  Compass,
  ArrowRight,
  CheckCircle,
  FileCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

interface RegistrationFormProps {
  onRegistered: (student: Student) => void;
  onGoToAssessment: (studentId: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegistered,
  onGoToAssessment,
}) => {
  const [formData, setFormData] = useState({
    // 1. Personal Details
    studentName: '',
    dob: '',
    age: 21,
    gender: 'Male',
    parentName: '',
    parentOccupation: '',
    mobile: '',
    whatsapp: '',
    parentMobile: '',
    email: '',
    residentialAddress: '',
    city: 'Sivakasi',
    pincode: '626123',

    // 2. Education Details
    collegeName: '',
    courseYear: 'B.Sc Computer Science (2026 Passout)',
    boardUniversity: 'Madurai Kamaraj University',
    medium: 'English',
    lastExamPercentage: '78%',
    favouriteSubjects: 'Web Technologies, Programming, HTML & CSS',

    // 3. Career Interests
    careerInterests: ['Software / IT'],
    dreamCareer: 'Fullstack Web Developer',
    workshopExpectation: 'To test and validate my HTML & CSS skills, understand job market readiness, and get career roadmap.',

    // 4. Other Details
    attendedBefore: 'No',
    hearAbout: 'Social Media',
    selectedDomain: 'HTML & CSS Web Development',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  const careerOptions = [
    'Software / IT',
    'Data Analytics',
    'Digital Marketing',
    'Graphic / Video Editing',
    'Engineering',
    'Medical / Healthcare',
    'Commerce / Finance',
    'Government Jobs',
    'Business / Entrepreneur',
    'Teaching',
    'Design / Arts',
    'Not sure yet',
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.careerInterests.includes(interest);
      if (exists) {
        return {
          ...prev,
          careerInterests: prev.careerInterests.filter((i) => i !== interest),
        };
      } else {
        return {
          ...prev,
          careerInterests: [...prev.careerInterests, interest],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.studentName.trim()) {
      setError('Student Name is required');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      setError('Please provide a valid 10-digit mobile number');
      return;
    }
    if (!formData.collegeName.trim()) {
      setError('College or Institution Name is required');
      return;
    }

    try {
      setLoading(true);
      const student = await api.registerStudent(formData);
      setRegisteredStudent(student);
      onRegistered(student);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify the information and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredStudent) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-green-50">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
          Registration Confirmed • 31 October 2026
        </span>
        <h2 className="text-3xl font-extrabold text-blue-950 mb-2">
          Welcome, {registeredStudent.studentName}!
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto mb-6">
          Your registration for the <strong className="text-slate-800">WeGrow Career Guidance Workshop</strong> has been recorded in the database.
        </p>

        {/* Badge Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 rounded-xl max-w-md mx-auto shadow-lg relative overflow-hidden mb-8 text-left">
          <div className="absolute right-0 top-0 opacity-15 translate-x-4 -translate-y-4">
            <img src="/wegrow-mascot.webp" alt="Mascot" className="w-36 h-36 object-contain" />
          </div>
          <div className="flex items-center justify-between border-b border-blue-700/60 pb-3 mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">
                Student Reg No.
              </div>
              <div className="text-2xl font-mono font-bold tracking-wide text-white">
                {registeredStudent.registrationNumber}
              </div>
            </div>
            <div className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
              Passout Batch
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Institution:</span>
              <span className="font-semibold text-slate-100 truncate block">
                {registeredStudent.collegeName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Degree / Course:</span>
              <span className="font-semibold text-slate-100 truncate block">
                {registeredStudent.courseYear}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Assessment Track:</span>
              <span className="font-semibold text-orange-300">
                {registeredStudent.selectedDomain}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact:</span>
              <span className="font-semibold text-slate-100">
                {registeredStudent.mobile}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onGoToAssessment(registeredStudent._id)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transform transition hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            <span>Launch My Skill Assessment (HTML & CSS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRegisteredStudent(null)}
            className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition"
          >
            Register Another Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="registration-form" className="max-w-4xl mx-auto my-8 px-4 scroll-mt-24">
      {/* Form Card Header - Matches WeGrow Official PDF Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Banner with Address */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/wegrow-logo.png"
                alt="WeGrow Logo"
                className="h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-blue-950 tracking-tight">
                  WeGrow Skill Campus
                </h1>
                <p className="text-xs text-slate-600 max-w-md">
                  193/1A, Ground Floor, Ayyappan Kovil Opp, Police Station Road, Sivakasi - 626 123
                </p>
                <p className="text-xs font-bold text-orange-600 mt-0.5">
                  Building Skills. Growing Futures.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/wegrow-mascot.webp"
                alt="WeGrow Mascot"
                className="w-16 h-16 object-contain hidden sm:block"
              />
            </div>
          </div>
        </div>

        {/* Orange Form Header Title */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 font-bold tracking-wide text-sm md:text-base">
            <FileCheck className="w-5 h-5 text-white" />
            <span>CAREER GUIDANCE WORKSHOP | STUDENT DETAILS FORM</span>
          </div>
          <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            31 October 2026
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-sm rounded-r-lg font-medium">
              {error}
            </div>
          )}

          {/* SECTION 1: PERSONAL DETAILS */}
          <div>
            <div className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-orange-400" />
              <span>1. PERSONAL DETAILS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name as per official certificate"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Gender
                </label>
                <div className="flex items-center gap-3 pt-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="16"
                  max="40"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  placeholder="Father / Mother / Guardian"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parent Occupation
                </label>
                <input
                  type="text"
                  placeholder="Occupation"
                  value={formData.parentOccupation}
                  onChange={(e) => setFormData({ ...formData, parentOccupation: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp No.
                </label>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parent Mobile No.
                </label>
                <input
                  type="tel"
                  placeholder="Parent mobile"
                  value={formData.parentMobile}
                  onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Door No, Street, Area"
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: EDUCATION DETAILS */}
          <div>
            <div className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-orange-400" />
              <span>2. EDUCATION DETAILS (COLLEGE STUDENTS PASSED OUT)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  School / College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayya Nadar Janaki Ammal College / Mepco Schlenk Engineering College"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Class / Course & Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Sc CS (2026 Passout), BCA, B.E. CSE"
                  value={formData.courseYear}
                  onChange={(e) => setFormData({ ...formData, courseYear: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Board / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Madurai Kamaraj University / Anna University"
                  value={formData.boardUniversity}
                  onChange={(e) => setFormData({ ...formData, boardUniversity: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Medium of Study
                </label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Last Exam Percentage / Grade
                </label>
                <input
                  type="text"
                  placeholder="e.g. 78% / 8.2 CGPA"
                  value={formData.lastExamPercentage}
                  onChange={(e) => setFormData({ ...formData, lastExamPercentage: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Favourite Subjects
                </label>
                <input
                  type="text"
                  placeholder="e.g. Web Development, Programming in Python, Database, Design"
                  value={formData.favouriteSubjects}
                  onChange={(e) => setFormData({ ...formData, favouriteSubjects: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CAREER INTERESTS */}
          <div>
            <div className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-orange-400" />
              <span>3. CAREER INTERESTS (TICK ALL THAT APPLY)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 italic">
              Your career guidance score report will tailor recommendations according to these choices.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              {careerOptions.map((interest) => {
                const checked = formData.careerInterests.includes(interest);
                return (
                  <label
                    key={interest}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium cursor-pointer transition ${
                      checked
                        ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleInterestToggle(interest)}
                      className="rounded text-orange-500 focus:ring-orange-400 h-4 w-4"
                    />
                    <span>{interest}</span>
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dream Career / Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Web Developer / Software Engineer"
                  value={formData.dreamCareer}
                  onChange={(e) => setFormData({ ...formData, dreamCareer: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  What do you expect from this workshop?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Industry skill evaluation, job placement advice"
                  value={formData.workshopExpectation}
                  onChange={(e) => setFormData({ ...formData, workshopExpectation: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: OTHER DETAILS (MATCHING OFFICIAL WEGROW FORM) */}
          <div>
            <div className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>4. OTHER DETAILS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Attended career guidance before?
                </label>
                <div className="flex items-center gap-4">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="attendedBefore"
                        value={opt}
                        checked={formData.attendedBefore === opt}
                        onChange={(e) => setFormData({ ...formData, attendedBefore: e.target.value })}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  How did you hear about this workshop?
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {['School', 'Friend', 'Social Media', 'Poster', 'Other'].map((source) => (
                    <label key={source} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="hearAbout"
                        value={source}
                        checked={formData.hearAbout === source}
                        onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <span>{source}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Declaration and Submit Button */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-4 italic">
              "I declare that the details given above are true, and I agree to attend the WeGrow Career Guidance Workshop on 31 October 2026."
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-950 hover:to-slate-900 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-900/25 flex items-center justify-center gap-3 transition transform hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Student...</span>
              ) : (
                <>
                  <span>Submit Details & Issue Student Registration Number</span>
                  <ArrowRight className="w-5 h-5 text-orange-400" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

