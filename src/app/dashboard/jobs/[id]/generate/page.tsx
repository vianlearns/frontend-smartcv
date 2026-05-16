"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { jobApi, cvApi } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function GenerateCVPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [cvContent, setCVContent] = useState<string | null>(null);
  const [cvId, setCVId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadJob();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadJob() {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await jobApi.get(token, Number(id));
      setJob(res.data);
    } catch (error) {
      toast.error("Failed to load job");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function generateCV() {
    if (!job) return;
    setGenerating(true);

    try {
      const token = await getToken();
      if (!token) return;

      const res = await cvApi.generate(token, {
        job_application_id: job.id,
      });

      setCVContent(res.data.content);
      setCVId(res.data.id);
      toast.success("CV generated!");
    } catch (error: any) {
      if (error.response?.data?.error?.includes("credits")) {
        toast.error("Not enough credits. Please purchase more.");
        router.push("/dashboard/credits");
      } else {
        toast.error("Failed to generate CV");
      }
      console.error(error);
    } finally {
      setGenerating(false);
    }
  }

  async function sendChatMessage() {
    if (!inputMessage.trim() || !cvId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const token = await getToken();
      if (!token) return;

      const res = await cvApi.chat(token, cvId, userMessage, messages);
      
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
      setCVContent(res.data.cv_content);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  }

  async function downloadPDF() {
    if (!cvId) return;

    try {
      const token = await getToken();
      if (!token) return;

      const blob = await cvApi.downloadPDF(token, cvId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${job?.job_title || "resume"}_cv.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error("Failed to download PDF");
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/dashboard/jobs/${job.id}`} className="text-sm text-zinc-500 hover:text-white mb-2 inline-block">
            ← Back to Job
          </Link>
          <h1 className="text-2xl font-semibold">Generate CV for {job.job_title}</h1>
        </div>
        {cvContent && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={downloadPDF}>
              Download PDF
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CV Preview */}
        <Card className="lg:h-[calc(100vh-200px)] overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <h2 className="text-lg font-medium mb-4">CV Preview</h2>
            {cvContent ? (
              <div className="flex-1 overflow-y-auto bg-white text-black rounded-xl p-6 text-sm leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans">{cvContent}</pre>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
                <div className="text-center">
                  <p className="text-zinc-500 mb-4">No CV generated yet</p>
                  <Button onClick={generateCV} disabled={generating}>
                    {generating ? "Generating..." : "Generate CV"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Panel */}
        <Card className="lg:h-[calc(100vh-200px)] overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <h2 className="text-lg font-medium mb-4">Refine with AI Chat</h2>
            {!cvContent ? (
              <div className="flex-1 flex items-center justify-center text-zinc-600">
                Generate a CV first to start refining it
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 && (
                    <div className="text-zinc-500 text-sm">
                      Ask the AI to refine your CV. For example:
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Make the summary more impactful</li>
                        <li>Add more keywords for ATS</li>
                        <li>Highlight leadership experience</li>
                      </ul>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl text-sm ${
                        msg.role === "user"
                          ? "bg-zinc-800 ml-8"
                          : "bg-zinc-900 mr-8"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Ask to refine your CV..."
                    className="flex-1 h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                  <Button onClick={sendChatMessage}>Send</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
