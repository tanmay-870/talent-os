"use client";
import { useState } from "react";
import Link from "next/link";

export default function StudentDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [githubUser, setGithubUser] = useState("tanmay-870");
  const [targetRole, setTargetRole] = useState("SDE-1 (Amazon / Tier-1 Tech)");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume first using the 'Choose File' button.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (err) {
      setError("Backend connection failed. Is FastAPI running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans pb-16">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0b0f19] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">TalentOS</span>
          <span className="px-3 py-1 text-xs font-bold bg-blue-500/20 text-blue-400 rounded-md">Student Hub</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span className="text-white">Student Portal</span>
          <Link href="/recruiter" className="hover:text-white transition">Recruiter Dashboard</Link>
          <Link href="/interview" className="hover:text-white transition">AI Mock Interview</Link>
        </div>
        <Link href="/interview" className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition">
          Start AI Interview &rarr;
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Student Talent Dashboard</h1>
          <p className="text-slate-400 text-sm">Analyze your resume, link GitHub repositories, and get your AI 360° Placement Score.</p>
        </div>

        {/* Top Grid: Upload & Tech Profile */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Box 1: Upload Resume */}
          <div className="bg-[#111623] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">📄 1. Upload Resume (PDF/Docx)</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">Gemini AI Parser</span>
              </div>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-white/[0.02] transition text-center">
                <span className="text-3xl mb-3">☁️</span>
                <p className="text-white font-medium mb-1">Click or drag resume PDF here</p>
                <p className="text-xs text-slate-500 mb-4">Parses skills, experience, & projects automatically.</p>
                
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer" 
                />
              </div>
            </div>
            {file && (
              <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 flex items-center justify-between">
                <span>📎 Selected: <strong>{file.name}</strong></span>
                <span className="text-emerald-400 font-bold">Ready</span>
              </div>
            )}
          </div>

          {/* Box 2: Connect Tech Profiles */}
          <div className="bg-[#111623] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">🐙 2. Connect Tech Profiles</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Live Code Intelligence</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">GitHub Username</label>
                  <input 
                    type="text" 
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="octocat" 
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Job Role & Company</label>
                  <select 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SDE-1 (Amazon / Tier-1 Tech)">SDE-1 (Amazon / Tier-1 Tech)</option>
                    <option value="Frontend Developer (React/Next.js)">Frontend Developer (React/Next.js)</option>
                    <option value="Backend Engineer (Node/Python/FastAPI)">Backend Engineer (Node/Python/FastAPI)</option>
                    <option value="Cloud / DevOps Engineer (AWS)">Cloud / DevOps Engineer (AWS)</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleUpload} 
              disabled={loading} 
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg text-sm transition shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Analyzing Resume with AI..." : "✨ Generate 360° Talent Profile"}
            </button>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-sm">{error}</div>}

        {/* 4-Column Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111623] border border-white/5 rounded-xl p-5">
            <p className="text-xs text-slate-400 mb-2">Overall Talent Score</p>
            <p className="text-3xl font-black text-indigo-400">{result ? `${result.talent_score} / 100` : "84 / 100"}</p>
          </div>
          <div className="bg-[#111623] border border-white/5 rounded-xl p-5">
            <p className="text-xs text-slate-400 mb-2">Target Readiness</p>
            <p className="text-3xl font-black text-emerald-400">{result ? "92% Match" : "88% Match"}</p>
          </div>
          <div className="bg-[#111623] border border-white/5 rounded-xl p-5">
            <p className="text-xs text-slate-400 mb-2">GitHub Activity Rating</p>
            <p className="text-3xl font-black text-sky-400">A+ Tier</p>
          </div>
          <div className="bg-[#111623] border border-white/5 rounded-xl p-5">
            <p className="text-xs text-slate-400 mb-2">Mock Interview Status</p>
            <p className="text-3xl font-black text-amber-500">Ready</p>
          </div>
        </div>

        {/* Bottom Grid: Skill Gap & Roadmap */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skill Gap Analysis */}
          <div className="bg-[#111623] border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">📊 Skill Gap Analysis</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">Target: {targetRole.split(" ")[0]}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Comparison between your verified skills and target enterprise requirements:</p>
            
            <div className="space-y-5">
              {result?.skill_gaps && result.skill_gaps.length > 0 ? (
                result.skill_gaps.map((gap: string, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-200">{gap}</span>
                      <span className="text-amber-500">Gap Detected</span>
                    </div>
                    <div className="w-full bg-[#0b0f19] rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5"><span className="text-slate-200">Data Structures & System Design</span><span className="text-emerald-400">90% (Strong)</span></div>
                    <div className="w-full bg-[#0b0f19] rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '90%' }}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5"><span className="text-slate-200">Distributed Caching & Redis</span><span className="text-amber-500">60% (Gap Detected)</span></div>
                    <div className="w-full bg-[#0b0f19] rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }}></div></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI Learning Roadmap */}
          <div className="bg-[#111623] border border-white/5 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">🗺️ AI Learning Roadmap</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">Personalized</span>
            </div>
            <p className="text-xs text-slate-400 mb-5">Action items to increase your Readiness Score to 95%:</p>
            
            <div className="space-y-4 flex-grow">
              {result?.roadmap && result.roadmap.length > 0 ? (
                result.roadmap.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{step}</p>
                      <p className="text-xs text-slate-500">Optimized for your target role.</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Complete Mock Interview on System Design</p>
                      <p className="text-xs text-slate-500">Practices microservice API rate limiting questions.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Add Dockerfile to GitHub Project</p>
                      <p className="text-xs text-slate-500">Verifies DevOps execution capability on your profile.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <Link href="/interview" className="w-full mt-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold py-2.5 rounded-lg text-sm transition flex justify-center items-center gap-2">
              🎙️ Take AI Mock Interview Now
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}