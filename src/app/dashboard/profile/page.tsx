"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userApi, profileApi, experienceApi, educationApi, skillApi, certificationApi, projectApi, Profile, Experience, Education, Skill, Certification, Project } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";
import { Plus, X, Pencil } from "lucide-react";

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "education" | "skills" | "projects" | "certifications">("profile");

  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    linked_in: "",
    website: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadAllData = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const [userRes, profileRes, expRes, eduRes, skillRes, certRes, projRes] = await Promise.all([
        userApi.get(token),
        profileApi.get(token),
        experienceApi.list(token),
        educationApi.list(token),
        skillApi.list(token),
        certificationApi.list(token),
        projectApi.list(token),
      ]);

      setUser(userRes.data);
      if (profileRes.data) setProfile(profileRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (eduRes.data) setEducations(eduRes.data);
      if (skillRes.data) setSkills(skillRes.data);
      if (certRes.data) setCertifications(certRes.data);
      if (projRes.data) setProjects(projRes.data);
    } catch {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, [getToken, setUser]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      if (!token) return;

      await profileApi.update(token, profile);
      toast.success("Profile saved");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  // Experience handlers
  async function addExperience(exp: Partial<Experience>) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await experienceApi.create(token, exp);
      setExperiences([...experiences, res.data]);
      toast.success("Experience added");
    } catch {
      toast.error("Failed to add experience");
    }
  }

  async function updateExperience(id: number, exp: Partial<Experience>) {
    try {
      const token = await getToken();
      if (!token) return;

      await experienceApi.update(token, id, exp);
      setExperiences(experiences.map((e) => (e.id === id ? { ...e, ...exp } : e)));
      toast.success("Experience updated");
    } catch {
      toast.error("Failed to update experience");
    }
  }

  async function deleteExperience(id: number) {
    try {
      const token = await getToken();
      if (!token) return;

      await experienceApi.delete(token, id);
      setExperiences(experiences.filter((e) => e.id !== id));
      toast.success("Experience deleted");
    } catch {
      toast.error("Failed to delete experience");
    }
  }

  // Education handlers
  async function addEducation(edu: Partial<Education>) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await educationApi.create(token, edu);
      setEducations([...educations, res.data]);
      toast.success("Education added");
    } catch {
      toast.error("Failed to add education");
    }
  }

  async function updateEducation(id: number, edu: Partial<Education>) {
    try {
      const token = await getToken();
      if (!token) return;

      await educationApi.update(token, id, edu);
      setEducations(educations.map((e) => (e.id === id ? { ...e, ...edu } : e)));
      toast.success("Education updated");
    } catch {
      toast.error("Failed to update education");
    }
  }

  async function deleteEducation(id: number) {
    try {
      const token = await getToken();
      if (!token) return;

      await educationApi.delete(token, id);
      setEducations(educations.filter((e) => e.id !== id));
      toast.success("Education deleted");
    } catch {
      toast.error("Failed to delete education");
    }
  }

  // Skill handlers
  async function addSkill(skill: Partial<Skill>) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await skillApi.create(token, skill);
      setSkills([...skills, res.data]);
      toast.success("Skill added");
    } catch {
      toast.error("Failed to add skill");
    }
  }

  async function updateSkill(id: number, skill: Partial<Skill>) {
    try {
      const token = await getToken();
      if (!token) return;

      await skillApi.update(token, id, skill);
      setSkills(skills.map((s) => (s.id === id ? { ...s, ...skill } : s)));
      toast.success("Skill updated");
    } catch {
      toast.error("Failed to update skill");
    }
  }

  async function deleteSkill(id: number) {
    try {
      const token = await getToken();
      if (!token) return;

      await skillApi.delete(token, id);
      setSkills(skills.filter((s) => s.id !== id));
      toast.success("Skill deleted");
    } catch {
      toast.error("Failed to delete skill");
    }
  }

  // Project handlers
  async function addProject(proj: Partial<Project>) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await projectApi.create(token, proj);
      setProjects([...projects, res.data]);
      toast.success("Project added");
    } catch {
      toast.error("Failed to add project");
    }
  }

  async function updateProject(id: number, proj: Partial<Project>) {
    try {
      const token = await getToken();
      if (!token) return;

      await projectApi.update(token, id, proj);
      setProjects(projects.map((p) => (p.id === id ? { ...p, ...proj } : p)));
      toast.success("Project updated");
    } catch {
      toast.error("Failed to update project");
    }
  }

  async function deleteProject(id: number) {
    try {
      const token = await getToken();
      if (!token) return;

      await projectApi.delete(token, id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  }

  // Certification handlers
  async function addCertification(cert: Partial<Certification>) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await certificationApi.create(token, cert);
      setCertifications([...certifications, res.data]);
      toast.success("Certification added");
    } catch {
      toast.error("Failed to add certification");
    }
  }

  async function updateCertification(id: number, cert: Partial<Certification>) {
    try {
      const token = await getToken();
      if (!token) return;

      await certificationApi.update(token, id, cert);
      setCertifications(certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)));
      toast.success("Certification updated");
    } catch {
      toast.error("Failed to update certification");
    }
  }

  async function deleteCertification(id: number) {
    try {
      const token = await getToken();
      if (!token) return;

      await certificationApi.delete(token, id);
      setCertifications(certifications.filter((c) => c.id !== id));
      toast.success("Certification deleted");
    } catch {
      toast.error("Failed to delete certification");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "profile" as const, label: "Basic Info", count: null },
    { id: "experience" as const, label: "Experience", count: experiences.length },
    { id: "education" as const, label: "Education", count: educations.length },
    { id: "skills" as const, label: "Skills", count: skills.length },
    { id: "projects" as const, label: "Projects", count: projects.length },
    { id: "certifications" as const, label: "Certifications", count: certifications.length },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile Builder</h1>
        <p className="text-zinc-500 mt-1">Build your comprehensive professional profile</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${activeTab === tab.id ? "bg-zinc-200" : "bg-zinc-800"
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />
                <Input
                  label="Email"
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Phone"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
                <Input
                  label="Location"
                  value={profile.address || ""}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="City, Country"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Input
                  label="LinkedIn"
                  value={profile.linked_in || ""}
                  onChange={(e) => setProfile({ ...profile, linked_in: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                />
                <Input
                  label="GitHub"
                  value={profile.github || ""}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="github.com/johndoe"
                />
                <Input
                  label="Website"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://johndoe.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professional Summary</label>
                <Textarea
                  value={profile.summary || ""}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  placeholder="Write a brief summary of your professional background..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      )}

      {/* Experience Tab */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onUpdate={(data) => updateExperience(exp.id, data)}
              onDelete={() => deleteExperience(exp.id)}
            />
          ))}
          <ExperienceForm onAdd={addExperience} />
        </div>
      )}

      {/* Education Tab */}
      {activeTab === "education" && (
        <div className="space-y-4">
          {educations.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
              onUpdate={(data) => updateEducation(edu.id, data)}
              onDelete={() => deleteEducation(edu.id)}
            />
          ))}
          <EducationForm onAdd={addEducation} />
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === "skills" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillItem
                    key={skill.id}
                    skill={skill}
                    onUpdate={(data) => updateSkill(skill.id, data)}
                    onDelete={() => deleteSkill(skill.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <SkillForm onAdd={addSkill} />
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onUpdate={(data) => updateProject(proj.id, data)}
              onDelete={() => deleteProject(proj.id)}
            />
          ))}
          <ProjectForm onAdd={addProject} />
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === "certifications" && (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onUpdate={(data) => updateCertification(cert.id, data)}
              onDelete={() => deleteCertification(cert.id)}
            />
          ))}
          <CertificationForm onAdd={addCertification} />
        </div>
      )}
    </div>
  );
}

