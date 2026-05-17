"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cvApi, GeneratedCV } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function ResumesPage() {
  const { getToken } = useAuth();
  const { cvs, setCVs } = useAppStore();
  const [loading, setLoading] = useState(true);

  const loadResumes = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await cvApi.list(token);
      setCVs(res.data);
    } catch (error) {
      toast.error("Failed to load resumes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getToken, setCVs]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  async function handleDelete() {
    if (!confirm("Delete this resume?")) return;
    // Note: CV delete not implemented in backend
    toast.error("Delete feature not available");
  }

  async function downloadPDF(cv: GeneratedCV) {
    try {
      const token = await getToken();
      if (!token) return;

      const blob = await cvApi.downloadPDF(token, cv.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.job_title || "resume"}_cv.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download");
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
      <div>
        <h1 className="text-2xl font-semibold">Your Resumes</h1>
        <p className="text-zinc-500 mt-1">All generated CVs are stored here</p>
      </div>

      {cvs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-zinc-500 mb-4">No resumes yet.</p>
            <Link href="/dashboard/jobs">
              <Button>Go to Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cvs.map((cv) => (
            <Card key={cv.id} className="hover:border-zinc-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{cv.job_title || "Untitled Resume"}</h3>
                    <p className="text-zinc-500 text-sm mt-1">
                      Created {format(new Date(cv.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {cv.version && (
                      <span className="inline-block mt-2 px-2 py-1 rounded-md bg-zinc-800 text-xs text-zinc-400">
                        Version {cv.version}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/resumes/${cv.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => downloadPDF(cv)}>
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete()}
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
