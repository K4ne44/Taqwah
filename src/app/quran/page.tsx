"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
}

const TOTAL_PAGES = 604;

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

interface QuranRecord {
  date: string;
  pagesRead: number;
  ayatMemorized: number;
}

export default function QuranPage() {
  const { token } = useAuth();
  const todayStr = formatDate(new Date());

  const [records, setRecords] = useState<QuranRecord[]>([]);
  const [pagesInput, setPagesInput] = useState(0);
  const [ayatInput, setAyatInput] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    const data = await apiFetch("/api/quran", token);
    setRecords(data.records || []);
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const todayRecord = records.find(r => r.date === todayStr);
  const totalPages = records.reduce((sum, r) => sum + (r.pagesRead || 0), 0);
  const totalAyat = records.reduce((sum, r) => sum + (r.ayatMemorized || 0), 0);
  const overallPercent = Math.round((totalPages / TOTAL_PAGES) * 100);

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = formatDate(d);
    const rec = records.find(r => r.date === dStr);
    if (rec && rec.pagesRead > 0) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      break;
    }
  }

  const recentRecords = records.slice(0, 14);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    await fetch("/api/quran", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        date: todayStr,
        pagesRead: todayRecord ? todayRecord.pagesRead + pagesInput : pagesInput,
        ayatMemorized: todayRecord ? todayRecord.ayatMemorized + ayatInput : ayatInput,
      }),
    });
    setPagesInput(0);
    setAyatInput(0);
    await loadData();
    setSaving(false);
  };

  const handleReset = async () => {
    if (!token) return;
    setSaving(true);
    await fetch("/api/quran", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date: todayStr, pagesRead: 0, ayatMemorized: 0 }),
    });
    setPagesInput(0);
    setAyatInput(0);
    await loadData();
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Quran Tracking</h1>
        <p className="text-gray-400 text-sm mt-1">Track your daily reading and memorization</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Quran Completion</h3>
          <span className="text-2xl font-bold text-emerald-400">{overallPercent}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{totalPages} pages read</span>
          <span className="text-gray-400">{TOTAL_PAGES} total</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{totalPages}</p>
          <p className="text-sm text-gray-400 mt-1">Pages Read</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">{totalAyat}</p>
          <p className="text-sm text-gray-400 mt-1">Ayat Memorized</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-white">{streak}</p>
          <p className="text-sm text-gray-400 mt-1">Day Streak</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Today&apos;s Reading</h3>
        {todayRecord && (
          <p className="text-sm text-gray-400 mb-4">
            {todayRecord.pagesRead} pages &middot; {todayRecord.ayatMemorized} ayat recorded
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pages Read</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPagesInput(Math.max(0, pagesInput - 1))}
                className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xl font-bold flex items-center justify-center hover:bg-gray-700 transition active:scale-95"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                value={pagesInput}
                onChange={(e) => setPagesInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center text-white text-xl font-bold focus:outline-none focus:border-emerald-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setPagesInput(pagesInput + 1)}
                className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xl font-bold flex items-center justify-center hover:bg-gray-700 transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ayat Memorized</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAyatInput(Math.max(0, ayatInput - 1))}
                className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xl font-bold flex items-center justify-center hover:bg-gray-700 transition active:scale-95"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                value={ayatInput}
                onChange={(e) => setAyatInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center text-white text-xl font-bold focus:outline-none focus:border-emerald-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setAyatInput(ayatInput + 1)}
                className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xl font-bold flex items-center justify-center hover:bg-gray-700 transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || (pagesInput === 0 && ayatInput === 0)}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition active:scale-[0.98]"
            >
              {saving ? "Saving..." : "Save Reading"}
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:text-gray-500 text-gray-300 font-medium rounded-xl border border-gray-700 transition active:scale-[0.98]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {streak >= 3 && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl shrink-0">
            &#128293;
          </div>
          <div>
            <p className="text-emerald-400 font-semibold">{streak}-Day Reading Streak!</p>
            <p className="text-gray-400 text-sm">Keep the momentum going. Consistent reading builds understanding.</p>
          </div>
        </div>
      )}

      {recentRecords.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Entries</h3>
          <div className="space-y-2">
            {recentRecords.map((rec) => (
              <div key={rec.date} className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl">
                <div>
                  <p className="text-sm text-white font-medium">
                    {new Date(rec.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-emerald-400">{rec.pagesRead} pages</span>
                  <span className="text-amber-400">{rec.ayatMemorized} ayat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
