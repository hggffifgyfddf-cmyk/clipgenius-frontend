"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- SVG Icons ---
const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const PlaySquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
);

const WalletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const RotateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7132f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// Mock Graphic for Coins
const CoinStack = ({ size = "small" }) => {
  const scale = size === "small" ? 0.6 : size === "medium" ? 0.8 : size === "large" ? 1 : size === "xl" ? 1.2 : 1.5;
  return (
    <div style={{ position: 'relative', width: 60 * scale, height: 50 * scale, margin: '20px auto' }}>
      <div style={{ position: 'absolute', bottom: '0', left: '10%', width: '80%', height: '40%', background: 'linear-gradient(180deg, #8b5cf6 0%, #4c1d95 100%)', borderRadius: '50%', border: '1px solid #a78bfa' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '0', width: '100%', height: '40%', background: 'linear-gradient(180deg, #8b5cf6 0%, #4c1d95 100%)', borderRadius: '50%', border: '1px solid #a78bfa', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '30%', left: '15%', width: '70%', height: '40%', background: 'linear-gradient(180deg, #a78bfa 0%, #5b21b6 100%)', borderRadius: '50%', border: '1px solid #ddd6fe', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 10 * scale, fontWeight: 'bold' }}>C</span>
      </div>
    </div>
  );
};


// --- Theme Constants ---
const colors = {
  bg: "#06080C",
  cardBg: "#0F111A",
  cardBorder: "rgba(255, 255, 255, 0.06)",
  textPrimary: "#F8FAFC",
  textSecondary: "#8B92A5",
  textMuted: "#5E6577",
  accent: "#7132f5",
  accentHover: "#5b24c9",
  accentLight: "rgba(113, 50, 245, 0.15)",
  highlightBorder: "#7132f5",
};

