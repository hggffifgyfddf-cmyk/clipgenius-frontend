"use client";

import { useState } from "react";

const colors = {
  accent: "#6366f1",
  text: "#ffffff",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.3)",
  border: "rgba(255,255,255,0.06)",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
};

export default function ActivityFeed({ jobs, loading, onViewClips }) {
  const [hoveredJob, setHoveredJob] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "✅";
      case "failed": return "❌";
      case "processing": return "⏳";
      default: return "🔄";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return colors.success;
      case "failed": return colors.error;
      case "processing": return colors.warning;
      default: return colors.textTertiary;
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>📋</span>
        <h3 style={{ fontWeight: 600, fontSize: 14 }}>Recent Activity</h3>
        <span style={{ fontSize: 10, color: colors.textTertiary, marginLeft: "auto", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {jobs.length} jobs
        </span>
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 4 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: colors.textTertiary, padding: "40px 0", fontSize: 13 }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
            <div style={{ color: colors.textSecondary, fontSize: 13 }}>No jobs yet</div>
            <div style={{ color: colors.textTertiary, fontSize: 11, marginTop: 4 }}>Start generating your first clip!</div>
          </div>
        ) : (
          jobs.map((job, index) => (
            <div
              key={job.id}
              onClick={() => job.status === "completed" && onViewClips(job)}
              style={{
                padding: "12px 14px",
                marginBottom: 6,
                borderRadius: 12,
                border: `1px solid ${hoveredJob === job.id ? colors.border : "rgba(255,255,255,0.03)"}`,
                background: hoveredJob === job.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
                cursor: job.status === "completed" ? "pointer" : "default",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={() => setHoveredJob(job.id)}
              onMouseLeave={() => setHoveredJob(null)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ fontSize: 18 }}>{getStatusIcon(job.status)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>
                      Job #{job.id?.slice(0, 8) || "Unknown"}
                    </span>
                    {job.clip_count && (
                      <span style={{ fontSize: 10, color: colors.textTertiary }}>{job.clip_count} clips</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: colors.textTertiary }}>
                      {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently"}
                    </span>
                    {job.credits_spent && (
                      <span style={{ fontSize: 10, color: colors.textTertiary }}>• {job.credits_spent} credits</span>
                    )}
                    {job.status === "completed" && (
                      <span style={{ fontSize: 10, color: colors.accent }}>Click to view →</span>
                    )}
                  </div>
                </div>
                {job.status === "processing" && (
                  <div style={{ width: 20, height: 20, border: `2px solid ${colors.border}`, borderTopColor: colors.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}