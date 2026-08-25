"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_HADITHS, HADITH_BOOKS } from "@/lib/hadith-data";

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

export default function HadithBookPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const bookId = params.id as string;

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const book = HADITH_BOOKS.find((b) => b.id === bookId);
  const bookHadiths = useMemo(() => ALL_HADITHS.filter((h) => h.book === bookId), [bookId]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/api/hadiths/bookmarks", token)
      .then((d) => setBookmarks(new Set((d.bookmarks || []).map((b: { hadithId: string }) => b.hadithId))))
      .catch(() => {})
      .finally(() => setLoading(false));
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

  if (!book) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Book not found</p>
        <Link href="/hadiths" className="text-emerald-400 hover:text-emerald-300">Back to Hadith Library</Link>
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
          <div className="flex items-center gap-2">
            <span className="text-xl">{book.icon}</span>
            <h1 className="text-2xl font-bold text-white">{book.name}</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">{book.author} &middot; {book.arabicName}</p>
        </div>
        <span className="text-sm text-gray-500">{bookHadiths.length} hadiths</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <p className="text-sm text-gray-400">{book.description}</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading hadiths...</p>
          </div>
        ) : bookHadiths.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hadiths found in this book.</p>
          </div>
        ) : (
          bookHadiths.map((hadith) => (
            <Link key={hadith.id} href={`/hadiths/hadith/${hadith.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition">{hadith.hadithNumber}</span>
                    <span className="text-xs text-gray-500">{hadith.chapter}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      hadith.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
                      hadith.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{hadith.authenticity}</span>
                  </div>
                  <p className="text-right text-lg leading-relaxed text-emerald-400/60 mb-2 line-clamp-2" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                    {hadith.arabic.slice(0, 120)}...
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1">{hadith.translation.slice(0, 120)}...</p>
                  <p className="text-xs text-gray-600 mt-1">{hadith.narrator}</p>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); toggleBookmark(hadith.id); }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition ${
                    bookmarks.has(hadith.id) ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {bookmarks.has(hadith.id) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                  )}
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
