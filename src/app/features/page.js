"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const colors = {
  bg: "#0A0E17",
  card: "rgba(18, 16, 35, 0.75)",
  cardHover: "rgba(28, 24, 55, 0.85)",
  border: "rgba(168, 85, 247, 0.08)",
  borderHover: "rgba(168, 85, 247, 0.25)",
  text: "#F8FAFC",
  textSecondary: "rgba(255,255,255,0.55)",
  textTertiary: "rgba(255,255,255,0.25)",
  accent: "#A855F7",
  accentHover: "#C084FC",
  accentLight: "rgba(168,85,247,0.06)",
  accentGlow: "rgba(168,85,247,0.2)",
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 28px",
        borderBottom: `1px solid ${scrolled ? colors.border : "transparent"}`,
        background: scrolled ? "rgba(10,14,23,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <div style={{ position: "relative", width: 140, height: 42 }}>
            <Image
              src="/logo.png"
              alt="ClipGenius Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/docs" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: "none" }}>
          Docs
        </Link>
        <Link href="/faq" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: "none" }}>
          FAQ
        </Link>
        <Link href="/features" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: "none" }}>
          Features
        </Link>
        <SignedOut>
          <Link href="/sign-in">
            <button
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                background: "transparent",
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(168,85,247,0.06)";
                e.currentTarget.style.color = colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                background: colors.accent,
                color: "#0A0E17",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: `0 0 20px ${colors.accentGlow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.accentHover;
                e.currentTarget.style.boxShadow = `0 0 30px ${colors.accentGlow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.accent;
                e.currentTarget.style.boxShadow = `0 0 20px ${colors.accentGlow}`;
              }}
            >
              Start Free
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </motion.nav>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      style={{
        padding: "24px",
        borderRadius: 14,
        background: colors.card,
        border: `1px solid ${colors.border}`,
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.borderHover;
        e.currentTarget.style.background = colors.cardHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.background = colors.card;
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "rgba(168, 85, 247, 0.12)",
          border: "1px solid rgba(168, 85, 247, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          marginBottom: 16,
          color: colors.accent,
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 8, letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
        {description}
      </p>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Clips",
      description: "Our AI analyzes your content to find the most engaging, viral moments automatically.",
    },
    {
      icon: "🔲",
      title: "Multiple Aspect Ratios",
      description: "Export clips in 9:16, 1:1, or 16:9 formats optimized for every platform.",
    },
    {
      icon: "💬",
      title: "Auto Subtitles",
      description: "Generate accurate captions automatically to boost retention and engagement.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Process long videos in minutes. Spend less time editing, more time growing.",
    },
    {
      icon: "🎯",
      title: "Smart Context Detection",
      description: "Understands context, emotions, and highlights to pick the best moments.",
    },
    {
      icon: "☁️",
      title: "Easy Upload & Import",
      description: "Upload files or import from YouTube, Twitch, and Kick with one click.",
    },
    {
      icon: "⬇️",
      title: "High Quality Exports",
      description: "Get crisp, high-quality clips ready to post anywhere.",
    },
    {
      icon: "✨",
      title: "Presets for Everyone",
      description: "Choose from ready-made presets for podcasts, gaming, sports, and more.",
    },
    {
      icon: "🛡️",
      title: "Safe & Private",
      description: "Your videos are secure and never shared. We respect your privacy.",
    },
  ];

  const steps = [
    {
      icon: "☁️",
      title: "1. Upload",
      description: "Upload your long video or paste a link from YouTube, Twitch, or Kick.",
    },
    {
      icon: "🧠",
      title: "2. AI Analyzes",
      description: "Our AI scans your video, detects highlights, and scores the best moments.",
    },
    {
      icon: "✂️",
      title: "3. Generate Clips",
      description: "Get multiple viral-ready clips in your chosen aspect ratio.",
    },
    {
      icon: "⬆️",
      title: "4. Download & Share",
      description: "Download your clips and share them anywhere to grow your audience.",
    },
  ];

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          margin: 0;
          padding: 0;
          background: #0A0E17;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(168,85,247,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.4); }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0A0E17", color: colors.text }}>
        <Navbar />
        <div style={{ maxWidth: 1060, margin: "40px auto 80px auto", padding: "0 20px" }}>
          
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                color: colors.accent,
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              Features
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", color: colors.text, lineHeight: 1.15, marginBottom: 16 }}>
              Everything you need to create <span style={{ color: colors.accent }}>viral clips</span>
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: 16, maxWidth: 580, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
              ClipGenius uses advanced AI to transform your long videos into engaging, viral-ready clips in minutes.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 80 }}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          {/* How It Works Section */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                color: colors.accent,
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              Simple Process
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: colors.text, marginBottom: 40 }}>
              How ClipGenius Works
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, position: "relative" }}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    padding: "24px 16px",
                    borderRadius: 14,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(168, 85, 247, 0.12)",
                      border: "1px solid rgba(168, 85, 247, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      marginBottom: 14,
                      color: colors.accent,
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 6 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5 }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div
            style={{
              padding: "40px",
              borderRadius: 16,
              background: colors.card,
              border: `1px solid ${colors.borderHover}`,
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                margin: "0 auto 16px auto",
                color: colors.accent,
                boxShadow: `0 0 25px ${colors.accentGlow}`,
              }}
            >
              🚀
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 8, letterSpacing: "-0.01em" }}>
              Ready to create viral clips?
            </h2>
            <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 24, maxWidth: 450, margin: "0 auto 24px auto" }}>
              Join thousands of creators who save hours and grow faster with ClipGenius.
            </p>
            <Link href="/sign-up">
              <button
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: colors.accent,
                  color: "#0A0E17",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: `0 0 25px ${colors.accentGlow}`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.accentHover;
                  e.currentTarget.style.boxShadow = `0 0 40px ${colors.accentGlow}`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.accent;
                  e.currentTarget.style.boxShadow = `0 0 25px ${colors.accentGlow}`;
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                Get Started →
              </button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}