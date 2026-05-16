import { create } from "zustand";
import { User, Profile, JobApplication, GeneratedCV, Experience, Education, Skill } from "@/lib/api";

interface AppState {
  user: User | null;
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  jobs: JobApplication[];
  cvs: GeneratedCV[];
  
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setExperiences: (experiences: Experience[]) => void;
  setEducation: (education: Education[]) => void;
  setSkills: (skills: Skill[]) => void;
  setJobs: (jobs: JobApplication[]) => void;
  setCVs: (cvs: GeneratedCV[]) => void;
  
  addJob: (job: JobApplication) => void;
  removeJob: (id: number) => void;
  addCV: (cv: GeneratedCV) => void;
  removeCV: (id: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  experiences: [],
  education: [],
  skills: [],
  jobs: [],
  cvs: [],

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setExperiences: (experiences) => set({ experiences }),
  setEducation: (education) => set({ education }),
  setSkills: (skills) => set({ skills }),
  setJobs: (jobs) => set({ jobs }),
  setCVs: (cvs) => set({ cvs }),

  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  removeJob: (id) => set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),
  addCV: (cv) => set((state) => ({ cvs: [cv, ...state.cvs] })),
  removeCV: (id) => set((state) => ({ cvs: state.cvs.filter((c) => c.id !== id) })),
}));
