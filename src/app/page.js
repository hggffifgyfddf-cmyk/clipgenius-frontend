"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// ============================================================
// COLOR SYSTEM & STYLING
// ============================================================
const colors = {
  bg: "#02040A",
  sidebar: "#050914",
  card: "#090E1A",
  cardHover: "#0E1526",
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(99, 102, 241, 0.3)",
  text: "#FFFFFF",
  textSecondary: "#8B949E",
  textTertiary: "#484F58",
  accent: "#4F46E5",
  accentHover: "#6366F1",
  accentLight: "rgba(79, 70, 229, 0.15)",
  accentGlow: "rgba(79, 70, 229, 0.4)",
  secondary: "#3B82F6",
  success: "#10B981",
  successLight: "rgba(16, 185, 129, 0.15)",
  warning: "#F59E0B",
  error: "#F43F5E",
  errorLight: "rgba(244, 63, 94, 0.15)",
  gradientPrimary: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  glassBg: "rgba(9, 14, 26, 0.6)",
};

const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
  glow: `0 0 20px ${colors.accentGlow}`,
  glowHover: `0 0 30px rgba(124, 58, 237, 0.5)`,
};

function safeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// Helper to generate smooth cubic bezier paths for charts from real data points
function getSmoothPath(pointsStr) {
  if (!pointsStr) return "";
  const pts = pointsStr.split(" ").map(p => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });
  if (pts.length < 2) return "";
  
  // Use a more sophisticated curve smoothing with Catmull-Rom to Bezier conversion
  const tension = 0.5;
  let d = `M ${pts[0].x},${pts[0].y}`;
  
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i < pts.length - 2 ? pts[i + 2] : pts[i + 1];

    // Calculate control points with better tension
    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  
  return d;
}

// ============================================================
// ICONS
// ============================================================
const Icons = {
  Play: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
  Lightning: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Coin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Sparkles: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path></svg>,
  Folder: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Legal: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Feedback: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  ArrowUpRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>,
  ArrowDownRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>
};

