'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FileText, Briefcase, CreditCard, Sparkles, Plus, ArrowRight } from 'lucide-react';

interface Stats {
  credits: number;
  totalJobs: number;
  totalCVs: number;
  recentJobs: Array<{
    id: number;
    job_title: string;
    company?: string;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const token = await getToken();
      const [userRes, jobsRes, cvsRes] = await Promise.all([
        api.getUser(token!),
        api.getJobs(token!),
        api.getCVs(token!),
      ]);

      setStats({
        credits: userRes.data?.credits || 0,
        totalJobs: jobsRes.data?.length || 0,
        totalCVs: cvsRes.data?.length || 0,
        recentJobs: jobsRes.data?.slice(0, 3) || [],
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 mt-2">Welcome back! Here&apos;s your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credits */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full">Available</span>
            </div>
            <p className="text-4xl font-bold">{stats?.credits || 0}</p>
            <p className="text-zinc-400 text-sm mt-1">Credits</p>
            <Link
              href="/dashboard/credits"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Buy More
            </Link>
          </div>

          {/* Job Applications */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-5 h-5 text-zinc-400" />
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-4xl font-bold">{stats?.totalJobs || 0}</p>
            <p className="text-zinc-400 text-sm mt-1">Job Applications</p>
            <Link
              href="/dashboard/jobs/new"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-zinc-800 text-white py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Job
            </Link>
          </div>

          {/* Generated CVs */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-5 h-5 text-zinc-400" />
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-4xl font-bold">{stats?.totalCVs || 0}</p>
            <p className="text-zinc-400 text-sm mt-1">Generated CVs</p>
            <Link
              href="/dashboard/resumes"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-zinc-800 text-white py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/profile"
              className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Complete Your Profile</h3>
                  <p className="text-sm text-zinc-400">Add your experience, skills, and education</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
            <Link
              href="/dashboard/jobs/new"
              className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Generate New CV</h3>
                  <p className="text-sm text-zinc-400">Add a job and get an AI-tailored resume</p>
                </div>
                <Sparkles className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        {stats?.recentJobs && stats.recentJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Job Applications</h2>
              <Link href="/dashboard/jobs" className="text-sm text-zinc-400 hover:text-white">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="block bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{job.job_title}</h3>
                      {job.company && (
                        <p className="text-sm text-zinc-400">{job.company}</p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats?.totalJobs === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">No job applications yet</h3>
            <p className="text-zinc-400 mb-6">Add your first job application to get started</p>
            <Link
              href="/dashboard/jobs/new"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
