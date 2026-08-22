"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Goal {
  _id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  unit: string;
  targetDate: string;
  completed: boolean;
}

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());
}

export default function GoalsPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: 30,
    unit: "days",
    targetDate: "",
  });

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/goals", token).then((data) => {
      setGoals(data.goals || []);
      setLoading(false);
    });
  }, [token]);

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.title.trim()) return;
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, progress: 0, completed: false }),
    });
    const data = await res.json();
    setGoals((prev) => [data.goal, ...prev]);
    setForm({ title: "", description: "", target: 30, unit: "days", targetDate: "" });
    setShowForm(false);
  };

  const updateGoal = async (id: string, update: Partial<Goal>) => {
    if (!token) return;
    await fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...update }),
    });
    setGoals((prev) => prev.map((g) => (g._id === id ? { ...g, ...update } : g)));
  };

  const deleteGoal = async (id: string) => {
    if (!token) return;
    await fetch(`/api/goals?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals((prev) => prev.filter((g) => g._id !== id));
  };

  const incrementProgress = (goal: Goal) => {
    if (goal.completed) return;
    const newProgress = goal.progress + 1;
    const completed = newProgress >= goal.target;
    updateGoal(goal._id, { progress: newProgress, completed });
  };

  const markCompleted = (goal: Goal) => {
    updateGoal(goal._id, { completed: true, progress: goal.target });
  };

  const getGoalStatus = (goal: Goal) => {
    if (goal.completed) return "completed";
    if (goal.progress > 0) return "in-progress";
    return "not-started";
  };

  const statusStyles = {
    completed: "border-emerald-500/30 bg-emerald-500/5",
    "in-progress": "border-amber-500/30 bg-amber-500/5",
    "not-started": "border-gray-700 bg-gray-900",
  };

  const progressColors = {
    completed: "bg-emerald-500",
    "in-progress": "bg-amber-500",
    "not-started": "bg-gray-600",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Goals</h1>
          <p className="text-gray-400 text-sm mt-1">Set targets and track your progress.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition"
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addGoal} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Read 30 pages of Quran"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Target</label>
              <input
                type="number"
                min={1}
                value={form.target}
                onChange={(e) => setForm({ ...form, target: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Why is this goal important to you?"
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="days">days</option>
                <option value="pages">pages</option>
                <option value="sessions">sessions</option>
                <option value="times">times</option>
                <option value="minutes">minutes</option>
                <option value="reps">reps</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Target Date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
          >
            Create Goal
          </button>
        </form>
      )}

      {loading ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          Loading goals...
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
          No goals yet. Create your first goal to start tracking progress.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const status = getGoalStatus(goal);
            const pct = goal.target > 0 ? Math.min(Math.round((goal.progress / goal.target) * 100), 100) : 0;
            return (
              <div key={goal._id} className={`relative border rounded-2xl p-5 transition ${statusStyles[status]}`}>
                <button
                  onClick={() => deleteGoal(goal._id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-500 hover:text-red-400 flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
                <div className="space-y-3">
                  <div className="pr-8">
                    <h3 className={`font-semibold text-sm ${status === "completed" ? "text-emerald-400" : "text-white"}`}>
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{goal.description}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">
                        {goal.progress} / {goal.target} {goal.unit}
                      </span>
                      <span className={`text-xs font-semibold ${status === "completed" ? "text-emerald-400" : status === "in-progress" ? "text-amber-400" : "text-gray-500"}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`${progressColors[status]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {goal.targetDate && (
                    <p className="text-xs text-gray-500">
                      Target: {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                  {!goal.completed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => incrementProgress(goal)}
                        className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium transition border border-gray-700"
                      >
                        +1 {goal.unit}
                      </button>
                      <button
                        onClick={() => markCompleted(goal)}
                        className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium transition border border-emerald-500/30"
                      >
                        ✓ Done
                      </button>
                    </div>
                  )}
                  {goal.completed && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
