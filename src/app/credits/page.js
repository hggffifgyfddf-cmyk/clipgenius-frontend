"use client";

import { useState, useEffect } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const theme = {
  bg: "#05050A", // Very deep dark background
  card: "#0C0C14",
  cardLight: "#12121C",
  border: "#1F1F33",
  borderHover: "#2D2D4A",
  text: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textTertiary: "#606075",
  accent: "#8B5CF6",
  accentHover: "#A78BFA",
  accentGlow: "rgba(139, 92, 246, 0.3)",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.1)",
  error: "#EF4444",
  errorBg: "rgba(239, 68, 68, 0.1)",
};

export default function CreditsPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buying, setBuying] = useState(false);

  async function loadCredits() {
    try {
      setLoading(true);
      const res = await fetch("/api/credits");
      const data = await res.json();
      if (data.balance !== undefined) setBalance(data.balance);
      if (data.transactions) setTransactions(data.transactions);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function buyCredits(amount) {
    setBuying(true);
    try {
      alert(`Buy ${amount} credits - Payment system coming soon!`);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setBuying(false);
    }
  }

  useEffect(() => {
    loadCredits();
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }) + " - " + d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SignedIn>
      <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "40px 24px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <Link href="/" style={{ color: theme.textSecondary, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = theme.text} onMouseLeave={(e) => e.currentTarget.style.color = theme.textSecondary}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Dashboard
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>Credits</h1>
                  <p style={{ margin: 0, color: theme.textSecondary, fontSize: 14 }}>Manage your credits and view transaction history</p>
                </div>
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserButton />
            </div>
          </div>

          {/* Top Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24, marginBottom: 32 }}>
            
            {/* Balance Card with Nebula effect */}
            <div style={{
              background: `radial-gradient(ellipse at top left, rgba(67, 34, 150, 0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.2) 0%, transparent 50%), ${theme.card}`,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: "48px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative particles (simulated via subtle radial overlay) */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.03, pointerEvents: "none" }} />
              
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, position: "relative", zIndex: 1 }}>
                Available Credits
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: 64, fontWeight: 600, color: theme.text, textShadow: `0 0 40px ${theme.accentGlow}`, lineHeight: 1, marginBottom: 8, position: "relative", zIndex: 1 }}
              >
                {loading ? (
                  <span style={{ opacity: 0.5 }}>...</span>
                ) : (
                  balance.toLocaleString()
                )}
              </motion.div>
              
              <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 32, position: "relative", zIndex: 1 }}>
                1 credit = 1 clip
              </div>
              
              <button
                onClick={() => setShowBuyModal(true)}
                style={{
                  padding: "12px 32px",
                  borderRadius: 8,
                  background: `linear-gradient(to right, ${theme.accent}, #9333EA)`,
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: `0 8px 24px ${theme.accentGlow}`,
                  transition: "all 0.2s ease",
                  position: "relative",
                  zIndex: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${theme.accentGlow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accentGlow}`;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Buy Credits
              </button>
            </div>

            {/* About Credits Card */}
            <div style={{
              background: theme.cardLight,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: "28px",
              display: "flex",
              flexDirection: "column"
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ color: theme.accent }}>✦</span> About Credits
              </h3>
              <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
                Credits are used to generate AI-powered clips. More credits allow you to create more high-quality content.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "1 credit = 1 clip",
                  "No expiration",
                  "Secure payments",
                  "Used instantly"
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: theme.textSecondary }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: `rgba(139, 92, 246, 0.1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transaction History Section */}
          <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                Transaction History
              </h3>
              <button style={{ 
                background: "transparent", border: "none", color: theme.textSecondary, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "color 0.2s" 
              }} onMouseEnter={(e) => e.currentTarget.style.color = theme.text} onMouseLeave={(e) => e.currentTarget.style.color = theme.textSecondary}>
                View All History ↗
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: theme.textTertiary, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${theme.border}`, borderTopColor: theme.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: theme.textTertiary, border: `1px dashed ${theme.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 12, opacity: 0.5 }}>📝</div>
                No transactions yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  const title = tx.type === "purchase" ? "Credits Purchase" : "Clip Generation";
                  const badgeLabel = tx.type === "purchase" ? "Purchased" : "Used";
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={tx.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderRadius: 12,
                        background: theme.bg,
                        border: `1px solid ${theme.border}`,
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.borderHover}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ 
                          width: 36, height: 36, borderRadius: "50%", 
                          background: isPositive ? theme.successBg : theme.errorBg,
                          color: isPositive ? theme.success : theme.error,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {isPositive ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: theme.text, marginBottom: 4 }}>
                            {title}
                          </div>
                          <div style={{ fontSize: 12, color: theme.textSecondary }}>
                            {formatDate(tx.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 40, width: "30%", justifyContent: "space-between" }}>
                        <div style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: isPositive ? theme.success : theme.error,
                        }}>
                          {isPositive ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} credits
                        </div>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: theme.cardLight,
                          color: theme.textSecondary,
                          border: `1px solid ${theme.border}`
                        }}>
                          {badgeLabel}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Buy Credits Modal */}
        <AnimatePresence>
          {showBuyModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 24
              }}
              onClick={() => setShowBuyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 32,
                  maxWidth: 480,
                  width: "100%",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
                  position: "relative"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px 0", color: theme.text }}>Buy Credits</h2>
                    <p style={{ margin: 0, color: theme.textSecondary, fontSize: 14 }}>1 credit = 1 clip. Top up your balance to generate more.</p>
                  </div>
                  <button 
                    onClick={() => setShowBuyModal(false)}
                    style={{ width: 32, height: 32, borderRadius: 8, background: theme.cardLight, border: `1px solid ${theme.border}`, color: theme.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; e.currentTarget.style.background = theme.border; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.background = theme.cardLight; }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  {[
                    { credits: 100, price: "$4.99", popular: false },
                    { credits: 500, price: "$19.99", popular: true },
                    { credits: 1000, price: "$34.99", popular: false },
                    { credits: 5000, price: "$149.99", popular: false },
                  ].map((plan) => (
                    <button
                      key={plan.credits}
                      onClick={() => buyCredits(plan.credits)}
                      disabled={buying}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderRadius: 12,
                        border: `1px solid ${plan.popular ? theme.accent : theme.border}`,
                        background: plan.popular ? theme.accentGlow : theme.bg,
                        cursor: buying ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        opacity: buying ? 0.7 : 1,
                        textAlign: "left"
                      }}
                      onMouseEnter={(e) => {
                        if (!buying) {
                          e.currentTarget.style.borderColor = plan.popular ? theme.accentHover : theme.textSecondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!buying) {
                          e.currentTarget.style.borderColor = plan.popular ? theme.accent : theme.border;
                        }
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 16, color: theme.text }}>{plan.credits.toLocaleString()} Credits</span>
                          {plan.popular && (
                            <span style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: theme.accent,
                              color: "#fff",
                              textTransform: "uppercase"
                            }}>
                              Popular
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: theme.textSecondary }}>Generate {plan.credits.toLocaleString()} clips</div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: theme.text }}>{plan.price}</div>
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 12, color: theme.textTertiary, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Secure payments via Stripe
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </SignedIn>
  );
}