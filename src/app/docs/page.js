"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Mail, Search, User, Upload, SlidersHorizontal, Sparkles, Download,
  LayoutDashboard, Folder, BarChart2, CreditCard, MessageSquare, Tag,
  HelpCircle, Shield, ArrowRight
} from "lucide-react";

const colors = {
  bg: "#06060B",
  card: "#0C0C14",
  border: "#1C1C28",
  borderHover: "#2D2D44",
  text: "#FFFFFF",
  textSecondary: "#8A8A9E",
  accent: "#8B5CF6", // Purple Accent
  accentDark: "#2B1B4D",
  accentText: "#C4B5FD",
  accentGlow: "rgba(139, 92, 246, 0.15)",
};

export default function DocsPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    { num: "1", icon: <User size={24} color={colors.accentText} />, title: "Create an Account", desc: "Sign up or log in to access your dashboard and start clipping." },
    { num: "2", icon: <Upload size={24} color={colors.accentText} />, title: "Upload a Video", desc: "Upload a video from your device or import from supported platforms." },
    { num: "3", icon: <SlidersHorizontal size={24} color={colors.accentText} />, title: "Choose a Preset", desc: "Select the content type that fits your video to let AI work its magic." },
    { num: "4", icon: <Sparkles size={24} color={colors.accentText} />, title: "Generate Clips", desc: "Click Generate and let ClipGenius analyze your content." },
    { num: "5", icon: <Download size={24} color={colors.accentText} />, title: "Download", desc: "Download your clips and share them across your favorite platforms." },
  ];

  const docs = [
    { icon: <LayoutDashboard size={20} color={colors.accentText} />, title: "Dashboard", desc: "Overview of your activity, stats, and recent projects." },
    { icon: <Folder size={20} color={colors.accentText} />, title: "Jobs", desc: "Track your renders, view progress and results." },
    { icon: <BarChart2 size={20} color={colors.accentText} />, title: "Analytics", desc: "Deep insights into your clips and performance." },
    { icon: <CreditCard size={20} color={colors.accentText} />, title: "Credits", desc: "Learn how credits work and manage usage." },
    { icon: <MessageSquare size={20} color={colors.accentText} />, title: "Feedback", desc: "Report bugs, request features or share suggestions." },
    { icon: <Tag size={20} color={colors.accentText} />, title: "Pricing", desc: "View our plans and find the best one for you." },
    { icon: <HelpCircle size={20} color={colors.accentText} />, title: "FAQ", desc: "Find answers to common questions." },
    { icon: <Shield size={20} color={colors.accentText} />, title: "Legal", desc: "Read our policies and terms of service." },
  ];

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          margin: 0; 
          padding: 0; 
          background: ${colors.bg}; 
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif; 
          -webkit-font-smoothing: antialiased; 
          -moz-osx-font-smoothing: grayscale; 
          color: ${colors.text};
        }
        
        /* Grid Layouts */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
          .docs-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-container { flex-direction: column; text-align: center; }
          .hero-search { margin: 0 auto; }
          .hero-graphic { margin-top: 40px; }
        }
        
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr; }
          .docs-grid { grid-template-columns: 1fr; }
          .top-nav { flex-direction: column; gap: 16px; }
        }

        /* Hover Effects */
        .doc-card {
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .doc-card:hover {
          border-color: ${colors.borderHover};
          background-color: #12121E;
        }
      `}</style>

      <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
        
        {/* Top Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            padding: "20px 40px",
            background: scrolled ? "rgba(6, 6, 11, 0.9)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? `1px solid ${colors.border}` : "1px solid transparent",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.3s ease",
          }}
          className="top-nav"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image
              src="/logo.png"
              alt="ClipGenius"
              width={40}
              height={40}
              priority
              style={{ objectFit: "contain" }}
            />
            <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>ClipGenius</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ 
              display: "flex", alignItems: "center", background: colors.card, 
              padding: "8px 16px", borderRadius: "100px", border: `1px solid ${colors.border}`, 
              fontSize: "13px" 
            }}>
              <Mail size={14} style={{ marginRight: "8px", color: colors.textSecondary }} />
              <span style={{ color: colors.text, marginRight: "12px", fontWeight: 500 }}>Contact Support</span>
              <span style={{ color: colors.accent, fontWeight: 500 }}>support@clipgenius.ai</span>
            </div>
            
            <SignedOut>
              <Link href="/sign-in" style={{ color: colors.textSecondary, textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="hero-container" style={{ 
          maxWidth: "1240px", margin: "0 auto", padding: "80px 20px", 
          display: "flex", justifyContent: "space-between", alignItems: "center" 
        }}>
          <div style={{ maxWidth: "560px" }}>
            <div style={{ 
              background: colors.accentDark, color: colors.accentText, 
              fontSize: "10px", fontWeight: 700, padding: "4px 10px", 
              borderRadius: "4px", display: "inline-block", marginBottom: "24px", 
              letterSpacing: "0.08em", textTransform: "uppercase" 
            }}>
              DOCUMENTATION
            </div>
            <h1 style={{ fontSize: "44px", fontWeight: 700, marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: "1.1" }}>
              Welcome to <span style={{ color: colors.accent }}>ClipGenius</span>
            </h1>
            <p style={{ fontSize: "16px", color: colors.textSecondary, marginBottom: "32px", lineHeight: "1.6" }}>
              Your all-in-one AI video clipping platform.<br />
              Create viral clips. Save time. Grow everywhere.
            </p>
            
            <div className="hero-search" style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
              <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search documentation..."
                style={{ 
                  width: "100%", padding: "16px 16px 16px 48px", 
                  background: colors.card, border: `1px solid ${colors.border}`, 
                  borderRadius: "8px", color: colors.text, fontSize: "14px", outline: "none",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = colors.accent}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "4px" }}>
                <kbd style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.textSecondary, padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" }}>⌘</kbd>
                <kbd style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.textSecondary, padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" }}>K</kbd>
              </div>
            </div>
          </div>
          
          <div className="hero-graphic" style={{ position: "relative", width: "320px", height: "320px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ 
              position: "absolute", width: "220px", height: "220px", 
              background: colors.accent, filter: "blur(120px)", opacity: 0.2, borderRadius: "50%" 
            }}></div>
            <Image
              src="/logo.png"
              alt="ClipGenius Logo"
              width={260}
              height={260}
              priority
              style={{ objectFit: "contain", zIndex: 1, filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.2))" }}
            />
          </div>
        </div>

        {/* Getting Started Section */}
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px 60px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: colors.text, marginBottom: "24px" }}>Getting Started</h2>
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.num} style={{ 
                background: colors.card, border: `1px solid ${colors.border}`, 
                borderRadius: "12px", padding: "28px 20px 24px", position: "relative", 
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" 
              }}>
                <div style={{ 
                  position: "absolute", top: "-14px", left: "20px", width: "28px", height: "28px", 
                  background: colors.accent, color: colors.text, borderRadius: "50%", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  fontSize: "12px", fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                }}>
                  {step.num}
                </div>
                <div style={{ marginBottom: "16px" }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: "14px", color: colors.text, marginBottom: "8px", fontWeight: 600 }}>{step.title}</h3>
                <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.5" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Grid */}
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px 40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: colors.text, marginBottom: "24px" }}>Documentation</h2>
          <div className="docs-grid">
            {docs.map((doc) => (
              <div key={doc.title} className="doc-card" style={{ 
                background: colors.card, border: `1px solid ${colors.border}`, 
                borderRadius: "12px", padding: "20px", display: "flex", 
                alignItems: "center", cursor: "pointer"
              }}>
                <div style={{ 
                  width: "44px", height: "44px", borderRadius: "10px", 
                  background: colors.accentGlow, display: "flex", 
                  alignItems: "center", justifyContent: "center", marginRight: "16px", flexShrink: 0 
                }}>
                  {doc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "15px", color: colors.text, fontWeight: 600, marginBottom: "4px" }}>{doc.title}</h3>
                  <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.4" }}>{doc.desc}</p>
                </div>
                <div style={{ marginLeft: "16px", color: colors.textSecondary }}>
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}

            {/* Support/Need Help Card */}
            <div style={{ 
              background: "linear-gradient(145deg, rgba(43, 27, 77, 0.4) 0%, rgba(12, 12, 20, 1) 100%)", 
              border: `1px solid ${colors.borderHover}`, borderRadius: "12px", 
              padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" 
            }}>
              <h3 style={{ fontSize: "15px", color: colors.text, fontWeight: 600, marginBottom: "6px" }}>Need Help?</h3>
              <p style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "20px" }}>Our support team is here for you.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <a href="mailto:support@clipgenius.ai" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    background: colors.accent, color: colors.text, border: "none", 
                    borderRadius: "6px", padding: "8px 16px", fontSize: "12px", 
                    fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", 
                    cursor: "pointer", transition: "opacity 0.2s ease" 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <Mail size={14} /> Contact Support
                  </button>
                </a>
                <span style={{ color: colors.accentText, fontSize: "12px", fontWeight: 500 }}>support@clipgenius.ai</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </>
  );
}