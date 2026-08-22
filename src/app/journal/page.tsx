"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface JournalEntry {
  _id: string;
  date: string;
  wentWell: string;
  mistakes: string;
  triggers: string;
  improvement: string;
}

function apiFetch(url: string, token: string) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
}

export default function JournalPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    wentWell: "",
    mistakes: "",
    triggers: "",
    improvement: "",
  });

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/journal", token).then((data) => {
      setEntries(data.entries || []);
      setLoading(false);
    });
  }, [token]);

  const todayEntry = entries.find((e) => e.date === today);

  useEffect(() => {
    if (todayEntry && !editingId) {
      setForm({
        date: todayEntry.date,
        wentWell: todayEntry.wentWell,
        mistakes: todayEntry.mistakes,
        triggers: todayEntry.triggers,
        improvement: todayEntry.improvement,
      });
    }
  }, [todayEntry, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const saved = await res.json();
    const savedEntry = saved.entry;
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.date === savedEntry.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedEntry;
        return updated;
      }
      return [savedEntry, ...prev];
    });
    setEditingId(null);
    setForm({
      date: today,
      wentWell: "",
      mistakes: "",
      triggers: "",
      improvement: "",
    });
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry._id);
    setForm({
      date: entry.date,
      wentWell: entry.wentWell,
      mistakes: entry.mistakes,
      triggers: entry.triggers,
      improvement: entry.improvement,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Reflection Journal</h1>
          <p className="mt-1 text-gray-400">Reflect on your day to grow stronger tomorrow.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? "Edit Entry" : "Today's Reflection"}
            </h2>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-emerald-400">
              What went well today?
            </label>
            <textarea
              value={form.wentWell}
              onChange={(e) => setForm({ ...form, wentWell: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="List the good things that happened..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-red-400">
              What mistakes did I make?
            </label>
            <textarea
              value={form.mistakes}
              onChange={(e) => setForm({ ...form, mistakes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Be honest about where you fell short..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-amber-400">
              What triggered those mistakes?
            </label>
            <textarea
              value={form.triggers}
              onChange={(e) => setForm({ ...form, triggers: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Identify the triggers and root causes..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-400">
              How can I improve tomorrow?
            </label>
            <textarea
              value={form.improvement}
              onChange={(e) => setForm({ ...form, improvement: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Set actionable goals for tomorrow..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
            >
              {editingId ? "Update Entry" : "Save Entry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    date: today,
                    wentWell: "",
                    mistakes: "",
                    triggers: "",
                    improvement: "",
                  });
                }}
                className="rounded-xl border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Past Entries</h2>
          {loading ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-400">
              Loading entries...
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-400">
              No entries yet. Start reflecting today!
            </div>
          ) : (
            entries.map((entry) => (
              <button
                key={entry._id}
                onClick={() => handleEdit(entry)}
                className="w-full text-left rounded-2xl border border-gray-800 bg-gray-900 p-5 hover:border-emerald-700 transition-colors cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-400">{entry.date}</span>
                  {entry.date === today && (
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Today
                    </span>
                  )}
                </div>
                {entry.wentWell && (
                  <div>
                    <span className="text-xs font-medium text-emerald-400/80">Went well:</span>
                    <p className="mt-0.5 text-sm text-gray-300 line-clamp-2">{entry.wentWell}</p>
                  </div>
                )}
                {entry.mistakes && (
                  <div>
                    <span className="text-xs font-medium text-red-400/80">Mistakes:</span>
                    <p className="mt-0.5 text-sm text-gray-300 line-clamp-2">{entry.mistakes}</p>
                  </div>
                )}
                {entry.triggers && (
                  <div>
                    <span className="text-xs font-medium text-amber-400/80">Triggers:</span>
                    <p className="mt-0.5 text-sm text-gray-300 line-clamp-2">{entry.triggers}</p>
                  </div>
                )}
                {entry.improvement && (
                  <div>
                    <span className="text-xs font-medium text-blue-400/80">Improvement:</span>
                    <p className="mt-0.5 text-sm text-gray-300 line-clamp-2">{entry.improvement}</p>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
