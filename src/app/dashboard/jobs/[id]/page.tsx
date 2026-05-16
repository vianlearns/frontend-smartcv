"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { jobApi, JobApplication } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { jobs } = useAppStore();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<string | null>(null);

  useEffect(() => {
    loadJob();
  }, [id]);

  async function loadJob() {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await jobApi.get(token, Number(id));
      setJob(res.data);
      if (res.data.gap_analysis) {
        setGapAnalysis(res.data.gap_analysis);
      }
    } catch (error) {
      toast.error("Failed to load job");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeJob() {
    if (!job) return;
    setAnalyzing(true);

    try {
      const token = await getToken();
      if (!token) return;

      const res = await jobApi.analyzeGap(token, job.id);
      setGapAnalysis(res.data.analysis);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Failed to analyze");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-zinc-500">Job not found</p>
        <Link href="/dashboard/jobs">
          <Button variant="outline" className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/jobs" className="text-sm text-zinc-500 hover:text-white mb-2 inline-block">
            ← Back to Jobs
          </Link>
          <h1 className="text-2xl font-semibold">{job.job_title}</h1>
          <p className="text-zinc-500 mt-1">{job.company || "No company specified"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/jobs/${job.id}/generate`}>
            <Button>Generate CV</Button>
          </Link>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Job Description</h2>
              <div className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">
                {job.job_description}
              </div>
            </CardContent>
          </Card>

          {job.qualifications && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Qualifications</h2>
                <div className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">
                  {job.qualifications}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="text-sm text-zinc-500">Job Type</div>
                <div className="font-medium capitalize">{job.job_type || "Not specified"}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-500">Created</div>
                <div className="font-medium">{format(new Date(job.created_at), "MMM d, yyyy")}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Gap Analysis</h2>
                {!gapAnalysis && (
                  <Button size="sm" onClick={analyzeJob} disabled={analyzing}>
                    {analyzing ? "Analyzing..." : "Analyze"}
                  </Button>
                )}
              </div>
              {gapAnalysis ? (
                <div className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">
                  {gapAnalysis}
                </div>
              ) : (
                <p className="text-zinc-600 text-sm">
                  Click analyze to compare your profile against this job's requirements.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
