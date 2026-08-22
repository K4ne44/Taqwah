"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
}

interface Checkin {
  date: string;
  sinsAvoided: boolean;
  goodHabitsCompleted: boolean;
  triggers: string[];
}

const TRIGGER_OPTIONS = [
  "Boredom", "Loneliness", "Stress", "Social Media",
  "Friends", "Anger", "Night Time", "Lack of Sleep", "Other",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function getStatusColor(status: string) {
  if (status === "success") return "bg-emerald-500 text-white";
  if (status === "partial") return "bg-amber-500 text-white";
  if (status === "failed") return "bg-red-500 text-white";
  return "bg-gray-800 text-gray-500";
}

function getStatusLabel(status: string) {
  if (status === "success") return "Full Success";
  if (status === "partial") return "Partial Success";
  if (status === "failed") return "Needs Improvement";
  return "No Data";
}

function getStatusDescription(status: string) {
  if (status === "success") return "You avoided sins and completed good habits. Amazing!";
  if (status === "partial") return "You made progress but there is room to improve.";
  if (status === "failed") return "Tough day, but tomorrow is a new opportunity.";
  return "No check-in recorded for this day.";
}

export default function CalendarPage() {
  const { token } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [checkins, setCheckins] = useState<Record<string, Checkin>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [sinsAvoided, setSinsAvoided] = useState<boolean | null>(null);
  const [goodHabitsCompleted, setGoodHabitsCompleted] = useState<boolean | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/api/checkins?month=${monthKey}`, token).then((data) => {
      const map: Record<string, Checkin> = {};
      (data.checkins || []).forEach((c: Checkin) => {
        map[c.date] = c;
      });
      setCheckins(map);
    });
  }, [token, monthKey]);

  const getDayStatus = (dateKey: string): string => {
    const c = checkins[dateKey];
    if (!c) return "none";
    if (c.sinsAvoided && c.goodHabitsCompleted) return "success";
    if (c.sinsAvoided || c.goodHabitsCompleted) return "partial";
    return "failed";
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateKey = formatDateKey(year, month, day);
    setSelectedDate(dateKey);
    const existing = checkins[dateKey];
    if (existing) {
      setSinsAvoided(existing.sinsAvoided);
      setGoodHabitsCompleted(existing.goodHabitsCompleted);
      setSelectedTriggers(existing.triggers || []);
    } else {
      setSinsAvoided(null);
      setGoodHabitsCompleted(null);
      setSelectedTriggers([]);
    }
    setModalOpen(true);
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const saveCheckin = async () => {
    if (!token || !selectedDate || sinsAvoided === null || goodHabitsCompleted === null) return;
    setSaving(true);
    await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        date: selectedDate,
        sinsAvoided,
        goodHabitsCompleted,
        triggers: sinsAvoided ? [] : selectedTriggers,
      }),
    });
    const updatedCheckin: Checkin = {
      date: selectedDate,
      sinsAvoided,
      goodHabitsCompleted,
      triggers: sinsAvoided ? [] : selectedTriggers,
    };
    setCheckins((prev) => ({ ...prev, [selectedDate]: updatedCheckin }));
    setSaving(false);
    setModalOpen(false);
  };

  const monthName = new Date(year, month).toLocaleString("en-US", { month: "long", year: "numeric" });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const selectedCheckin = selectedDate ? checkins[selectedDate] : null;
  const selectedStatus = selectedDate ? getDayStatus(selectedDate) : "none";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Accountability Calendar</h1>
        <p className="text-gray-400 text-sm mt-1">Track your daily progress and build consistency</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-white">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const dateKey = formatDateKey(year, month, day);
            const status = getDayStatus(dateKey);
            const isToday = dateKey === formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
            const isSelected = dateKey === selectedDate;

            return (
              <button
                key={dateKey}
                onClick={() => handleDayClick(day)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition text-sm font-medium ${
                  isSelected
                    ? "ring-2 ring-emerald-400 bg-gray-800"
                    : isToday
                    ? "ring-1 ring-emerald-500/50 bg-gray-800/50"
                    : "hover:bg-gray-800/50"
                }`}
              >
                <span className={`text-xs ${isToday ? "text-emerald-400 font-bold" : "text-gray-300"}`}>{day}</span>
                <div className={`w-2 h-2 rounded-full mt-1 ${getStatusColor(status)}`} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500">Success</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-500">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs text-gray-500">Failed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
            <span className="text-xs text-gray-500">No Data</span>
          </div>
        </div>
      </div>

      {selectedDate && !modalOpen && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </h3>
              <p className={`text-sm mt-1 font-medium ${
                selectedStatus === "success" ? "text-emerald-400" :
                selectedStatus === "partial" ? "text-amber-400" :
                selectedStatus === "failed" ? "text-red-400" : "text-gray-500"
              }`}>
                {getStatusLabel(selectedStatus)}
              </p>
            </div>
            <button
              onClick={() => handleDayClick(new Date(selectedDate + "T12:00:00").getDate())}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition"
            >
              {selectedCheckin ? "Edit" : "Check In"}
            </button>
          </div>
          <p className="text-gray-400 text-sm">{getStatusDescription(selectedStatus)}</p>
          {selectedCheckin && selectedCheckin.triggers && selectedCheckin.triggers.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Triggers reported:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCheckin.triggers.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-gray-300 text-sm font-medium mb-3">Did you avoid sins today?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setSinsAvoided(true); setSelectedTriggers([]); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                      sinsAvoided === true
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setSinsAvoided(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                      sinsAvoided === false
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {sinsAvoided === false && (
                <div className="animate-fade-in">
                  <p className="text-gray-300 text-sm font-medium mb-3">What triggered you?</p>
                  <div className="flex flex-wrap gap-2">
                    {TRIGGER_OPTIONS.map((trigger) => (
                      <button
                        key={trigger}
                        onClick={() => toggleTrigger(trigger)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          selectedTriggers.includes(trigger)
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-300 text-sm font-medium mb-3">Did you complete good habits?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGoodHabitsCompleted(true)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                      goodHabitsCompleted === true
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setGoodHabitsCompleted(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                      goodHabitsCompleted === false
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={saveCheckin}
              disabled={sinsAvoided === null || goodHabitsCompleted === null || saving}
              className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl text-sm font-medium transition"
            >
              {saving ? "Saving..." : selectedCheckin ? "Update Check-In" : "Save Check-In"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
