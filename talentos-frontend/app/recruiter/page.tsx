"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecruiterDashboard() {
  // Table States
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Copilot Chatbot States
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotReply, setCopilotReply] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfiles(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Helpers
  const formatName = (filename: string) => {
    return filename?.replace(".pdf", "").replace(/_/g, " ").replace(/-/g, " ") || "Candidate";
  };

  const getTopSkills = (skillsStr: string) => {
    if (!skillsStr) return [];
    return skillsStr.split(",").slice(0, 2);
  };

  // CSV Export Function
  const handleExportCSV = () => {
    if (!profiles.length) {
      alert("No candidates available to export!");
      return;
    }

    const headers = ["Rank", "Candidate Name", "Extracted Skills", "Talent Score"];
    const rows = profiles.map((p, index) => [
      index + 1,
      `"${formatName(p.filename)}"`,
      `"${p.skills ? p.skills.replace(/,/g, ";") : ""}"`,
      p.talent_score
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TalentOS_Candidate_Shortlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copilot API Call Logic
  const handleCopilotAsk = async (questionText: string) => {
    if (!questionText) return;
    setCopilotLoading(true);
    setCopilotReply("");
    
    try {
      const res = await fetch("http://localhost:8000/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText })
      });
      const data = await res.json();
      if (data.reply) setCopilotReply(data.reply);
      else setCopilotReply("Error connecting to AI.");
    } catch (err) {
      setCopilotReply("Failed to reach Copilot server.");
    }
    setCopilotLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans pb-16">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0b0f19] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">TalentOS</span>
          <span className="px-3 py-1 text-xs font-bold bg-sky-500/20 text-sky-400 rounded-md">Recruiter Portal</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/student" className="hover:text-white transition">Student Portal</Link>
          <span className="text-white">Recruiter Dashboard</span>
          <Link href="/interview" className="hover:text-white transition">AI Mock Interview</Link>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
          <span>✨</span> {profiles.length} Verified Candidates
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Candidate Talent Leaderboard</h1>
            <p className="text-slate-400 text-sm">Ranked dynamically by verified AI Talent Score.</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#111623] hover:bg-white/5 border border-white/10 text-slate-300 rounded-lg transition cursor-pointer"
          >
            📊 Export CSV
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Table Section (Left Side) */}
          <div className="lg:col-span-3 bg-[#111623] border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-fit">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#0b0f19]/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Candidate Name</th>
                    <th className="px-6 py-4">Top Extracted Skills</th>
                    <th className="px-6 py-4">AI Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Loading dynamic candidate data...
                      </td>
                    </tr>
                  ) : profiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No candidates found. Upload a real resume first.
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile, index) => (
                      <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5 font-medium text-slate-500">#{index + 1}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm uppercase">
                              {formatName(profile.filename).charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-200">{formatName(profile.filename)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            {getTopSkills(profile.skills).map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-[#0b0f19] border border-white/10 text-slate-300 rounded text-[11px] font-medium">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-lg font-bold ${profile.talent_score >= 80 ? 'text-emerald-400' : profile.talent_score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {profile.talent_score}
                          </span>
                          <span className="text-xs text-slate-500">/100</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {/* PDF Viewer Link */}
                            <a 
                              href={`http://localhost:8000/static/uploads/${profile.filename}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-md text-xs font-semibold transition flex items-center gap-1.5"
                            >
                              📄 View CV
                            </a>
                            <button className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-md text-xs font-semibold transition flex items-center gap-1.5">
                              🤖 AI Insights
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recruiter Copilot Sidebar (Right Side) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-[#111623] border border-white/5 rounded-2xl p-6 h-full flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">🤖 Recruiter Copilot</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded">Gemini 1.5</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => { 
                    setCopilotQuery("Who is the best candidate for Python?"); 
                    handleCopilotAsk("Who is the best candidate for Python?"); 
                  }}
                  className="w-full text-left px-4 py-3 bg-[#0b0f19] border border-white/5 hover:border-indigo-500/30 rounded-xl text-xs text-slate-300 transition flex items-center gap-2"
                >
                  💡 "Who is best for Python?"
                </button>
                <button 
                  onClick={() => { 
                    setCopilotQuery("Which candidate has the highest AI score?"); 
                    handleCopilotAsk("Which candidate has the highest AI score?"); 
                  }}
                  className="w-full text-left px-4 py-3 bg-[#0b0f19] border border-white/5 hover:border-indigo-500/30 rounded-xl text-xs text-slate-300 transition flex items-center gap-2"
                >
                  💡 "Highest AI score candidate?"
                </button>
              </div>

              {/* AI Reply Box */}
              {copilotReply && (
                <div className="mb-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm text-indigo-200">
                  <span className="font-bold text-indigo-400 block mb-1">AI Reply:</span>
                  {copilotReply}
                </div>
              )}

              {/* Input Area */}
              <div className="mt-auto">
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCopilotAsk(copilotQuery)}
                    placeholder="Ask AI about candidates..." 
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 pr-12"
                  />
                  <button 
                    onClick={() => handleCopilotAsk(copilotQuery)}
                    disabled={copilotLoading}
                    className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {copilotLoading ? "..." : "↑"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}