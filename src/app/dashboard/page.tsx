"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [todayCheckin, setTodayCheckin] = useState<Record<string, unknown> | null>(null);
  const [prayers, setPrayers] = useState<{ name: string; completed: boolean }[]>([]);
  const [dhikrTotal, setDhikrTotal] = useState(0);
  const [goals, setGoals] = useState<Array<{ progress: number; target: number; completed: boolean }>>([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/analytics", token).then(setAnalytics);
    apiFetch(`/api/checkins?month=${today.substring(0, 7)}`, token).then((data) => {
      const checkin = data.checkins?.find((c: { date: string }) => c.date === today);
      setTodayCheckin(checkin || null);
    });
    apiFetch(`/api/prayers?month=${today.substring(0, 7)}`, token).then((data) => {
      const todayPrayer = data.prayers?.find((p: { date: string }) => p.date === today);
      setPrayers(todayPrayer?.prayers || [
        { name: "Fajr", completed: false },
        { name: "Dhuhr", completed: false },
        { name: "Asr", completed: false },
        { name: "Maghrib", completed: false },
        { name: "Isha", completed: false },
      ]);
    });
    apiFetch("/api/dhikr", token).then((data) => {
      const todayDhikr = data.records?.find((r: { date: string }) => r.date === today);
      const total = todayDhikr?.counts?.reduce((sum: number, c: { count: number }) => sum + c.count, 0) || 0;
      setDhikrTotal(total);
    });
    apiFetch("/api/goals", token).then((data) => setGoals(data.goals || []));
  }, [token, today]);

  const togglePrayer = async (index: number) => {
    const updated = [...prayers];
    updated[index] = { ...updated[index], completed: !updated[index].completed };
    setPrayers(updated);
    await fetch("/api/prayers", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date: today, prayers: updated }),
    });
  };

  const dayStatus = todayCheckin
    ? todayCheckin.sinsAvoided && todayCheckin.goodHabitsCompleted
      ? "success"
      : todayCheckin.sinsAvoided || todayCheckin.goodHabitsCompleted
      ? "partial"
      : "failed"
    : "none";

  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.length;

  const streak = (analytics?.currentStreak as number) || 0;
  const badges = [365, 180, 90, 60, 30, 14, 7, 3];
  const currentBadge = badges.find(b => streak >= b);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <a
          href="/emergency"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium hover:bg-red-500/30 transition animate-pulse-glow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          I Need Help
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
          color="emerald"
        />
        <StatCard
          title="Success Rate"
          value={`${(analytics?.successPercentage as number) || 0}%`}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="blue"
        />
        <StatCard
          title="Today's Prayers"
          value={`${prayers.filter(p => p.completed).length}/5`}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>}
          color="amber"
        />
        <StatCard
          title="Goals"
          value={`${completedGoals}/${activeGoals}`}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          color="purple"
        />
      </div>

      {currentBadge && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl shrink-0">
            &#127942;
          </div>
          <div>
            <p className="text-emerald-400 font-semibold">Incredible Streak!</p>
            <p className="text-gray-400 text-sm">You&apos;ve maintained a {streak}-day streak. Keep going!</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Status</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
              dayStatus === "success" ? "bg-emerald-500/20" :
              dayStatus === "partial" ? "bg-amber-500/20" :
              dayStatus === "failed" ? "bg-red-500/20" : "bg-gray-800"
            }`}>
              {dayStatus === "success" ? "✓" : dayStatus === "partial" ? "~" : dayStatus === "failed" ? "✗" : "—"}
            </div>
            <div>
              <p className={`font-medium ${
                dayStatus === "success" ? "text-emerald-400" :
                dayStatus === "partial" ? "text-amber-400" :
                dayStatus === "failed" ? "text-red-400" : "text-gray-400"
              }`}>
                {dayStatus === "success" ? "Great day!" :
                 dayStatus === "partial" ? "Partial success" :
                 dayStatus === "failed" ? "Tough day, but tomorrow is new" : "Not checked in yet"}
              </p>
              <p className="text-sm text-gray-500">
                {dayStatus === "none" ? "Go to calendar to check in" : "Keep up the good work"}
              </p>
            </div>
          </div>
          {dayStatus === "none" && (
            <a href="/calendar" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition">
              Check In Now
            </a>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Prayer Tracker</h3>
          <div className="space-y-2">
            {prayers.map((prayer, i) => (
              <button
                key={prayer.name}
                onClick={() => togglePrayer(i)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition text-sm font-medium ${
                  prayer.completed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                }`}
              >
                <span>{prayer.name}</span>
                <span>{prayer.completed ? "✓" : "○"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Daily Dhikr</h3>
          <span className="text-2xl font-bold text-emerald-400">{dhikrTotal}</span>
        </div>
        <a href="/dhikr" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition">
          Open Counter →
        </a>
      </div>

      {analytics && (analytics.triggers as Record<string, number>) && Object.keys(analytics.triggers as Record<string, number>).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Triggers</h3>
          <div className="space-y-3">
            {Object.entries(analytics.triggers as Record<string, number>)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([trigger, count]) => (
                <div key={trigger} className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500/60 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(analytics.triggers as Record<string, number>))) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-24 text-right">{trigger}</span>
                  <span className="text-sm text-gray-500 w-8 text-right">{count as number}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <DailyAyahCard />

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Daily Reminder</h3>
        <p className="text-gray-300 text-sm leading-relaxed italic">
          &ldquo;Verily, with hardship comes ease.&rdquo; — Quran 94:6
        </p>
        <p className="text-gray-500 text-xs mt-2">Every small step counts. Keep moving forward.</p>
      </div>
    </div>
  );
}

function DailyAyahCard() {
  const [ayah, setAyah] = useState<{ surahNumber: number; ayahNumber: number; surahName: string; surahEnglishName: string; arabicText: string; translation: string } | null>(null);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    import("@/lib/quran-data").then(({ DAILY_AYAHS }) => {
      setAyah(DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length]);
    });
  }, []);

  if (!ayah) return null;

  return (
    <a href={`/quran/surah/${ayah.surahNumber}`} className="block bg-gradient-to-br from-gray-900 to-gray-800 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/30 transition group">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <span className="text-lg">&#128220;</span>
        </div>
        <h3 className="text-sm font-semibold text-emerald-400">Daily Ayah</h3>
      </div>
      <p className="text-right text-2xl mb-3 leading-loose text-white/90 group-hover:text-emerald-400 transition" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
        {ayah.arabicText}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed italic mb-2">&ldquo;{ayah.translation}&rdquo;</p>
      <p className="text-xs text-gray-500">{ayah.surahEnglishName} ({ayah.surahName}) &middot; Ayah {ayah.ayahNumber}</p>
    </a>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/20 text-blue-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{title}</p>
    </div>
  );
}
