"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Bookmark {
  _id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  arabicText: string;
  translation: string;
  bookmarkCollection: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadBookmarks = useCallback(async () => {
    if (!token) return;
    const url = filter !== "all" ? `/api/bookmarks?collection=${filter}` : "/api/bookmarks";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setBookmarks(data.bookmarks || []);
    setLoading(false);
  }, [token, filter]);

  useEffect(() => { loadBookmarks(); }, [loadBookmarks]);

  const removeBookmark = async (surahNumber: number, ayahNumber: number) => {
    if (!token) return;
    await fetch(`/api/bookmarks?surah=${surahNumber}&ayah=${ayahNumber}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookmarks((prev) => prev.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)));
  };

  const collections = ["all", "favorites", "important", "to-review"];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/quran" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
          <p className="text-gray-400 text-sm">{bookmarks.length} saved Ayahs</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {collections.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === c ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}>
            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">No bookmarks yet</p>
          <p className="text-gray-500 text-sm mb-4">Save Ayahs from the Quran reader</p>
          <Link href="/quran" className="inline-flex px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition">
            Browse Quran
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div key={b._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
              <div className="flex items-center justify-between mb-3">
                <Link href={`/quran/surah/${b.surahNumber}`} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition">
                  {b.surahName} - Ayah {b.ayahNumber}
                </Link>
                <div className="flex gap-1">
                  <Link href={`/quran/reflect/${b.surahNumber}/${b.ayahNumber}`} className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                  </Link>
                  <button onClick={() => removeBookmark(b.surahNumber, b.ayahNumber)} className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
              {b.arabicText && (
                <p className="text-right text-xl mb-2 leading-loose" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                  {b.arabicText}
                </p>
              )}
              {b.translation && <p className="text-gray-400 text-sm">{b.translation}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
