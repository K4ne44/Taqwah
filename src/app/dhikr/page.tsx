"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
}

const DHIKR_TYPES = [
  { name: "Istighfar", target: 33, color: "emerald" },
  { name: "SubhanAllah", target: 33, color: "blue" },
  { name: "Alhamdulillah", target: 33, color: "amber" },
  { name: "Allahu Akbar", target: 34, color: "purple" },
];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

interface DhikrCount {
  name: string;
  count: number;
}

export default function DhikrPage() {
  const { token } = useAuth();
  const todayStr = formatDate(new Date());

  const [counts, setCounts] = useState<DhikrCount[]>(
    DHIKR_TYPES.map(d => ({ name: d.name, count: 0 }))
  );
  const [animating, setAnimating] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    const data = await apiFetch("/api/dhikr", token);
    const todayRecord = (data.records || []).find((r: { date: string }) => r.date === todayStr);
    if (todayRecord?.counts) {
      const merged = DHIKR_TYPES.map(d => {
        const existing = todayRecord.counts.find((c: DhikrCount) => c.name === d.name);
        return { name: d.name, count: existing?.count || 0 };
      });
      setCounts(merged);
    }
  }, [token, todayStr]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveCounts = async (updated: DhikrCount[]) => {
    if (!token) return;
    await fetch("/api/dhikr", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date: todayStr, counts: updated }),
    });
  };

  const increment = (index: number) => {
    const updated = counts.map((c, i) => i === index ? { ...c, count: c.count + 1 } : { ...c });
    setCounts(updated);
    setAnimating(DHIKR_TYPES[index].name);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnimating(null), 150);
    saveCounts(updated);
  };

  const resetCounter = (index: number) => {
    const updated = counts.map((c, i) => i === index ? { ...c, count: 0 } : { ...c });
    setCounts(updated);
    saveCounts(updated);
  };

  const totalDaily = counts.reduce((sum, c) => sum + c.count, 0);
  const totalTarget = DHIKR_TYPES.reduce((sum, d) => sum + d.target, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Dhikr Counter</h1>
        <p className="text-gray-400 text-sm mt-1">Digital tasbih for daily remembrance</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Daily Total</p>
            <p className="text-3xl font-bold text-white">{totalDaily}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Target</p>
            <p className="text-lg font-medium text-gray-300">{totalTarget}</p>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalDaily / totalTarget) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DHIKR_TYPES.map((dhikr, index) => {
          const count = counts[index]?.count || 0;
          const progress = Math.min(count / dhikr.target, 1);
          const isComplete = count >= dhikr.target;

          const colorClasses: Record<string, { ring: string; text: string; bg: string; progress: string; complete: string }> = {
            emerald: { ring: "border-emerald-500/40", text: "text-emerald-400", bg: "bg-emerald-500/10", progress: "stroke-emerald-400", complete: "bg-emerald-500/20" },
            blue: { ring: "border-blue-500/40", text: "text-blue-400", bg: "bg-blue-500/10", progress: "stroke-blue-400", complete: "bg-blue-500/20" },
            amber: { ring: "border-amber-500/40", text: "text-amber-400", bg: "bg-amber-500/10", progress: "stroke-amber-400", complete: "bg-amber-500/20" },
            purple: { ring: "border-purple-500/40", text: "text-purple-400", bg: "bg-purple-500/10", progress: "stroke-purple-400", complete: "bg-purple-500/20" },
          };
          const colors = colorClasses[dhikr.color];

          return (
            <div key={dhikr.name} className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center ${isComplete ? colors.complete : ""}`}>
              <p className={`text-sm font-medium mb-1 ${colors.text}`}>{dhikr.name}</p>
              <p className="text-xs text-gray-500 mb-4">Target: {dhikr.target}</p>

              <button
                onClick={() => increment(index)}
                className={`relative w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all active:scale-90 ${
                  animating === dhikr.name
                    ? `${colors.ring} ${colors.bg} scale-95`
                    : isComplete
                    ? `${colors.ring} ${colors.bg}`
                    : "border-gray-700 bg-gray-800 hover:border-gray-600"
                }`}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="50" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-800" />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={colors.progress}
                    strokeDasharray={`${progress * 314} 314`}
                  />
                </svg>
                <span className={`text-3xl font-bold relative z-10 ${isComplete ? colors.text : "text-white"}`}>
                  {count}
                </span>
              </button>

              <button
                onClick={() => resetCounter(index)}
                className="mt-3 px-4 py-1.5 text-xs text-gray-500 hover:text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Reset
              </button>
            </div>
          );
        })}
      </div>

      {totalDaily > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Breakdown</h3>
          <div className="space-y-2">
            {DHIKR_TYPES.map((dhikr, index) => {
              const count = counts[index]?.count || 0;
              const pct = dhikr.target > 0 ? Math.round((count / dhikr.target) * 100) : 0;
              return (
                <div key={dhikr.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-32 truncate">{dhikr.name}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dhikr.color === "emerald" ? "bg-emerald-500" :
                        dhikr.color === "blue" ? "bg-blue-500" :
                        dhikr.color === "amber" ? "bg-amber-500" :
                        "bg-purple-500"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-16 text-right">{count}/{dhikr.target}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
