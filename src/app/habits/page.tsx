"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function apiFetch(url: string, token: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
}

interface Habit {
  _id: string;
  name: string;
  type: "avoid" | "good";
  category: string;
  active: boolean;
}

const DEFAULT_AVOID: Omit<Habit, "_id" | "active">[] = [
  { name: "Watching inappropriate content", type: "avoid", category: "Eyes" },
  { name: "Lying", type: "avoid", category: "Tongue" },
  { name: "Gossiping", type: "avoid", category: "Tongue" },
  { name: "Wasting time", type: "avoid", category: "Time" },
  { name: "Missing prayers", type: "avoid", category: "Worship" },
  { name: "Social media addiction", type: "avoid", category: "Time" },
];

const DEFAULT_GOOD: Omit<Habit, "_id" | "active">[] = [
  { name: "Praying all prayers", type: "good", category: "Worship" },
  { name: "Reading Quran", type: "good", category: "Worship" },
  { name: "Dhikr", type: "good", category: "Worship" },
  { name: "Exercise", type: "good", category: "Health" },
  { name: "Studying", type: "good", category: "Knowledge" },
  { name: "Helping parents", type: "good", category: "Family" },
];

export default function HabitsPage() {
  const { token } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"avoid" | "good">("avoid");
  const [formCategory, setFormCategory] = useState("");
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/habits", token).then((data) => {
      const list: Habit[] = data.habits || [];
      setHabits(list);
      if (list.length === 0 && !defaultsLoaded) {
        seedDefaults();
      }
      setDefaultsLoaded(true);
    });
  }, [token, defaultsLoaded]);

  const seedDefaults = async () => {
    if (!token) return;
    const all = [
      ...DEFAULT_AVOID.map((h) => ({ ...h, active: true })),
      ...DEFAULT_GOOD.map((h) => ({ ...h, active: true })),
    ];
    for (const habit of all) {
      await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(habit),
      });
    }
    const data = await apiFetch("/api/habits", token);
    setHabits(data.habits || []);
  };

  const avoidHabits = habits.filter((h) => h.type === "avoid");
  const goodHabits = habits.filter((h) => h.type === "good");

  const openAddForm = (type: "avoid" | "good") => {
    setEditingId(null);
    setFormName("");
    setFormType(type);
    setFormCategory("");
    setShowForm(true);
  };

  const openEditForm = (habit: Habit) => {
    setEditingId(habit._id);
    setFormName(habit.name);
    setFormType(habit.type);
    setFormCategory(habit.category);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormCategory("");
  };

  const saveHabit = async () => {
    if (!token || !formName.trim()) return;
    if (editingId) {
      await fetch("/api/habits", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editingId, name: formName.trim(), type: formType, category: formCategory.trim() || "General" }),
      });
    } else {
      await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: formName.trim(), type: formType, category: formCategory.trim() || "General", active: true }),
      });
    }
    const data = await apiFetch("/api/habits", token);
    setHabits(data.habits || []);
    closeForm();
  };

  const toggleActive = async (habit: Habit) => {
    if (!token) return;
    await fetch("/api/habits", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: habit._id, active: !habit.active }),
    });
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? { ...h, active: !h.active } : h)));
  };

  const deleteHabit = async (id: string) => {
    if (!token) return;
    await fetch(`/api/habits?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  const renderHabitList = (items: Habit[], type: "avoid" | "good") => {
    const color = type === "avoid" ? "red" : "emerald";
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              type === "avoid" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
            }`}>
              {type === "avoid" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{type === "avoid" ? "Things to Avoid" : "Good Habits"}</h3>
              <p className="text-xs text-gray-500">{items.length} habits</p>
            </div>
          </div>
          <button
            onClick={() => openAddForm(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              type === "avoid"
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
            }`}
          >
            + Add
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            {type === "avoid" ? "No habits to avoid yet" : "No good habits tracked yet"}
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((habit) => (
              <div
                key={habit._id}
                className={`flex items-center gap-3 p-3 rounded-xl transition border ${
                  habit.active
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-800/20 border-gray-800 opacity-50"
                }`}
              >
                <button
                  onClick={() => toggleActive(habit)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition ${
                    habit.active
                      ? type === "avoid"
                        ? "bg-red-500/20 border-red-500/40 text-red-400"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-gray-800 border-gray-700 text-gray-600"
                  }`}
                >
                  {habit.active && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${habit.active ? "text-white" : "text-gray-500"}`}>
                    {habit.name}
                  </p>
                  <p className="text-xs text-gray-500">{habit.category}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditForm(habit)}
                    className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Habits Management</h1>
        <p className="text-gray-400 text-sm mt-1">Define what to avoid and what habits to build</p>
      </div>

      {renderHabitList(avoidHabits, "avoid")}
      {renderHabitList(goodHabits, "good")}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeForm}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{editingId ? "Edit Habit" : "Add Habit"}</h3>
              <button onClick={closeForm} className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Habit Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Reading Quran"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormType("avoid")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                      formType === "avoid"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    Things to Avoid
                  </button>
                  <button
                    onClick={() => setFormType("good")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                      formType === "good"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    Good Habits
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g., Worship, Health, Time"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>
            </div>

            <button
              onClick={saveHabit}
              disabled={!formName.trim()}
              className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl text-sm font-medium transition"
            >
              {editingId ? "Update Habit" : "Add Habit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
