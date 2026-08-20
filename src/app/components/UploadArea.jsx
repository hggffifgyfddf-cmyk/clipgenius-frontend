"use client";

import { useRef, useState } from "react";

const colors = {
  accent: "#6366f1",
  text: "#ffffff",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.3)",
  border: "rgba(255,255,255,0.06)",
  borderFocus: "rgba(255,255,255,0.12)",
};

export default function UploadArea({
  file,
  setFile,
  youtubeUrl,
  setYoutubeUrl,
  isUploading,
  uploadProgress,
  clipLength,
  setClipLength,
  maxClips,
  setMaxClips,
  ratio,
  setRatio,
  subtitleOn,
  setSubtitleOn,
  subtitleColor,
  setSubtitleColor,
  acceptTerms,
  setAcceptTerms,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const subtitleColors = [
    { id: "black", color: "#000000" },
    { id: "white", color: "#ffffff" },
    { id: "red", color: "#ef4444" },
    { id: "green", color: "#22c55e" },
    { id: "blue", color: "#3b82f6" },
    { id: "yellow", color: "#facc15" },
  ];

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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
        <span style={{ fontSize: 20 }}>📤</span>
        <h3 style={{ fontWeight: 600, fontSize: 14 }}>Upload Video</h3>
        <span style={{ fontSize: 10, color: colors.textTertiary, marginLeft: "auto", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {file ? "File selected" : "Drag & drop or click"}
        </span>
      </div>

      <div
        onClick={handleFileClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? colors.accent : colors.border}`,
          borderRadius: 16,
          padding: "32px 16px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          background: file ? "rgba(34,197,94,0.05)" : "transparent",
        }}
      >
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: "none" }} />

        {file ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>✅</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{file.name}</div>
              <div style={{ fontSize: 11, color: colors.textTertiary }}>{(file.size / (1024 * 1024)).toFixed(1)} MB</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎬</div>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
              {isDragging ? "Drop your video here" : "Drop your video here"}
            </div>
            <div style={{ fontSize: 11, color: colors.textTertiary }}>or click to browse (MP4, MOV, AVI, up to 500MB)</div>
          </>
        )}
      </div>

      {isUploading && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textTertiary, marginBottom: 4 }}>
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: colors.accent,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: colors.border }} />
        <span style={{ fontSize: 10, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>or paste URL</span>
        <div style={{ flex: 1, height: 1, background: colors.border }} />
      </div>

      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="https://youtube.com/... or https://twitch.tv/..."
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          background: "rgba(255,255,255,0.02)",
          color: colors.text,
          fontSize: 14,
          outline: "none",
          transition: "all 0.3s ease",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.borderFocus;
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ fontSize: 10, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, display: "block", marginBottom: 4 }}>
            ⏱ Clip Length
          </label>
          <input
            type="number"
            value={clipLength}
            onChange={(e) => setClipLength(parseInt(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: "rgba(255,255,255,0.02)",
              color: colors.text,
              fontSize: 14,
              outline: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.borderFocus;
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 10, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, display: "block", marginBottom: 4 }}>
            📊 Max Clips
          </label>
          <input
            type="number"
            value={maxClips}
            onChange={(e) => setMaxClips(parseInt(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: "rgba(255,255,255,0.02)",
              color: colors.text,
              fontSize: 14,
              outline: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.borderFocus;
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ fontSize: 10, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, display: "block", marginBottom: 4 }}>
            📐 Aspect Ratio
          </label>
          <select
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: "rgba(255,255,255,0.02)",
              color: colors.text,
              fontSize: 14,
              outline: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
              cursor: "pointer",
              appearance: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.borderFocus;
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            <option value="9:16" style={{ background: "#0a0a0a" }}>📱 9:16 (TikTok/Reels)</option>
            <option value="1:1" style={{ background: "#0a0a0a" }}>⬜ 1:1 (Square)</option>
            <option value="16:9" style={{ background: "#0a0a0a" }}>🖥 16:9 (YouTube)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>💬 Subtitles</span>
          <button
            onClick={() => setSubtitleOn(true)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 500,
              border: subtitleOn ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
              background: subtitleOn ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
              color: subtitleOn ? colors.accent : colors.textTertiary,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            ON
          </button>
          <button
            onClick={() => setSubtitleOn(false)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 500,
              border: !subtitleOn ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
              background: !subtitleOn ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
              color: !subtitleOn ? colors.accent : colors.textTertiary,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            OFF
          </button>
        </div>
        {subtitleOn && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {subtitleColors.map((c) => (
              <div
                key={c.id}
                onClick={() => setSubtitleColor(c.id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: c.color,
                  border: subtitleColor === c.id ? `2px solid ${colors.text}` : "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span style={{ fontSize: 11, color: colors.textTertiary, lineHeight: 1.5 }}>
            I confirm I own this content and accept the Terms, Privacy Policy, and Copyright Policy.
          </span>
        </label>
      </div>
    </div>
  );
}