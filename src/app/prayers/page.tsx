"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
}

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getWeekStart(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

export default function PrayersPage() {
  const { token } = useAuth();
  const today = new Date();
  const todayStr = formatDate(today);
  const monthStr = todayStr.substring(0, 7);

  const [prayers, setPrayers] = useState<{ name: string; completed: boolean }[]>(PRAYER_NAMES.map(name => ({ name, completed: false })));
  const [monthData, setMonthData] = useState<Array<{ date: string; prayers: { name: string; completed: boolean }[] }>>([]);
  const [weekData, setWeekData] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const loadData = useCallback(async () => {
    if (!token) return;
    const data = await apiFetch(`/api/prayers?month=${monthStr}`, token);
    const records = data.prayers || [];
    setMonthData(records);
    const todayRecord = records.find((r: { date: string }) => r.date === todayStr);
    if (todayRecord) setPrayers(todayRecord.prayers);

    const weekStart = getWeekStart(today);
    const week: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = formatDate(addDays(weekStart, i));
      const rec = records.find((r: { date: string }) => r.date === d);
      const count = rec ? rec.prayers.filter((p: { completed: boolean }) => p.completed).length : 0;
      week[d] = count;
    }
    setWeekData(week);
  }, [token, monthStr, todayStr]);

  useEffect(() => { loadData(); }, [loadData]);

  const togglePrayer = async (index: number) => {
    const updated = prayers.map((p, i) => i === index ? { ...p, completed: !p.completed } : { ...p });
    setPrayers(updated);
    await fetch("/api/prayers", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date: todayStr, prayers: updated }),
    });
    loadData();
  };

  const totalDays = monthData.length;
  const totalCompleted = monthData.reduce((sum, r) => sum + r.prayers.filter(p => p.completed).length, 0);
  const totalPossible = totalDays * 5;
  const monthPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  const weekStart = getWeekStart(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayCompleted = prayers.filter(p => p.completed).length;

  const selectedRecord = monthData.find(r => r.date === selectedDate);
  const selectedPrayers = selectedRecord?.prayers || PRAYER_NAMES.map(name => ({ name, completed: false }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Prayer Tracking</h1>
        <p className="text-gray-400 text-sm mt-1">
          {today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{todayCompleted}/5</p>
          <p className="text-sm text-gray-400 mt-1">Today</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-white">{totalCompleted}</p>
          <p className="text-sm text-gray-400 mt-1">This Month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">{monthPercent}%</p>
          <p className="text-sm text-gray-400 mt-1">Completion</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Prayers</h3>
        <div className="space-y-3">
          {prayers.map((prayer, i) => (
            <button
              key={prayer.name}
              onClick={() => togglePrayer(i)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all active:scale-[0.98] text-base font-medium ${
                prayer.completed
                  ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40"
                  : "bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                  prayer.completed ? "bg-emerald-500/30" : "bg-gray-700"
                }`}>
                  {prayer.completed ? "✓" : "○"}
                </div>
                <span className="text-lg">{prayer.name}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${prayer.completed ? "bg-emerald-400" : "bg-gray-600"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dStr = formatDate(day);
            const count = weekData[dStr] || 0;
            const isToday = dStr === todayStr;
            const isSelected = dStr === selectedDate;
            return (
              <button
                key={dStr}
                onClick={() => setSelectedDate(dStr)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-emerald-500/20 border-2 border-emerald-500/40"
                    : isToday
                    ? "bg-gray-800 border-2 border-gray-600"
                    : "bg-gray-800/50 border-2 border-transparent hover:border-gray-700"
                }`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-emerald-400" : "text-gray-500"}`}>
                  {DAY_LABELS[day.getDay()]}
                </span>
                <span className={`text-lg font-bold ${count === 5 ? "text-emerald-400" : count > 0 ? "text-amber-400" : "text-gray-500"}`}>
                  {count}
                </span>
                <span className={`text-xs ${isToday ? "text-emerald-400" : "text-gray-500"}`}>
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
        {selectedDate !== todayStr && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-2">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {selectedPrayers.map((p) => (
                <div
                  key={p.name}
                  className={`text-center py-2 rounded-xl text-xs font-medium ${
                    p.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {p.name.substring(0, 3)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Progress</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{totalCompleted} of {totalPossible} prayers</span>
          <span className="text-sm font-medium text-emerald-400">{monthPercent}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${monthPercent}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {PRAYER_NAMES.map((name) => {
            const prayed = monthData.filter(r => r.prayers.find(p => p.name === name && p.completed)).length;
            const pct = totalDays > 0 ? Math.round((prayed / totalDays) * 100) : 0;
            return (
              <div key={name} className="text-center">
                <div className="h-24 bg-gray-800 rounded-xl relative overflow-hidden mb-1">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 rounded-xl transition-all duration-500"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{name.substring(0, 3)}</p>
                <p className="text-xs font-medium text-gray-300">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
