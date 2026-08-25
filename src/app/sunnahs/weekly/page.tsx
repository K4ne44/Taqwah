"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_SUNNAHS, SUNNAH_CATEGORIES } from "@/lib/sunnah-data";

const apiFetch = async (url: string, token: string | null, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  return res.json();
};

interface DayData {
  date: string;
  sunnahs: Record<string, string>;
}

export default function SunnahWeeklyPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);

  const dailySunnahs = useMemo(() => ALL_SUNNAHS.filter((s) => s.frequency === "daily"), []);

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { start: fmt(start), end: fmt(end) };
  }, []);

  const days = useMemo(() => {
    const result: { date: string; label: string; short: string }[] = [];
    const end = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      result.push({
        date: ds,
        label: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        short: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return result;
  }, []);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiFetch(`/api/sunnahs/progress?week=${dateRange.start}`, token),
      apiFetch("/api/sunnahs/progress?stats=true", token),
    ]).then(([weekResp, statsResp]) => {
      setWeekData(weekResp.progress || []);
      setStats({ currentStreak: statsResp.currentStreak || 0, longestStreak: statsResp.longestStreak || 0 });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, dateRange.start]);

  const getDayProgress = (dateStr: string): Record<string, string> => {
    const day = weekData.find((d) => d.date === dateStr);
    return day?.sunnahs || {};
  };

  const dailyCompletionRate = useMemo(() => {
    return days.map((d) => {
      const prog = getDayProgress(d.date);
      const completed = dailySunnahs.filter((s) => prog[s.id] === "completed").length;
      return {
        ...d,
        completed,
        total: dailySunnahs.length,
        percent: dailySunnahs.length > 0 ? Math.round((completed / dailySunnahs.length) * 100) : 0,
      };
    });
  }, [days, weekData, dailySunnahs]);

  const maxPercent = Math.max(...dailyCompletionRate.map((d) => d.percent), 1);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    for (const cat of SUNNAH_CATEGORIES) {
      const catSunnahs = ALL_SUNNAHS.filter((s) => s.category === cat.id);
      let completed = 0;
      for (const d of weekData) {
        for (const s of catSunnahs) {
          if (d.sunnahs?.[s.id] === "completed") completed++;
        }
      }
      counts[cat.id] = { total: catSunnahs.length * 7, completed };
    }
    return SUNNAH_CATEGORIES
      .map((c) => ({ ...c, ...counts[c.id] }))
      .filter((c) => c.completed > 0)
      .sort((a, b) => b.completed - a.completed);
  }, [weekData]);

  const totalCompleted = useMemo(() => {
    return weekData.reduce((acc, day) => {
      return acc + dailySunnahs.filter((s) => day.sunnahs?.[s.id] === "completed").length;
    }, 0);
  }, [weekData, dailySunnahs]);

  const avgPerDay = weekData.length > 0 ? Math.round(totalCompleted / 7) : 0;

  const weakAreas = useMemo(() => {
    const catCounts: Record<string, { completed: number; total: number }> = {};
    for (const cat of SUNNAH_CATEGORIES) {
      const catSunnahs = ALL_SUNNAHS.filter((s) => s.category === cat.id && s.frequency === "daily");
      let completed = 0;
      for (const day of weekData) {
        for (const s of catSunnahs) {
          if (day.sunnahs?.[s.id] === "completed") completed++;
        }
      }
      catCounts[cat.id] = { completed, total: catSunnahs.length * 7 };
    }
    return SUNNAH_CATEGORIES
      .map((c) => ({ ...c, ...catCounts[c.id] }))
      .filter((c) => c.total > 0 && c.completed / c.total < 0.3)
      .sort((a, b) => a.completed / a.total - b.completed / b.total);
  }, [weekData]);

  const suggestions = useMemo(() => {
    const tips: string[] = [];
    if (avgPerDay < dailySunnahs.length * 0.3) {
      tips.push("Start small: focus on just 3-5 sunnahs per day to build consistency.");
    }
    if (weakAreas.length > 0) {
      tips.push(`Focus on ${weakAreas[0].name} — you completed only ${weakAreas[0].completed} of ${weakAreas[0].total} opportunities this week.`);
    }
    if (stats.currentStreak === 0) {
      tips.push("Begin a new streak today! Even one consistent sunnah daily can transform your routine.");
    }
    if (avgPerDay >= dailySunnahs.length * 0.5) {
      tips.push("Great progress! Try adding more weekly or occasional sunnahs to your routine.");
    }
    if (tips.length === 0) {
      tips.push("Keep up the good work! Consistency is the key to building sunnah habits.");
    }
    return tips;
  }, [avgPerDay, weakAreas, stats, dailySunnahs]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Sunnah Report</h1>
          <p className="text-gray-400 text-sm mt-1">{dateRange.start} to {dateRange.end}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{totalCompleted}</p>
          <p className="text-xs text-gray-500">Total Completed</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{avgPerDay}</p>
          <p className="text-xs text-gray-500">Avg Per Day</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.currentStreak}</p>
          <p className="text-xs text-gray-500">Current Streak</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.longestStreak}</p>
          <p className="text-xs text-gray-500">Longest Streak</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Daily Completions</h2>
        <div className="flex items-end gap-3 h-40">
          {dailyCompletionRate.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{d.percent}%</span>
              <div className="w-full relative" style={{ height: `${Math.max((d.percent / maxPercent) * 100, 4)}%` }}>
                <div className={`absolute inset-0 rounded-t-lg transition-all duration-500 ${d.percent > 50 ? "bg-emerald-400" : d.percent > 0 ? "bg-amber-400" : "bg-gray-700"}`} />
              </div>
              <span className="text-xs text-gray-500">{d.short}</span>
            </div>
          ))}
        </div>
      </div>

      {categoryBreakdown.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => {
              const percent = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span className="text-sm text-white">{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{cat.completed}/{cat.total} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Improvement Suggestions</h2>
        <div className="space-y-2">
          {suggestions.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">💡</span>
              <p className="text-sm text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Day-by-Day Details</h2>
        <div className="space-y-4">
          {days.map((d) => {
            const prog = getDayProgress(d.date);
            const completed = dailySunnahs.filter((s) => prog[s.id] === "completed").length;
            const inProgress = dailySunnahs.filter((s) => prog[s.id] === "in-progress").length;
            const missed = dailySunnahs.filter((s) => prog[s.id] === "missed").length;
            const unmarked = dailySunnahs.length - completed - inProgress - missed;
            return (
              <div key={d.date} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{d.label}</span>
                  <span className="text-xs text-gray-400">{completed}/{dailySunnahs.length} completed</span>
                </div>
                <div className="flex gap-2">
                  {completed > 0 && <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">✅ {completed}</span>}
                  {inProgress > 0 && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">⏳ {inProgress}</span>}
                  {missed > 0 && <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400">❌ {missed}</span>}
                  {unmarked > 0 && <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500">⬜ {unmarked}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
