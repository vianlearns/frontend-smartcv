"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cvApi, GeneratedCV, CVComment } from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function ResumeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState<GeneratedCV | null>(null);
  const [comments, setComments] = useState<CVComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResume();
  }, [id]);

  async function loadResume() {
    try {
      const token = await getToken();
      if (!token) return;

      const [cvRes, commentsRes] = await Promise.all([
        cvApi.get(token, Number(id)),
        cvApi.getComments(token, Number(id)),
      ]);

      setCV(cvRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      toast.error("Failed to load resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addComment() {
    if (!newComment.trim() || !cv) return;
    setSaving(true);

    try {
      const token = await getToken();
      if (!token) return;

      const res = await cvApi.addComment(token, cv.id, newComment.trim());
      setComments([...comments, res.data]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function applyComment(comment: CVComment) {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await cvApi.applyComment(token, cv!.id, comment.id);
      setCV({ ...cv!, content: res.data.content });
      toast.success("CV updated");
    } catch (error) {
      toast.error("Failed to apply changes");
      console.error(error);
    }
  }

  async function downloadPDF() {
    if (!cv) return;

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

  if (!cv) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-zinc-500">Resume not found</p>
        <Link href="/dashboard/resumes">
          <Button variant="outline" className="mt-4">Back to Resumes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/resumes" className="text-sm text-zinc-500 hover:text-white mb-2 inline-block">
            ← Back to Resumes
          </Link>
          <h1 className="text-2xl font-semibold">{cv.job_title || "Resume"}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Created {format(new Date(cv.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <Button variant="outline" onClick={downloadPDF}>
          Download PDF
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CV Preview */}
        <Card className="lg:h-[calc(100vh-250px)] overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <h2 className="text-lg font-medium mb-4">CV Preview</h2>
            <div className="flex-1 overflow-y-auto bg-white text-black rounded-xl p-6 text-sm leading-relaxed">
              <pre className="whitespace-pre-wrap font-sans">{cv.content}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="lg:h-[calc(100vh-250px)] overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <h2 className="text-lg font-medium mb-4">Comments & Revisions</h2>
            
            {/* Add Comment */}
            <div className="mb-4 space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or revision request..."
                rows={3}
              />
              <Button size="sm" onClick={addComment} disabled={saving || !newComment.trim()}>
                Add Comment
              </Button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {comments.length === 0 ? (
                <p className="text-zinc-600 text-sm">No comments yet. Add one above to request revisions.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-zinc-500">
                        {format(new Date(comment.created_at), "MMM d, h:mm a")}
                      </span>
                      {!comment.applied && (
                        <Button size="sm" variant="ghost" onClick={() => applyComment(comment)}>
                          Apply
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-zinc-300">{comment.content}</p>
                    {comment.ai_response && (
                      <div className="mt-3 p-3 rounded-lg bg-zinc-800 text-sm text-zinc-400">
                        <span className="text-xs text-zinc-500 block mb-1">AI Response:</span>
                        {comment.ai_response}
                      </div>
                    )}
                    {comment.applied && (
                      <span className="inline-block mt-2 text-xs text-green-500">✓ Applied</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
