import { AxiosInstance, AxiosError } from "axios";

export interface Profile {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  profile_id: number;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  achievements?: string[];
  created_at: string;
}

export interface Education {
  id: number;
  profile_id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  gpa?: number;
  created_at: string;
}

export interface Skill {
  id: number;
  profile_id: number;
  name: string;
  category?: string;
  proficiency?: string;
  created_at: string;
}

export interface JobApplication {
  id: number;
  user_id: string;
  job_title: string;
  company?: string;
  job_type?: string;
  job_description: string;
  qualifications?: string;
  gap_analysis?: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedCV {
  id: number;
  user_id: string;
  job_application_id: number;
  job_title?: string;
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CVComment {
  id: number;
  cv_id: number;
  content: string;
  ai_response?: string;
  applied: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

export interface UserResponse {
  user: User;
  profile?: Profile;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
}

const api: AxiosInstance = require("axios").default.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// User API
export const userApi = {
  get: async (token: string): Promise<{ data: UserResponse }> => {
    const res = await api.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  updateProfile: async (token: string, profile: Partial<Profile>): Promise<{ data: Profile }> => {
    const res = await api.put("/user/profile", profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  uploadCV: async (token: string, formData: FormData): Promise<{ data: { profile: Partial<Profile> } }> => {
    const res = await api.post("/user/upload-cv", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};

// Job API
export const jobApi = {
  list: async (token: string): Promise<{ data: JobApplication[] }> => {
    const res = await api.get("/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  get: async (token: string, id: number): Promise<{ data: JobApplication }> => {
    const res = await api.get(`/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  create: async (token: string, data: Partial<JobApplication>): Promise<{ data: JobApplication }> => {
    const res = await api.post("/jobs", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  update: async (token: string, id: number, data: Partial<JobApplication>): Promise<{ data: JobApplication }> => {
    const res = await api.put(`/jobs/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  delete: async (token: string, id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  analyzeGap: async (token: string, id: number): Promise<{ data: { analysis: string } }> => {
    const res = await api.post(`/jobs/${id}/analyze`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// CV API
export const cvApi = {
  list: async (token: string): Promise<{ data: GeneratedCV[] }> => {
    const res = await api.get("/cvs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  get: async (token: string, id: number): Promise<{ data: GeneratedCV }> => {
    const res = await api.get(`/cvs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  generate: async (token: string, data: { job_application_id: number }): Promise<{ data: GeneratedCV }> => {
    const res = await api.post("/cvs/generate", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  delete: async (token: string, id: number): Promise<void> => {
    await api.delete(`/cvs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  downloadPDF: async (token: string, id: number): Promise<Blob> => {
    const res = await api.get(`/cvs/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    return res.data;
  },

  chat: async (
    token: string,
    cvId: number,
    message: string,
    history: { role: string; content: string }[]
  ): Promise<{ data: { response: string; cv_content: string } }> => {
    const res = await api.post(`/cvs/${cvId}/chat`, { message, history }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getComments: async (token: string, cvId: number): Promise<{ data: CVComment[] }> => {
    const res = await api.get(`/cvs/${cvId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  addComment: async (token: string, cvId: number, content: string): Promise<{ data: CVComment }> => {
    const res = await api.post(`/cvs/${cvId}/comments`, { content }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  applyComment: async (token: string, cvId: number, commentId: number): Promise<{ data: { content: string } }> => {
    const res = await api.post(`/cvs/${cvId}/comments/${commentId}/apply`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// Credits API
export const creditsApi = {
  purchase: async (
    token: string,
    data: { credits: number; amount: number }
  ): Promise<{ data: { redirect_url: string; order_id: string } }> => {
    const res = await api.post("/credits/purchase", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export default api;
