"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_DUAS } from "@/lib/dua-data";

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

export default function DuaFavoritesPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/duas/favorites", token).then((d) => {
      setFavorites(new Set(d.favorites || []));
    });
  }, [token]);

  const favoriteDuas = ALL_DUAS.filter((d) => favorites.has(d.id));

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

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Favorite Du&apos;as</h1>
          <p className="text-gray-400 text-sm mt-1">{favoriteDuas.length} saved</p>
        </div>
      </div>

      {favoriteDuas.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-lg mb-2">No favorites yet</p>
          <p className="text-gray-500 text-sm mb-6">Tap the bookmark icon on any dua to save it here.</p>
          <Link href="/duas" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition">
            Browse Du&apos;as
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteDuas.map((dua) => (
            <Link key={dua.id} href={`/duas/dua/${dua.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">{dua.title}</h3>
                  <p className="text-right text-lg mt-2 leading-relaxed text-emerald-400/80 line-clamp-2" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                    {dua.arabic}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-1">{dua.translation}</p>
                  <p className="text-xs text-gray-600 mt-1">{dua.source}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); toggleFavorite(dua.id); }} className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
