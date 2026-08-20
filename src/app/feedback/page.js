"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Precise color palette matching the premium reference image
const theme = {
  bg: "#0B0C10",
  sidebarBg: "#050508",
  cardBg: "#111218",
  cardBorder: "rgba(255, 255, 255, 0.04)",
  accent: "#6366F1", // Primary purple
  accentHover: "#7C3AED",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  textDarker: "#6B7280",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.1)",
  warning: "#F59E0B",
  warningBg: "rgba(245, 158, 11, 0.1)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.1)",
  blue: "#3B82F6",
  blueBg: "rgba(59, 130, 246, 0.1)",
  inputBg: "#0B0C10",
};

// --- SVG Icons (Inline to ensure zero compilation errors & perfect match) ---
const Icons = {
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Projects: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Presets: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>,
  Analytics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Feedback: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Billing: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Lightning: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Send: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Paperclip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Lightbulb: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Bug: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 11h.01"></path><path d="M8 11h.01"></path><path d="M12 11h.01"></path><path d="M6 18l-3 3"></path><path d="M18 18l3 3"></path><path d="M6 14H3"></path><path d="M21 14h-3"></path><path d="M12 2v4"></path><path d="M10 6a2 2 0 0 0-2 2v9a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V8a2 2 0 0 0-2-2h-4z"></path><path d="M6 10l-3-3"></path><path d="M18 10l3-3"></path></svg>,
  ThumbsUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>,
  MoreVertical: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
};

