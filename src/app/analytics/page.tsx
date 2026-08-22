"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AnalyticsData {
  totalCheckins: number;
  successDays: number;
  partialDays: number;
  failedDays: number;
  currentStreak: number;
  longestStreak: number;
  totalPrayers: number;
  possiblePrayers: number;
  triggers: Record<string, number>;
  weeklyData: Record<string, { success: number; partial: number; failed: number }>;
  successPercentage: number;
  habits: { avoid: string[]; good: string[] };
}

function apiFetch(url: string, token: string) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
}

function getMonthOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    options.push({ value, label });
  }
  return options;
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiFetch(`/api/analytics?month=${month}`, token).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [token, month]);

  const pieData = data
    ? [
        { name: "Success", value: data.successDays },
        { name: "Partial", value: data.partialDays },
        { name: "Failed", value: data.failedDays },
      ]
    : [];

  const barData = data
    ? Object.entries(data.weeklyData).map(([week, v]) => ({
        name: week,
        success: v.success,
        partial: v.partial,
        failed: v.failed,
      }))
    : [];

  const triggerData = data
    ? Object.entries(data.triggers)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const successRate = data ? data.successPercentage : 0;
  const failureRate = data ? (data.totalCheckins > 0 ? Math.round((data.failedDays / (data.successDays + data.partialDays + data.failedDays || 1)) * 100) : 0) : 0;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Monthly Analytics</h1>
            <p className="mt-1 text-gray-400">Track your progress over time.</p>
          </div>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {getMonthOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center text-gray-400">
            Loading analytics...
          </div>
        ) : !data ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center text-gray-400">
            No data available for this month.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="mt-1 text-3xl font-bold text-emerald-400">{successRate}%</p>
                <p className="mt-0.5 text-xs text-gray-500">Days completed fully</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <p className="text-sm text-gray-400">Failure Rate</p>
                <p className="mt-1 text-3xl font-bold text-red-400">{failureRate}%</p>
                <p className="mt-0.5 text-xs text-gray-500">Days failed</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <p className="text-sm text-gray-400">Longest Streak</p>
                <p className="mt-1 text-3xl font-bold text-amber-400">{data.longestStreak}</p>
                <p className="mt-0.5 text-xs text-gray-500">Consecutive days</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <p className="text-sm text-gray-400">Total Check-ins</p>
                <p className="mt-1 text-3xl font-bold text-blue-400">{data.totalCheckins}</p>
                <p className="mt-0.5 text-xs text-gray-500">This month</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">Day Outcomes</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#34d399" />
                      <Cell fill="#fbbf24" />
                      <Cell fill="#f87171" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "#f3f4f6",
                      }}
                    />
                    <Legend
                      formatter={(value: string) => (
                        <span style={{ color: "#d1d5db" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">Weekly Progress</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      axisLine={{ stroke: "#374151" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      axisLine={{ stroke: "#374151" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "#f3f4f6",
                      }}
                    />
                    <Legend
                      formatter={(value: string) => (
                        <span style={{ color: "#d1d5db" }}>{value}</span>
                      )}
                    />
                    <Bar dataKey="success" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="partial" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="failed" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {triggerData.length > 0 && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">Trigger Frequency</h2>
                <ResponsiveContainer width="100%" height={Math.max(200, triggerData.length * 48)}>
                  <BarChart data={triggerData} layout="vertical" margin={{ left: 120 }}>
                    <XAxis
                      type="number"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      axisLine={{ stroke: "#374151" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#d1d5db", fontSize: 13 }}
                      axisLine={{ stroke: "#374151" }}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "#f3f4f6",
                      }}
                    />
                    <Bar dataKey="count" fill="#f87171" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {(data.habits.avoid.length > 0 || data.habits.good.length > 0) && (
              <div className="grid gap-6 lg:grid-cols-2">
                {data.habits.good.length > 0 && (
                  <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-emerald-400">Good Habits</h2>
                    <div className="space-y-2">
                      {data.habits.good.map((h, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-emerald-800/40 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300"
                        >
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.habits.avoid.length > 0 && (
                  <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                    <h2 className="mb-3 text-lg font-semibold text-red-400">Habits to Avoid</h2>
                    <div className="space-y-2">
                      {data.habits.avoid.map((h, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-red-800/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
                        >
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-3 text-lg font-semibold text-white">Prayer Coverage</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-3 rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${data.totalPrayers / (data.possiblePrayers || 1) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {data.totalPrayers}/{data.possiblePrayers}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
