"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_HADITHS, HADITH_TOPICS } from "@/lib/hadith-data";

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

export default function HadithDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const hadithId = params.id as string;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const hadithIndex = ALL_HADITHS.findIndex((h) => h.id === hadithId);
  const hadith = hadithIndex >= 0 ? ALL_HADITHS[hadithIndex] : null;
  const prevHadith = hadithIndex > 0 ? ALL_HADITHS[hadithIndex - 1] : null;
  const nextHadith = hadithIndex < ALL_HADITHS.length - 1 ? ALL_HADITHS[hadithIndex + 1] : null;

  const topicNames = hadith ? hadith.topics.map((t) => HADITH_TOPICS.find((tp) => tp.id === t)).filter(Boolean) : [];

  useEffect(() => {
    if (!token || !hadithId) return;
    apiFetch("/api/hadiths/bookmarks", token).then((d) => {
      const bookmarks = d.bookmarks || [];
      setIsBookmarked(bookmarks.includes(hadithId));
    }).catch(() => {});
  }, [token, hadithId]);

  useEffect(() => {
    if (!token || !hadithId) return;
    apiFetch("/api/hadiths/history", token, {
      method: "POST",
      body: JSON.stringify({ hadithId }),
    }).catch(() => {});
  }, [token, hadithId]);

  const toggleBookmark = async () => {
    if (!token) return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    await apiFetch(`/api/hadiths/bookmarks?hadithId=${hadithId}`, token, {
      method: next ? "POST" : "DELETE",
      body: next ? JSON.stringify({ hadithId, note }) : undefined,
    });
  };

  const shareHadith = useCallback(async () => {
    if (!hadith) return;
    const text = `${hadith.bookName} - ${hadith.chapter} #${hadith.hadithNumber}\n\n${hadith.arabic}\n\n${hadith.transliteration}\n\n${hadith.translation}\n\n— ${hadith.narrator}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: hadith.chapter, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [hadith]);

  if (!hadith) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Hadith not found</p>
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
          <h1 className="text-lg font-bold text-white">{hadith.chapter}</h1>
          <p className="text-gray-400 text-sm">{hadith.bookName} &middot; Hadith #{hadith.hadithNumber}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <p
          className="text-3xl sm:text-4xl leading-loose text-emerald-400/90 mb-6"
          dir="rtl"
          style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
        >
          {hadith.arabic}
        </p>
        <div className="w-16 h-px bg-gray-800 mx-auto mb-4" />
        <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
          {hadith.transliteration}
        </p>
        <div className="w-16 h-px bg-gray-800 mx-auto mb-4" />
        <p className="text-sm text-gray-400 leading-relaxed">
          {hadith.translation}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{hadith.narrator}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            hadith.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
            hadith.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
            hadith.authenticity === "Da'if" ? "bg-red-500/10 text-red-400" :
            "bg-gray-800 text-gray-500"
          }`}>{hadith.authenticity}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topicNames.map((t) => (
            <Link key={t!.id} href={`/hadiths/topic/${t!.id}`} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition">
              {t!.icon} {t!.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleBookmark}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition ${
            isBookmarked
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
          }`}
        >
          {isBookmarked ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
          )}
          <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>

        <button
          onClick={shareHadith}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
              <span>Share</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowNoteInput(!showNoteInput)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
          <span>Notes</span>
        </button>
      </div>

      {showNoteInput && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal note about this hadith..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 text-sm resize-none"
            rows={3}
          />
          <button
            onClick={async () => {
              if (!token) return;
              await apiFetch(`/api/hadiths/bookmarks?hadithId=${hadithId}`, token, {
                method: isBookmarked ? "POST" : "POST",
                body: JSON.stringify({ hadithId, note }),
              });
              if (!isBookmarked) {
                setIsBookmarked(true);
              }
              setShowNoteInput(false);
            }}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
          >
            Save Note
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        {prevHadith ? (
          <Link href={`/hadiths/hadith/${prevHadith.id}`} className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-700 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Previous
          </Link>
        ) : <div />}
        {nextHadith ? (
          <Link href={`/hadiths/hadith/${nextHadith.id}`} className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-700 transition">
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
