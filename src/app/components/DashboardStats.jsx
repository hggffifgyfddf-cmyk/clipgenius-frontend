"use client";

import { useEffect, useState } from "react";

const colors = {
  accent: "#6366f1",
  text: "#ffffff",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.3)",
  border: "rgba(255,255,255,0.06)",
};

export default function DashboardStats({ credits, totalClips, totalJobs, loading }) {
  const [animatedCredits, setAnimatedCredits] = useState(0);
  const [animatedClips, setAnimatedClips] = useState(0);
  const [animatedJobs, setAnimatedJobs] = useState(0);

  useEffect(() => {
    if (!loading) {
      animateNumber(credits, setAnimatedCredits, 1000);
      animateNumber(totalClips, setAnimatedClips, 1000);
      animateNumber(totalJobs, setAnimatedJobs, 1000);
    }
  }, [credits, totalClips, totalJobs, loading]);

  const animateNumber = (target, setter, duration) => {
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  };

  const stats = [
    { icon: "🎬", label: "Total Clips", value: animatedClips, color: "#6366f1" },
    { icon: "📋", label: "Total Jobs", value: animatedJobs, color: "#8b5cf6" },
    { icon: "💳", label: "Credits", value: animatedCredits, color: "#06b6d4" },
    { icon: "📊", label: "Success Rate", value: totalJobs > 0 ? Math.round((totalClips / totalJobs) * 100) : 0, color: "#22c55e" },
    { icon: "⚡", label: "Status", value: "Active", color: "#f59e0b" },
    { icon: "🏆", label: "Level", value: totalClips > 1000 ? "Pro" : totalClips > 100 ? "Advanced" : "Starter", color: "#ec4899" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: "16px 12px",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: stat.color }}>
            {loading ? "..." : typeof stat.value === "number" ? stat.value : stat.value}
          </div>
          <div style={{ fontSize: 10, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}