"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SURAH_LIST, RECITERS, getReciterUrl } from "@/lib/quran-data";

export default function QuranPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");
  const [audioSurah, setAudioSurah] = useState<number | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [reciter, setReciter] = useState("ar.yasseraldossari");
  const [showReciters, setShowReciters] = useState(false);

  const filtered = useMemo(() => {
    return SURAH_LIST.filter((s) => {
      if (filter === "meccan" && s.revelationType !== "Meccan") return false;
      if (filter === "medinan" && s.revelationType !== "Medinan") return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.englishName.toLowerCase().includes(q) ||
          s.name.includes(search) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          String(s.number).includes(q)
        );
      }
      return true;
    });
  }, [search, filter]);

  const totalAyahs = SURAH_LIST.reduce((sum, s) => sum + s.numberOfAyahs, 0);

  const playAudio = async (surahNumber: number) => {
    if (audioRef) {
      audioRef.pause();
      audioRef.src = "";
      setAudioRef(null);
      setAudioSurah(null);
    }
    try {
      const url = getReciterUrl(surahNumber, reciter);
      console.log("Playing surah audio:", url);
      const audio = new Audio(url);
      audio.onerror = (e) => console.error("Audio error:", e, audio.error);
      audio.onended = () => { setAudioSurah(null); setAudioRef(null); };
      await audio.play();
      setAudioRef(audio);
      setAudioSurah(surahNumber);
    } catch (err) {
      console.error("Failed to play surah:", err);
      setAudioSurah(null);
      setAudioRef(null);
    }
  };

  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause();
      setAudioRef(null);
      setAudioSurah(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quran</h1>
          <p className="text-gray-400 text-sm mt-1">{SURAH_LIST.length} Surahs &middot; {totalAyahs.toLocaleString()} Ayahs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/quran/search" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition">
            Search
          </Link>
          <Link href="/quran/bookmarks" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition">
            Bookmarks
          </Link>
          <Link href="/quran/memorize" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition">
            Memorize
          </Link>
          <Link href="/quran/reflections" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition">
            Reflections
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="relative">
            <button onClick={() => setShowReciters(!showReciters)} className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded-lg bg-gray-800/50">
              {RECITERS.find(r => r.id === reciter)?.name || "Select Reciter"}
            </button>
            {showReciters && (
              <div className="absolute right-0 top-8 z-20 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 w-64 max-h-60 overflow-y-auto">
                {RECITERS.map((r) => (
                  <button key={r.id} onClick={() => { setReciter(r.id); setShowReciters(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${reciter === r.id ? "bg-emerald-500/20 text-emerald-400" : "text-gray-300 hover:bg-gray-700"}`}>
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <Link href="/quran/surah/1" className="bg-gray-900/50 rounded-xl p-3 text-center hover:bg-gray-800 transition">
            <p className="text-emerald-400 font-semibold text-sm">Al-Fatihah</p>
            <p className="text-xs text-gray-500">Open</p>
          </Link>
          <Link href="/quran/surah/36" className="bg-gray-900/50 rounded-xl p-3 text-center hover:bg-gray-800 transition">
            <p className="text-amber-400 font-semibold text-sm">Ya-Sin</p>
            <p className="text-xs text-gray-500">Open</p>
          </Link>
          <Link href="/quran/surah/55" className="bg-gray-900/50 rounded-xl p-3 text-center hover:bg-gray-800 transition">
            <p className="text-emerald-400 font-semibold text-sm">Ar-Rahman</p>
            <p className="text-xs text-gray-500">Open</p>
          </Link>
          <Link href="/quran/surah/67" className="bg-gray-900/50 rounded-xl p-3 text-center hover:bg-gray-800 transition">
            <p className="text-amber-400 font-semibold text-sm">Al-Mulk</p>
            <p className="text-xs text-gray-500">Open</p>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search Surahs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "meccan", "medinan"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                filter === f ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {audioSurah && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Playing: {SURAH_LIST.find(s => s.number === audioSurah)?.englishName}</p>
              <p className="text-gray-400 text-xs">{RECITERS.find(r => r.id === reciter)?.name}</p>
            </div>
          </div>
          <button onClick={stopAudio} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/30 transition">
            Stop
          </button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((surah) => (
          <div key={surah.number} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition">
                <span className="text-gray-400 group-hover:text-emerald-400 font-bold text-sm transition">{surah.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/quran/surah/${surah.number}`} className="text-white font-semibold hover:text-emerald-400 transition">
                    {surah.englishName}
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${surah.revelationType === "Meccan" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {surah.revelationType}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{surah.englishNameTranslation} &middot; {surah.numberOfAyahs} Ayahs</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg text-emerald-400/80 font-arabic" dir="rtl">{surah.name}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => audioSurah === surah.number ? stopAudio() : playAudio(surah.number)} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-500/20 flex items-center justify-center transition" title="Play audio">
                  {audioSurah === surah.number ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No Surahs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
