"use client";
import { useState, useMemo } from "react";
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

export default function DuaCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const categoryId = params.id as string;

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedSub, setSelectedSub] = useState<string>("All");

  const category = DUA_CATEGORIES.find((c) => c.id === categoryId);
  const categoryDuas = useMemo(() => ALL_DUAS.filter((d) => d.category === categoryId), [categoryId]);

  const subcategories = useMemo(() => {
    const subs = new Set(categoryDuas.map((d) => d.subcategory));
    return ["All", ...Array.from(subs)];
  }, [categoryDuas]);

  const filteredDuas = useMemo(() => {
    if (selectedSub === "All") return categoryDuas;
    return categoryDuas.filter((d) => d.subcategory === selectedSub);
  }, [categoryDuas, selectedSub]);

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

  const colorMap: Record<string, { bg: string; text: string }> = {
    amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
    green: { bg: "bg-green-500/10", text: "text-green-400" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-400" },
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  };

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Category not found</p>
        <Link href="/duas" className="text-emerald-400 hover:text-emerald-300">Back to Dua Library</Link>
      </div>
    );
  }

  const colors = colorMap[category.color] || colorMap.emerald;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{category.icon}</span>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">{category.description}</p>
        </div>
        <span className="text-sm text-gray-500">{categoryDuas.length} du&apos;as</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSub(sub)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${
              selectedSub === sub
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredDuas.map((dua) => (
          <Link
            key={dua.id}
            href={`/duas/dua/${dua.id}`}
            className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white group-hover:text-emerald-400 transition">{dua.title}</h3>
                <p className="text-right text-lg leading-relaxed text-emerald-400/60 mt-2 line-clamp-2" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                  {dua.arabic.slice(0, 100)}...
                </p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-1 italic">{dua.transliteration.slice(0, 80)}...</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dua.translation.slice(0, 80)}...</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-600">{dua.source}</span>
                  {dua.authenticity && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      dua.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
                      dua.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
                      "bg-gray-800 text-gray-500"
                    }`}>
                      {dua.authenticity}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); toggleFavorite(dua.id); }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition ${
                  favorites.has(dua.id)
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {favorites.has(dua.id) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                )}
              </button>
            </div>
          </Link>
        ))}
        {filteredDuas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No du&apos;as found in this subcategory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
