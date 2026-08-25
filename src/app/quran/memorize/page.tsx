"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SURAH_LIST } from "@/lib/quran-data";

interface MemorizationRecord {
  surahNumber: number;
  ayahNumber: number;
  status: "not_started" | "memorizing" | "memorized" | "needs_revision";
}

const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-gray-800 text-gray-400",
  memorizing: "bg-amber-500/20 text-amber-400",
  memorized: "bg-emerald-500/20 text-emerald-400",
  needs_revision: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  memorizing: "Memorizing",
  memorized: "Memorized",
  needs_revision: "Needs Revision",
};

export default function MemorizePage() {
  const { token } = useAuth();
  const [records, setRecords] = useState<MemorizationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadRecords = useCallback(async () => {
    if (!token) return;
    const url = selectedSurah ? `/api/memorization?surah=${selectedSurah}` : "/api/memorization";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setRecords(data.records || []);
    setLoading(false);
  }, [token, selectedSurah]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const updateStatus = async (surahNumber: number, ayahNumber: number, status: string) => {
    if (!token) return;
    await fetch("/api/memorization", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ surahNumber, ayahNumber, status }),
    });
    setRecords((prev) => {
      const existing = prev.find((r) => r.surahNumber === surahNumber && r.ayahNumber === ayahNumber);
      if (existing) return prev.map((r) => r.surahNumber === surahNumber && r.ayahNumber === ayahNumber ? { ...r, status: status as MemorizationRecord["status"] } : r);
      return [...prev, { surahNumber, ayahNumber, status: status as MemorizationRecord["status"] }];
    });
  };

  const stats = {
    total: records.length,
    memorized: records.filter((r) => r.status === "memorized").length,
    memorizing: records.filter((r) => r.status === "memorizing").length,
    needsRevision: records.filter((r) => r.status === "needs_revision").length,
  };

  const filteredSurahs = selectedSurah
    ? SURAH_LIST.filter((s) => s.number === selectedSurah)
    : SURAH_LIST;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/quran" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Memorization Tracker</h1>
          <p className="text-gray-400 text-sm">Track your Quran memorization journey</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-1">Total Tracked</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.memorized}</p>
          <p className="text-xs text-gray-400 mt-1">Memorized</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.memorizing}</p>
          <p className="text-xs text-gray-400 mt-1">In Progress</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{stats.needsRevision}</p>
          <p className="text-xs text-gray-400 mt-1">Needs Review</p>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Memorization Progress</span>
            <span>{stats.total > 0 ? Math.round((stats.memorized / stats.total) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.memorized / stats.total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedSurah(null)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!selectedSurah ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}>
          All Surahs
        </button>
        {SURAH_LIST.slice(0, 15).map((s) => (
          <button key={s.number} onClick={() => setSelectedSurah(s.number)} className={`px-3 py-2 rounded-xl text-sm font-medium transition ${selectedSurah === s.number ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}>
            {s.number}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "memorized", "memorizing", "needs_revision", "not_started"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter === s ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`}>
            {s === "all" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSurahs.map((surah) => {
            const surahRecords = records.filter((r) => r.surahNumber === surah.number);
            const filteredRecords = statusFilter === "all" ? surahRecords : surahRecords.filter((r) => r.status === statusFilter);
            const memorized = surahRecords.filter((r) => r.status === "memorized").length;
            const progress = surah.numberOfAyahs > 0 ? Math.round((memorized / surah.numberOfAyahs) * 100) : 0;

            return (
              <div key={surah.number} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 font-bold text-sm">{surah.number}</span>
                    </div>
                    <div>
                      <Link href={`/quran/surah/${surah.number}`} className="text-white font-semibold hover:text-emerald-400 transition text-sm">{surah.englishName}</Link>
                      <p className="text-xs text-gray-500">{surah.numberOfAyahs} Ayahs &middot; {progress}% memorized</p>
                    </div>
                  </div>
                  <span className="text-lg text-emerald-400/80" dir="rtl">{surah.name}</span>
                </div>

                {progress > 0 && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: Math.min(surah.numberOfAyahs, 10) }, (_, i) => {
                    const ayahNum = i + 1;
                    const record = surahRecords.find((r) => r.ayahNumber === ayahNum);
                    const status = record?.status || "not_started";
                    return (
                      <button
                        key={ayahNum}
                        onClick={() => updateStatus(surah.number, ayahNum, status === "memorized" ? "not_started" : status === "not_started" ? "memorizing" : status === "memorizing" ? "memorized" : "memorizing")}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${STATUS_COLORS[status]} hover:opacity-80`}
                        title={`Ayah ${ayahNum}: ${STATUS_LABELS[status]}`}
                      >
                        {ayahNum}
                      </button>
                    );
                  })}
                  {surah.numberOfAyahs > 10 && <span className="w-8 h-8 rounded-lg bg-gray-800 text-gray-500 flex items-center justify-center text-xs">+{surah.numberOfAyahs - 10}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