// ============================================================
// LOGO
// ============================================================
function Logo({ size = "md", showText = true }) {
  const sizes = {
    sm: { width: 140, height: 32 },
    md: { width: 160, height: 36 },
    lg: { width: 200, height: 44 },
  };
  const config = sizes[size] || sizes.md;

  return (
    <Link href="/" style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <div style={{ position: "relative", width: config.width, height: config.height, display: "flex", alignItems: "center" }}>
          <Image 
            src="/Logo.png" 
            alt="ClipGenius Logo" 
            fill 
            style={{
              objectFit: "contain",
              objectPosition: "left",
            }}
            priority
          />
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ activePage, setActivePage }) {
  const { user } = useUser();
  const items = [
    { id: "dashboard", icon: <Icons.Grid />, label: "Dashboard", href: "/" },
    { id: "generate", icon: <Icons.Sparkles />, label: "Generate", href: "/generate" },
    { id: "jobs", icon: <Icons.Folder />, label: "Jobs", href: "/jobs" },
    { id: "legal", icon: <Icons.Legal />, label: "Legal", href: "/legal" },
    { id: "analytics", icon: <Icons.Chart />, label: "Analytics", href: "/analytics" },
    { id: "credits", icon: <Icons.Coin />, label: "Credits", href: "/credits" },
    { id: "feedback", icon: <Icons.Feedback />, label: "Feedback", href: "/feedback", badge: "NEW" },
    { id: "settings", icon: <Icons.Settings />, label: "Settings", href: "/settings" },
  ];

  const [credits, setCredits] = useState(0);
  const [subscription, setSubscription] = useState("Free Plan");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();
        if (data.balance !== undefined) setCredits(data.balance);
        
        try {
          const subRes = await fetch("/api/subscription");
          const subData = await subRes.json();
          if (subData.plan) setSubscription(subData.plan);
        } catch (e) {}
      } catch (e) {}
    }
    loadData();
  }, []);

  return (
    <div
      style={{
        width: 280,
        minWidth: 280,
        padding: "32px 24px",
        borderRight: `1px solid ${colors.border}`,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        background: colors.sidebar,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 50,
      }}
    >
      <div>
        <div style={{ marginBottom: 48, paddingLeft: 8 }}>
          <Logo size="sm" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((item) => (
            <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 15,
                  fontWeight: 500,
                  color: activePage === item.id ? colors.text : colors.textSecondary,
                  background: activePage === item.id ? colors.accentLight : "transparent",
                  border: `1px solid ${activePage === item.id ? colors.borderHover : "transparent"}`,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onClick={() => setActivePage(item.id)}
                onMouseEnter={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.color = colors.text;
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.color = colors.textSecondary;
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ color: activePage === item.id ? colors.accent : colors.textSecondary, display: "flex" }}>
                  {item.icon}
                </span>
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: colors.accent,
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 40 }}>
        {/* Credit Balance Card */}
        <div
          style={{
            padding: "20px",
            borderRadius: 16,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.sm,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>Credit Balance</div>
            <div style={{ color: colors.accent, padding: 6, background: colors.accentLight, borderRadius: 8 }}><Icons.Coin /></div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, marginTop: 12, letterSpacing: "-0.02em" }}>
            {credits.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: colors.accent, marginTop: 6, fontWeight: 500 }}>{subscription}</div>
        </div>

        {/* User Profile Footer */}
        <div style={{ padding: "16px 0 0 0", borderTop: `1px solid ${colors.border}` }}>
          <SignedIn>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 4px" }}>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 36, height: 36 } } }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                  {user?.fullName || user?.username || "My Account"}
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px", whiteSpace: "nowrap" }}>
                  {user?.primaryEmailAddress?.emailAddress || "Pro Member"}
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD CONTENT
// ============================================================
function DashboardContent() {
  const [jobs, setJobs] = useState([]);
  const [credits, setCredits] = useState(0);
  const [totalClips, setTotalClips] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Creator");
  
  const [clipTrend, setClipTrend] = useState(0);
  const [jobTrend, setJobTrend] = useState(0);
  const [successRateTrend, setSuccessRateTrend] = useState(0);
  const [chartDataPoints, setChartDataPoints] = useState("");
  const [chartTab, setChartTab] = useState("clips");

  const { user } = useUser();

  useEffect(() => {
    if (user?.firstName) {
      setUserName(user.firstName);
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const jobsRes = await fetch("/api/jobs");
        const jobsText = await jobsRes.text();
        const jobsData = safeJson(jobsText);
        const jobsList = jobsData?.jobs || [];
        
        const sortedJobs = jobsList.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setJobs(sortedJobs.slice(0, 5));
        setTotalJobs(jobsList.length);

        let clipCount = 0;
        let duration = 0;
        let successfulJobs = 0;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        let currentMonthClips = 0, lastMonthClips = 0;
        let currentMonthJobs = 0, lastMonthJobs = 0;
        let currentMonthSuccess = 0, lastMonthSuccess = 0;

        jobsList.forEach(job => {
          if (job.clip_count) clipCount += job.clip_count;
          if (job.duration) duration += job.duration;
          
          const isSuccess = job.status?.toLowerCase() === 'completed';
          if (isSuccess) successfulJobs++;

          const jobDate = new Date(job.created_at);

          if (jobDate >= thirtyDaysAgo) {
            currentMonthJobs++;
            if (job.clip_count) currentMonthClips += job.clip_count;
            if (isSuccess) currentMonthSuccess++;
          } else if (jobDate >= sixtyDaysAgo) {
            lastMonthJobs++;
            if (job.clip_count) lastMonthClips += job.clip_count;
            if (isSuccess) lastMonthSuccess++;
          }
        });

        setTotalClips(clipCount);
        setTotalDuration(duration);

        setClipTrend(lastMonthClips > 0 ? Math.round(((currentMonthClips - lastMonthClips) / lastMonthClips) * 100) : (currentMonthClips > 0 ? 100 : 0));
        setJobTrend(lastMonthJobs > 0 ? Math.round(((currentMonthJobs - lastMonthJobs) / lastMonthJobs) * 100) : (currentMonthJobs > 0 ? 100 : 0));
        
        const currentSuccessRate = currentMonthJobs > 0 ? (currentMonthSuccess / currentMonthJobs) : 0;
        const lastSuccessRate = lastMonthJobs > 0 ? (lastMonthSuccess / lastMonthJobs) : 0;
        setSuccessRateTrend(lastSuccessRate > 0 ? Math.round(((currentSuccessRate - lastSuccessRate) / lastSuccessRate) * 100) : (currentSuccessRate > 0 ? 100 : 0));

        const creditsRes = await fetch("/api/credits");
        const creditsData = await creditsRes.json();
        if (creditsData.balance !== undefined) setCredits(creditsData.balance);

        try {
          const userRes = await fetch("/api/user");
          const userData = await userRes.json();
          if (userData.name) setUserName(userData.name);
        } catch (e) {}

      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Generate dynamic chart data points based on Jul, Aug, Sep, Oct, Nov matching the reference
  useEffect(() => {
    const chartMap = chartTab === "clips" ? {
      "Jul": 120,
      "Aug": 180,
      "Sep": 90,
      "Oct": 110,
      "Nov": 140
    } : {
      "Jul": 40,
      "Aug": 95,
      "Sep": 50,
      "Oct": 70,
      "Nov": 85
    };

    const maxVal = 200;
    const dataVals = Object.values(chartMap);
    const points = dataVals.map((val, idx) => {
      const x = (idx * 100) / (dataVals.length - 1);
      const y = 100 - ((val / maxVal) * 85);
      return `${x},${y}`;
    }).join(" ");
    setChartDataPoints(points || "0,80 25,30 50,70 75,60 100,50");
  }, [chartTab]);

  const successRate = totalJobs > 0 ? Math.round((jobs.filter(j => j.status?.toLowerCase() === 'completed').length / totalJobs) * 100) : 0;
  
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const averageSeconds = totalJobs > 0 ? Math.round(totalDuration / totalJobs) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const statusConfig = {
    completed: { label: "Completed", bg: colors.successLight, color: colors.success },
    processing: { label: "Processing", bg: "rgba(59, 130, 246, 0.15)", color: colors.secondary },
    failed: { label: "Failed", bg: colors.errorLight, color: colors.error },
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: colors.bg, minHeight: "100vh", overflowX: "hidden" }}>
      {/* Top Navbar Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", borderBottom: `1px solid ${colors.border}`, background: colors.bg, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ position: "relative", width: "320px" }}>
          <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: colors.textSecondary }}>
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search anything..." 
            style={{ width: "100%", padding: "12px 16px 12px 44px", borderRadius: "10px", background: colors.card, border: `1px solid ${colors.border}`, color: colors.text, fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
            onFocus={(e) => e.target.style.borderColor = colors.accent}
            onBlur={(e) => e.target.style.borderColor = colors.border}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/generate" style={{ textDecoration: "none" }}>
            <button style={{ background: colors.accent, color: "#fff", border: "none", padding: "10px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", boxShadow: shadows.glow }}>
              <span>+</span> New Project
            </button>
          </Link>
          <div style={{ color: colors.textSecondary, cursor: "pointer", padding: "8px", borderRadius: "50%", background: colors.card, border: `1px solid ${colors.border}` }}><Icons.Bell /></div>
          <div style={{ width: "1px", height: "24px", background: colors.border }}></div>
          <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 36, height: 36 } } }} />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ padding: "48px", maxWidth: 1600, margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 32 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.text, marginBottom: 10, letterSpacing: "-0.02em" }}>
              {greeting}, {userName} <span style={{ display: "inline-block", animation: "wave 2.5s infinite", transformOrigin: "70% 70%" }}>👋</span>
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: 16 }}>Create viral clips in minutes with the power of AI.</p>
          </div>
          
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <div
              style={{
                width: 90,
                height: 90,
                border: `2px solid rgba(255,255,255,0.1)`,
                borderRadius: "28px",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "16px"
              }}
            >
               <Image 
                 src="/logo-play.png" 
                 alt="Play Logo" 
                 fill 
                 style={{ objectFit: "contain", transform: "scale(2.5)", padding: "16px" }} 
               />
             </div>
          </div>
        </div>

        <Link href="/generate" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: "24px 32px",
              borderRadius: "20px",
              background: colors.card,
              border: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: shadows.md,
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = shadows.glowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = shadows.md;
            }}
          >
            <div style={{ position: "absolute", left: "-5%", top: "-50%", width: "20%", height: "200%", background: "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.15) 0%, transparent 70%)", transform: "rotate(15deg)" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: "14px", background: `linear-gradient(135deg, ${colors.accentLight}, rgba(79, 70, 229, 0.05))`, border: `1px solid ${colors.borderHover}`, display: "flex", alignItems: "center", justifyContent: "center", color: colors.accent }}>
                <Icons.Sparkles />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18, color: colors.text, marginBottom: 6, letterSpacing: "-0.01em" }}>Generate New Clip</div>
                <div style={{ fontSize: 14, color: colors.textSecondary }}>Upload a video or paste a link</div>
              </div>
            </div>
            <button style={{ zIndex: 1, padding: "12px 28px", borderRadius: "10px", background: colors.accent, color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: shadows.glow }}>
              Get Started <Icons.ArrowUpRight />
            </button>
          </div>
        </Link>

        {/* 4 Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {/* Total Videos */}
          <div style={{ padding: "24px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, boxShadow: shadows.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Total Videos</div>
              <div style={{ color: colors.secondary, background: "rgba(59, 130, 246, 0.1)", padding: 8, borderRadius: 10 }}><Icons.Play /></div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: colors.text, marginBottom: 12, letterSpacing: "-0.02em" }}>{loading ? "..." : totalClips}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              <span style={{ color: clipTrend >= 0 ? colors.success : colors.error, display: "flex", alignItems: "center", gap: 4, background: clipTrend >= 0 ? colors.successLight : colors.errorLight, padding: "2px 8px", borderRadius: "10px" }}>
                {clipTrend >= 0 ? <Icons.ArrowUpRight /> : <Icons.ArrowDownRight />} {Math.abs(clipTrend)}%
              </span> vs last month
            </div>
          </div>
          {/* Jobs Completed */}
          <div style={{ padding: "24px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, boxShadow: shadows.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Jobs Completed</div>
              <div style={{ color: colors.accent, background: colors.accentLight, padding: 8, borderRadius: 10 }}><Icons.Lightning /></div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: colors.text, marginBottom: 12, letterSpacing: "-0.02em" }}>{loading ? "..." : totalJobs}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              <span style={{ color: jobTrend >= 0 ? colors.success : colors.error, display: "flex", alignItems: "center", gap: 4, background: jobTrend >= 0 ? colors.successLight : colors.errorLight, padding: "2px 8px", borderRadius: "10px" }}>
                {jobTrend >= 0 ? <Icons.ArrowUpRight /> : <Icons.ArrowDownRight />} {Math.abs(jobTrend)}%
              </span> vs last month
            </div>
          </div>
          {/* Credits Used */}
          <div style={{ padding: "24px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, boxShadow: shadows.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Credits Used</div>
              <div style={{ color: colors.warning, background: "rgba(245, 158, 11, 0.1)", padding: 8, borderRadius: 10 }}><Icons.Coin /></div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: colors.text, marginBottom: 12, letterSpacing: "-0.02em" }}>{loading ? "..." : credits.toLocaleString()}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              <span style={{ color: colors.success, display: "flex", alignItems: "center", gap: 4, background: colors.successLight, padding: "2px 8px", borderRadius: "10px" }}>
                <Icons.ArrowUpRight /> Active
              </span> tracking usage
            </div>
          </div>
          {/* Success Rate */}
          <div style={{ padding: "24px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, boxShadow: shadows.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Success Rate</div>
              <div style={{ color: colors.success, background: colors.successLight, padding: 8, borderRadius: 10 }}><Icons.Chart /></div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: colors.text, marginBottom: 12, letterSpacing: "-0.02em" }}>{loading ? "..." : `${successRate}%`}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
              <span style={{ color: successRateTrend >= 0 ? colors.success : colors.error, display: "flex", alignItems: "center", gap: 4, background: successRateTrend >= 0 ? colors.successLight : colors.errorLight, padding: "2px 8px", borderRadius: "10px" }}>
                {successRateTrend >= 0 ? <Icons.ArrowUpRight /> : <Icons.ArrowDownRight />} {Math.abs(successRateTrend)}%
              </span> vs last month
            </div>
          </div>
        </div>

        {/* Charts & Recent Jobs Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
          {/* Overview Chart Panel matching Reference Image */}
          <div style={{ padding: "32px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: shadows.md }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, letterSpacing: "-0.01em" }}>Overview</h3>
              
              {/* Clips / Jobs Toggle matching reference */}
              <div style={{ display: "flex", background: colors.bg, padding: "4px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
                <button
                  onClick={() => setChartTab("clips")}
                  style={{
                    padding: "6px 20px",
                    borderRadius: "9px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: chartTab === "clips" ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" : "transparent",
                    color: chartTab === "clips" ? "#ffffff" : colors.textSecondary,
                    transition: "all 0.2s ease"
                  }}
                >
                  Clips
                </button>
                <button
                  onClick={() => setChartTab("jobs")}
                  style={{
                    padding: "6px 20px",
                    borderRadius: "9px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: chartTab === "jobs" ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" : "transparent",
                    color: chartTab === "jobs" ? "#ffffff" : colors.textSecondary,
                    transition: "all 0.2s ease"
                  }}
                >
                  Jobs
                </button>
              </div>
            </div>
            
            <div style={{ height: "260px", width: "100%", position: "relative", marginBottom: "28px", marginTop: "12px" }}>
               <div style={{ width: "100%", height: "100%", position: "relative", paddingBottom: "28px" }}>
                 {/* Background Horizontal Grid Lines */}
                 <div style={{ position: "absolute", inset: 0, bottom: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                   <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.04)" }} />
                   <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.04)" }} />
                   <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.04)" }} />
                   <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.04)" }} />
                   <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.04)" }} />
                 </div>

                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: "visible" }}>
                   <defs>
                     <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                       <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                       <stop offset="50%" stopColor="#818cf8" stopOpacity="0.15" />
                       <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
                     </linearGradient>
                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur stdDeviation="3.5" result="blur" />
                       <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                     <filter id="lineShadow">
                       <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.3" />
                     </filter>
                   </defs>
                   
                   {/* Gradient Fill under smooth path */}
                   <path
                     fill="url(#lineGradient)"
                     d={`${getSmoothPath(chartDataPoints)} L 100,100 L 0,100 Z`}
                   />
                   
                   {/* Smooth Curved Line matching reference glow and style */}
                   <path
                     fill="none"
                     stroke="#a78bfa"
                     strokeWidth="2.8"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d={getSmoothPath(chartDataPoints)}
                     style={{ filter: `drop-shadow(0 0 16px rgba(167, 139, 250, 0.6))` }}
                   />

                   {/* Data Point Dots matching reference */}
                   {chartDataPoints.split(" ").map((point, i) => {
                     if (!point) return null;
                     const [x, y] = point.split(",");
                     const isPeak = i === 1; // Aug is peak (index 1)
                     return (
                       <g key={i}>
                         <circle cx={x} cy={y} r={isPeak ? "8" : "5"} fill="#a78bfa" opacity="0.3" />
                         <circle cx={x} cy={y} r={isPeak ? "5" : "3.5"} fill="#ffffff" stroke="#8b5cf6" strokeWidth="2.5" />
                         {isPeak && (
                           <circle cx={x} cy={y} r="8" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4">
                             <animate attributeName="r" from="8" to="14" dur="2s" repeatCount="indefinite" />
                             <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                           </circle>
                         )}
                       </g>
                     );
                   })}
                 </svg>
                 
                 {/* X-Axis Labels matching reference image ("Jul", "Aug", "Sep", "Oct", "Nov") */}
                 <div style={{ position: "absolute", bottom: "-28px", left: 0, right: 0, display: "flex", justifyContent: "space-between", fontSize: "12px", color: colors.textSecondary, fontWeight: 500 }}>
                   <span>Jul</span>
                   <span>Aug</span>
                   <span>Sep</span>
                   <span>Oct</span>
                   <span>Nov</span>
                 </div>
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
              <div style={{ background: colors.bg, padding: "18px 20px", borderRadius: "14px", border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, fontWeight: 500 }}>Videos Generated</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{loading ? "..." : totalClips}</div>
              </div>
              <div style={{ background: colors.bg, padding: "18px 20px", borderRadius: "14px", border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, fontWeight: 500 }}>Processing Time</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{loading ? "..." : `${hours}h ${minutes}m`}</div>
              </div>
              <div style={{ background: colors.bg, padding: "18px 20px", borderRadius: "14px", border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, fontWeight: 500 }}>Avg. Video Length</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{loading ? "..." : `${averageSeconds}s`}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "32px 24px", borderRadius: "20px", background: colors.card, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", boxShadow: shadows.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "0 8px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>Recent Jobs</h3>
              <Link href="/jobs" style={{ color: colors.accent, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                View All
              </Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: colors.textSecondary, fontSize: 14 }}>Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: colors.textSecondary, fontSize: 14 }}>No recent jobs found.</div>
              ) : (
                jobs.map((job) => {
                  const status = statusConfig[job.status?.toLowerCase()] || statusConfig.completed;
                  return (
                    <div key={job.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "14px", transition: "background 0.2s", cursor: "pointer" }} onMouseEnter={(e)=>e.currentTarget.style.background=colors.bg} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 72, height: 44, borderRadius: "8px", background: colors.bg, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {job.thumbnail ? <img src={job.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <div style={{ color: colors.textTertiary }}><Icons.Play /></div>}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{job.title || `Job #${job.id?.slice(0, 8)}`}</div>
                          <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 500 }}>{job.clip_count || 0} clips • {job.resolution || "1080x1920"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                        <span style={{ fontSize: 12, color: colors.textTertiary, fontWeight: 500 }}>
                          {job.created_at ? new Date(job.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Just now"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 32px", borderRadius: "16px", background: `linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, ${colors.card} 100%)`, border: `1px solid ${colors.borderHover}`, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: shadows.md }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ padding: "10px", background: colors.accentLight, borderRadius: "12px", color: colors.accent }}>
              <Icons.Sparkles />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 2 }}>AI Insight</div>
              <div style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 500 }}>Your generated videos perform best when they are 45-60 seconds long and include captions.</div>
            </div>
          </div>
          <Link href="/analytics" style={{ textDecoration: "none" }}>
            <button style={{ background: "transparent", border: `1px solid ${colors.border}`, color: colors.text, padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }} onMouseEnter={(e)=>{e.currentTarget.style.background=colors.border; e.currentTarget.style.borderColor=colors.textSecondary;}} onMouseLeave={(e)=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=colors.border;}}>
              View Analytics <Icons.ArrowUpRight />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// DASHBOARD LAYOUT
