"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
}

interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Omit<Achievement, "unlocked">[] = [
  { id: "first_step", label: "First Step", description: "First successful day", icon: "★" },
  { id: "one_week", label: "One Week Strong", description: "7 day streak", icon: "🔥" },
  { id: "monthly", label: "Monthly Champion", description: "30 day streak", icon: "🏆" },
  { id: "quarter", label: "Quarter Master", description: "90 day streak", icon: "🎖" },
  { id: "half_year", label: "Half Year Hero", description: "180 day streak", icon: "👑" },
  { id: "year", label: "Year of Purpose", description: "365 day streak", icon: "💎" },
  { id: "prayer_warrior", label: "Prayer Warrior", description: "100 prayers completed", icon: "🌙" },
  { id: "dhikr_master", label: "Dhikr Master", description: "1000 dhikr completed", icon: "❤" },
  { id: "journal_keeper", label: "Journal Keeper", description: "50 journal entries", icon: "📖" },
  { id: "goal_crusher", label: "Goal Crusher", description: "Complete 5 goals", icon: "⚡" },
];

export default function SettingsPage() {
  const { user, token, logout } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      apiFetch("/api/analytics", token),
      apiFetch("/api/dhikr", token),
      apiFetch("/api/journal", token),
      apiFetch("/api/goals", token),
    ]).then(([analytics, dhikr, journal, goals]) => {
      const longestStreak = (analytics.longestStreak as number) || 0;
      const totalPrayers = (analytics.totalPrayers as number) || 0;
      const totalDhikr = (dhikr.records || []).reduce(
        (sum: number, r: { counts?: { count: number }[] }) =>
          sum + (r.counts?.reduce((s: number, c: { count: number }) => s + c.count, 0) || 0),
        0
      );
      const journalEntries = (journal.entries || []).length;
      const completedGoals = (goals.goals || []).filter((g: { completed: boolean }) => g.completed).length;

      const unlocked: Record<string, boolean> = {
        first_step: longestStreak >= 1 || totalPrayers >= 1 || totalDhikr >= 1 || journalEntries >= 1,
        one_week: longestStreak >= 7,
        monthly: longestStreak >= 30,
        quarter: longestStreak >= 90,
        half_year: longestStreak >= 180,
        year: longestStreak >= 365,
        prayer_warrior: totalPrayers >= 100,
        dhikr_master: totalDhikr >= 1000,
        journal_keeper: journalEntries >= 50,
        goal_crusher: completedGoals >= 5,
      };

      setAchievements(
        ACHIEVEMENTS.map((a) => ({ ...a, unlocked: !!unlocked[a.id] }))
      );
    });
  }, [token]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user?.name || "Unknown"}</h2>
            <p className="text-gray-400 text-sm">{user?.email || "No email"}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Achievements</h2>
          <span className="text-sm text-emerald-400 font-medium">
            {unlockedCount}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 border transition ${
                a.unlocked
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-gray-800/50 border-gray-700 opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  a.unlocked ? "bg-emerald-500/20" : "bg-gray-800"
                }`}
              >
                {a.unlocked ? a.icon : "🔒"}
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  a.unlocked ? "text-emerald-400" : "text-gray-500"
                }`}
              >
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Privacy</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">Your data is stored securely and only you can access it</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">All notes and journal entries are private</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">End-to-end encryption coming soon</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">About</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">App</span>
            <span className="text-white text-sm font-medium">Taqwa Tracker</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Version</span>
            <span className="text-white text-sm font-medium">1.0.0</span>
          </div>
          <div className="pt-2">
            <p className="text-gray-500 text-xs text-center">Built with love for your self-improvement journey</p>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
