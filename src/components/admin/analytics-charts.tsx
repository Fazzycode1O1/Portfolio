"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// Atelier-aligned chart palette. Signal variations + moss + copper + smoke
// produce a coordinated 4-value scale without rainbow garishness.
const COLORS = ["#6B8FA8", "#8FA9BD", "#5C8A6F", "#A8A8A2"];

interface TimeSeriesPoint { date: string; count: number }
interface PiePoint { name: string; value: number }

export function MessagesAreaChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B8FA8" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#6B8FA8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#6B6B68" fontSize={11} tickLine={false} />
          <YAxis stroke="#6B6B68" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#16161A", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#A8A8A2" }}
          />
          <Area type="monotone" dataKey="count" stroke="#6B8FA8" strokeWidth={2} fill="url(#g1)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart({ data }: { data: PiePoint[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 12, color: "#A8A8A2" }} />
          <Tooltip contentStyle={{ background: "#16161A", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
