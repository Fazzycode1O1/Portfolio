"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#7C5CFF", "#4F8BFF", "#4FE0FF", "#A0A0AE"];

interface TimeSeriesPoint { date: string; count: number }
interface PiePoint { name: string; value: number }

export function MessagesAreaChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#6B6B7A" fontSize={11} tickLine={false} />
          <YAxis stroke="#6B6B7A" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#16161E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#A0A0AE" }}
          />
          <Area type="monotone" dataKey="count" stroke="#7C5CFF" strokeWidth={2} fill="url(#g1)" />
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
          <Legend wrapperStyle={{ fontSize: 12, color: "#A0A0AE" }} />
          <Tooltip contentStyle={{ background: "#16161E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
