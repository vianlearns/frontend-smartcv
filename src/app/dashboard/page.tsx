"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { userApi, jobApi, cvApi } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user, jobs, cvs, setUser, setJobs, setCVs } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const token = await getToken();
      if (!token) return;

      const [userRes, jobsRes, cvsRes] = await Promise.all([
        userApi.get(token),
        jobApi.list(token),
        cvApi.list(token),
      ]);

      setUser(userRes.data.user);
      setJobs(jobsRes.data);
      setCVs(cvsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-zinc-500 mt-1">Here's your SmartCV overview</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>+ New Application</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-zinc-500 mb-1">Credits</div>
            <div className="text-3xl font-bold">{user?.credits || 0}</div>
            <Link href="/dashboard/credits" className="text-sm text-zinc-400 hover:text-white mt-2 inline-block">
              Buy more →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-zinc-500 mb-1">Job Applications</div>
            <div className="text-3xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-zinc-500 mb-1">Resumes Created</div>
            <div className="text-3xl font-bold">{cvs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-zinc-500 mb-1">Profile Status</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-zinc-400">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Complete Your Profile
                </Button>
              </Link>
              <Link href="/dashboard/jobs/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Add Job Application
                </Button>
              </Link>
              <Link href="/dashboard/resumes" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Your Resumes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Jobs</h2>
              <Link href="/dashboard/jobs" className="text-sm text-zinc-400 hover:text-white">
                View all →
              </Link>
            </div>
            {jobs.length === 0 ? (
              <p className="text-zinc-500 text-sm">No job applications yet. Add one to get started!</p>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <Link
                    key={job.id}
                    href={`/dashboard/jobs/${job.id}`}
                    className="block p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="font-medium">{job.job_title}</div>
                    <div className="text-sm text-zinc-500">{job.company || "No company"}</div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
