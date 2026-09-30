"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0b0f19]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-wide">TalentOS</span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded">AI 360°</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-24 pb-16 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium">
            
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Two Dual Portals, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">One AI Engine</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Bridging the gap between job seekers and recruiters using predictive skill intelligence. Select your portal to begin.
          </p>
        </div>

        {/* Portal Selection Cards */}
        <div className="w-full grid md:grid-cols-2 gap-8 max-w-5xl">
          
          {/* Student Card */}
          <div className="bg-[#111623] border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] transition-all flex flex-col h-full group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🎓 For Students & Applicants
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">Skill Accelerator</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 flex-grow">
              Get transparent feedback on your job readiness before applying. Detect skill gaps, generate a personalized learning roadmap, and practice with real-time AI.
            </p>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-indigo-400">✔</span> AI Resume Parsing & Company Readiness</li>
              <li className="flex items-center gap-2"><span className="text-indigo-400">✔</span> Live GitHub Code Quality Extraction</li>
              <li className="flex items-center gap-2"><span className="text-indigo-400">✔</span> Real-time Voice AI Mock Interview</li>
            </ul>
            <Link href="/student" className="w-full block text-center bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white font-bold py-3.5 px-8 rounded-lg transition-all group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              Launch Student Dashboard &rarr;
            </Link>
          </div>

          {/* Recruiter Card */}
          <div className="bg-[#111623] border border-white/10 rounded-2xl p-8 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all flex flex-col h-full group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                💼 For Enterprise Recruiters
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">Recruiter Copilot</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 flex-grow">
              Stop wasting hours reading resumes. Rank candidates instantly by verified skills, inspect the 360° AI Digital Twin, and hire top talent faster.
            </p>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-emerald-400">✔</span> AI-Driven Candidate Skill Ranking</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✔</span> 360° AI Digital Twin Database</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✔</span> Candidate Side-by-Side Comparison</li>
            </ul>
            <Link href="/recruiter" className="w-full block text-center bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-500 text-white font-bold py-3.5 px-8 rounded-lg transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Launch Recruiter Intelligence &rarr;
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}