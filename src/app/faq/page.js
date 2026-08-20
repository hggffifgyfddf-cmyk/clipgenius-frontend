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

function FAQItem({ icon, question, answer, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${isOpen ? colors.borderHover : colors.border}`,
        borderRadius: 14,
        marginBottom: 12,
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        if (!isOpen) e.currentTarget.style.borderColor = colors.borderHover;
      }}
      onMouseLeave={(e) => {
        if (!isOpen) e.currentTarget.style.borderColor = colors.border;
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 20px",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(168, 85, 247, 0.12)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: colors.accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: colors.text, letterSpacing: "-0.01em" }}>
            {question}
          </h4>
        </div>
        <span
          style={{
            fontSize: 14,
            color: colors.textTertiary,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          ▼
        </span>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          style={{
            padding: "0 20px 20px 70px",
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "General", "Billing", "Features", "Export & Clips", "Technical"];

  const faqs = [
    {
      icon: "✨",
      question: "What is ClipGenius?",
      answer: "ClipGenius is an AI-powered video clipping platform that automatically finds the most engaging moments in your videos and turns them into viral-ready short clips for TikTok, YouTube Shorts, Instagram Reels, and more.",
    },
    {
      icon: "🧠",
      question: "How does ClipGenius work?",
      answer: "Upload a video or paste a supported link, choose your settings, and our AI analyzes your content to detect the best moments. It then automatically generates high-quality clips optimized for social media.",
    },
    {
      icon: "🌐",
      question: "Which platforms are supported?",
      answer: "ClipGenius supports local video uploads as well as YouTube, Twitch, and Kick links. More platforms will be added over time.",
    },
    {
      icon: "⚡",
      question: "How long does processing take?",
      answer: "Most videos are processed within a few minutes. Processing time depends on the video's length, resolution, and the number of clips requested.",
    },
    {
      icon: "📽️",
      question: "Can I upload long videos?",
      answer: "Yes. ClipGenius is designed to process long-form content such as livestreams, podcasts, interviews, gaming sessions, and educational videos.",
    },
    {
      icon: "💬",
      question: "Does ClipGenius add subtitles?",
      answer: "Yes. You can enable automatic subtitles during generation, and ClipGenius will add accurate captions to your clips.",
    },
    {
      icon: "🔢",
      question: "Can I choose how many clips are generated?",
      answer: "Yes. You can select the maximum number of clips you want before generation starts.",
    },
    {
      icon: "📱",
      question: "Which aspect ratios are available?",
      answer: "You can generate clips in 9:16 (TikTok & Reels), 1:1 (Square), or 16:9 (YouTube).",
    },
    {
      icon: "🛡️",
      question: "Is my content private?",
      answer: "Yes. Your uploaded videos are processed securely and are only used to generate your requested clips.",
    },
    {
      icon: "👑",
      question: "Who owns the generated clips?",
      answer: "You retain full ownership of your original content and the clips generated from it.",
    },
    {
      icon: "💳",
      question: "Do unused credits expire?",
      answer: "Unused credits remain in your account according to your subscription plan. Check your plan details for specific credit policies.",
    },
    {
      icon: "🎙️",
      question: "Can I use ClipGenius for podcasts?",
      answer: "Yes. ClipGenius supports podcast content and continuously improves its AI to generate engaging podcast clips.",
    },
    {
      icon: "📁",
      question: "What video formats are supported?",
      answer: "ClipGenius supports popular video formats including MP4, MOV, and WEBM.",
    },
    {
      icon: "❌",
      question: "Can I cancel my subscription anytime?",
      answer: "Yes. You can manage or cancel your subscription at any time from your account settings.",
    },
    {
      icon: "🎧",
      question: "What if I need help?",
      answer: "Our support team is here to help. If you encounter any issues or have questions, contact us through the Feedback page or our support email.",
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
        <div style={{ maxWidth: 780, margin: "40px auto 80px auto", padding: "0 20px" }}>
          
          {/* Header Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: colors.text, marginBottom: 8 }}>
                Frequently Asked Questions
              </h1>
              <p style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 1.5 }}>
                Everything you need to know about ClipGenius.<br />
                Can't find the answer you're looking for?{" "}
                <a
                  href="mailto:support@clipgenius.com"
                  style={{ color: colors.accent, textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.accentHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.accent}
                >
                  Contact us
                </a>
              </p>
            </div>
            <div
              style={{
                width: 80,
                height: 70,
                borderRadius: 16,
                background: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: colors.accent,
                boxShadow: `0 0 30px ${colors.accentGlow}`,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>FAQ</span>
              <span style={{ fontSize: 16 }}>💬?</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    background: isActive ? colors.accent : colors.card,
                    color: isActive ? "#0A0E17" : colors.textSecondary,
                    border: `1px solid ${isActive ? colors.accent : colors.border}`,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? `0 0 20px ${colors.accentGlow}` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = colors.borderHover;
                      e.currentTarget.style.color = colors.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.color = colors.textSecondary;
                    }
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div style={{ marginBottom: 40 }}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                icon={faq.icon}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Bottom Support Banner */}
          <div
            style={{
              padding: "28px 32px",
              borderRadius: 16,
              background: colors.card,
              border: `1px solid ${colors.borderHover}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(168, 85, 247, 0.15)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: colors.accent,
                  boxShadow: `0 0 20px ${colors.accentGlow}`,
                }}
              >
                🎧
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 4 }}>
                  Still have questions?
                </h3>
                <p style={{ color: colors.textSecondary, fontSize: 13 }}>
                  Our support team is ready to help you.
                </p>
              </div>
            </div>
            <a href="mailto:support@clipgenius.com" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: colors.accent,
                  color: "#0A0E17",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: `0 0 20px ${colors.accentGlow}`,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.accentHover;
                  e.currentTarget.style.boxShadow = `0 0 35px ${colors.accentGlow}`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.accent;
                  e.currentTarget.style.boxShadow = `0 0 20px ${colors.accentGlow}`;
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                Contact Support ↗
              </button>
            </a>
          </div>

          {/* Footer Copyright */}
          <div style={{ marginTop: 40, textAlign: "center", display: "flex", justifyContent: "center", gap: 24, fontSize: 12, color: colors.textTertiary }}>
            <span>© 2026 ClipGenius. All rights reserved.</span>
            <Link href="/privacy" style={{ color: colors.textTertiary, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: colors.textTertiary, textDecoration: "none" }}>Terms of Service</Link>
          </div>

        </div>
      </div>
    </>
  );
}