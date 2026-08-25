"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_DUAS, DUA_CATEGORIES, EMOTION_MAP, EMOTION_DUAS } from "@/lib/dua-data";

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

function getDailyDua() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return ALL_DUAS[dayOfYear % ALL_DUAS.length];
}

export default function DuaLibraryPage() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, totalDays: 0, todayCount: 0 });
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodDuas, setMoodDuas] = useState<typeof ALL_DUAS>([]);

  const dailyDua = useMemo(() => getDailyDua(), []);

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/duas/favorites", token).then((d) => {
      setFavorites(new Set(d.favorites || []));
    });
    apiFetch("/api/duas/history", token).then((d) => {
      setHistory(d.history || []);
    });
    apiFetch("/api/duas/streaks", token).then((d) => {
      setStreak({ currentStreak: d.currentStreak || 0, totalDays: d.totalDays || 0, todayCount: d.todayCount || 0 });
    });
  }, [token]);

  useEffect(() => {
    if (!selectedMood) {
      setMoodDuas([]);
      return;
    }
    const subcats = EMOTION_DUAS[selectedMood] || [];
    const moodCats = EMOTION_MAP[selectedMood] || [];
    setMoodDuas(
      ALL_DUAS.filter(
        (d) =>
          moodCats.includes(d.category) && subcats.some((s) => d.subcategory.includes(s))
      ).slice(0, 12)
    );
  }, [selectedMood]);

  const toggleFavorite = async (duaId: string) => {
    if (!token) return;
    const isFav = favorites.has(duaId);
    const next = new Set(favorites);
    if (isFav) next.delete(duaId);
    else next.add(duaId);
    setFavorites(next);
    await apiFetch(`/api/duas/favorites?duaId=${duaId}`, token, {
      method: isFav ? "DELETE" : "POST",
      body: isFav ? undefined : JSON.stringify({ duaId }),
    });
  };

  const filteredDuas = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_DUAS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [search]);

  const recentFavorites = useMemo(() => {
    return ALL_DUAS.filter((d) => favorites.has(d.id)).slice(0, 4);
  }, [favorites]);

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
    green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  };

  const moodColorMap: Record<string, string> = {
    blue: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    amber: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    red: "border-red-500/40 text-red-400 bg-red-500/10",
    purple: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    orange: "border-orange-500/40 text-orange-400 bg-orange-500/10",
    green: "border-green-500/40 text-green-400 bg-green-500/10",
    emerald: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dua Library</h1>
          <p className="text-gray-400 text-sm mt-1">{ALL_DUAS.length} du&apos;as to explore</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-2 text-center">
          <p className="text-2xl font-bold text-emerald-400">{streak.currentStreak}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search du&apos;as by keyword, title, or tag..."
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm transition"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {search && filteredDuas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400">Search Results ({filteredDuas.length})</h2>
          {filteredDuas.slice(0, 8).map((dua) => (
            <Link key={dua.id} href={`/duas/dua/${dua.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{dua.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dua.translation}</p>
                  <p className="text-xs text-gray-600 mt-1">{dua.source}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); toggleFavorite(dua.id); }} className={`ml-3 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${favorites.has(dua.id) ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                  {favorites.has(dua.id) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                  )}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!search && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <h2 className="text-sm font-semibold text-white">Dua of the Day</h2>
            </div>
            <Link href={`/duas/dua/${dailyDua.id}`} className="block hover:opacity-80 transition">
              <p className="text-right text-xl leading-relaxed text-emerald-400/80 mb-3" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                {dailyDua.arabic.slice(0, 120)}...
              </p>
              <p className="text-sm text-gray-300">{dailyDua.title}</p>
              <p className="text-xs text-gray-500 mt-1">{dailyDua.source}</p>
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DUA_CATEGORIES.map((cat) => {
                const colors = colorMap[cat.color] || colorMap.emerald;
                const count = ALL_DUAS.filter((d) => d.category === cat.id).length;
                return (
                  <Link key={cat.id} href={`/duas/category/${cat.id}`} className={`bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition group`}>
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                      <span className="text-lg">{cat.icon}</span>
                    </div>
                    <h3 className="text-sm font-medium text-white truncate">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{count} du&apos;as</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {recentFavorites.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-400">Recent Favorites</h2>
                <Link href="/duas/favorites" className="text-xs text-emerald-400 hover:text-emerald-300">View all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentFavorites.map((dua) => (
                  <Link key={dua.id} href={`/duas/dua/${dua.id}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white truncate">{dua.title}</h3>
                      <button onClick={(e) => { e.preventDefault(); toggleFavorite(dua.id); }} className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{dua.translation}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400">Smart Emotional Support</h2>
              {selectedMood && (
                <button onClick={() => setSelectedMood(null)} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { emotion: "sad", icon: "😢", label: "Sad", color: "blue" },
                { emotion: "anxious", icon: "😰", label: "Anxious", color: "amber" },
                { emotion: "angry", icon: "😤", label: "Angry", color: "red" },
                { emotion: "lonely", icon: "🥺", label: "Lonely", color: "purple" },
                { emotion: "stressed", icon: "😩", label: "Stressed", color: "orange" },
                { emotion: "grateful", icon: "🤲", label: "Grateful", color: "green" },
                { emotion: "motivated", icon: "💪", label: "Motivated", color: "emerald" },
              ].map((e) => (
                <button
                  key={e.emotion}
                  onClick={() => setSelectedMood(selectedMood === e.emotion ? null : e.emotion)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                    selectedMood === e.emotion
                      ? moodColorMap[e.color]
                      : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                  }`}
                >
                  <span>{e.icon}</span>
                  <span>{e.label}</span>
                </button>
              ))}
            </div>
            {moodDuas.length > 0 && (
              <div className="space-y-3">
                {moodDuas.map((dua) => (
                  <Link key={dua.id} href={`/duas/dua/${dua.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">{dua.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dua.translation}</p>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); toggleFavorite(dua.id); }} className={`ml-3 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${favorites.has(dua.id) ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                        {favorites.has(dua.id) ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                        )}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
