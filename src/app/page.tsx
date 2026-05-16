import Link from "next/link";
import { HeaderNav, HeroCTA, CtaButton } from "@/components/auth/client-buttons";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            SmartCV
          </Link>
          <HeaderNav />
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI-Powered Resume Builder
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Land your dream job
              <br />
              <span className="text-zinc-500">with AI-tailored resumes</span>
            </h1>
            
            <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              SmartCV analyzes job descriptions and creates ATS-optimized resumes 
              tailored to each position. Stop getting rejected by robots.
            </p>
            
            <HeroCTA />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold mb-4">How it works</h2>
              <p className="text-zinc-500">Three simple steps to your perfect resume</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 text-2xl">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-3">Build your profile</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Upload your existing CV or let our AI interview you to extract your professional history.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 text-2xl">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-3">Paste job description</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Our AI analyzes requirements and identifies skill gaps between your profile and the job.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 text-2xl">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3">Get tailored CV</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Download an ATS-optimized resume with the right keywords and professional formatting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-6 border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm text-zinc-500">Resumes created</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">85%</div>
                <div className="text-sm text-zinc-500">ATS pass rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-sm text-zinc-500">Free credits</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">30s</div>
                <div className="text-sm text-zinc-500">Avg generation</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-zinc-800/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Ready to stand out?
            </h2>
            <p className="text-zinc-500 mb-10">
              Join thousands of job seekers who improved their interview rates with SmartCV.
            </p>
            <CtaButton />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-zinc-500">
          <p>© 2024 SmartCV. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
