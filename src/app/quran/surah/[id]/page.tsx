"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SURAH_LIST, RECITERS, getSurahByNumber, getAyahAudioUrl } from "@/lib/quran-data";
import { useAuth } from "@/contexts/AuthContext";

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  translation?: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export default function SurahPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const surahNum = Number(params.id);
  const surahInfo = getSurahByNumber(surahNum);

  const [data, setData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"both" | "arabic" | "translation">("both");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [reciter, setReciter] = useState("ar.yasseraldossari");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [fontSize, setFontSize] = useState(28);

  const fetchSurah = useCallback(async () => {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih`);
      const json = await res.json();
      if (json.code === 200) {
        const arabic = json.data[0];
        const english = json.data[1];
        setData({
          number: arabic.number,
          name: arabic.name,
          englishName: arabic.englishName,
          englishNameTranslation: arabic.englishNameTranslation,
          numberOfAyahs: arabic.numberOfAyahs,
          revelationType: arabic.revelationType,
          ayahs: arabic.ayahs.map((a: Ayah, i: number) => ({
            number: a.number,
            text: a.text,
            numberInSurah: a.numberInSurah,
            juz: a.juz,
            page: a.page,
            translation: english.ayahs[i]?.text || "",
          })),
        });
      }
    } catch {
      setData(null);
    }
    setLoading(false);
  }, [surahNum]);

  useEffect(() => { fetchSurah(); }, [fetchSurah]);

  useEffect(() => {
    if (playingAyah !== null) {
      const el = document.getElementById(`ayah-${playingAyah}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingAyah]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/bookmarks", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const set = new Set<string>();
        (d.bookmarks || []).forEach((b: { surahNumber: number; ayahNumber: number }) => set.add(`${b.surahNumber}:${b.ayahNumber}`));
        setBookmarks(set);
      });
  }, [token]);

  const playAyah = (ayahNumber: number) => {
    if (audio) { audio.pause(); setAudio(null); setPlayingAyah(null); }
    const a = new Audio(getAyahAudioUrl(surahNum, ayahNumber, reciter));
    a.play().catch(() => {});
    setAudio(a);
    setPlayingAyah(ayahNumber);
    a.onended = () => { setPlayingAyah(null); setAudio(null); };
  };

  const stopAudio = () => { if (audio) { audio.pause(); setAudio(null); setPlayingAyah(null); } };

  const toggleBookmark = async (ayah: Ayah) => {
    if (!token) return;
    const key = `${surahNum}:${ayah.numberInSurah}`;
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        surahNumber: surahNum,
        ayahNumber:ayah.numberInSurah,
        surahName: surahInfo?.englishName || "",
        arabicText: ayah.text,
        translation: (data?.ayahs.find(a => a.numberInSurah === ayah.numberInSurah) as Ayah & { translation?: string })?.translation || "",
      }),
    });
    const d = await res.json();
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (d.bookmarked) next.add(key); else next.delete(key);
      return next;
    });
  };

  const prevSurah = surahNum > 1 ? surahNum - 1 : null;
  const nextSurah = surahNum < 114 ? surahNum + 1 : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Surah...</p>
        </div>
      </div>
    );
  }

  if (!data || !surahInfo) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Surah not found</p>
        <Link href="/quran" className="text-emerald-400 hover:text-emerald-300">Back to Quran</Link>
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
          <h1 className="text-2xl font-bold text-white">{data.englishName}</h1>
          <p className="text-gray-400 text-sm">{data.englishNameTranslation} &middot; {data.numberOfAyahs} Ayahs &middot; {data.revelationType}</p>
        </div>
        <p className="text-2xl text-emerald-400/80" dir="rtl">{data.name}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {(["both", "arabic", "translation"] as const).map((m) => (
              <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === m ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                {m === "both" ? "Both" : m === "arabic" ? "Arabic" : "Translation"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(s => Math.max(18, s - 2))} className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center text-sm">A-</button>
            <span className="text-xs text-gray-500">{fontSize}px</span>
            <button onClick={() => setFontSize(s => Math.min(48, s + 2))} className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center text-lg">A+</button>
          </div>
          <div className="relative">
            <select value={reciter} onChange={(e) => setReciter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none appearance-none pr-6">
              {RECITERS.filter(r => !r.id.startsWith("en.")).map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-2xl">
        <p className="text-3xl text-emerald-400/80 mb-2" dir="rtl">{data.name}</p>
        <p className="text-gray-500 text-sm">{data.englishName} &middot; {data.englishNameTranslation}</p>
      </div>

      <div className="space-y-1">
        {data.ayahs.map((ayah) => {
          const isBookmarked = bookmarks.has(`${surahNum}:${ayah.numberInSurah}`);
          const isPlaying = playingAyah === ayah.numberInSurah;
          return (
            <div id={`ayah-${ayah.numberInSurah}`} key={ayah.numberInSurah} className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 transition ${isPlaying ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-gray-700"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isPlaying ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-400"}`}>
                    {ayah.numberInSurah}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => isPlaying ? stopAudio() : playAyah(ayah.numberInSurah)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${isPlaying ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>
                  <button onClick={() => toggleBookmark(ayah)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${isBookmarked ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {isBookmarked ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                    )}
                  </button>
                  <Link href={`/quran/reflect/${surahNum}/${ayah.numberInSurah}`} className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                  </Link>
                </div>
              </div>
              {(viewMode === "both" || viewMode === "arabic") && (
                <p className="text-right leading-loose mb-3" dir="rtl" style={{ fontSize: `${fontSize}px`, fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                  {ayah.text}
                </p>
              )}
              {(viewMode === "both" || viewMode === "translation") && ayah.translation && (
                <p className="text-gray-400 text-sm leading-relaxed">{ayah.translation}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4">
        {prevSurah ? (
          <Link href={`/quran/surah/${prevSurah}`} className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:border-gray-700 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <div className="text-left">
              <p className="text-xs text-gray-500">Previous</p>
              <p className="text-sm font-medium">{SURAH_LIST[prevSurah - 1]?.englishName}</p>
            </div>
          </Link>
        ) : <div />}
        {nextSurah ? (
          <Link href={`/quran/surah/${nextSurah}`} className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:border-gray-700 transition">
            <div className="text-right">
              <p className="text-xs text-gray-500">Next</p>
              <p className="text-sm font-medium">{SURAH_LIST[nextSurah - 1]?.englishName}</p>
            </div>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