export default function FeedbackPage() {
  const { user } = useUser();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  async function loadFeedback() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function submitFeedback() {
    if (!newFeedback.trim() && rating === 0) {
      alert("Please write some feedback or select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert([
        {
          feedback: newFeedback,
          rating: rating,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setNewFeedback("");
      setRating(0);
      await loadFeedback();
    } catch (e) {
      console.error("Error saving feedback:", e);
      alert("Error saving feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  const getRatingVisuals = (ratingValue) => {
    if (ratingValue >= 5) return { icon: <Icons.ThumbsUp />, color: theme.success, bg: theme.successBg, label: "Praise" };
    if (ratingValue === 4) return { icon: <Icons.Lightbulb />, color: theme.blue, bg: theme.blueBg, label: "Suggestion" };
    if (ratingValue > 0) return { icon: <Icons.Bug />, color: theme.danger, bg: theme.dangerBg, label: "Bug Report" };
    return { icon: <Icons.Feedback />, color: theme.textMuted, bg: "rgba(255,255,255,0.05)", label: "General" };
  };

  return (
    <SignedIn>
      <style dangerouslySetInnerHTML={{__html: `
        body { background-color: ${theme.bg}; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; color: ${theme.text}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: #2A2D3A; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3A3D4A; }
        ::placeholder { color: ${theme.textDarker}; }
        textarea:focus { border-color: ${theme.accent} !important; box-shadow: 0 0 0 1px ${theme.accent} !important; }
      `}} />

      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: theme.bg }}>
        
        {/* --- SIDEBAR --- */}
        <div style={{
          width: 260,
          backgroundColor: theme.sidebarBg,
          borderRight: `1px solid ${theme.cardBorder}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "fixed",
          height: "100vh",
          zIndex: 10
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", padding: "0 12px", marginBottom: 40 }}>
            <img src="/logo.png" alt="Logo" width="140" height="42" style={{ objectFit: "contain" }} />
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Dashboard /> Dashboard</div>
            </Link>
            <Link href="/generate" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Lightning /> Generate</div>
            </Link>
            <Link href="/jobs" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Projects /> Jobs</div>
            </Link>
            <Link href="/legal" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Users /> Legal</div>
            </Link>
            <Link href="/analytics" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Analytics /> Analytics</div>
            </Link>
            <Link href="/credits" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Billing /> Credits</div>
            </Link>
            <Link href="/feedback" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(true)}><Icons.Feedback /> Feedback</div>
            </Link>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Settings /> Settings</div>
            </Link>
          </nav>

          {/* User Profile Dynamic Mock */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 12, cursor: "pointer" }}>
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4B5563", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
                {user?.firstName?.[0] || user?.username?.[0] || "U"}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "User"}
              </div>
              <div style={{ fontSize: 11, color: theme.textDarker, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.primaryEmailAddress?.emailAddress || ""}
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div style={{ marginLeft: 260, flex: 1, padding: "40px 48px", maxWidth: 1200 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Header Area */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>My Feedback</h1>
                <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>Share your thoughts, report issues, or suggest features.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", cursor: "pointer", color: theme.textMuted }}>
                  <Icons.Bell />
                  <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, backgroundColor: theme.danger, borderRadius: "50%", border: `2px solid ${theme.bg}` }}></span>
                </div>
                <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 36, height: 36 } } }} />
              </div>
            </div>

            {/* Form Section */}
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: 32
            }}>
              <div>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 10, 
                  background: "rgba(99, 102, 241, 0.1)", 
                  color: theme.accent, 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  marginBottom: 16 
                }}>
                  <Icons.Feedback />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>Add Feedback</h3>
                <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, lineHeight: 1.5 }}>
                  Let us know how we can make ClipGenius better for you.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 24 }}>
                  <div style={{ width: 160 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: theme.textMuted, marginBottom: 8 }}>Rating</label>
                    <div style={{ 
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: theme.inputBg, border: `1px solid ${theme.cardBorder}`, 
                      borderRadius: 8, padding: "10px 14px", height: 42 
                    }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          style={{
                            fontSize: 18, cursor: "pointer",
                            color: star <= (hoveredStar || rating) ? theme.warning : theme.cardBorder,
                            transition: "all 0.15s ease",
                            transform: star <= (hoveredStar || rating) ? "scale(1.1)" : "scale(1)",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: theme.textMuted, marginBottom: 8 }}>Describe your feedback...</label>
                    <textarea
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                      placeholder="What would you like to suggest or improve?"
                      style={{
                        width: "100%", padding: "12px 14px", borderRadius: 8,
                        border: `1px solid ${theme.cardBorder}`, background: theme.inputBg,
                        color: theme.text, minHeight: 90, resize: "none",
                        fontFamily: "inherit", fontSize: 13, outline: "none",
                        transition: "all 0.2s ease", boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <button style={{ 
                    display: "flex", alignItems: "center", gap: 8, background: "transparent", 
                    border: "none", color: theme.textMuted, fontSize: 13, cursor: "pointer" 
                  }}>
                    <Icons.Paperclip />
                    <span style={{ borderBottom: `1px dashed ${theme.textDarker}` }}>Add screenshot (optional)</span>
                  </button>

                  <button
                    onClick={submitFeedback}
                    disabled={submitting}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 24px", borderRadius: 8,
                      background: submitting ? theme.textDarker : theme.accent,
                      color: "#fff", border: "none", fontSize: 13, fontWeight: 600,
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: submitting ? "none" : `0 4px 14px ${theme.accent}40`
                    }}
                    onMouseEnter={(e) => { if(!submitting) e.currentTarget.style.background = theme.accentHover }}
                    onMouseLeave={(e) => { if(!submitting) e.currentTarget.style.background = theme.accent }}
                  >
                    <Icons.Send />
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={filterTabStyle(true)}>All Feedback <span style={filterCountStyle(true)}>{feedback.length}</span></div>
                <div style={filterTabStyle(false)}>Suggestions <span style={filterCountStyle(false)}>0</span></div>
                <div style={filterTabStyle(false)}>Bug Reports <span style={filterCountStyle(false)}>0</span></div>
                <div style={filterTabStyle(false)}>Praise <span style={filterCountStyle(false)}>0</span></div>
                <div style={filterTabStyle(false)}>Other <span style={filterCountStyle(false)}>0</span></div>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textDarker, display: "flex" }}>
                  <Icons.Search />
                </div>
                <input 
                  type="text" 
                  placeholder="Search feedback..." 
                  style={{
                    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 20,
                    padding: "8px 16px 8px 36px", fontSize: 13, color: theme.text, outline: "none", width: 200
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted, fontSize: 14 }}>Loading feedback...</div>
              ) : feedback.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted, fontSize: 14, background: theme.cardBg, borderRadius: 12, border: `1px solid ${theme.cardBorder}` }}>
                  No feedback yet. Be the first to share your thoughts!
                </div>
              ) : (
                feedback.map((item) => {
                  const visuals = getRatingVisuals(item.rating);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: theme.cardBg,
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: 12,
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        transition: "border-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.cardBorder}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: visuals.bg, color: visuals.color,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {visuals.icon}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.feedback ? (item.feedback.length > 50 ? item.feedback.substring(0, 50) + "..." : item.feedback) : "No description provided."}
                          </h4>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: theme.textMuted, border: `1px solid ${theme.cardBorder}` }}>
                            {visuals.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.feedback || `User left a ${item.rating}-star rating.`}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>
                            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div style={{ 
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "4px 10px", borderRadius: 20, 
                            background: visuals.bg, color: visuals.color, fontSize: 11, fontWeight: 600
                          }}>
                            <span style={{ fontSize: 12 }}>{item.rating > 0 ? '★'.repeat(item.rating) : 'Unrated'}</span>
                          </div>
                        </div>
                        <button style={{ background: "none", border: "none", color: theme.textDarker, cursor: "pointer", padding: 4 }}>
                          <Icons.MoreVertical />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </SignedIn>
  );
}

function navItemStyle(active) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: active ? theme.text : theme.textMuted,
    background: active ? theme.accent : "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease"
  };
}

function filterTabStyle(active) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    color: active ? theme.text : theme.textMuted,
    background: active ? theme.accent : theme.cardBg,
    border: `1px solid ${active ? theme.accent : theme.cardBorder}`,
    cursor: active ? "default" : "pointer",
  };
}

function filterCountStyle(active) {
  return {
    background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
    padding: "2px 6px",
    borderRadius: 10,
    fontSize: 11,
    color: active ? "#fff" : theme.textDarker
  };
}