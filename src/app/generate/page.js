"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const theme = {
  bg: "#080811",
  sidebar: "#0D0E17",
  card: "#12131F",
  cardHover: "#171926",
  border: "#1E2032",
  borderLight: "#2A2D42",
  text: "#FFFFFF",
  textSecondary: "#9CA3AF",
  textTertiary: "#6B7280",
  accent: "#5B44F2",
  accentHover: "#4935D4",
  accentLight: "rgba(91, 68, 242, 0.1)",
  accentGlow: "rgba(91, 68, 242, 0.3)",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.1)",
  warning: "#F59E0B",
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

const FeatureCards = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 32 }}>
    {[
      { icon: "🛡️", title: "AI-Powered", desc: "Advanced AI finds the most viral moments automatically" },
      { icon: "✨", title: "Smart Detection", desc: "Detects insights, highlights, and key elements" },
      { icon: "CC", title: "Auto Captions", desc: "Adds accurate subtitles automatically" },
      { icon: "🚀", title: "Fast & Easy", desc: "Get your clips in minutes, ready to share" }
    ].map((feature, i) => (
      <div key={i} style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        transition: "all 0.2s ease"
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: theme.accentLight, color: theme.accent,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
          border: `1px solid rgba(91,68,242,0.2)`
        }}>
          {feature.icon}
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{feature.title}</h4>
          <p style={{ fontSize: 11, color: theme.textSecondary, lineHeight: 1.4 }}>{feature.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

function StepUpload({ file, setFile, youtubeUrl, setYoutubeUrl, onNext, isUploading, uploadProgress }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const isValid = file !== null || youtubeUrl.trim() !== "";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 8 }}>
          Upload Your <span style={{ color: "#B48BFF" }}>Video</span>
        </h2>
        <p style={{ color: theme.textSecondary, fontSize: 15 }}>Drag & drop or paste a link to get started</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        <div
          style={{
            border: `2px dashed ${isDragging ? theme.accent : file ? theme.success : theme.borderLight}`,
            borderRadius: 16,
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? theme.accentLight : theme.card,
            transition: "all 0.2s ease",
            display: "flex", flexFlow: "column", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => document.getElementById("fileInput").click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="fileInput"
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />
          {file ? (
            <div>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.successBg, color: theme.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: theme.text }}>{file.name}</div>
              <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6 }}>
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                style={{
                  marginTop: 16, padding: "6px 16px", borderRadius: 8, background: theme.errorBg, color: theme.error, border: "none", fontSize: 13, cursor: "pointer", fontWeight: 500
                }}
              >
                Remove File
              </button>
            </div>
          ) : (
            <div>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.accentLight, border: `1px solid rgba(91,68,242,0.3)`, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>
                ☁️
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: theme.text }}>
                {isDragging ? "Drop video here" : "Drag & Drop your video here"}
              </div>
              <div style={{ fontSize: 14, color: theme.accent, marginTop: 8, fontWeight: 500 }}>or click to browse files</div>
              <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 12 }}>MP4, MOV, WEBM up to 500MB</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: theme.text, fontWeight: 500, marginBottom: 12 }}>
              🔗 Or paste a link
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube, Twitch, or Kick link here..."
                style={{
                  width: "100%", padding: "14px 16px 14px 40px", borderRadius: 12, border: `1px solid ${theme.borderLight}`, background: theme.card, color: theme.text, fontSize: 14, outline: "none", transition: "all 0.2s ease"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accentLight}`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = theme.borderLight; e.currentTarget.style.boxShadow = "none"; }}
              />
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: theme.textTertiary, fontSize: 14 }}>🔗</span>
            </div>
            <button
              onClick={() => {}}
              style={{
                width: "100%", padding: "12px", borderRadius: 10, background: theme.borderLight, color: theme.text, border: "none", fontSize: 14, fontWeight: 500, marginTop: 12, cursor: "pointer", transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#35384F"}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.borderLight}
            >
              Add Link
            </button>
          </div>

          <div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 12 }}>Supported Platforms</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { src: "/youtube.svg", alt: "YouTube" },
                { src: "/twitch.svg", alt: "Twitch" },
                { src: "/kick.svg", alt: "Kick" }
              ].map((platform, i) => (
                <div
                  key={i}
                  style={{
                    width: 40, height: 40, borderRadius: 10, background: theme.card, border: `1px solid ${theme.borderLight}`,
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = theme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = theme.borderLight;
                  }}
                >
                  <img src={platform.src} alt={platform.alt} style={{ width: 20, height: 20, objectFit: "contain" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isUploading && (
        <div style={{ marginTop: 24, background: theme.card, padding: 16, borderRadius: 12, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textSecondary, marginBottom: 8 }}>
            <span>Uploading your video...</span>
            <span style={{ color: theme.accent, fontWeight: 500 }}>{uploadProgress}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: theme.border, borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{ width: `${uploadProgress}%`, height: "100%", background: theme.accent, borderRadius: 3, transition: "none" }}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <button
          onClick={onNext}
          disabled={!isValid || isUploading}
          style={{
            width: "100%", maxWidth: 400, padding: "16px", borderRadius: 12,
            background: isValid && !isUploading ? theme.accent : theme.borderLight,
            color: isValid && !isUploading ? "#FFFFFF" : theme.textTertiary,
            border: "none", fontSize: 16, fontWeight: 600, cursor: isValid && !isUploading ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            boxShadow: isValid && !isUploading ? `0 4px 20px ${theme.accentGlow}` : "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}
          onMouseEnter={(e) => { if (isValid && !isUploading) e.currentTarget.style.background = theme.accentHover; }}
          onMouseLeave={(e) => { if (isValid && !isUploading) e.currentTarget.style.background = theme.accent; }}
        >
          Continue <span style={{ fontSize: 18 }}>→</span>
        </button>
        <div style={{ fontSize: 12, color: theme.textTertiary, display: "flex", alignItems: "center", gap: 6 }}>
          🔒 Your files are secure and only used for clip generation
        </div>
      </div>

      <FeatureCards />
    </motion.div>
  );
}

function StepSettings({
  clipLength, setClipLength, maxClips, setMaxClips, ratio, setRatio, subtitleOn, setSubtitleOn,
  subtitleColor, setSubtitleColor, acceptTerms, setAcceptTerms, credits, onBack, onGenerate, generating,
}) {
  const subtitleColors = [
    { id: "white", color: "#ffffff", label: "Aa" },
    { id: "yellow", color: "#facc15", label: "Aa" },
    { id: "green", color: "#22c55e", label: "Aa" },
    { id: "red", color: "#ef4444", label: "Aa" },
    { id: "blue", color: "#3b82f6", label: "Aa" },
  ];

  const canGenerate = acceptTerms && credits >= maxClips;

  const InputLabel = ({ children, tooltip }) => (
    <label style={{ fontSize: 13, color: theme.text, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      {children}
      {tooltip && <span style={{ color: theme.textTertiary, fontSize: 12, cursor: "help" }}>ⓘ</span>}
    </label>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        
        <div>
          <div style={{ background: theme.card, borderRadius: 16, padding: 24, border: `1px solid ${theme.borderLight}` }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.text, display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <span style={{ color: theme.accent }}>⚙</span> Configure Your Clip
            </h3>

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: theme.accent }}>⚡</span> Clip Settings
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div>
                  <InputLabel tooltip>Clip Length</InputLabel>
                  <select
                    value={clipLength}
                    onChange={(e) => setClipLength(parseInt(e.target.value) || 0)}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${theme.borderLight}`, background: theme.sidebar, color: theme.text, fontSize: 14, outline: "none", appearance: "none" }}
                  >
                    <option value={15}>15 seconds</option>
                    <option value={18}>18 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                  </select>
                  <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 6 }}>Recommended: 15-30 seconds</div>
                </div>
                <div>
                  <InputLabel tooltip>Maximum Clips</InputLabel>
                  <select
                    value={maxClips}
                    onChange={(e) => setMaxClips(parseInt(e.target.value) || 0)}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${theme.borderLight}`, background: theme.sidebar, color: theme.text, fontSize: 14, outline: "none", appearance: "none" }}
                  >
                    {[1, 3, 5, 10, 15].map(num => (
                      <option key={num} value={num}>{num} clips</option>
                    ))}
                  </select>
                  <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 6 }}>More clips cost more credits</div>
                </div>
                <div>
                  <InputLabel tooltip>Aspect Ratio</InputLabel>
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${theme.borderLight}`, background: theme.sidebar, color: theme.text, fontSize: 14, outline: "none", appearance: "none" }}
                  >
                    <option value="9:16">9:16 (TikTok/Reels)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (YouTube)</option>
                  </select>
                  <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 6 }}>Best for short-form content</div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: theme.borderLight, margin: "24px 0" }} />

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: theme.accent }}>✨</span> AI Features
              </div>
              <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
                <div>
                  <InputLabel tooltip>Subtitles</InputLabel>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setSubtitleOn(!subtitleOn)}
                      style={{
                        width: 44, height: 24, borderRadius: 12, background: subtitleOn ? theme.accent : theme.borderLight,
                        position: "relative", border: "none", cursor: "pointer", transition: "all 0.3s ease"
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "#FFF", position: "absolute", top: 3,
                        left: subtitleOn ? 23 : 3, transition: "all 0.3s ease"
                      }} />
                    </button>
                    <span style={{ fontSize: 12, color: theme.textSecondary }}>Automatically generate accurate<br/>subtitles</span>
                  </div>
                </div>

                {subtitleOn && (
                  <div>
                    <InputLabel tooltip>Subtitle Style</InputLabel>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div
                         onClick={() => setSubtitleColor("black")}
                         style={{
                           width: 32, height: 32, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
                           border: subtitleColor === "black" ? `2px solid ${theme.accent}` : `1px solid ${theme.borderLight}`,
                           cursor: "pointer", fontSize: 12, color: "#FFF", fontWeight: 600
                         }}
                      >Aa</div>
                      {subtitleColors.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSubtitleColor(c.id)}
                          style={{
                            width: 32, height: 32, borderRadius: 8, background: c.color, display: "flex", alignItems: "center", justifyContent: "center",
                            border: subtitleColor === c.id ? `2px solid ${theme.accent}` : `1px solid ${theme.borderLight}`,
                            cursor: "pointer", fontSize: 12, color: c.id === "white" || c.id === "yellow" ? "#000" : "#FFF", fontWeight: 600
                          }}
                        >
                          {c.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: 1, background: theme.borderLight, margin: "24px 0" }} />

            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: theme.accent }}>⚙️</span> Advanced Options
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <InputLabel tooltip>AI Model</InputLabel>
                  <select style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${theme.borderLight}`, background: theme.sidebar, color: theme.text, fontSize: 14, outline: "none", appearance: "none" }}>
                    <option>ClipGenius AI (Recommended)</option>
                  </select>
                  <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 6 }}>Our most advanced model for viral clips</div>
                </div>
                <div>
                  <InputLabel tooltip>Highlight Detection</InputLabel>
                  <select style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${theme.borderLight}`, background: theme.sidebar, color: theme.text, fontSize: 14, outline: "none", appearance: "none" }}>
                    <option>Auto (Recommended)</option>
                  </select>
                  <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 6 }}>AI will automatically find the best moments</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: theme.card, borderRadius: 16, padding: 24, border: `1px solid ${theme.borderLight}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              📄 Summary
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>🕒 Clip Length</span>
                <span style={{ color: theme.text, fontWeight: 500 }}>{clipLength} seconds</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>🎞️ Maximum Clips</span>
                <span style={{ color: theme.text, fontWeight: 500 }}>{maxClips} clips</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>📱 Aspect Ratio</span>
                <span style={{ color: theme.text, fontWeight: 500 }}>{ratio === "9:16" ? "9:16 (Portrait)" : ratio}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>CC Subtitles</span>
                <span style={{ color: theme.text, fontWeight: 500 }}>{subtitleOn ? "On" : "Off"}</span>
              </div>
              <div style={{ height: 1, background: theme.borderLight, margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>🪙 Credits Required</span>
                <span style={{ color: theme.accent, fontWeight: 600 }}>{maxClips} credits</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>⏱️ Est. Processing Time</span>
                <span style={{ color: theme.text, fontWeight: 500 }}>2-5 minutes</span>
              </div>
            </div>

            <div style={{ 
              marginTop: 16, padding: 12, borderRadius: 8, 
              background: credits >= maxClips ? theme.successBg : theme.errorBg, 
              border: `1px solid ${credits >= maxClips ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{ color: credits >= maxClips ? theme.success : theme.error, fontSize: 16 }}>
                {credits >= maxClips ? "✓" : "❌"}
              </span>
              <div style={{ fontSize: 12, color: credits >= maxClips ? theme.success : theme.error }}>
                <div style={{ fontWeight: 600 }}>{credits >= maxClips ? "You have more than enough credits" : "Insufficient Credits"}</div>
                <div style={{ opacity: 0.8, marginTop: 2 }}>This generation will cost {maxClips} credits. Balance: {credits}</div>
              </div>
            </div>
          </div>

          <div style={{ background: theme.card, borderRadius: 16, padding: 24, border: `1px solid ${theme.borderLight}` }}>
             <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              💡 Tips
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: theme.textSecondary, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>Shorter clips (15-30s) perform best</li>
              <li>9:16 ratio gets more views on mobile</li>
              <li>AI will find the most viral moments</li>
              <li>Subtitles increase engagement by 80%</li>
            </ul>
          </div>

        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <button
          onClick={onBack}
          style={{
            padding: "12px 24px", borderRadius: 10, background: theme.card, color: theme.text, border: `1px solid ${theme.borderLight}`,
            fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.borderLight}
          onMouseLeave={(e) => e.currentTarget.style.background = theme.card}
        >
          ← Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
           <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: theme.accent }}
            />
            <span style={{ fontSize: 12, color: theme.textSecondary }}>
              I agree to the Terms & Conditions and own this content.
            </span>
          </label>
          <button
            onClick={onGenerate}
            disabled={!canGenerate || generating}
            style={{
              padding: "14px 32px", borderRadius: 10,
              background: canGenerate && !generating ? theme.accent : theme.borderLight,
              color: canGenerate && !generating ? "#FFFFFF" : theme.textTertiary,
              border: "none", fontSize: 15, fontWeight: 600, cursor: canGenerate && !generating ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              boxShadow: canGenerate && !generating ? `0 4px 20px ${theme.accentGlow}` : "none",
            }}
          >
            {generating ? "Generating..." : "Continue to Generate →"}
          </button>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: theme.textTertiary }}>
        🔒 Your settings are saved automatically
      </div>
    </motion.div>
  );
}

