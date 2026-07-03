import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Sparkles, RefreshCw, AlertCircle, BrainCircuit } from "lucide-react";

const AiSummary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSummary = async () => {
    const token = Cookies.get("jwt_token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const options = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };
      const res = await fetch("http://localhost:3000/Summaryai", options);
      const data = await res.json();

      if (res.ok && data.success) {
        setSummary(data.summary);
      } else {
        setError(data.message || "Could not retrieve summary.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div className="relative overflow-hidden w-full bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
      
      {/* Premium top neon accent bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Subtle background glow effect */}
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header section */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <BrainCircuit className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-[13px] font-extrabold tracking-tight text-white flex items-center gap-1.5">
              AI Daily Coach
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Smart Task Insights
            </p>
          </div>
        </div>

        <button
          onClick={getSummary}
          disabled={loading}
          className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95 border border-slate-800 bg-slate-900/50"
          title="Regenerate briefing"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-800/80 w-full mb-3.5" />

      {/* Content Area */}
      <div className="relative z-10 min-h-[60px]">
        {loading ? (
          <div className="space-y-2 py-2 animate-pulse">
            <div className="h-3 bg-slate-700/60 rounded-lg w-5/6"></div>
            <div className="h-3 bg-slate-700/60 rounded-lg w-full"></div>
            <div className="h-3 bg-slate-700/60 rounded-lg w-4/5"></div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 text-xs text-rose-400 font-semibold bg-rose-950/20 p-3.5 border border-rose-900/30 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="relative border-l-2 border-indigo-500/50 pl-3.5 py-1.5 my-1">
            <div className="text-slate-200 font-medium text-[13px] leading-relaxed italic">
              {summary ? (
                <p className="whitespace-pre-line">"{summary}"</p>
              ) : (
                <p className="text-slate-500 italic text-center py-2">
                  No active tasks to review. Add tasks to see your daily briefing!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSummary;
