"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Goal {
  _id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
}

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
}

const VERSES = [
  { text: "Verily, with hardship comes ease.", ref: "Quran 94:6" },
  { text: "And whoever puts their trust in Allah, then He is sufficient for them.", ref: "Quran 65:3" },
  { text: "Allah does not burden a soul beyond that it can bear.", ref: "Quran 2:286" },
  { text: "So remember Me; I will remember you.", ref: "Quran 2:152" },
  { text: "Indeed, the patient will be given their reward without account.", ref: "Quran 39:10" },
];

const BREATHING_PHASES = ["Breathe in...", "Hold...", "Breathe out...", "Hold..."];

export default function EmergencyPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState(0);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathActive, setBreathActive] = useState(false);
  const [whyText, setWhyText] = useState("");

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/goals", token).then((data) => setGoals(data.goals || []));
    apiFetch("/api/analytics", token).then((data) => setStreak(data.currentStreak || 0));
  }, [token]);

  useEffect(() => {
    if (!breathActive) return;
    const durations = [4000, 4000, 6000, 2000];
    const timer = setTimeout(() => {
      setBreathPhase((prev) => (prev + 1) % 4);
    }, durations[breathPhase]);
    return () => clearTimeout(timer);
  }, [breathActive, breathPhase]);

  const activeGoals = goals.filter((g) => !g.completed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f2d] to-[#0a2a1f] -mx-6 -my-6 px-6 py-10 space-y-12">
      <div className="max-w-2xl mx-auto text-center space-y-4 pt-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Take a deep breath.
        </h1>
        <p className="text-xl text-emerald-300/80 font-medium">
          You are stronger than this moment.
        </p>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          This is a safe space. There is no judgment here. Take your time, read the words below, and remember why you started this journey.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-emerald-300 text-center">Words of Comfort</h2>
        <div className="grid gap-3">
          {VERSES.map((v, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center space-y-2">
              <p className="text-gray-200 italic leading-relaxed">&ldquo;{v.text}&rdquo;</p>
              <p className="text-emerald-400/70 text-xs font-medium">— {v.ref}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-emerald-300 text-center">Your Goals</h2>
        {activeGoals.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No active goals. You are working on yourself, and that matters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {activeGoals.slice(0, 4).map((goal) => {
              const pct = goal.target > 0 ? Math.min(Math.round((goal.progress / goal.target) * 100), 100) : 0;
              return (
                <div key={goal._id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-2">
                  <p className="text-sm text-white font-medium">{goal.title}</p>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500">{goal.progress}/{goal.target} {goal.unit} — {pct}%</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center space-y-3">
        <h2 className="text-lg font-semibold text-emerald-300">Your Streak</h2>
        <p className="text-4xl font-bold text-white">{streak}</p>
        <p className="text-sm text-gray-400">
          {streak > 0
            ? `You've stayed strong for ${streak} day${streak === 1 ? "" : "s"}. Don't let this moment define you.`
            : "Every new day is a chance to start fresh. Today can be day one."}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-emerald-300 text-center">Remember Why You Started</h2>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-3">
          <p className="text-gray-300 text-sm text-center">
            What made you decide to change? Write it down and keep it close.
          </p>
          <textarea
            value={whyText}
            onChange={(e) => setWhyText(e.target.value)}
            rows={3}
            placeholder="I started this journey because..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none text-center"
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-emerald-300 text-center">Breathing Exercise</h2>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center space-y-6">
          <button
            onClick={() => {
              setBreathActive(!breathActive);
              setBreathPhase(0);
            }}
            className="relative w-40 h-40 flex items-center justify-center"
          >
            <div
              className={`absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/30 transition-all duration-[4000ms] ease-in-out ${
                breathActive
                  ? breathPhase === 0
                    ? "scale-125 opacity-80"
                    : breathPhase === 1
                    ? "scale-125 opacity-80"
                    : breathPhase === 2
                    ? "scale-75 opacity-40"
                    : "scale-75 opacity-40"
                  : "scale-100 opacity-60"
              }`}
            />
            <span className="relative z-10 text-emerald-300 text-sm font-medium text-center px-4">
              {breathActive ? BREATHING_PHASES[breathPhase] : "Tap to start"}
            </span>
          </button>
          {breathActive && (
            <p className="text-xs text-gray-500 text-center">
              Follow the circle. 4 seconds in, 4 seconds hold, 6 seconds out, 2 seconds hold.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center pt-4 pb-8 space-y-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl text-sm transition-colors"
        >
          I feel better now
        </button>
        <p className="text-gray-600 text-xs">
          You came here for strength. That itself is a sign of strength.
        </p>
      </div>
    </div>
  );
}
