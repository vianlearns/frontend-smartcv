"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobApi, JobApplication } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function JobsPage() {
  const { getToken } = useAuth();
  const { jobs, setJobs, removeJob } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await jobApi.list(token);
      setJobs(res.data);
    } catch (error) {
      toast.error("Failed to load job applications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this job application?")) return;

    try {
      const token = await getToken();
      if (!token) return;

      await jobApi.delete(token, id);
      removeJob(id);
      toast.success("Deleted");
    } catch (error) {
      toast.error("Failed to delete");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Job Applications</h1>
          <p className="text-zinc-500 mt-1">Manage your job applications</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>+ Add Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-zinc-500 mb-4">No job applications yet.</p>
            <Link href="/dashboard/jobs/new">
              <Button>Add Your First Job</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.job_title}</h3>
                    <p className="text-zinc-500">{job.company || "No company"}</p>
                    <p className="text-sm text-zinc-600 mt-2">
                      {format(new Date(job.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                    <Link href={`/dashboard/jobs/${job.id}/generate`}>
                      <Button size="sm">Generate CV</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
