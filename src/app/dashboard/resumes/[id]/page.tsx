"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cvApi, GeneratedCV, CVComment } from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Download, MessageSquare, Sparkles, Loader2 } from "lucide-react";

// CV Content type for rendering
interface CVContentData {
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  skills?: {
    technical?: string[];
    tools?: string[];
    languages?: string[];
    other?: string[];
  };
  experience?: Array<{
    company?: string;
    position?: string;
    location?: string;
    duration?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    year?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    year?: string;
  }>;
}

export default function ResumeDetailPage() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState<GeneratedCV | null>(null);
  const [cvContent, setCVContent] = useState<CVContentData | null>(null);
  const [comments, setComments] = useState<CVComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [freeRevision, setFreeRevision] = useState(true);
  const [revisionDeadline, setRevisionDeadline] = useState<string | null>(null);

  const loadResume = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const [cvRes, commentsRes] = await Promise.all([
        cvApi.get(token, Number(id)),
        cvApi.getComments(token, Number(id)),
      ]);

      setCV(cvRes.data);
      setComments(commentsRes.data);
      
      // Set free revision info
      if (cvRes.data.free_revision !== undefined) {
        setFreeRevision(cvRes.data.free_revision as boolean);
      }
      if (cvRes.data.revision_deadline) {
        setRevisionDeadline(cvRes.data.revision_deadline as string);
      }

      // Parse CV content
      if (cvRes.data.content) {
        setCVContent(cvRes.data.content as CVContentData);
      }
    } catch (error) {
      toast.error("Failed to load resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getToken, id]);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  async function addComment() {
    if (!newComment.trim() || !cv) return;
    setSaving(true);

    try {
      const token = await getToken();
      if (!token) return;

      const res = await cvApi.addComment(token, cv.id, newComment.trim());
      setComments([...comments, res.data]);
      
      // Check if credits were deducted
      if (res.data.credits_deducted) {
        toast.success("Revision applied! 1 credit deducted.");
      } else {
        toast.success("Revision applied! Free revision period.");
      }
      
      // Reload CV to get updated content
      const cvRes = await cvApi.get(token, Number(id));
      setCV(cvRes.data);
      if (cvRes.data.content) {
        setCVContent(cvRes.data.content as CVContentData);
      }
      if (cvRes.data.free_revision !== undefined) {
        setFreeRevision(cvRes.data.free_revision as boolean);
      }
      
      setNewComment("");
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string; free_revision_expired?: boolean } } };
      if (axiosError.response?.data?.free_revision_expired) {
        toast.error("Free revision period expired. Please purchase more credits.");
      } else {
        toast.error("Failed to add comment");
      }
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function downloadPDF() {
    if (!cv) return;
    setDownloading(true);

    try {
      const token = await getToken();
      if (!token) return;

      const blob = await cvApi.downloadPDF(token, cv.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SmartCV_${cv.job_title || "resume"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download");
      console.error(error);
    } finally {
      setDownloading(false);
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/resumes" className="text-sm text-zinc-500 hover:text-white mb-2 inline-block">
            ← Back to Resumes
          </Link>
          <h1 className="text-2xl font-semibold">{cv.job_title || "Resume"}</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-zinc-500 text-sm">
              Created {format(new Date(cv.created_at), "MMM d, yyyy")}
            </p>
            {cv.ats_score && (
              <span className="text-sm px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                ATS Score: {cv.ats_score}%
              </span>
            )}
          </div>
        </div>
        <Button onClick={downloadPDF} disabled={downloading}>
          {downloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download PDF
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* CV Preview - 3 columns */}
        <div className="lg:col-span-3">
          <Card className="lg:h-[calc(100vh-250px)] overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="font-medium">CV Preview</h2>
                <span className="text-xs text-zinc-500">Version {cv.version}</span>
              </div>
              <div className="flex-1 overflow-y-auto bg-zinc-50 text-zinc-900 p-8">
                {cvContent ? (
                  <div className="max-w-2xl mx-auto space-y-6 text-sm">
                    {/* Header */}
                    {cvContent.contact?.name && (
                      <div className="text-center border-b border-zinc-200 pb-4">
                        <h1 className="text-2xl font-bold text-zinc-900">
                          {cvContent.contact.name}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-zinc-600">
                          {cvContent.contact.email && (
                            <span>{cvContent.contact.email}</span>
                          )}
                          {cvContent.contact.phone && (
                            <span>• {cvContent.contact.phone}</span>
                          )}
                          {cvContent.contact.location && (
                            <span>• {cvContent.contact.location}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-1 text-xs text-blue-600">
                          {cvContent.contact.linkedin && (
                            <span>LinkedIn</span>
                          )}
                          {cvContent.contact.github && (
                            <span>• GitHub</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {cvContent.summary && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Professional Summary
                        </h2>
                        <p className="text-zinc-700 leading-relaxed">
                          {cvContent.summary}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    {cvContent.skills && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Skills
                        </h2>
                        <div className="space-y-1">
                          {cvContent.skills.technical && cvContent.skills.technical.length > 0 && (
                            <div className="flex gap-2">
                              <span className="font-medium text-zinc-600 w-20">Technical:</span>
                              <span className="text-zinc-700">{cvContent.skills.technical.join(", ")}</span>
                            </div>
                          )}
                          {cvContent.skills.tools && cvContent.skills.tools.length > 0 && (
                            <div className="flex gap-2">
                              <span className="font-medium text-zinc-600 w-20">Tools:</span>
                              <span className="text-zinc-700">{cvContent.skills.tools.join(", ")}</span>
                            </div>
                          )}
                          {cvContent.skills.languages && cvContent.skills.languages.length > 0 && (
                            <div className="flex gap-2">
                              <span className="font-medium text-zinc-600 w-20">Languages:</span>
                              <span className="text-zinc-700">{cvContent.skills.languages.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {cvContent.experience && cvContent.experience.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Professional Experience
                        </h2>
                        <div className="space-y-4">
                          {cvContent.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-zinc-900">{exp.company}</h3>
                                  <p className="text-zinc-600">{exp.position}</p>
                                </div>
                                {exp.duration && (
                                  <span className="text-xs text-zinc-500">{exp.duration}</span>
                                )}
                              </div>
                              {exp.highlights && exp.highlights.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {exp.highlights.map((h, j) => (
                                    <li key={j} className="flex gap-2 text-zinc-700">
                                      <span className="text-zinc-400">•</span>
                                      <span>{h}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {cvContent.education && cvContent.education.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Education
                        </h2>
                        <div className="space-y-2">
                          {cvContent.education.map((edu, i) => (
                            <div key={i} className="flex justify-between">
                              <div>
                                <h3 className="font-semibold text-zinc-900">{edu.institution}</h3>
                                <p className="text-zinc-600 text-sm">
                                  {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                                </p>
                              </div>
                              {edu.year && (
                                <span className="text-xs text-zinc-500">{edu.year}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {cvContent.projects && cvContent.projects.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Projects
                        </h2>
                        <div className="space-y-3">
                          {cvContent.projects.map((proj, i) => (
                            <div key={i}>
                              <h3 className="font-semibold text-zinc-900">{proj.name}</h3>
                              {proj.description && (
                                <p className="text-zinc-600 text-sm mt-0.5">{proj.description}</p>
                              )}
                              {proj.technologies && proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {proj.technologies.map((tech, j) => (
                                    <span key={j} className="text-xs px-1.5 py-0.5 bg-zinc-200 rounded">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {cvContent.certifications && cvContent.certifications.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Certifications
                        </h2>
                        <div className="space-y-1">
                          {cvContent.certifications.map((cert, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-zinc-700">
                                {cert.name} - {cert.issuer}
                              </span>
                              {cert.year && (
                                <span className="text-zinc-500">{cert.year}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(cv.content, null, 2)}</pre>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comments Panel - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="lg:h-[calc(100vh-250px)] overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <h2 className="font-medium">Comments & Revisions</h2>
              </div>

              {/* Add Comment */}
              <div className="p-4 border-b border-zinc-800 space-y-3">
                {/* Free Revision Status Banner */}
                {freeRevision ? (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>Free revision period active</span>
                    {revisionDeadline && (
                      <span className="text-zinc-500 ml-auto">
                        Expires: {new Date(revisionDeadline).toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-800 px-3 py-2 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                    <span>Revisions require 1 credit</span>
                    <Link href="/dashboard/credits" className="text-white underline ml-auto">
                      Buy credits
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Request AI-powered revisions</span>
                </div>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="e.g., Make the summary more impactful, highlight leadership skills, add metrics to achievements..."
                  rows={3}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={addComment} 
                  disabled={saving || !newComment.trim()}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Applying revision...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply Revision
                    </>
                  )}
                </Button>
              </div>

              {/* Comment List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 mx-auto text-zinc-700 mb-2" />
                    <p className="text-zinc-500 text-sm">No revisions yet</p>
                    <p className="text-zinc-600 text-xs mt-1">
                      Add a comment above to request changes
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-500">
                          {format(new Date(comment.created_at), "MMM d, h:mm a")}
                        </span>
                        {comment.is_resolved && (
                          <span className="text-xs text-green-500">✓ Applied</span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