export default function BillingCreditsPage() {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

  useEffect(() => {
    async function fetchUserCredits() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('credits')
            .eq('id', user.id)
            .single();
          
          if (data && data.credits !== undefined) {
            setCredits(data.credits);
          }
        }
      } catch (err) {
        console.error("Error fetching user credits:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserCredits();
  }, [supabase]);

  const maxDisplayCredits = Math.max(20000, credits);
  const percentage = Math.min(100, (credits / maxDisplayCredits) * 100);

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          margin: 0;
          padding: 0;
          background: ${colors.bg};
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: ${colors.textPrimary};
        }
      `}</style>

      <div style={{ minHeight: "100vh", padding: "40px 60px", maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", letterSpacing: "-0.01em" }}>
              Billing / Credits
            </h1>
            <p style={{ color: colors.textSecondary, fontSize: "14px" }}>
              Buy credits to generate clips. No subscriptions. Pay only for what you use.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "transparent",
                border: `1px solid ${colors.cardBorder}`,
                color: colors.textSecondary,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <HelpIcon /> Need help?
            </button>
            <button style={{ background: "transparent", border: "none", color: colors.textSecondary, cursor: "pointer", display: "flex" }}>
              <SunIcon />
            </button>
          </div>
        </div>

        {/* Top Two Panels */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
          
          {/* Your Credits Card */}
          <div style={{ 
            flex: 1, 
            background: colors.cardBg, 
            border: `1px solid ${colors.cardBorder}`, 
            borderRadius: "16px", 
            padding: "28px" 
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "24px" }}>Your Credits</h2>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
              <div style={{ 
                width: "48px", height: "48px", borderRadius: "50%", 
                background: colors.accent, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: "bold", color: "white",
                boxShadow: `0 0 20px ${colors.accentLight}`
              }}>
                C
              </div>
              <span style={{ fontSize: "42px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                {loading ? "..." : credits.toLocaleString()}
              </span>
            </div>
            <p style={{ color: colors.textSecondary, fontSize: "14px", marginLeft: "64px", marginBottom: "32px" }}>credits ({credits} clips available)</p>

            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: colors.textSecondary }}>{credits.toLocaleString()} / {maxDisplayCredits.toLocaleString()}</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${percentage}%`, height: "100%", background: colors.accent, borderRadius: "4px", transition: "width 0.3s ease" }}></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{
                flex: 1, padding: "12px", borderRadius: "8px", background: colors.accent, color: "white",
                border: "none", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer"
              }}>
                <CartIcon /> Buy More Credits
              </button>
              <button style={{
                flex: 1, padding: "12px", borderRadius: "8px", background: "transparent", color: colors.textPrimary,
                border: `1px solid ${colors.cardBorder}`, fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer"
              }}>
                <ChartIcon /> View Usage
              </button>
            </div>
          </div>

          {/* How it works Card */}
          <div style={{ 
            flex: 1, 
            background: colors.cardBg, 
            border: `1px solid ${colors.cardBorder}`, 
            borderRadius: "16px", 
            padding: "28px" 
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "24px" }}>How it works</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: colors.accentLight, color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CartIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Buy Credits</h3>
                  <p style={{ fontSize: "13px", color: colors.textSecondary, lineHeight: "1.4" }}>Choose a credit pack that fits your needs. 5 credits = $4 (1 credit = $0.80).</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: colors.accentLight, color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <PlaySquareIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Generate Clips</h3>
                  <p style={{ fontSize: "13px", color: colors.textSecondary, lineHeight: "1.4" }}>1 clip = 1 credit. Credits are used when your video is processed.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: colors.accentLight, color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <WalletIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Pay As You Go</h3>
                  <p style={{ fontSize: "13px", color: colors.textSecondary, lineHeight: "1.4" }}>No subscriptions. No monthly fees.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: colors.accentLight, color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RotateIcon />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Rollover Credits</h3>
                  <p style={{ fontSize: "13px", color: colors.textSecondary, lineHeight: "1.4" }}>Unused credits never expire.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Credit Packs Section */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>Credit Packs</h2>
          <p style={{ color: colors.textSecondary, fontSize: "14px", marginBottom: "24px" }}>One-time purchase • No subscriptions (5 credits = $4)</p>

          <div style={{ display: "flex", gap: "16px" }}>
            
            {/* Starter */}
            <div style={{ flex: 1, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Starter</h3>
              <div style={{ fontSize: "24px", fontWeight: "600" }}>19</div>
              <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "16px" }}>credits</div>
              <CoinStack size="small" />
              <div style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%" }}>
                <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2px" }}>$15</div>
                <div style={{ fontSize: "11px", color: colors.textSecondary, marginBottom: "16px" }}>One-time payment</div>
                <button style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>Buy Now</button>
              </div>
            </div>

            {/* Basic (Highlighted) */}
            <div style={{ flex: 1, background: colors.cardBg, border: `1px solid ${colors.highlightBorder}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", boxShadow: `0 0 30px ${colors.accentLight}` }}>
              <div style={{ position: "absolute", top: "-12px", background: colors.accent, color: "white", fontSize: "11px", fontWeight: "600", padding: "4px 12px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "10px" }}>★</span> Most Popular
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Basic</h3>
              <div style={{ fontSize: "28px", fontWeight: "600" }}>31</div>
              <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "16px" }}>credits</div>
              <CoinStack size="medium" />
              <div style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%" }}>
                <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2px" }}>$25</div>
                <div style={{ fontSize: "11px", color: colors.textSecondary, marginBottom: "16px" }}>One-time payment</div>
                <button style={{ width: "100%", padding: "10px", borderRadius: "8px", background: colors.accent, border: "none", color: "white", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>Buy Now</button>
              </div>
            </div>

            {/* Pro */}
            <div style={{ flex: 1, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Pro</h3>
              <div style={{ fontSize: "24px", fontWeight: "600" }}>56</div>
              <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "16px" }}>credits</div>
              <CoinStack size="large" />
              <div style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%" }}>
                <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2px" }}>$45</div>
                <div style={{ fontSize: "11px", color: colors.textSecondary, marginBottom: "16px" }}>One-time payment</div>
                <button style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>Buy Now</button>
              </div>
            </div>

            {/* Advanced */}
            <div style={{ flex: 1, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Advanced</h3>
              <div style={{ fontSize: "24px", fontWeight: "600" }}>113</div>
              <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "16px" }}>credits</div>
              <CoinStack size="xl" />
              <div style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%" }}>
                <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2px" }}>$90</div>
                <div style={{ fontSize: "11px", color: colors.textSecondary, marginBottom: "16px" }}>One-time payment</div>
                <button style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>Buy Now</button>
              </div>
            </div>

            {/* Ultimate */}
            <div style={{ flex: 1, background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Ultimate</h3>
              <div style={{ fontSize: "24px", fontWeight: "600" }}>200</div>
              <div style={{ fontSize: "12px", color: colors.textSecondary, marginBottom: "16px" }}>credits</div>
              <CoinStack size="xxl" />
              <div style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%" }}>
                <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2px" }}>$160</div>
                <div style={{ fontSize: "11px", color: colors.textSecondary, marginBottom: "16px" }}>One-time payment</div>
                <button style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>Buy Now</button>
              </div>
            </div>

          </div>
        </div>

        {/* How credits are used Section */}
        <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>How credits are used</h2>
          <p style={{ color: colors.textSecondary, fontSize: "13px", marginBottom: "24px" }}>
            Credits are deducted based on the video duration and the preset you choose. (1 clip = 1 credit)
          </p>

          <div style={{ display: "flex", gap: "64px" }}>
            
            {/* Table 1: Duration */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: `1px solid ${colors.cardBorder}`, paddingBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: colors.textPrimary }}>Video Duration</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: colors.textPrimary }}>Credits</span>
              </div>
              {[
                { label: "Up to 5 minutes", val: "10 credits" },
                { label: "5 - 15 minutes", val: "20 credits" },
                { label: "15 - 30 minutes", val: "40 credits" },
                { label: "30 - 60 minutes", val: "60 credits" },
                { label: "60+ minutes", val: "80 credits+" }
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", color: colors.textSecondary }}>{row.label}</span>
                  <span style={{ fontSize: "13px", color: colors.textPrimary }}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Table 2: Multiplier */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: `1px solid ${colors.cardBorder}`, paddingBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: colors.textPrimary }}>Preset Multiplier</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: colors.textPrimary }}></span>
              </div>
              {[
                { label: "General", val: "1x" },
                { label: "Gaming / Sports", val: "1.2x" },
                { label: "Podcast", val: "1.5x" },
                { label: "More Presets", val: "Coming soon" }
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", color: colors.textSecondary }}>{row.label}</span>
                  <span style={{ fontSize: "13px", color: colors.textPrimary }}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div style={{ flex: 1.2 }}>
              <div style={{ background: "rgba(113, 50, 245, 0.05)", border: "1px solid rgba(113, 50, 245, 0.15)", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                  <InfoIcon />
                </div>
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "500", color: colors.textPrimary, marginBottom: "4px" }}>Good to know</h4>
                  <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.5", marginBottom: "8px" }}>
                    The final credit cost is shown before you generate your clips. (1 clip = 1 credit)
                  </p>
                  <p style={{ fontSize: "12px", color: colors.textSecondary }}>
                    You're always in control.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}