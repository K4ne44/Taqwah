"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_DUAS, DUA_CATEGORIES } from "@/lib/dua-data";

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

export default function DuaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const duaId = params.id as string;

  const dua = ALL_DUAS.find((d) => d.id === duaId);
  const category = dua ? DUA_CATEGORIES.find((c) => c.id === dua.category) : null;

  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token || !duaId) return;
    apiFetch("/api/duas/favorites", token).then((d) => {
      setIsFavorited((d.favorites || []).includes(duaId));
    });
  }, [token, duaId]);

  useEffect(() => {
    if (!token || !duaId) return;
    apiFetch("/api/duas/history", token, {
      method: "POST",
      body: JSON.stringify({ duaId }),
    });
    apiFetch("/api/duas/streaks", token, {
      method: "POST",
    });
  }, [token, duaId]);

  const toggleFavorite = async () => {
    if (!token) return;
    const next = !isFavorited;
    setIsFavorited(next);
    await apiFetch(`/api/duas/favorites?duaId=${duaId}`, token, {
      method: next ? "POST" : "DELETE",
      body: next ? JSON.stringify({ duaId }) : undefined,
    });
  };

  const shareDua = useCallback(async () => {
    if (!dua) return;
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.source}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dua.title, text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [dua]);

  const toggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  if (!dua) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Dua not found</p>
        <Link href="/duas" className="text-emerald-400 hover:text-emerald-300">Back to Dua Library</Link>
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
          <h1 className="text-2xl font-bold text-white">{dua.title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {category?.icon} {category?.name}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <p
          className="text-3xl sm:text-4xl leading-loose text-emerald-400/90 mb-6"
          dir="rtl"
          style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
        >
          {dua.arabic}
        </p>
        <div className="w-16 h-px bg-gray-800 mx-auto mb-4" />
        <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
          {dua.transliteration}
        </p>
        <div className="w-16 h-px bg-gray-800 mx-auto mb-4" />
        <p className="text-sm text-gray-400 leading-relaxed">
          {dua.translation}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{dua.source}</span>
            {dua.authenticity && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                dua.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
                dua.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
                dua.authenticity === "Da'if" ? "bg-red-500/10 text-red-400" :
                "bg-gray-800 text-gray-500"
              }`}>
                {dua.authenticity}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {dua.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleFavorite}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition ${
            isFavorited
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
          }`}
        >
          {isFavorited ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
          )}
          <span>{isFavorited ? "Favorited" : "Favorite"}</span>
        </button>

        <button
          onClick={shareDua}
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
          onClick={toggleAudio}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition ${
            isPlaying
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
          }`}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
          <span>{isPlaying ? "Playing" : "Listen"}</span>
        </button>
      </div>
    </div>
  );
}
