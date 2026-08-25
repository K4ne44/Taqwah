"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_HADITHS, HADITH_BOOKS, HADITH_TOPICS } from "@/lib/hadith-data";

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

function getDailyHadith() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return ALL_HADITHS[dayOfYear % ALL_HADITHS.length];
}

const colorMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", light: "bg-emerald-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", light: "bg-blue-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", light: "bg-amber-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", light: "bg-purple-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", light: "bg-rose-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", light: "bg-cyan-500/20" },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", light: "bg-green-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", light: "bg-orange-500/20" },
};

export default function HadithsPage() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const dailyHadith = useMemo(() => getDailyHadith(), []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    Promise.all([
      apiFetch("/api/hadiths/bookmarks", token).then((d) => setBookmarks(new Set((d.bookmarks || []).map((b: { hadithId: string }) => b.hadithId)))).catch(() => {}),
      apiFetch("/api/hadiths/history", token).then((d) => setHistory(d.history || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [token]);

  const toggleBookmark = async (hadithId: string) => {
    if (!token) return;
    const isBookmarked = bookmarks.has(hadithId);
    const next = new Set(bookmarks);
    if (isBookmarked) next.delete(hadithId); else next.add(hadithId);
    setBookmarks(next);
    await apiFetch(`/api/hadiths/bookmarks?hadithId=${hadithId}`, token, {
      method: isBookmarked ? "DELETE" : "POST",
      body: isBookmarked ? undefined : JSON.stringify({ hadithId }),
    });
  };

  const randomHadith = useMemo(() => {
    return ALL_HADITHS[Math.floor(Math.random() * ALL_HADITHS.length)];
  }, []);

  const filteredHadiths = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_HADITHS.filter(
      (h) =>
        h.translation.toLowerCase().includes(q) ||
        h.arabic.includes(search) ||
        h.narrator.toLowerCase().includes(q) ||
        h.topics.some((t) => t.toLowerCase().includes(q)) ||
        h.chapter.toLowerCase().includes(q)
    );
  }, [search]);

  const recentHadiths = useMemo(() => {
    return history.slice(-5).reverse().map((id) => ALL_HADITHS.find((h) => h.id === id)).filter(Boolean) as typeof ALL_HADITHS;
  }, [history]);

  const favoriteHadiths = useMemo(() => {
    return ALL_HADITHS.filter((h) => bookmarks.has(h.id)).slice(0, 4);
  }, [bookmarks]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hadith Library</h1>
          <p className="text-gray-400 text-sm mt-1">{ALL_HADITHS.length} hadiths from {HADITH_BOOKS.length} collections</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hadiths/search" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition">
            Search
          </Link>
          <Link href="/hadiths/collections" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition">
            Collections
          </Link>
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
          placeholder="Search hadiths by keyword, narrator, topic..."
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

      {search && filteredHadiths.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400">Search Results ({filteredHadiths.length})</h2>
          {filteredHadiths.slice(0, 8).map((hadith) => (
            <Link key={hadith.id} href={`/hadiths/hadith/${hadith.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{hadith.bookName} &middot; {hadith.chapter}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  hadith.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
                  hadith.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
                  "bg-red-500/10 text-red-400"
                }`}>{hadith.authenticity}</span>
              </div>
              <p className="text-right text-lg leading-relaxed text-emerald-400/60 mb-2 line-clamp-2" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                {hadith.arabic.slice(0, 100)}...
              </p>
              <p className="text-xs text-gray-400 line-clamp-1">{hadith.translation.slice(0, 100)}...</p>
            </Link>
          ))}
        </div>
      )}

      {!search && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📖</span>
              <h2 className="text-sm font-semibold text-white">Hadith of the Day</h2>
            </div>
            <Link href={`/hadiths/hadith/${dailyHadith.id}`} className="block hover:opacity-80 transition">
              <p className="text-right text-xl leading-relaxed text-emerald-400/80 mb-3" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                {dailyHadith.arabic.slice(0, 120)}...
              </p>
              <p className="text-sm text-gray-300">{dailyHadith.translation.slice(0, 150)}...</p>
              <p className="text-xs text-gray-500 mt-2">{dailyHadith.bookName} &middot; {dailyHadith.narrator}</p>
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Book Collections</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {HADITH_BOOKS.map((book) => {
                const colors = colorMap[book.color] || colorMap.emerald;
                const count = ALL_HADITHS.filter((h) => h.book === book.id).length;
                return (
                  <Link key={book.id} href={`/hadiths/book/${book.id}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{book.icon}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{count}</span>
                    </div>
                    <h3 className="text-sm font-medium text-white truncate">{book.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{book.author}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400">Browse by Topic</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {HADITH_TOPICS.map((topic) => {
                const count = ALL_HADITHS.filter((h) => h.topics.includes(topic.id)).length;
                return (
                  <Link key={topic.id} href={`/hadiths/topic/${topic.id}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 hover:border-gray-700 transition group text-center">
                    <span className="text-xl block mb-1">{topic.icon}</span>
                    <h3 className="text-xs font-medium text-white truncate">{topic.name}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{count}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/hadiths/hadith/${randomHadith.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Random Hadith
            </Link>
          </div>

          {recentHadiths.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-400">Recent Reading</h2>
              </div>
              <div className="space-y-3">
                {recentHadiths.map((hadith) => (
                  <Link key={hadith.id} href={`/hadiths/hadith/${hadith.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{hadith.bookName} &middot; #{hadith.hadithNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        hadith.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
                        hadith.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>{hadith.authenticity}</span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-1">{hadith.translation.slice(0, 120)}...</p>
                    <p className="text-xs text-gray-600 mt-1">{hadith.narrator}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favoriteHadiths.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-400">Favorite Hadiths</h2>
                <Link href="/hadiths/collections" className="text-xs text-emerald-400 hover:text-emerald-300">View all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoriteHadiths.map((hadith) => (
                  <Link key={hadith.id} href={`/hadiths/hadith/${hadith.id}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{hadith.chapter}</span>
                      <button onClick={(e) => { e.preventDefault(); toggleBookmark(hadith.id); }} className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{hadith.translation.slice(0, 100)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!loading && search && filteredHadiths.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hadiths found matching your search.</p>
          <p className="text-gray-600 text-sm mt-2">Try different keywords or browse by book/topic.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading hadiths...</p>
        </div>
      )}
    </div>
  );
}