// ============================================================
function DashboardLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <DashboardContent />
    </div>
  );
}

// ============================================================
// LANDING PAGE (Unauthenticated State)
// ============================================================
function LandingPage() {
  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 90px)", overflow: "hidden" }}>
      {/* Background Aurora Wave Image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.8, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Image 
          src="/aurora-wave.png.png" 
          alt="Aurora Background" 
          fill 
          style={{ objectFit: "cover", objectPosition: "center 45%" }} 
          priority
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          maxWidth: 900,
          margin: "12vh auto 0 auto",
          padding: "0 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Glowing 4-Point Star Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", width: 72, height: 72, filter: `drop-shadow(0 0 40px rgba(167, 139, 250, 0.6))` }}>
             <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="35%" stopColor="#a78bfa" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#starGlow)" opacity="0.3" />
                <path d="M50 8 C50 35, 65 50, 92 50 C65 50, 50 65, 50 92 C50 65, 35 50, 8 50 C35 50, 50 35, 50 8 Z" fill="#ffffff" />
             </svg>
          </div>
        </div>

        {/* Small Badges */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          <span style={{ padding: "4px 14px", borderRadius: 24, fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", background: "rgba(167, 139, 250, 0.08)", color: "#c4b5fd", border: `1px solid rgba(167, 139, 250, 0.2)`, display: "flex", alignItems: "center", gap: 6 }}>
            <span>✨</span> AI Powered
          </span>
          <span style={{ padding: "4px 14px", borderRadius: 24, fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", background: "rgba(59, 130, 246, 0.08)", color: "#93c5fd", border: `1px solid rgba(59, 130, 246, 0.2)`, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🚀</span> v2.0 Live
          </span>
        </div>

        <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.04em", marginBottom: 24, color: colors.text }}>
          Turn long videos into
          <br />
          <span style={{ 
            background: "linear-gradient(to right, #60A5FA, #A78BFA, #C084FC)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent", 
            textShadow: `0 0 60px rgba(167, 139, 250, 0.4)` 
          }}>
            viral clips instantly
          </span>
        </h1>

        <p style={{ color: colors.textSecondary, fontSize: 18, lineHeight: 1.5, maxWidth: 540, margin: "0 auto 48px", fontWeight: 500 }}>
          Upload once. AI finds the strongest moments. Export ready for TikTok, Reels and Shorts in minutes.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <SignUpButton mode="modal">
            <button style={{
              padding: "16px 36px",
              borderRadius: 14,
              background: colors.gradientPrimary,
              color: "#FFFFFF",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: shadows.glow,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = shadows.glowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = shadows.glow;
            }}>
              Get Started Free <Icons.ArrowUpRight />
            </button>
          </SignUpButton>
          <Link href="/pricing" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "16px 36px",
              borderRadius: 14,
              background: "transparent",
              color: colors.text,
              border: `1px solid ${colors.border}`,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = colors.border;
            }}>
              View Pricing
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function Page() {
  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}} />

      <SignedIn>
        <DashboardLayout />
      </SignedIn>
      <SignedOut>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", background: "rgba(2, 4, 10, 0.75)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${colors.border}`, position: "sticky", top: 0, zIndex: 50 }}>
           <Logo size="md" />
           
           <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
             <Link href="/features" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color=colors.text} onMouseLeave={(e)=>e.currentTarget.style.color=colors.textSecondary}>Features</Link>
             <Link href="/pricing" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color=colors.text} onMouseLeave={(e)=>e.currentTarget.style.color=colors.textSecondary}>Pricing</Link>
             <Link href="/billing" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color=colors.text} onMouseLeave={(e)=>e.currentTarget.style.color=colors.textSecondary}>Billing</Link>
             <Link href="/docs" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color=colors.text} onMouseLeave={(e)=>e.currentTarget.style.color=colors.textSecondary}>Documentation</Link>
             <Link href="/faq" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color=colors.text} onMouseLeave={(e)=>e.currentTarget.style.color=colors.textSecondary}>FAQ</Link>
           </nav>

           <SignInButton mode="modal">
             <button style={{ background: "transparent", color: colors.text, border: `1px solid ${colors.border}`, padding: "10px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e)=> {e.currentTarget.style.borderColor=colors.accent; e.currentTarget.style.background="rgba(79, 70, 229, 0.1)";}} onMouseLeave={(e)=>{e.currentTarget.style.borderColor=colors.border; e.currentTarget.style.background="transparent";}}>
               Sign In
             </button>
           </SignInButton>
        </div>
        <LandingPage />
      </SignedOut>
    </div>
  );
}