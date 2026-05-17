"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { jobApi } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";

const jobTypes = [
  { value: "", label: "Select type" },
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

export default function NewJobPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { addJob } = useAppStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    job_title: "",
    company: "",
    job_type: "",
    job_description: "",
    qualifications: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.job_title || !formData.job_description) {
      toast.error("Job title and description are required");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await jobApi.create(token, formData);
      addJob(res.data);
      toast.success("Job application created");
      router.push(`/dashboard/jobs/${res.data.id}`);
    } catch (error) {
      toast.error("Failed to create job application");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Add Job Application</h1>
        <p className="text-zinc-500 mt-1">Enter the job details to generate a tailored resume</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                id="job_title"
                label="Job Title *"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Software Engineer"
                required
              />
              <Input
                id="company"
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
              />
            </div>

            <Select
              id="job_type"
              label="Job Type"
              value={formData.job_type}
              onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
              options={jobTypes}
            />

            <Textarea
              id="job_description"
              label="Job Description *"
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              placeholder="Paste the full job description here..."
              rows={8}
              required
            />

            <Textarea
              id="qualifications"
              label="Qualifications"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              placeholder="List the required qualifications and skills..."
              rows={4}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create & Analyze"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
