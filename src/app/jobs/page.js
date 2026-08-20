"use client";

import { useState, useEffect } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const theme = {
  bg: "#0A0B10",
  sidebar: "#0D0E15",
  card: "#13141C",
  cardHover: "#171822",
  border: "#1F212E",
  borderLight: "#2A2D3D",
  text: "#FFFFFF",
  textSecondary: "#A0AEC0",
  textTertiary: "#718096",
  accent: "#6366F1",
  accentHover: "#4F46E5",
  accentLight: "rgba(99, 102, 241, 0.1)",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.1)",
  warning: "#F59E0B",
  warningBg: "rgba(245, 158, 11, 0.1)",
  error: "#EF4444",
  errorBg: "rgba(239, 68, 68, 0.1)",
};

function safeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobClips, setSelectedJobClips] = useState(null);
  const [showClipsModal, setShowClipsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Jobs");
  const [searchQuery, setSearchQuery] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const text = await res.text();
      const data = safeJson(text);
      if (!res.ok) throw new Error();
      setJobs(data?.jobs || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function viewClips(job) {
    if (job.clips && job.clips.length > 0) {
      setSelectedJobClips(job.clips);
      setShowClipsModal(true);
    } else if (job.clips_data && job.clips_data.length > 0) {
      setSelectedJobClips(job.clips_data);
      setShowClipsModal(true);
    } else {
      alert("No clips found for this job");
    }
  }

  const tabs = ["All Jobs", "Processing", "Completed", "Failed"];

  const filteredJobs = jobs.filter((job) => {
    const matchesTab =
      activeTab === "All Jobs" || job.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const statusConfig = {
    completed: { icon: "●", label: "Completed", color: theme.success, bg: theme.successBg },
    processing: { icon: "●", label: "Processing", color: theme.warning, bg: theme.warningBg },
    failed: { icon: "●", label: "Failed", color: theme.error, bg: theme.errorBg },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <SignedIn>
      <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          
          {/* Top Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <Link href="/" style={{ color: theme.textSecondary, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
              ← Back to Dashboard
            </Link>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={loadJobs}
                style={{
                  padding: "8px 16px", borderRadius: 8, background: theme.card, color: theme.textSecondary,
                  border: `1px solid ${theme.border}`, cursor: "pointer", fontSize: 13, fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = theme.borderLight; e.currentTarget.style.color = theme.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = theme.card; e.currentTarget.style.color = theme.textSecondary; }}
              >
                ⟳ Refresh
              </button>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: theme.accentLight, display: "flex", alignItems: "center", justifyItems: "center" }}>
                <UserButton />
              </div>
            </div>
          </div>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: theme.card, border: `1px solid ${theme.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              📁
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 600, color: theme.text, margin: "0 0 4px 0" }}>Jobs</h1>
              <p style={{ color: theme.textSecondary, fontSize: 14, margin: 0 }}>
                Track and manage all your AI clip generation jobs
              </p>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", gap: 4, background: theme.card, padding: 4, borderRadius: 12, border: `1px solid ${theme.border}` }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer",
                    background: activeTab === tab ? theme.borderLight : "transparent",
                    color: activeTab === tab ? theme.text : theme.textSecondary,
                    transition: "all 0.2s ease"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textTertiary, fontSize: 14 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 16px 8px 36px", borderRadius: 10, background: theme.card, color: theme.text,
                    border: `1px solid ${theme.border}`, fontSize: 13, outline: "none", width: 200, transition: "border 0.2s ease"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = theme.accent}
                  onBlur={(e) => e.currentTarget.style.borderColor = theme.border}
                />
              </div>
              <button style={{
                padding: "8px 16px", borderRadius: 10, background: theme.card, color: theme.textSecondary,
                border: `1px solid ${theme.border}`, cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8
              }}>
                ⧨ Filters
              </button>
            </div>
          </div>

          {/* Job List */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: theme.textTertiary, fontSize: 14 }}>Loading your jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: theme.text, marginBottom: 8 }}>No jobs found</h2>
              <p style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 24 }}>Generate your first clip to see it here.</p>
              <Link href="/generate">
                <button style={{
                  padding: "10px 24px", borderRadius: 10, background: theme.accent, color: "#fff", border: "none",
                  fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease",
                  boxShadow: `0 4px 12px ${theme.accentLight}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.accentHover}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.accent}
                >
                  Generate New Clip
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <AnimatePresence>
                {filteredJobs.map((job) => {
                  const status = statusConfig[job.status] || statusConfig.processing;
                  const isCompleted = job.status === "completed";
                  const jobIdLabel = job.title || `Job #${job.id?.slice(0, 8) || "Unknown"}`;

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => isCompleted && viewClips(job)}
                      style={{
                        padding: 16, borderRadius: 16, background: theme.card, border: `1px solid ${theme.border}`,
                        cursor: isCompleted ? "pointer" : "default", display: "flex", gap: 24, alignItems: "center",
                        transition: "all 0.2s ease", position: "relative", overflow: "hidden"
                      }}
                      onMouseEnter={(e) => {
                        if (isCompleted) {
                          e.currentTarget.style.borderColor = theme.borderLight;
                          e.currentTarget.style.background = theme.cardHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = theme.border;
                        e.currentTarget.style.background = theme.card;
                      }}
                    >
                      {/* Thumbnail Placeholder */}
                      <div style={{
                        width: 140, height: 80, borderRadius: 10, flexShrink: 0, position: "relative",
                        background: `linear-gradient(135deg, ${theme.borderLight} 0%, ${theme.sidebar} 100%)`,
                        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <div style={{ fontSize: 24, opacity: 0.2 }}>🎬</div>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ color: theme.accent, fontSize: 16 }}>⭕</span>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: theme.text, margin: 0 }}>{jobIdLabel}</h3>
                            <div style={{
                              display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20,
                              background: status.bg, border: `1px solid ${status.color}30`
                            }}>
                              <span style={{ color: status.color, fontSize: 8 }}>{status.icon}</span>
                              <span style={{ color: status.color, fontSize: 11, fontWeight: 600 }}>{status.label}</span>
                            </div>
                          </div>
                          <button style={{ background: "transparent", border: "none", color: theme.textTertiary, cursor: "pointer", padding: 4 }}>
                            ⋮
                          </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: theme.textSecondary, marginBottom: 12 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>🎞️ {job.clip_count || 0} clips</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>📅 {formatDate(job.created_at)}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>🪙 {job.credits_spent || 0} credits</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>⏱️ Started {getTimeAgo(job.created_at)}</span>
                        </div>

                        {/* Progress Bar (If processing) */}
                        {job.status === "processing" && (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.accent, marginBottom: 6, fontWeight: 500 }}>
                              <span>AI is analyzing your video...</span>
                              <span>{job.progress || 0}%</span>
                            </div>
                            <div style={{ width: "100%", height: 4, background: theme.borderLight, borderRadius: 2, overflow: "hidden" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${job.progress || 0}%` }}
                                style={{ height: "100%", background: theme.accent, borderRadius: 2 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && jobs.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32, gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button style={{ background: "transparent", border: "none", color: theme.textTertiary, cursor: "not-allowed" }}>&lt;</button>
                <button style={{ width: 32, height: 32, borderRadius: 8, background: theme.accentLight, color: theme.accent, border: "none", fontSize: 13, fontWeight: 600 }}>1</button>
                <button style={{ background: "transparent", border: "none", color: theme.textTertiary, cursor: "not-allowed" }}>&gt;</button>
              </div>
              <div style={{ fontSize: 12, color: theme.textTertiary }}>
                Showing {filteredJobs.length} of {jobs.length} jobs
              </div>
            </div>
          )}

          {/* Bottom Promo Card */}
          <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: theme.card, border: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.accentLight, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                ✨
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: theme.text, margin: "0 0 4px 0" }}>AI is working its magic ✨</h4>
                <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Our advanced AI analyzes your video to find the most viral moments, add captions, and create engaging clips.</p>
              </div>
            </div>
            <button style={{
              padding: "10px 20px", borderRadius: 8, background: "transparent", color: theme.text,
              border: `1px solid ${theme.borderLight}`, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.borderLight}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              Learn How It Works ↗
            </button>
          </div>
        </div>

        {/* Clips Modal */}
        <AnimatePresence>
          {showClipsModal && selectedJobClips && selectedJobClips.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 11, 16, 0.8)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24
              }}
              onClick={() => setShowClipsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                style={{
                  background: theme.sidebar, border: `1px solid ${theme.borderLight}`, borderRadius: 20, padding: 32,
                  maxWidth: 800, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 48px rgba(0,0,0,0.4)"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, color: theme.text, margin: "0 0 8px 0" }}>Your Generated Clips</h2>
                    <p style={{ color: theme.textSecondary, fontSize: 14, margin: 0 }}>Successfully generated {selectedJobClips.length} clips ready for download.</p>
                  </div>
                  <button
                    onClick={() => setShowClipsModal(false)}
                    style={{
                      background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 16px",
                      color: theme.textSecondary, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = theme.borderLight; e.currentTarget.style.color = theme.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = theme.card; e.currentTarget.style.color = theme.textSecondary; }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                  {selectedJobClips.map((clip, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 16, borderRadius: 12, background: theme.card, border: `1px solid ${theme.border}`, display: "flex", gap: 16
                      }}
                    >
                      <video
                        src={clip.url}
                        controls
                        style={{ width: 100, height: 178, borderRadius: 8, background: "#000", objectFit: "cover" }}
                      />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontSize: 11, color: theme.accent, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          Clip {clip.index || idx + 1}
                        </div>
                        {clip.hook && <div style={{ fontSize: 13, color: theme.text, fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>"{clip.hook}"</div>}
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                          <div style={{ fontSize: 11, color: theme.textSecondary }}>Score: <span style={{ color: theme.text }}>{clip.viralScore || 85}/100</span></div>
                          <div style={{ fontSize: 11, color: theme.textSecondary }}>Subtitle Style: <span style={{ color: theme.text }}>{clip.color || "Default"}</span></div>
                        </div>

                        <a
                          href={clip.url}
                          download={`clip_${clip.index || idx + 1}.mp4`}
                          style={{
                            background: theme.accent, color: "#fff", padding: "10px", borderRadius: 8, fontSize: 12,
                            fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center", transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = theme.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.background = theme.accent}
                        >
                          Download Clip
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SignedIn>
  );
}