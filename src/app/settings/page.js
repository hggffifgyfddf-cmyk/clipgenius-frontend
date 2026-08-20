"use client";

import { useState, useEffect } from "react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Precise color palette matching the premium reference image
const theme = {
  bg: "#0B0C10",
  sidebarBg: "#050508",
  cardBg: "#111218",
  cardBorder: "rgba(255, 255, 255, 0.04)",
  accent: "#6366F1", // Primary purple
  accentHover: "#7C3AED",
  accentLight: "rgba(99, 102, 241, 0.1)",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  textDarker: "#6B7280",
  success: "#10B981",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.1)",
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
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Profile: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Security: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  API: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Mail: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
};

function safeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // User settings - loaded from database (Preserving Logic)
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    darkMode: true,
    emailUpdates: false,
    twoFactor: false,
    language: "en",
    timezone: "UTC",
  });

  // Profile settings
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    website: "",
    twitter: "",
  });

  // Default active tab updated to 'general' to match visual reference perfectly
  const [activeTab, setActiveTab] = useState("general");

  // Load settings from database
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        if (user) {
          setProfile(prev => ({
            ...prev,
            displayName: user.fullName || user.firstName || user.emailAddresses?.[0]?.emailAddress || "",
          }));
        }
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
        if (data.profile) setProfile(prev => ({ ...prev, ...data.profile }));
      } catch (e) {
        console.log("Error loading settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [user]);

  const handleToggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const handleProfileChange = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, profile }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Error saving settings: " + data.error);
      }
    } catch (e) {
      alert("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    // Clerk sign out logic handled by Clerk
  };

  // Expanded nav items matching the reference image's UI menu (Security & Notifications removed as requested)
  const innerNavItems = [
    { id: "general", icon: <Icons.Settings />, label: "General" },
    { id: "profile", icon: <Icons.Profile />, label: "Profile" },
    { id: "api", icon: <Icons.API />, label: "API" },
    { id: "billing", icon: <Icons.Billing />, label: "Billing" },
  ];

  return (
    <SignedIn>
      <style dangerouslySetInnerHTML={{__html: `
        body { background-color: ${theme.bg}; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; color: ${theme.text}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: #2A2D3A; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3A3D4A; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        textarea:focus, input:focus { border-color: ${theme.accent} !important; box-shadow: 0 0 0 1px ${theme.accent} !important; }
      `}} />

      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: theme.bg }}>
        
        {/* --- MAIN SIDEBAR --- */}
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
          <div style={{ display: "flex", alignItems: "center", padding: "0 12px", marginBottom: 40 }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: "42px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Dashboard /> Dashboard</div>
            </Link>
            <Link href="/generate" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Projects /> Generate</div>
            </Link>
            <Link href="/jobs" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Presets /> Jobs</div>
            </Link>
            <Link href="/legal" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Security /> Legal</div>
            </Link>
            <Link href="/analytics" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Analytics /> Analytics</div>
            </Link>
            <Link href="/credits" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Billing /> Credits</div>
            </Link>
            <Link href="/feedback" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(false)}><Icons.Feedback /> Feedback</div>
            </Link>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <div style={navItemStyle(true)}><Icons.Settings /> Settings</div>
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", borderRadius: 12, cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4B5563", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
              {user?.firstName?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user?.fullName || "User"}</div>
              <div style={{ fontSize: 11, color: theme.textDarker, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user?.emailAddresses?.[0]?.emailAddress || "user@example.com"}</div>
            </div>
            <Icons.ChevronDown />
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div style={{ marginLeft: 260, flex: 1, padding: "40px 48px", maxWidth: 1200 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Settings</h1>
                <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>Manage your account, preferences and app settings.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "8px 20px", borderRadius: 8, background: saved ? theme.success : theme.accent, color: "#fff",
                    border: "none", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease", opacity: saving ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => { if (!saving && !saved) e.currentTarget.style.background = theme.accentHover; }}
                  onMouseLeave={(e) => { if (!saving && !saved) e.currentTarget.style.background = theme.accent; }}
                >
                  {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
                </button>
                <div style={{ position: "relative", cursor: "pointer", color: theme.textMuted }}>
                  <Icons.Bell />
                  <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, backgroundColor: theme.danger, borderRadius: "50%", border: `2px solid ${theme.bg}` }}></span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              
              {/* Inner Sidebar (Settings Menu) */}
              <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 4 }}>
                {innerNavItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      color: activeTab === item.id ? theme.text : theme.textMuted,
                      background: activeTab === item.id ? theme.accentLight : "transparent",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { if (activeTab !== item.id) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = theme.text; } }}
                    onMouseLeave={(e) => { if (activeTab !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted; } }}
                  >
                    <div style={{ color: activeTab === item.id ? theme.accent : "currentColor" }}>{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Settings Content Area */}
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 60 }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted }}>Loading settings...</div>
                ) : (
                  <>
                    {/* --- GENERAL TAB --- */}
                    {activeTab === "general" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        
                        {/* General Settings Card */}
                        <div style={cardStyle}>
                          <div style={cardHeaderStyle}>
                            <h3 style={cardTitleStyle}>General Settings</h3>
                            <p style={cardDescStyle}>Manage the basic settings of your account and preferences.</p>
                          </div>
                          
                          <div style={rowStyle(true)}>
                            <div>
                              <div style={rowLabelStyle}>Language</div>
                              <div style={rowDescStyle}>Choose your preferred language.</div>
                            </div>
                            <div style={{ position: "relative" }}>
                              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, pointerEvents: "none" }}>
                                <Icons.Globe />
                              </div>
                              <select
                                value={settings.language}
                                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                                style={selectStyle(true)}
                              >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                              </select>
                              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, pointerEvents: "none" }}>
                                <Icons.ChevronDown />
                              </div>
                            </div>
                          </div>

                          <div style={rowStyle(false)}>
                            <div>
                              <div style={rowLabelStyle}>Timezone</div>
                              <div style={rowDescStyle}>Select your timezone.</div>
                            </div>
                            <div style={{ position: "relative" }}>
                              <select
                                value={settings.timezone}
                                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                style={selectStyle(false)}
                              >
                                <option value="UTC">(GMT+00:00) UTC</option>
                                <option value="EST">(GMT-05:00) Eastern Time</option>
                                <option value="PST">(GMT-08:00) Pacific Time</option>
                                <option value="GMT">(GMT+00:00) GMT</option>
                              </select>
                              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: theme.textMuted, pointerEvents: "none" }}>
                                <Icons.ChevronDown />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Default Preferences Card */}
                        <div style={cardStyle}>
                          <div style={cardHeaderStyle}>
                            <h3 style={cardTitleStyle}>Default Preferences</h3>
                            <p style={cardDescStyle}>Set defaults for your projects and exports.</p>
                          </div>
                          
                          <div style={rowStyle(false)}>
                            <div>
                              <div style={rowLabelStyle}>Auto Save</div>
                              <div style={rowDescStyle}>Automatically save your projects while you work.</div>
                            </div>
                            <Toggle active={settings.autoSave} onClick={() => handleToggle("autoSave")} />
                          </div>
                        </div>

                        {/* Account Danger Zone Card */}
                        <div style={cardStyle}>
                          <div style={cardHeaderStyle}>
                            <h3 style={cardTitleStyle}>Account</h3>
                            <p style={cardDescStyle}>Manage your account settings and data.</p>
                          </div>

                          <div style={rowStyle(false)}>
                            <div>
                              <div style={rowLabelStyle}>Delete Account</div>
                              <div style={rowDescStyle}>Permanently delete your account and all data.</div>
                            </div>
                            <button 
                              style={{ ...actionButtonStyle, color: theme.danger, border: `1px solid ${theme.dangerBg}` }}
                              onMouseEnter={(e) => e.currentTarget.style.background = theme.dangerBg}
                              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              onClick={() => { if (confirm("Are you sure you want to delete your account? This cannot be undone.")) alert("Account deletion request submitted."); }}
                            >
                              <Icons.Trash /> Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- PROFILE TAB --- */}
                    {activeTab === "profile" && (
                      <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                          <h3 style={cardTitleStyle}>Profile Information</h3>
                          <p style={cardDescStyle}>Update your public profile and details.</p>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                          {[
                            { key: "displayName", label: "Display Name", placeholder: "Your name", type: "text" },
                            { key: "website", label: "Website", placeholder: "https://yourwebsite.com", type: "text" },
                            { key: "twitter", label: "Twitter", placeholder: "@username", type: "text" },
                            { key: "bio", label: "Bio", placeholder: "Tell us about yourself", type: "textarea" }
                          ].map((field) => (
                            <div key={field.key}>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: theme.textMuted, marginBottom: 8 }}>{field.label}</label>
                              {field.type === "textarea" ? (
                                <textarea
                                  value={profile[field.key] || ""}
                                  onChange={(e) => handleProfileChange(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={profile[field.key] || ""}
                                  onChange={(e) => handleProfileChange(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  style={inputStyle}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fallback for other tabs to prevent visual breaking while maintaining logic structure */}
                    {["api", "billing"].includes(activeTab) && (
                      <div style={cardStyle}>
                        <div style={{ padding: 40, textAlign: "center", color: theme.textMuted }}>
                          <h3 style={{ fontSize: 16, color: theme.text, marginBottom: 8, fontWeight: 500 }}>Settings Available Soon</h3>
                          <p style={{ fontSize: 13 }}>This section is currently under development.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SignedIn>
  );
}

// --- Reusable Style Objects & Components ---
function navItemStyle(active) {
  return {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: active ? theme.text : theme.textMuted,
    background: active ? theme.accent : "transparent", cursor: "pointer", transition: "all 0.2s ease"
  };
}

const cardStyle = {
  background: theme.cardBg,
  border: `1px solid ${theme.cardBorder}`,
  borderRadius: 12,
  overflow: "hidden"
};

const cardHeaderStyle = {
  padding: "20px 24px",
  borderBottom: `1px solid ${theme.cardBorder}`,
};

const cardTitleStyle = {
  fontSize: 15, fontWeight: 600, color: theme.text, margin: "0 0 4px"
};

const cardDescStyle = {
  fontSize: 13, color: theme.textMuted, margin: 0
};

const rowStyle = (hasBorder) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  borderBottom: hasBorder ? `1px solid ${theme.cardBorder}` : "none",
});

const rowLabelStyle = {
  fontSize: 14, fontWeight: 500, color: theme.text, marginBottom: 4
};

const rowDescStyle = {
  fontSize: 13, color: theme.textMuted
};

const selectStyle = (hasIcon) => ({
  background: theme.inputBg,
  border: `1px solid ${theme.cardBorder}`,
  borderRadius: 8,
  padding: `10px 36px 10px ${hasIcon ? '36px' : '16px'}`,
  color: theme.text,
  fontSize: 13,
  outline: "none",
  cursor: "pointer",
  width: 180,
  transition: "border-color 0.2s ease"
});

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${theme.cardBorder}`,
  background: theme.inputBg, color: theme.text, fontSize: 14, outline: "none",
  transition: "all 0.2s ease", fontFamily: "inherit", boxSizing: "border-box"
};

const actionButtonStyle = {
  display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
  background: "transparent", color: theme.text, border: `1px solid ${theme.cardBorder}`,
  fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease"
};

// Toggle Switch Component to perfectly match reference
function Toggle({ active, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
        background: active ? theme.accent : "rgba(255,255,255,0.1)",
        position: "relative", transition: "background 0.3s ease"
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: active ? 23 : 3,
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      }} />
    </div>
  );
}