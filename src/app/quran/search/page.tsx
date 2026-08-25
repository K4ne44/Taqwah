"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SURAH_LIST, DAILY_AYAHS, searchQuran } from "@/lib/quran-data";

export default function QuranSearchPage() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "surah" | "ayah" | "translation">("all");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    if (searchType === "surah") {
      return SURAH_LIST.filter(s =>
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(query) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number).includes(q)
      ).map(s => ({
        type: "surah" as const,
        surahNumber: s.number,
        ayahNumber: 0,
        surahName: s.name,
        englishName: s.englishName,
        text: s.englishNameTranslation,
        ayahs: s.numberOfAyahs,
      }));
    }

    const ayahResults = searchQuran(query);
    if (searchType === "translation") {
      return ayahResults.filter(a => a.translation.toLowerCase().includes(q)).map(a => ({
        type: "ayah" as const,
        surahNumber: a.surahNumber,
        ayahNumber: a.ayahNumber,
        surahName: a.surahName,
        englishName: a.surahEnglishName,
        text: a.translation,
        arabicText: a.arabicText,
      }));
    }

    const surahMatches = SURAH_LIST.filter(s =>
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(query)
    ).map(s => ({
      type: "surah" as const,
      surahNumber: s.number,
      ayahNumber: 0,
      surahName: s.name,
      englishName: s.englishName,
      text: s.englishNameTranslation,
      ayahs: s.numberOfAyahs,
    }));

    const ayahMatches = ayahResults.map(a => ({
      type: "ayah" as const,
      surahNumber: a.surahNumber,
      ayahNumber: a.ayahNumber,
      surahName: a.surahName,
      englishName: a.surahEnglishName,
      text: a.translation,
      arabicText: a.arabicText,
    }));

    return [...surahMatches, ...ayahMatches];
  }, [query, searchType]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/quran" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Search Quran</h1>
          <p className="text-gray-400 text-sm">Search by Surah name, Ayah text, or translation</p>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search the Quran..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition text-lg"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {([["all", "All"], ["surah", "Surah Names"], ["ayah", "Arabic Text"], ["translation", "Translations"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSearchType(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${searchType === key ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {query && (
        <p className="text-gray-500 text-sm">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
      )}

      <div className="space-y-3">
        {results.map((r, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/quran/surah/${r.surahNumber}`} className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition">
                {r.englishName} {r.type === "ayah" && `- Ayah ${r.ayahNumber}`}
              </Link>
              <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === "surah" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                {r.type === "surah" ? `Surah ${r.surahNumber}` : `Ayah ${r.ayahNumber}`}
              </span>
            </div>
            {"arabicText" in r && r.arabicText && (
              <p className="text-right text-lg mb-2 leading-loose" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                {r.arabicText}
              </p>
            )}
            <p className="text-gray-400 text-sm">{r.text}</p>
          </div>
        ))}
      </div>

      {!query && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">Search the Holy Quran</p>
          <p className="text-gray-500 text-sm">Search by Surah name, Arabic text, or translation keywords</p>
        </div>
      )}
    </div>
  );
}
