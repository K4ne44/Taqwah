"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MotivationItem {
  _id: string;
  type: "verse" | "hadith" | "reminder" | "goal" | "dream";
  content: string;
  source: string;
}

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
}

const TYPE_CONFIG: Record<string, { label: string; color: string; badge: string; border: string; bg: string }> = {
  verse: { label: "Verse", color: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  hadith: { label: "Hadith", color: "text-blue-400", badge: "bg-blue-500/20 text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  reminder: { label: "Reminder", color: "text-amber-400", badge: "bg-amber-500/20 text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5" },
  goal: { label: "Goal", color: "text-purple-400", badge: "bg-purple-500/20 text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/5" },
  dream: { label: "Dream", color: "text-pink-400", badge: "bg-pink-500/20 text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/5" },
};

const DEFAULT_SUGGESTIONS: { type: MotivationItem["type"]; content: string; source: string }[] = [
  { type: "verse", content: "Verily, with hardship comes ease.", source: "Quran 94:6" },
  { type: "hadith", content: "The best of people are those who are most beneficial to others.", source: "Prophet Muhammad \uFDFA" },
  { type: "hadith", content: "Take matters easy, and do not be harsh, for there is no comfort in harshness.", source: "Prophet Muhammad \uFDFA" },
  { type: "reminder", content: "I will memorize one surah this month.", source: "" },
];

export default function MotivationPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MotivationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "verse" as MotivationItem["type"],
    content: "",
    source: "",
  });

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/motivation", token).then((data) => {
      setItems(data.items || []);
      setLoading(false);
    });
  }, [token]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.content.trim()) return;
    const res = await fetch("/api/motivation", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setItems((prev) => [data.item, ...prev]);
    setForm({ type: "verse", content: "", source: "" });
    setShowForm(false);
  };

  const deleteItem = async (id: string) => {
    if (!token) return;
    await fetch(`/api/motivation?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const addSuggestion = async (suggestion: (typeof DEFAULT_SUGGESTIONS)[number]) => {
    if (!token) return;
    const res = await fetch("/api/motivation", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(suggestion),
    });
    const data = await res.json();
    setItems((prev) => [data.item, ...prev]);
  };

  const existingContents = new Set(items.map((i) => i.content));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Motivation Board</h1>
          <p className="text-gray-400 text-sm mt-1">Collect what inspires you to stay strong.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addItem} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Type</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TYPE_CONFIG) as MotivationItem["type"][]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    form.type === t
                      ? `${TYPE_CONFIG[t].badge} ${TYPE_CONFIG[t].border}`
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={3}
              placeholder="Write or paste your motivation here..."
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Source</label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="e.g. Quran 2:286, Prophet Muhammad \uFDFA"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
          >
            Save
          </button>
        </form>
      )}

      {DEFAULT_SUGGESTIONS.some((s) => !existingContents.has(s.content)) && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Suggested for you</h3>
          <div className="space-y-2">
            {DEFAULT_SUGGESTIONS.filter((s) => !existingContents.has(s.content)).map((suggestion, idx) => {
              const cfg = TYPE_CONFIG[suggestion.type];
              return (
                <div key={idx} className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 truncate">&ldquo;{suggestion.content}&rdquo;</p>
                    {suggestion.source && <p className="text-xs text-gray-500 mt-0.5">{suggestion.source}</p>}
                  </div>
                  <button
                    onClick={() => addSuggestion(suggestion)}
                    className="shrink-0 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition border border-gray-700"
                  >
                    + Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          Loading your board...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          Your board is empty. Add some motivation above!
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((item) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.reminder;
            return (
              <div key={item._id} className={`break-inside-avoid border rounded-2xl p-5 transition ${cfg.border} ${cfg.bg} relative group`}>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-gray-800/80 hover:bg-red-500/20 text-gray-500 hover:text-red-400 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide mb-3 ${cfg.badge}`}>
                  {cfg.label}
                </span>
                <p className="text-sm text-gray-200 leading-relaxed italic">&ldquo;{item.content}&rdquo;</p>
                {item.source && (
                  <p className="text-xs text-gray-500 mt-2">— {item.source}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
