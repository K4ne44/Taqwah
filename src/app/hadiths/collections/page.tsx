"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_HADITHS } from "@/lib/hadith-data";

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

interface BookmarkEntry {
  hadithId: string;
  note?: string;
  createdAt?: string;
}

export default function HadithCollectionsPage() {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/api/hadiths/bookmarks", token)
      .then((d) => {
        const raw = d.bookmarks || [];
        if (Array.isArray(raw) && typeof raw[0] === "object") {
          setBookmarks(raw);
        } else {
          setBookmarks(raw.map((id: string) => ({ hadithId: id })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const removeBookmark = async (hadithId: string) => {
    if (!token) return;
    setBookmarks((prev) => prev.filter((b) => b.hadithId !== hadithId));
    await apiFetch(`/api/hadiths/bookmarks?hadithId=${hadithId}`, token, {
      method: "DELETE",
    });
  };

  const bookmarkedHadiths = useMemo(() => {
    return bookmarks.map((b) => {
      const hadith = ALL_HADITHS.find((h) => h.id === b.hadithId);
      return hadith ? { ...hadith, note: b.note } : null;
    }).filter(Boolean) as (typeof ALL_HADITHS[0] & { note?: string })[];
  }, [bookmarks]);

  const groupedByBook = useMemo(() => {
    const groups: Record<string, (typeof bookmarkedHadiths[0])[]> = {};
    bookmarkedHadiths.forEach((h) => {
      if (!groups[h.book]) groups[h.book] = [];
      groups[h.book].push(h);
    });
    return groups;
  }, [bookmarkedHadiths]);

  const favoriteHadiths = bookmarkedHadiths.filter((h) => h.topics.includes("sincerity") || h.topics.includes("faith") || h.authenticity === "Sahih").slice(0, 10);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/hadiths" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">My Collections</h1>
          <p className="text-gray-400 text-sm mt-1">{bookmarkedHadiths.length} bookmarked hadiths</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading collections...</p>
        </div>
      ) : bookmarkedHadiths.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">No bookmarked hadiths yet</p>
          <p className="text-gray-500 text-sm mb-4">Start bookmarking hadiths to build your collection.</p>
          <Link href="/hadiths" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition">
            Browse Hadiths
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⭐</span>
              <h2 className="text-sm font-semibold text-white">Favorites</h2>
              <span className="text-xs text-gray-500">({favoriteHadiths.length})</span>
            </div>
            {favoriteHadiths.length === 0 ? (
              <p className="text-xs text-gray-500">Your favorite hadiths will appear here.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoriteHadiths.slice(0, 6).map((hadith) => (
                  <Link key={hadith.id} href={`/hadiths/hadith/${hadith.id}`} className="bg-gray-800/50 border border-gray-800 rounded-xl p-3 hover:border-gray-700 transition">
                    <p className="text-xs text-gray-400 line-clamp-2">{hadith.translation.slice(0, 100)}...</p>
                    <p className="text-xs text-gray-600 mt-1">{hadith.bookName} &middot; {hadith.narrator}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {Object.entries(groupedByBook).map(([bookId, hadiths]) => (
            <div key={bookId}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-400">{hadiths[0]?.bookName || bookId} ({hadiths.length})</h2>
              </div>
              <div className="space-y-3">
                {hadiths.map((hadith) => (
                  <div key={hadith.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <Link href={`/hadiths/hadith/${hadith.id}`} className="block hover:opacity-80 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{hadith.chapter} &middot; #{hadith.hadithNumber}</span>
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
                      <p className="text-xs text-gray-600 mt-1">{hadith.narrator}</p>
                      {hadith.note && (
                        <div className="mt-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                          <p className="text-xs text-gray-500 italic">{hadith.note}</p>
                        </div>
                      )}
                    </Link>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => removeBookmark(hadith.id)}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