// Experience Card Component
function ExperienceCard({
  experience,
  onUpdate,
  onDelete,
}: {
  experience: Experience;
  onUpdate: (data: Partial<Experience>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ExperienceForm
        initialData={experience}
        onAdd={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{experience.position}</h3>
              <span className="text-sm text-zinc-500">at {experience.company}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {experience.start_date} - {experience.is_current ? "Present" : experience.end_date}
            </p>
            {experience.description && (
              <p className="text-sm text-zinc-400 mt-2">{experience.description}</p>
            )}
            {experience.achievements && experience.achievements.length > 0 && (
              <ul className="list-disc list-inside text-sm text-zinc-400 mt-2">
                {experience.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Experience Form Component
function ExperienceForm({ onAdd, initialData, onCancel }: { onAdd: (exp: Partial<Experience>) => void, initialData?: Partial<Experience>, onCancel?: () => void }) {
  const [open, setOpen] = useState(!!initialData);
  const [form, setForm] = useState({
    company: initialData?.company || "",
    position: initialData?.position || "",
    location: initialData?.location || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    is_current: initialData?.is_current || false,
    description: initialData?.description || "",
    achievements: initialData?.achievements || ([] as string[]),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(form);
    if (initialData) return;
    setForm({
      company: "",
      position: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      achievements: [],
    });
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Experience
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <Input
              label="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date"
              type="month"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="month"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              disabled={form.is_current}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Currently working here</span>
          </label>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your responsibilities..."
            rows={3}
          />
          <div>
            <label className="block text-sm font-medium text-white mb-2">Achievements</label>
            {form.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={ach}
                  onChange={(e) => {
                    const newAch = [...form.achievements];
                    newAch[i] = e.target.value;
                    setForm({ ...form, achievements: newAch });
                  }}
                  placeholder={`Achievement ${i + 1}`}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  setForm({ ...form, achievements: form.achievements.filter((_, idx) => idx !== i) });
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, achievements: [...form.achievements, ""] })}>
              <Plus className="w-4 h-4 mr-2" /> Add Achievement
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => {
              if (onCancel) onCancel();
              else setOpen(false);
            }}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Education Card Component
function EducationCard({
  education,
  onUpdate,
  onDelete,
}: {
  education: Education;
  onUpdate: (data: Partial<Education>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EducationForm
        initialData={education}
        onAdd={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{education.degree}{education.degree !== "SMA/SMK" && ` in ${education.field_of_study}`}</h3>
            <p className="text-sm text-zinc-400">{education.institution}</p>
            {education.location && <p className="text-xs text-zinc-500 mt-1">{education.location}</p>}
            <p className="text-xs text-zinc-500 mt-1">
              {education.start_date} - {education.end_date}
            </p>
            {Number(education.gpa) > 0 ? (
              <p className="text-xs text-zinc-500 mt-1">GPA: {education.gpa}</p>
            ) : null}
            {education.achievements && education.achievements.length > 0 && (
              <ul className="list-disc list-inside text-sm text-zinc-400 mt-2">
                {education.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Education Form Component
function EducationForm({ onAdd, initialData, onCancel }: { onAdd: (edu: Partial<Education>) => void, initialData?: Partial<Education>, onCancel?: () => void }) {
  const [open, setOpen] = useState(!!initialData);
  const [form, setForm] = useState({
    institution: initialData?.institution || "",
    degree: initialData?.degree || "",
    field_of_study: initialData?.field_of_study || "",
    location: initialData?.location || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    gpa: initialData?.gpa ? initialData.gpa.toString() : "",
    achievements: initialData?.achievements || ([] as string[]),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      ...form,
      gpa: form.gpa ? parseFloat(form.gpa) : undefined,
    });
    if (initialData) return;
    setForm({ institution: "", degree: "", field_of_study: "", location: "", start_date: "", end_date: "", gpa: "", achievements: [] });
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Education
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Institution"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Education Level / Degree <span className="text-red-500">*</span></label>
              <select
                className="w-full bg-zinc-900 border-zinc-800 rounded-md text-sm p-2 text-white h-10"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                required
              >
                <option value="" disabled>Select Level</option>
                <option value="SMA/SMK">SMA / SMK</option>
                <option value="D1-D3">Diploma (D1-D3)</option>
                <option value="D4/S1">Bachelor (D4/S1)</option>
                <option value="S2">Master (S2)</option>
                <option value="S3">Doctorate (S3)</option>
              </select>
            </div>
            <Input
              label="Field of Study / Jurusan"
              value={form.field_of_study}
              onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
              placeholder={form.degree === 'SMA/SMK' ? 'IPA, IPS, RPL, dll' : 'Computer Science, etc.'}
              required={form.degree !== 'SMA/SMK'}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City, Country"
            />
            <Input
              label="GPA (optional)"
              value={form.gpa}
              onChange={(e) => setForm({ ...form, gpa: e.target.value })}
              placeholder="3.8"
              type="number"
              step="0.01"
              min="0"
              max="4"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date"
              type="month"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="month"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Achievements</label>
            {form.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={ach}
                  onChange={(e) => {
                    const newAch = [...form.achievements];
                    newAch[i] = e.target.value;
                    setForm({ ...form, achievements: newAch });
                  }}
                  placeholder={`Achievement ${i + 1}`}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  setForm({ ...form, achievements: form.achievements.filter((_, idx) => idx !== i) });
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, achievements: [...form.achievements, ""] })}>
              <Plus className="w-4 h-4 mr-2" /> Add Achievement
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => {
              if (onCancel) onCancel();
              else setOpen(false);
            }}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Skill Item Component
function SkillItem({
  skill,
  onUpdate,
  onDelete,
}: {
  skill: Skill;
  onUpdate: (data: Partial<Skill>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="w-full mb-2">
        <SkillForm
          initialData={skill}
          onAdd={(data) => {
            onUpdate(data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg group">
      <span>{skill.name}</span>
      {skill.proficiency && (
        <span className="text-xs text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">{skill.proficiency}</span>
      )}
      {skill.category && (
        <span className="text-xs text-zinc-500">({skill.category})</span>
      )}
      <button
        onClick={() => setIsEditing(true)}
        className="text-zinc-500 hover:text-white ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={onDelete}
        className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Skill Form Component
function SkillForm({ onAdd, initialData, onCancel }: { onAdd: (skill: Partial<Skill>) => void, initialData?: Partial<Skill>, onCancel?: () => void }) {
  const [form, setForm] = useState({ 
    name: initialData?.name || "", 
    category: initialData?.category || "", 
    proficiency: initialData?.proficiency || "" 
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    if (initialData) return;
    setForm({ name: "", category: "", proficiency: "" });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Skill Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="JavaScript, Python, etc."
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label="Category (optional)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Frontend, Backend, etc."
            />
          </div>
          <div className="flex-1">
            <select
              className="w-full bg-zinc-900 border-zinc-800 rounded-md text-sm p-2 text-white h-10"
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
            >
              <option value="" disabled>Proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit">{initialData ? "Save" : "Add"}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Project Card Component
function ProjectCard({
  project,
  onUpdate,
  onDelete,
}: {
  project: Project;
  onUpdate: (data: Partial<Project>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ProjectForm
        initialData={project}
        onAdd={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{project.name}</h3>
            {(project.start_date || project.end_date) && (
              <p className="text-xs text-zinc-500 mt-1">
                {project.start_date} {project.start_date && project.end_date && "-"} {project.end_date}
              </p>
            )}
            {project.description && <p className="text-sm text-zinc-400 mt-2">{project.description}</p>}
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 mt-2 inline-block">
                {project.url}
              </a>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-zinc-800 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Project Form Component
function ProjectForm({ onAdd, initialData, onCancel }: { onAdd: (proj: Partial<Project>) => void, initialData?: Partial<Project>, onCancel?: () => void }) {
  const [open, setOpen] = useState(!!initialData);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    technologies: initialData?.technologies || ([] as string[]),
    url: initialData?.url || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      ...form,
      technologies: form.technologies.filter(Boolean),
    });
    if (initialData) return;
    setForm({ name: "", description: "", technologies: [], url: "", start_date: "", end_date: "" });
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Project
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <div>
            <label className="block text-sm font-medium text-white mb-2">Technologies</label>
            {form.technologies.map((tech, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={tech}
                  onChange={(e) => {
                    const newTech = [...form.technologies];
                    newTech[i] = e.target.value;
                    setForm({ ...form, technologies: newTech });
                  }}
                  placeholder={`e.g. React, Node.js`}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) });
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, technologies: [...form.technologies, ""] })}>
              <Plus className="w-4 h-4 mr-2" /> Add Technology
            </Button>
          </div>
          <Input
            label="Project URL (optional)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date"
              type="month"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="month"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => {
              if (onCancel) onCancel();
              else setOpen(false);
            }}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Certification Card Component
function CertificationCard({
  certification,
  onUpdate,
  onDelete,
}: {
  certification: Certification;
  onUpdate: (data: Partial<Certification>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <CertificationForm
        initialData={certification}
        onAdd={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{certification.name}</h3>
            <p className="text-sm text-zinc-400">{certification.issuer}</p>
            {(certification.issue_date || certification.expiry_date) && (
              <p className="text-xs text-zinc-500 mt-1">
                Issued: {certification.issue_date || "-"} | Expires: {certification.expiry_date || "-"}
              </p>
            )}
            {certification.credential_id && <p className="text-xs text-zinc-500 mt-1">Credential ID: {certification.credential_id}</p>}
            {certification.credential_url && (
              <a href={certification.credential_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 mt-1 inline-block">
                View Credential
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Certification Form Component
function CertificationForm({ onAdd, initialData, onCancel }: { onAdd: (cert: Partial<Certification>) => void, initialData?: Partial<Certification>, onCancel?: () => void }) {
  const [open, setOpen] = useState(!!initialData);
  const [form, setForm] = useState({ 
    name: initialData?.name || "", 
    issuer: initialData?.issuer || "", 
    issue_date: initialData?.issue_date || "", 
    expiry_date: initialData?.expiry_date || "", 
    credential_id: initialData?.credential_id || "", 
    credential_url: initialData?.credential_url || "" 
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(form);
    if (initialData) return;
    setForm({ name: "", issuer: "", issue_date: "", expiry_date: "", credential_id: "", credential_url: "" });
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Certification
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Certification Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Issuing Organization"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Issue Date"
              type="month"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
            />
            <Input
              label="Expiry Date"
              type="month"
              value={form.expiry_date}
              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Credential ID"
              value={form.credential_id}
              onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
            />
            <Input
              label="Credential URL"
              value={form.credential_url}
              onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => {
              if (onCancel) onCancel();
              else setOpen(false);
            }}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