function StepProgress({
  progress, currentStep, stepMessages, progressMessages, elapsedTime, estimatedTime,
  isComplete, hasError, errorMessage, onReset,
}) {
  const stepList = Object.keys(stepMessages).filter(key => key !== "complete");
  const currentStepIndex = stepList.indexOf(currentStep);

  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return "0m 0s";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      
      <div style={{ background: theme.card, borderRadius: 16, padding: 32, border: `1px solid ${theme.borderLight}`, minHeight: 400 }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.accentLight, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
            {isComplete ? "✨" : hasError ? "❌" : "✨"}
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: isComplete ? theme.success : hasError ? theme.error : theme.text, margin: 0 }}>
              {isComplete ? "Clips Generated!" : hasError ? "Generation Failed" : "AI is working..."}
            </h2>
            <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4, margin: "4px 0 0 0" }}>
              {isComplete ? "Your clips are ready to view and download." : hasError ? errorMessage : "This may take a few minutes."}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
           {stepList.map((stepKey, index) => {
             const isDone = index < currentStepIndex || isComplete;
             const isActive = index === currentStepIndex && !isComplete && !hasError;
             const label = stepMessages[stepKey] || stepKey;
             
             if (index > currentStepIndex + 2 || index < currentStepIndex - 3) return null;

             return (
               <div key={stepKey} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${theme.borderLight}` }}>
                 <div style={{ 
                   width: 20, height: 20, borderRadius: "50%", 
                   border: isDone ? "none" : `2px solid ${isActive ? theme.accent : theme.borderLight}`,
                   background: isDone ? theme.success : "transparent",
                   display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff"
                 }}>
                   {isDone && "✓"}
                 </div>
                 <span style={{ fontSize: 14, color: isDone ? theme.textSecondary : isActive ? theme.accent : theme.textTertiary, fontWeight: isActive ? 600 : 400 }}>
                   {label}
                 </span>
                 {isActive && (
                   <span style={{ marginLeft: "auto", fontSize: 12, color: theme.accent, fontWeight: 600 }}>
                     {Math.round(progress)}%
                   </span>
                 )}
               </div>
             );
           })}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, color: theme.text, marginBottom: 8 }}>
            <span>Overall Progress</span>
            <span>{isComplete ? "100%" : hasError ? "Error" : `${Math.round(progress)}%`}</span>
          </div>
          <div style={{ width: "100%", height: 8, background: theme.borderLight, borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                width: `${isComplete ? 100 : hasError ? 100 : progress}%`,
                height: "100%",
                background: isComplete ? theme.success : hasError ? theme.error : `linear-gradient(90deg, ${theme.accent}, #8B5CF6)`,
                transition: "none",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: theme.sidebar, borderRadius: 12, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: theme.textSecondary }}>
            <span>⏱️</span>
            <span>Estimated time: {formatTime(estimatedTime || 138)}</span>
          </div>
          {!isComplete && !hasError && (
            <div style={{ fontSize: 13, color: theme.accent }}>
              You can keep this tab open. We'll notify you when it's done.
            </div>
          )}
          {isComplete && (
            <Link href="/jobs">
              <button style={{
                padding: "8px 24px", borderRadius: 8, background: theme.accent, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}>
                View Clips
              </button>
            </Link>
          )}
          {hasError && (
            <button onClick={onReset} style={{
              padding: "8px 24px", borderRadius: 8, background: theme.error, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
              Try Again
            </button>
          )}
        </div>

      </div>

      <FeatureCards />
    </motion.div>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [clipLength, setClipLength] = useState(18);
  const [maxClips, setMaxClips] = useState(5);
  const [ratio, setRatio] = useState("9:16");
  const [subtitleOn, setSubtitleOn] = useState(true);
  const [subtitleColor, setSubtitleColor] = useState("white");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [credits, setCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(false);

  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("starting");
  const [progressMessages, setProgressMessages] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentJobId, setCurrentJobId] = useState(null);

  // EXACTLY what the worker sends - NOTHING MORE, NOTHING LESS
  const stepMessages = {
    starting: "Starting AI engine...",
    detecting_stream_type: "Detecting stream type...",
    downloading: "Downloading video...",
    uploading: "Uploading video...",
    extracting_audio: "Extracting audio...",
    analyzing_audio: "Analyzing audio energy...",
    optical_flow: "Detecting motion...",
    detecting_faces: "Detecting faces...",
    scene_detection: "Detecting scene changes...",
    candidate_windows: "Finding best moments...",
    ai_analyzing: "AI analyzing moments...",
    detecting_viral: "Finding viral moments...",
    generating_hooks: "Creating hooks...",
    generating_thumbnails: "Generating thumbnails...",
    cutting_clips: "Cutting clips...",
    adding_subtitles: "Applying subtitles...",
    rendering_clips: "Rendering clips...",
    exporting: "Exporting clips...",
    uploading_final: "Uploading clips...",
    complete: "Complete!"
  };

  async function loadCredits() {
    try {
      setLoadingCredits(true);
      const res = await fetch("/api/credits");
      const data = await res.json();
      if (data.balance !== undefined) setCredits(data.balance);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCredits(false);
    }
  }

  useEffect(() => {
    loadCredits();
  }, []);

  useEffect(() => {
    if (!currentJobId) return;

    const channel = supabase
      .channel(`job-${currentJobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
          filter: `id=eq.${currentJobId}`,
        },
        (payload) => {
          const job = payload.new;
          const prog = job.progress || 0;
          const step = job.current_step || "starting";
          const status = job.status;

          setProgress(prog);
          setCurrentStep(step);

          const message = stepMessages[step] || step;
          setProgressMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last !== message) {
              return [...prev, message];
            }
            return prev;
          });

          if (status === "completed" || prog === 100) {
            setIsComplete(true);
            setCreating(false);
            setGenerating(false);
            setProgress(100);
            setCurrentStep("complete");
            setProgressMessages((prev) => [...prev, "Complete!"]);
          }

          if (status === "failed") {
            setHasError(true);
            setCreating(false);
            setGenerating(false);
            setErrorMessage(job.error_message || "Job failed");
            setProgressMessages((prev) => [...prev, `Failed: ${job.error_message || "Job failed"}`]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentJobId]);

  useEffect(() => {
    let timeInterval;
    if (creating && !isComplete && !hasError) {
      const startTime = Date.now() - elapsedTime * 1000;
      timeInterval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timeInterval);
  }, [creating, isComplete, hasError]);

  useEffect(() => {
    if (!creating || isComplete || hasError) return;

    const etaInterval = setInterval(() => {
      if (progress > 0 && elapsedTime > 5) {
        const speed = progress / elapsedTime;
        const remaining = (100 - progress) / speed;
        setEstimatedTime(remaining);
      } else {
        setEstimatedTime(480);
      }
    }, 3000);

    return () => clearInterval(etaInterval);
  }, [creating, isComplete, hasError, progress, elapsedTime]);

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleGenerate = async () => {
    if (!acceptTerms) {
      alert("You must confirm content ownership.");
      return;
    }
    if (!file && !youtubeUrl) {
      alert("Upload video or paste a link.");
      return;
    }
    if (credits < maxClips) {
      alert(`Insufficient credits. Need ${maxClips}, have ${credits}.`);
      return;
    }

    setGenerating(true);
    setCreating(true);
    setStep(3);
    setProgressMessages([]);
    setProgress(0);
    setCurrentStep("starting");
    setElapsedTime(0);
    setEstimatedTime(null);
    setIsComplete(false);
    setHasError(false);
    setErrorMessage("");

    try {
      let videoPath = null;

      if (file) {
        setIsUploading(true);
        const resUpload = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        const { uploadUrl, path } = await resUpload.json();

        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          });
          xhr.onload = () => {
            if (xhr.status === 200) resolve();
            else reject(new Error("Upload failed"));
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
        videoPath = path;
        setIsUploading(false);
        setUploadProgress(100);
      }

      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          clipLength, 
          maxClips, 
          ratio, 
          subtitleOn, 
          subtitleColor, 
          videoPath, 
          youtubeUrl 
        }),
      });

      const text = await res.text();
      const json = safeJson(text);
      if (!res.ok) throw new Error(json?.error || "Job failed");

      if (json.job?.id) {
        setCurrentJobId(json.job.id);
      }

      await fetch("/api/credits/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: maxClips, jobId: json.job?.id }),
      });

      setFile(null);
      setYoutubeUrl("");

    } catch (e) {
      setHasError(true);
      setErrorMessage(e.message);
      setCreating(false);
      setGenerating(false);
      alert("Error: " + e.message);
    }
  };

  const handleReset = () => {
    setStep(1);
    setGenerating(false);
    setCreating(false);
    setProgress(0);
    setCurrentStep("starting");
    setProgressMessages([]);
    setElapsedTime(0);
    setEstimatedTime(null);
    setIsComplete(false);
    setHasError(false);
    setErrorMessage("");
    setCurrentJobId(null);
    setFile(null);
    setYoutubeUrl("");
    setAcceptTerms(false);
  };

  return (
    <SignedIn>
      <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <Link href="/" style={{ color: theme.textSecondary, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/logo-play.svg.png" alt="Play Logo" style={{ width: 24, height: 24, objectFit: "contain" }} />
              Back to Dashboard
            </Link>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {[
                { num: 1, label: "Upload", desc: "Video uploaded" },
                { num: 2, label: "Configure", desc: "Adjust your settings" },
                { num: 3, label: "Generate", desc: "AI creates your clips" }
              ].map((s, idx) => (
                <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: step >= s.num ? theme.accent : theme.card,
                      border: `1px solid ${step >= s.num ? theme.accent : theme.borderLight}`,
                      color: step >= s.num ? "#fff" : theme.textSecondary,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600,
                      boxShadow: step === s.num ? `0 0 20px ${theme.accentGlow}` : "none",
                      transition: "all 0.3s ease"
                    }}>
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: step >= s.num ? theme.text : theme.textSecondary }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: theme.textTertiary, display: step === s.num ? "block" : "none" }}>{s.desc}</div>
                    </div>
                  </div>
                  {idx < 2 && (
                    <div style={{ width: 80, height: 2, background: step > s.num ? theme.accent : theme.borderLight, marginTop: -20, transition: "background 0.3s ease" }} />
                  )}
                </div>
              ))}
            </div>

            <UserButton />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepUpload
                key="step1"
                file={file}
                setFile={setFile}
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                onNext={handleNext}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
            )}
            {step === 2 && (
              <StepSettings
                key="step2"
                clipLength={clipLength}
                setClipLength={setClipLength}
                maxClips={maxClips}
                setMaxClips={setMaxClips}
                ratio={ratio}
                setRatio={setRatio}
                subtitleOn={subtitleOn}
                setSubtitleOn={setSubtitleOn}
                subtitleColor={subtitleColor}
                setSubtitleColor={setSubtitleColor}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                credits={credits}
                onBack={handleBack}
                onGenerate={handleGenerate}
                generating={generating}
              />
            )}
            {step === 3 && (
              <StepProgress
                key="step3"
                progress={progress}
                currentStep={currentStep}
                stepMessages={stepMessages}
                progressMessages={progressMessages}
                elapsedTime={elapsedTime}
                estimatedTime={estimatedTime}
                isComplete={isComplete}
                hasError={hasError}
                errorMessage={errorMessage}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

        </div>
      </div>
    </SignedIn>
  );
}