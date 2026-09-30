"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function MockInterview() {
  const [timer, setTimer] = useState(165); // 02:45
  const [isRecording, setIsRecording] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentQuestion = "How would you design a distributed rate limiter for an API endpoint handling 100,000 requests per second? Which data structure or storage engine would you pick?";

  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Real Camera Access Logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setError("");
    } catch (err) {
      setError("Webcam access denied or not available. Please check browser permissions.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      setError("Please type your technical answer before submitting.");
      return;
    }

    setEvaluating(true);
    setError("");
    setEvaluation(null);

    try {
      const res = await fetch("http://localhost:8000/api/evaluate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          answer: answerText
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        setEvaluation(data.evaluation);
      } else {
        setError("Failed to evaluate answer.");
      }
    } catch (err) {
      setError("Backend connection error. Is FastAPI running?");
    }
    setEvaluating(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans pb-16">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0b0f19] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">TalentOS</span>
          <span className="px-3 py-1 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded-md uppercase tracking-wider">Live AI Interview</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/student" className="hover:text-white transition">Student Portal</Link>
          <Link href="/recruiter" className="hover:text-white transition">Recruiter Dashboard</Link>
          <span className="text-white bg-white/5 px-3 py-1 rounded-md">AI Mock Interview</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold rounded-full">
          <span>⏱️</span> Time Elapsed: {formatTime(timer)}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Adaptive AI Technical Interview</h1>
          <p className="text-slate-400 text-sm">Role Target: SDE-1 (System Architecture & Data Structures)</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Left Panel: AI Question & Evaluation */}
          <div className="bg-[#111623] border border-white/5 rounded-2xl p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">🤖 AI Interviewer (Gemini Agent)</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Question 1 of 1
              </span>
            </div>
            
            <div className="bg-[#0b0f19] border border-white/5 rounded-xl p-6 flex-grow mb-6">
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-3">Current Technical Question:</p>
              <p className="text-white text-lg leading-relaxed font-medium">
                "{currentQuestion}"
              </p>
            </div>

            {/* AI Evaluation Popup Box */}
            {evaluation && (
              <div className="mb-6 p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Evaluation Score</span>
                  <span className="text-2xl font-black text-emerald-400">{evaluation.score} / 100</span>
                </div>
                <p className="text-sm text-slate-300"><strong className="text-white">Feedback:</strong> {evaluation.feedback}</p>
              </div>
            )}

            {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-sm">{error}</div>}

            <div className="flex gap-4 mt-auto">
              <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold py-3 rounded-xl text-sm transition flex justify-center items-center gap-2">
                🔊 Read Question Out Loud
              </button>
            </div>
          </div>

          {/* Right Panel: Camera & Text Input Feed */}
          <div className="bg-[#111623] border border-white/5 rounded-2xl p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">📹 Candidate Response Feed</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                {cameraActive ? "Live Stream Active" : "Camera Idle"}
              </span>
            </div>

            {/* Real Webcam Viewport */}
            <div className="bg-black border border-white/5 rounded-xl h-48 mb-6 flex flex-col items-center justify-center relative overflow-hidden">
              <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`} muted playsInline />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                  </div>
                  <button 
                    onClick={startCamera}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-4 rounded-lg transition shadow-lg cursor-pointer"
                  >
                    📷 Enable Webcam Preview
                  </button>
                </div>
              )}
            </div>

            {/* Fully Functional Text Input */}
            <div className="flex-grow flex flex-col mb-6">
              <label className="text-xs font-medium text-slate-400 mb-2">Type your technical explanation below:</label>
              <textarea 
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Explain your approach regarding data structures (e.g., Redis, Token Bucket, HashMaps)..." 
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none flex-grow min-h-[100px]"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`flex-1 text-white font-bold py-3 rounded-xl text-sm transition flex justify-center items-center gap-2 ${isRecording ? 'bg-red-500' : 'bg-slate-800 border border-slate-700'}`}
              >
                {isRecording ? "⏹️ Mic Active" : "🎙️ Voice Input"}
              </button>
              
              <button 
                onClick={handleSubmitAnswer}
                disabled={evaluating}
                className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-sm transition flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {evaluating ? "Evaluator AI Analyzing..." : "🚀 Submit Answer to AI"}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}