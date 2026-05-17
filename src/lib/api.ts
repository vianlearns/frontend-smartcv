import axios, { AxiosInstance } from "axios";

export interface Profile {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  linked_in?: string;
  github?: string;
  website?: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  user_id: number;
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
  user_id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  gpa?: number;
  achievements?: string[];
  created_at: string;
}

export interface Skill {
  id: number;
  user_id: number;
  name: string;
  category?: string;
  proficiency?: string;
  created_at: string;
}

export interface Certification {
  id: number;
  user_id: number;
  name: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  created_at: string;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface JobApplication {
  id: number;
  user_id: number;
  job_title: string;
  company?: string;
  job_type?: string;
  job_description: string;
  qualifications?: string;
  status?: string;
  gap_analysis?: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedCV {
  id: number;
  user_id: number;
  job_application_id: number;
  job_title?: string;
  title?: string;
  content: Record<string, unknown>;
  ats_score?: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CVComment {
  id: number;
  cv_id: number;
  user_id: number;
  section?: string;
  content: string;
  is_resolved?: boolean;
  created_at: string;
}

export interface User {
  id: number;
  clerk_id: string;
  email: string;
  full_name?: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: wraps raw backend response into { data: T } shape for consistent frontend access
function wrap<T>(data: T): { data: T } {
  return { data };
}

// User API — backend returns User directly (not wrapped)
export const userApi = {
  get: async (token: string): Promise<{ data: User }> => {
    const res = await axiosInstance.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as User);
  },

  update: async (token: string, data: { full_name?: string; email?: string }): Promise<void> => {
    await axiosInstance.put("/user", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Profile API
export const profileApi = {
  get: async (token: string): Promise<{ data: Profile | null }> => {
    const res = await axiosInstance.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as Profile | null);
  },

  update: async (token: string, profile: Partial<Profile>): Promise<void> => {
    await axiosInstance.put("/profile", profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Experience API
export const experienceApi = {
  list: async (token: string): Promise<{ data: Experience[] }> => {
    const res = await axiosInstance.get("/experiences", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as Experience[]) || []);
  },

  create: async (token: string, data: Partial<Experience>): Promise<{ data: Experience }> => {
    const res = await axiosInstance.post("/experiences", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as Experience);
  },

  update: async (token: string, id: number, data: Partial<Experience>): Promise<void> => {
    await axiosInstance.put(`/experiences/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (token: string, id: number): Promise<void> => {
    await axiosInstance.delete(`/experiences/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Education API
export const educationApi = {
  list: async (token: string): Promise<{ data: Education[] }> => {
    const res = await axiosInstance.get("/educations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as Education[]) || []);
  },

  create: async (token: string, data: Partial<Education>): Promise<{ data: Education }> => {
    const res = await axiosInstance.post("/educations", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as Education);
  },

  update: async (token: string, id: number, data: Partial<Education>): Promise<void> => {
    await axiosInstance.put(`/educations/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (token: string, id: number): Promise<void> => {
    await axiosInstance.delete(`/educations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Skills API
export const skillApi = {
  list: async (token: string): Promise<{ data: Skill[] }> => {
    const res = await axiosInstance.get("/skills", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as Skill[]) || []);
  },

  create: async (token: string, data: Partial<Skill>): Promise<{ data: Skill }> => {
    const res = await axiosInstance.post("/skills", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as Skill);
  },

  update: async (token: string, id: number, data: Partial<Skill>): Promise<void> => {
    await axiosInstance.put(`/skills/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (token: string, id: number): Promise<void> => {
    await axiosInstance.delete(`/skills/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Certifications API
export const certificationApi = {
  list: async (token: string): Promise<{ data: Certification[] }> => {
    const res = await axiosInstance.get("/certifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as Certification[]) || []);
  },

  create: async (token: string, data: Partial<Certification>): Promise<{ data: Certification }> => {
    const res = await axiosInstance.post("/certifications", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as Certification);
  },

  update: async (token: string, id: number, data: Partial<Certification>): Promise<void> => {
    await axiosInstance.put(`/certifications/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (token: string, id: number): Promise<void> => {
    await axiosInstance.delete(`/certifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Projects API
export const projectApi = {
  list: async (token: string): Promise<{ data: Project[] }> => {
    const res = await axiosInstance.get("/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as Project[]) || []);
  },

  create: async (token: string, data: Partial<Project>): Promise<{ data: Project }> => {
    const res = await axiosInstance.post("/projects", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as Project);
  },

  update: async (token: string, id: number, data: Partial<Project>): Promise<void> => {
    await axiosInstance.put(`/projects/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (token: string, id: number): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Job API
export const jobApi = {
  list: async (token: string): Promise<{ data: JobApplication[] }> => {
    const res = await axiosInstance.get("/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as JobApplication[]) || []);
  },

  get: async (token: string, id: number): Promise<{ data: JobApplication }> => {
    const res = await axiosInstance.get(`/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as JobApplication);
  },

  create: async (token: string, data: Partial<JobApplication>): Promise<{ data: JobApplication }> => {
    const res = await axiosInstance.post("/jobs", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as JobApplication);
  },

  update: async (token: string, id: number, data: Partial<JobApplication>): Promise<void> => {
    await axiosInstance.put(`/jobs/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (token: string, id: number): Promise<void> => {
    await axiosInstance.delete(`/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// CV API
export const cvApi = {
  list: async (token: string): Promise<{ data: GeneratedCV[] }> => {
    const res = await axiosInstance.get("/cv", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as GeneratedCV[]) || []);
  },

  get: async (token: string, id: number): Promise<{ data: GeneratedCV }> => {
    const res = await axiosInstance.get(`/cv/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as GeneratedCV);
  },

  generate: async (token: string, jobApplicationId: number): Promise<{ data: GeneratedCV }> => {
    const res = await axiosInstance.post("/cv/generate", { job_application_id: jobApplicationId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as GeneratedCV);
  },

  update: async (token: string, id: number, content: Record<string, unknown>): Promise<void> => {
    await axiosInstance.put(`/cv/${id}`, { content }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  downloadPDF: async (token: string, id: number): Promise<Blob> => {
    const res = await axiosInstance.get(`/cv/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    return res.data;
  },

  upload: async (token: string, formData: FormData): Promise<{ data: { message: string; data: Record<string, unknown> } }> => {
    const res = await axiosInstance.post("/cv/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return wrap(res.data);
  },

  getComments: async (token: string, cvId: number): Promise<{ data: CVComment[] }> => {
    const res = await axiosInstance.get(`/cv/${cvId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap((res.data as CVComment[]) || []);
  },

  addComment: async (token: string, cvId: number, content: string, section?: string): Promise<{ data: CVComment }> => {
    const res = await axiosInstance.post(`/cv/${cvId}/comments`, { content, section }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data as CVComment);
  },

  resolveComment: async (token: string, commentId: number): Promise<void> => {
    await axiosInstance.patch(`/cv/comments/${commentId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// AI API
export const aiApi = {
  analyzeGap: async (token: string, jobApplicationId: number): Promise<{ data: { match_score: number; matching_skills: string[]; missing_skills: string[]; recommendations: string[] } }> => {
    const res = await axiosInstance.post("/analyze", { job_application_id: jobApplicationId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data);
  },

  chat: async (token: string, message: string, history: { role: string; content: string }[]): Promise<{ data: { response: string } }> => {
    const res = await axiosInstance.post("/chat", { message, history }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data);
  },

  getChatHistory: async (token: string, jobId: number): Promise<{ data: { messages: { role: string; content: string }[] } }> => {
    const res = await axiosInstance.get(`/chat/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data);
  },
};

// Credits API
export const creditsApi = {
  get: async (token: string): Promise<{ data: { credits: number } }> => {
    const res = await axiosInstance.get("/credits", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data);
  },

  purchase: async (token: string, packageId: string): Promise<{ data: { token: string; redirect_url: string; order_id: string } }> => {
    const res = await axiosInstance.post("/credits/purchase", { package_id: packageId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return wrap(res.data);
  },
};

// Convenience exports
export const api = {
  // User
  getUser: userApi.get,
  updateUser: userApi.update,

  // Profile
  getProfile: profileApi.get,
  updateProfile: profileApi.update,

  // Experience
  getExperiences: experienceApi.list,
  createExperience: experienceApi.create,
  updateExperience: experienceApi.update,
  deleteExperience: experienceApi.delete,

  // Education
  getEducations: educationApi.list,
  createEducation: educationApi.create,
  updateEducation: educationApi.update,
  deleteEducation: educationApi.delete,

  // Skills
  getSkills: skillApi.list,
  createSkill: skillApi.create,
  updateSkill: skillApi.update,
  deleteSkill: skillApi.delete,

  // Certifications
  getCertifications: certificationApi.list,
  createCertification: certificationApi.create,
  deleteCertification: certificationApi.delete,

  // Projects
  getProjects: projectApi.list,
  createProject: projectApi.create,
  updateProject: projectApi.update,
  deleteProject: projectApi.delete,

  // Jobs
  getJobs: jobApi.list,
  getJob: jobApi.get,
  createJob: jobApi.create,
  updateJob: jobApi.update,
  deleteJob: jobApi.delete,

  // CVs
  getCVs: cvApi.list,
  getCV: cvApi.get,
  generateCV: cvApi.generate,
  updateCV: cvApi.update,
  downloadPDF: cvApi.downloadPDF,
  uploadCV: cvApi.upload,
  getComments: cvApi.getComments,
  addComment: cvApi.addComment,
  resolveComment: cvApi.resolveComment,

  // AI
  analyzeGap: aiApi.analyzeGap,
  chat: aiApi.chat,
  getChatHistory: aiApi.getChatHistory,

  // Credits
  getCredits: creditsApi.get,
  purchaseCredits: creditsApi.purchase,
};

export default api;
