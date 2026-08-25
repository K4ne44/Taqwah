"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ReflectPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const surahNum = Number(params.surah);
  const ayahNum = Number(params.ayah);

  const [arabicText, setArabicText] = useState("");
  const [translation, setTranslation] = useState("");
  const [surahName, setSurahName] = useState("");
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAyah = useCallback(async () => {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih`);
      const json = await res.json();
      if (json.code === 200) {
        const arabic = json.data[0];
        const english = json.data[1];
        const ayah = arabic.ayahs.find((a: { numberInSurah: number }) => a.numberInSurah === ayahNum);
        const engAyah = english.ayahs.find((a: { numberInSurah: number }) => a.numberInSurah === ayahNum);
        setArabicText(ayah?.text || "");
        setTranslation(engAyah?.text || "");
        setSurahName(arabic.englishName);
      }
    } catch { /* empty */ }
    setLoading(false);
  }, [surahNum, ayahNum]);

  useEffect(() => { fetchAyah(); }, [fetchAyah]);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/reflections?surah=${surahNum}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const existing = (d.reflections || []).find((r: { ayahNumber: number }) => r.ayahNumber === ayahNum);
        if (existing) setReflection(existing.reflection);
      });
  }, [token, surahNum, ayahNum]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    await fetch("/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ surahNumber: surahNum, ayahNumber: ayahNum, surahName, arabicText, translation, reflection }),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Reflect on Ayah</h1>
          <p className="text-gray-400 text-sm">{surahName} - Ayah {ayahNum}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            {arabicText && (
              <p className="text-right text-2xl mb-4 leading-loose text-emerald-400" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
                {arabicText}
              </p>
            )}
            {translation && <p className="text-gray-400 text-sm italic leading-relaxed">&ldquo;{translation}&rdquo;</p>}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">My Reflection</h3>
            <p className="text-gray-500 text-xs mb-4">What does this Ayah mean to you? How can you apply it in your life?</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your personal reflection here..."
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition resize-none text-sm leading-relaxed"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !reflection.trim()}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition active:scale-[0.98]"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Reflection"}
            </button>
            <Link href={`/quran/surah/${surahNum}`} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl border border-gray-700 transition">
              View Surah
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
