"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  missed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-400",
  medium: "bg-amber-500/10 text-amber-400",
  hard: "bg-red-500/10 text-red-400",
};

const CATEGORY_COLORS: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  teal: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

export default function SunnahsPage() {
  const { token } = useAuth();
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0, totalDays: 0 });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const formattedDate = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const dailySunnahs = useMemo(() => ALL_SUNNAHS.filter((s) => s.frequency === "daily"), []);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiFetch(`/api/sunnahs/progress?date=${dateStr}`, token),
      apiFetch("/api/sunnahs/progress?stats=true", token),
    ]).then(([dayData, statsData]) => {
      setProgress(dayData.progress || {});
      setStats({ currentStreak: statsData.currentStreak || 0, longestStreak: statsData.longestStreak || 0, totalDays: statsData.totalDays || 0 });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, dateStr]);

  const updateStatus = async (sunnahId: string, status: string) => {
    if (!token || savingId) return;
    setSavingId(sunnahId);
    setProgress((p) => ({ ...p, [sunnahId]: status }));
    await apiFetch("/api/sunnahs/progress", token, {
      method: "POST",
      body: JSON.stringify({ sunnahId, status, date: dateStr }),
    });
    setSavingId(null);
  };

  const logAllCompleted = async () => {
    if (!token) return;
    const newProgress = { ...progress };
    for (const sunnah of dailySunnahs) {
      newProgress[sunnah.id] = "completed";
    }
    setProgress(newProgress);
    for (const sunnah of dailySunnahs) {
      await apiFetch("/api/sunnahs/progress", token, {
        method: "POST",
        body: JSON.stringify({ sunnahId: sunnah.id, status: "completed", date: dateStr }),
      });
    }
  };

  const completedCount = useMemo(() => {
    return dailySunnahs.filter((s) => progress[s.id] === "completed").length;
  }, [dailySunnahs, progress]);

  const progressPercent = dailySunnahs.length > 0 ? Math.round((completedCount / dailySunnahs.length) * 100) : 0;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    for (const cat of SUNNAH_CATEGORIES) {
      const catSunnahs = ALL_SUNNAHS.filter((s) => s.category === cat.id);
      counts[cat.id] = {
        total: catSunnahs.length,
        completed: catSunnahs.filter((s) => progress[s.id] === "completed").length,
      };
    }
    return counts;
  }, [progress]);

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
      <div>
        <h1 className="text-2xl font-bold text-white">Daily Sunnah Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">{formattedDate}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#1f2937" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 34}`} strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPercent / 100)}`} strokeLinecap="round" className="transition-all duration-500" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-emerald-400">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-400 mb-1">Daily Score</h2>
            <p className="text-2xl font-bold text-white">{completedCount} / {dailySunnahs.length}</p>
            <p className="text-xs text-gray-500 mt-1">sunnahs completed today</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-400">{stats.currentStreak}</p>
              <p className="text-xs text-gray-500">Current Streak</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{stats.longestStreak}</p>
              <p className="text-xs text-gray-500">Longest Streak</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {SUNNAH_CATEGORIES.map((cat) => {
            const colors = CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.emerald;
            const catCount = categoryCounts[cat.id];
            return (
              <Link key={cat.id} href={`/sunnahs/category/${cat.id}`} className={`bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition group`}>
                <div className="text-xl mb-2 group-hover:scale-110 transition">{cat.icon}</div>
                <h3 className="text-xs font-medium text-white truncate">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{catCount.completed}/{catCount.total}</p>
                {catCount.total > 0 && (
                  <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${(catCount.completed / catCount.total) * 100}%` }} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400">Today&apos;s Sunnahs</h2>
          <button onClick={logAllCompleted} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition">
            Log All as Completed
          </button>
        </div>
        <div className="space-y-3">
          {dailySunnahs.map((sunnah) => {
            const status = progress[sunnah.id];
            const catInfo = SUNNAH_CATEGORIES.find((c) => c.id === sunnah.category);
            return (
              <div key={sunnah.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white">{sunnah.title}</h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[sunnah.difficulty]}`}>{sunnah.difficulty}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{catInfo?.icon} {catInfo?.name}</p>
                    <p className="text-xs text-gray-500">{sunnah.source}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {[
                      { key: "completed", icon: "✅", label: "Completed" },
                      { key: "in-progress", icon: "⏳", label: "In Progress" },
                      { key: "missed", icon: "❌", label: "Missed" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => updateStatus(sunnah.id, s.key)}
                        disabled={savingId === sunnah.id}
                        title={s.label}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border transition ${
                          status === s.key
                            ? STATUS_COLORS[s.key]
                            : "bg-gray-800 border-gray-700 text-gray-500 hover:text-white hover:border-gray-600"
                        } ${savingId === sunnah.id ? "opacity-50" : ""}`}
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/sunnahs/weekly" className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition text-center">
          <p className="text-sm font-medium text-white">Weekly Report</p>
          <p className="text-xs text-gray-500 mt-1">View your weekly progress</p>
        </Link>
        <Link href="/sunnahs/monthly" className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition text-center">
          <p className="text-sm font-medium text-white">Monthly Report</p>
          <p className="text-xs text-gray-500 mt-1">View your monthly progress</p>
        </Link>
      </div>
    </div>
  );
}
