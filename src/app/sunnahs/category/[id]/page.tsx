"use client";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_SUNNAHS, SUNNAH_CATEGORIES } from "@/lib/sunnah-data";

const apiFetch = async (url: string, token: string | null, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  return res.json();
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  missed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-400",
  medium: "bg-amber-500/10 text-amber-400",
  hard: "bg-red-500/10 text-red-400",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
};

export default function SunnahCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const categoryId = params.id as string;

  const [progress, setProgress] = useState<Record<string, string>>({});
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [freqFilter, setFreqFilter] = useState<string>("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const category = SUNNAH_CATEGORIES.find((c) => c.id === categoryId);
  const categorySunnahs = useMemo(() => ALL_SUNNAHS.filter((s) => s.category === categoryId), [categoryId]);

  const filteredSunnahs = useMemo(() => {
    return categorySunnahs.filter((s) => {
      if (diffFilter !== "all" && s.difficulty !== diffFilter) return false;
      if (freqFilter !== "all" && s.frequency !== freqFilter) return false;
      return true;
    });
  }, [categorySunnahs, diffFilter, freqFilter]);

  const completedCount = categorySunnahs.filter((s) => progress[s.id] === "completed").length;

  const updateStatus = async (sunnahId: string, status: string) => {
    if (!token || savingId) return;
    setSavingId(sunnahId);
    setProgress((p) => ({ ...p, [sunnahId]: status }));
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await apiFetch("/api/sunnahs/progress", token, {
      method: "POST",
      body: JSON.stringify({ sunnahId, status, date: dateStr }),
    });
    setSavingId(null);
  };

  const colors = category ? CATEGORY_COLORS[category.color] || CATEGORY_COLORS.emerald : CATEGORY_COLORS.emerald;

  if (!category) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-gray-400 text-lg mb-4">Category not found</p>
        <button onClick={() => router.push("/sunnahs")} className="text-emerald-400 hover:text-emerald-300">Back to Sunnahs</button>
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
          <div className="flex items-center gap-2">
            <span className="text-xl">{category.icon}</span>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">{category.description}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-emerald-400">{completedCount}/{categorySunnahs.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${categorySunnahs.length > 0 ? (completedCount / categorySunnahs.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <span className="text-xs text-gray-500 self-center mr-1 flex-shrink-0">Difficulty:</span>
        {["all", "easy", "medium", "hard"].map((d) => (
          <button key={d} onClick={() => setDiffFilter(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 capitalize ${diffFilter === d ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <span className="text-xs text-gray-500 self-center mr-1 flex-shrink-0">Frequency:</span>
        {["all", "daily", "weekly", "occasional"].map((f) => (
          <button key={f} onClick={() => setFreqFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 capitalize ${freqFilter === f ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredSunnahs.map((sunnah) => {
          const status = progress[sunnah.id];
          return (
            <div key={sunnah.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-medium text-white">{sunnah.title}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[sunnah.difficulty]}`}>{sunnah.difficulty}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 capitalize">{sunnah.frequency}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{sunnah.description}</p>
                  <p className="text-xs text-gray-600 mt-2">{sunnah.source}</p>
                  {sunnah.steps && sunnah.steps.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {sunnah.steps.map((step, i) => (
                        <p key={i} className="text-xs text-gray-500 flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">{i + 1}.</span>
                          <span>{step}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {[
                    { key: "completed", icon: "✅", label: "Completed" },
                    { key: "in-progress", icon: "⏳", label: "In Progress" },
                    { key: "missed", icon: "❌", label: "Missed" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => updateStatus(sunnah.id, s.key)}
                      disabled={savingId === sunnah.id}
                      title={s.label}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border transition ${
                        status === s.key
                          ? STATUS_COLORS[s.key]
                          : "bg-gray-800 border-gray-700 text-gray-500 hover:text-white hover:border-gray-600"
                      } ${savingId === sunnah.id ? "opacity-50" : ""}`}
                    >
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {filteredSunnahs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No sunnahs match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
