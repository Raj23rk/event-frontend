import axios from 'axios';

// Vite proxy forwards '/api' to 'http://localhost:5000/api'
const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentApi = {
  // Student registration
  registerStudent: async (data: Record<string, any>) => {
    const res = await apiClient.post('/students/register', data);
    return res.data;
  },

  // Admin: Get all students with filters/search/pagination
  getStudents: async (params?: {
    search?: string;
    status?: string;
    domain?: string;
    college?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const res = await apiClient.get('/students', { params });
    return res.data;
  },

  // Admin: Get complete student profile + full assessment
  getStudentById: async (id: string) => {
    const res = await apiClient.get(`/students/${id}`);
    return res.data;
  },

  // Find by Reg No (e.g. WG-2026-001)
  getStudentByRegNo: async (regNo: string) => {
    const res = await apiClient.get(`/students/by-reg/${regNo}`);
    return res.data;
  },

  // Admin: Update student details
  updateStudent: async (id: string, data: Record<string, any>) => {
    const res = await apiClient.put(`/students/${id}`, data);
    return res.data;
  },

  // Admin: Delete student
  deleteStudent: async (id: string) => {
    const res = await apiClient.delete(`/students/${id}`);
    return res.data;
  },

  // Admin: Bulk delete
  bulkDeleteStudents: async (ids: string[]) => {
    const res = await apiClient.post('/students/bulk-delete', { ids });
    return res.data;
  },

  // Admin: Reset assessment
  resetAssessment: async (id: string) => {
    const res = await apiClient.post(`/students/${id}/reset-assessment`);
    return res.data;
  },

  // Admin: Dashboard metrics & analytics
  getBatchSummary: async () => {
    const res = await apiClient.get('/students/batch-summary');
    return res.data;
  },

  // Admin: Export data
  getExportData: async () => {
    const res = await apiClient.get('/students/export');
    return res.data;
  },
};

export default studentApi;

