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

interface DayEntry {
  date: string;
  sunnahs: Record<string, string>;
}

export default function SunnahMonthlyPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [monthProgress, setMonthProgress] = useState<DayEntry[]>([]);
  const [prevMonthProgress, setPrevMonthProgress] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(() => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);

  const prevMonth = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, [selectedMonth]);

  const dailySunnahs = useMemo(() => ALL_SUNNAHS.filter((s) => s.frequency === "daily"), []);

  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    return new Date(y, m - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [selectedMonth]);

  const calendarDays = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const firstDay = new Date(y, m - 1, 1);
    const lastDay = new Date(y, m, 0);
    const startPad = firstDay.getDay();
    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(y, m - 1, -i);
      days.push({ date: "", day: d.getDate(), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const ds = `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ date: ds, day: i, isCurrentMonth: true });
    }
    while (days.length % 7 !== 0) {
      days.push({ date: "", day: 0, isCurrentMonth: false });
    }
    return days;
  }, [selectedMonth]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      apiFetch(`/api/sunnahs/progress?month=${selectedMonth}`, token),
      apiFetch(`/api/sunnahs/progress?month=${prevMonth}`, token),
    ]).then(([curr, prev]) => {
      setMonthProgress(curr.progress || []);
      setPrevMonthProgress(prev.progress || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, selectedMonth, prevMonth]);

  const getDayMap = (entries: DayEntry[]) => {
    const map: Record<string, Record<string, string>> = {};
    for (const e of entries) {
      map[e.date] = e.sunnahs || {};
    }
    return map;
  };

  const currentMap = useMemo(() => getDayMap(monthProgress), [monthProgress]);
  const prevMap = useMemo(() => getDayMap(prevMonthProgress), [prevMonthProgress]);

  const getDayRate = (dateStr: string) => {
    const prog = currentMap[dateStr] || {};
    const completed = dailySunnahs.filter((s) => prog[s.id] === "completed").length;
    return dailySunnahs.length > 0 ? completed / dailySunnahs.length : 0;
  };

  const heatColor = (rate: number) => {
    if (rate === 0) return "bg-gray-800";
    if (rate < 0.25) return "bg-emerald-900/60";
    if (rate < 0.5) return "bg-emerald-700/60";
    if (rate < 0.75) return "bg-emerald-500/60";
    return "bg-emerald-400/80";
  };

  const overallStats = useMemo(() => {
    let totalCompleted = 0;
    let totalMissed = 0;
    let totalTracked = 0;
    for (const day of monthProgress) {
      for (const s of dailySunnahs) {
        const st = day.sunnahs?.[s.id];
        if (st === "completed") totalCompleted++;
        else if (st === "missed") totalMissed++;
        else if (st) totalTracked++;
      }
    }
    const total = totalCompleted + totalMissed + totalTracked;
    const rate = total > 0 ? Math.round((totalCompleted / total) * 100) : 0;
    return { totalCompleted, totalMissed, totalTracked, rate, total };
  }, [monthProgress, dailySunnahs]);

  const prevOverallStats = useMemo(() => {
    let totalCompleted = 0;
    let totalMissed = 0;
    for (const day of prevMonthProgress) {
      for (const s of dailySunnahs) {
        const st = day.sunnahs?.[s.id];
        if (st === "completed") totalCompleted++;
        else if (st === "missed") totalMissed++;
      }
    }
    const total = totalCompleted + totalMissed;
    return { totalCompleted, total, rate: total > 0 ? Math.round((totalCompleted / total) * 100) : 0 };
  }, [prevMonthProgress, dailySunnahs]);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, { completed: number; total: number }> = {};
    for (const cat of SUNNAH_CATEGORIES) {
      const catSunnahs = ALL_SUNNAHS.filter((s) => s.category === cat.id);
      let completed = 0;
      for (const day of monthProgress) {
        for (const s of catSunnahs) {
          if (day.sunnahs?.[s.id] === "completed") completed++;
        }
      }
      counts[cat.id] = { completed, total: catSunnahs.length * monthProgress.length };
    }
    return SUNNAH_CATEGORIES
      .map((c) => ({ ...c, ...counts[c.id] }))
      .filter((c) => c.completed > 0)
      .sort((a, b) => b.completed - a.completed);
  }, [monthProgress]);

  const topSunnahs = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const day of monthProgress) {
      for (const [id, status] of Object.entries(day.sunnahs || {})) {
        if (status === "completed") {
          counts[id] = (counts[id] || 0) + 1;
        }
      }
    }
    return ALL_SUNNAHS
      .map((s) => ({ ...s, count: counts[s.id] || 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [monthProgress]);

  const leastSunnahs = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const day of monthProgress) {
      for (const [id, status] of Object.entries(day.sunnahs || {})) {
        if (status === "missed") {
          counts[id] = (counts[id] || 0) + 1;
        }
      }
    }
    return ALL_SUNNAHS
      .map((s) => ({ ...s, count: counts[s.id] || 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [monthProgress]);

  const longestStreakThisMonth = useMemo(() => {
    let streak = 0;
    let maxStreak = 0;
    for (const day of calendarDays) {
      if (!day.date || !day.isCurrentMonth) continue;
      const rate = getDayRate(day.date);
      if (rate >= 0.5) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  }, [calendarDays, currentMap, dailySunnahs]);

  const changeMonth = (offset: number) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + offset, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const rateDelta = overallStats.rate - prevOverallStats.rate;

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Monthly Sunnah Report</h1>
          <p className="text-gray-400 text-sm mt-1">{monthLabel}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="text-sm font-medium text-white min-w-[140px] text-center">{monthLabel}</span>
        <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Calendar Heat Map</h2>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
          ))}
          {calendarDays.map((day, i) => (
            <div key={i} className="aspect-square">
              {day.isCurrentMonth ? (
                <div className={`w-full h-full rounded-lg flex items-center justify-center text-xs relative group cursor-default ${heatColor(getDayRate(day.date))}`}>
                  <span className="text-gray-300">{day.day}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                    {Math.round(getDayRate(day.date) * 100)}% completed
                  </div>
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-3">
          <span className="text-xs text-gray-500">Less</span>
          <div className="w-4 h-4 rounded bg-gray-800" />
          <div className="w-4 h-4 rounded bg-emerald-900/60" />
          <div className="w-4 h-4 rounded bg-emerald-700/60" />
          <div className="w-4 h-4 rounded bg-emerald-500/60" />
          <div className="w-4 h-4 rounded bg-emerald-400/80" />
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{overallStats.rate}%</p>
          <p className="text-xs text-gray-500">Completion Rate</p>
          {rateDelta !== 0 && (
            <p className={`text-xs mt-1 ${rateDelta > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {rateDelta > 0 ? "+" : ""}{rateDelta}% vs last month
            </p>
          )}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{overallStats.totalCompleted}</p>
          <p className="text-xs text-gray-500">Total Completed</p>
          <p className="text-xs text-gray-600 mt-1">vs {prevOverallStats.totalCompleted} last month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{overallStats.totalMissed}</p>
          <p className="text-xs text-gray-500">Total Missed</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{longestStreakThisMonth}</p>
          <p className="text-xs text-gray-500">Longest Streak</p>
          <p className="text-xs text-gray-600 mt-1">this month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{monthProgress.length}</p>
          <p className="text-xs text-gray-500">Days Tracked</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{topSunnahs.length}</p>
          <p className="text-xs text-gray-500">Unique Sunnahs</p>
          <p className="text-xs text-gray-600 mt-1">practiced this month</p>
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
                    <span className="text-xs text-gray-400">{percent}%</span>
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

      {topSunnahs.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Top Practiced Sunnahs</h2>
          <div className="space-y-2">
            {topSunnahs.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                <span className="text-sm font-bold text-emerald-400 w-6 text-center">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.source}</p>
                </div>
                <span className="text-xs text-emerald-400 font-medium">{s.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {leastSunnahs.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Least Practiced Sunnahs</h2>
          <div className="space-y-2">
            {leastSunnahs.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.source}</p>
                </div>
                <span className="text-xs text-red-400 font-medium">{s.count}x missed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
