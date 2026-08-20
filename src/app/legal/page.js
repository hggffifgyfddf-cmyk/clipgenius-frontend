"use client";

import { useState } from "react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Precise color palette matching the premium reference image & brand theme
const theme = {
  bg: "#0B0C10",
  sidebarBg: "#050508",
  cardBg: "#12131A",
  cardHoverBg: "#181922",
  cardBorder: "rgba(255, 255, 255, 0.06)",
  cardBorderHover: "rgba(139, 92, 246, 0.3)",
  accent: "#6366F1", // Primary purple/indigo
  accentHover: "#7C3AED",
  accentLight: "rgba(99, 102, 241, 0.12)",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  textDarker: "#6B7280",
  danger: "#EF4444",
};

// --- SVG Icons ---
const Icons = {
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Projects: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Presets: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>,
  Analytics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Feedback: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Billing: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Security: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Shield: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Lock: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Cookie: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="11.5" r="1"></circle><circle cx="11.5" cy="15.5" r="1.25"></circle><circle cx="14.5" cy="6.5" r="0.75"></circle></svg>,
  Copyright: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 9.35a4 4 0 0 0-3 1.35 4 4 0 0 0 0 5.3 4 4 0 0 0 3 1.35"></path></svg>,
  FileText: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Help: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Mail: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
};

export default function LegalPage() {
  const { user } = useUser();
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const legalPolicies = [
    {
      id: "terms",
      title: "Terms of Service",
      description: "Terms and conditions for using ClipGenius AI video clipping service.",
      lastUpdated: "July 14, 2026",
      icon: <Icons.Shield />,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p>Welcome to ClipGenius. By accessing or using our platform, website, and AI video clipping services, you agree to be bound by these Terms of Service.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>1. Acceptance of Terms</h4>
          <p>By creating an account or using ClipGenius, you confirm that you are at least 18 years old (or 13+ with parental consent), provide accurate information, maintain account security, and agree to abide by all applicable laws and regulations. Updates to these Terms will be notified via email or service.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>2. Description of Services</h4>
          <p>ClipGenius provides AI-powered automated video clipping services that process videos, identify viral moments, generate clips, add subtitles/effects, and produce platform-optimized content. We do not guarantee virality, views, success, or accuracy of virality scores. AI-generated content may contain inaccuracies or biases; users are responsible for reviewing and editing output.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>3. User Content & License</h4>
          <p>Users retain ownership of their content but grant ClipGenius a non-exclusive, royalty-free, worldwide license to process, store, and use aggregated data. Users warrant they have rights to upload, create derivative works, distribute, and commercialize output.</p>
          <p style={{ color: theme.textMuted, fontSize: 14, marginTop: 8 }}><strong>Prohibited Content:</strong> Illegal content, copyright infringement, CSAM, violence, threats, fraud, defamation, harassment, hate speech, graphic violence, self-harm, pornography, and privacy violations.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>4. Copyright & Fair Use</h4>
          <p>Users are solely responsible for rights clearance and fair use determination. ClipGenius complies with DMCA. Designated Agent: aividsgeneator@gmail.com.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>5. Payment</h4>
          <p>Subscription fees are billed in advance with auto-renewal. Refunds are at our discretion.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>6. Right to Refuse Service</h4>
          <p>We reserve the right to refuse service, reject content, and limit or terminate accounts.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>7. Arbitration & Liability</h4>
          <p>Binding arbitration in [Your City, State] with class action waiver. Users indemnify ClipGenius against claims. Total liability limited to amount paid in prior 12 months. No warranty provided.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>8. Contact</h4>
          <p>DMCA Agent and general contact: <a href="mailto:aividsgeneator@gmail.com" style={{ color: theme.accent, textDecoration: "none" }}>aividsgeneator@gmail.com</a></p>
        </div>
      ),
    },
    {
      id: "platform",
      title: "Platform ToS Compliance Policy",
      description: "Compliance with YouTube, Twitch, TikTok, Instagram, and Vimeo terms.",
      lastUpdated: "July 14, 2026",
      icon: <Icons.FileText />,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p>This policy governs use of third-party platforms through ClipGenius and ensures compliance with their terms of service.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>YouTube Compliance</h4>
          <p><strong>Prohibited:</strong> Downloading videos without displayed buttons, circumventing security, violating Community Guidelines, spamming/harassing, or using automated access.</p>
          <p><strong>Permitted:</strong> Using your own content, content with permission, fair use content, or public YouTube features. Complies with YouTube API Services Terms.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>Twitch Compliance</h4>
          <p><strong>Prohibited:</strong> Downloading streams without permission, circumventing security, violating guidelines, harassing/spamming, or reposting without attribution.</p>
          <p><strong>Permitted:</strong> Using your own streams/VODs, content with permission, fair use, transformative clips, or public Twitch features. Complies with Twitch Developer Terms.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>Content Ownership & Rights Clearance</h4>
          <p>Users warrant they have rights to upload, create derivative works, distribute, and commercialize output. Users must obtain permissions, releases, and clear music/visual elements.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>Data Usage & Prohibited Uses</h4>
          <p>Collects platform identifiers, metadata, and usage data. Users may request deletion via aividsgeneator@gmail.com. Prohibited: circumventing access controls, violating platform terms, scraping, impersonation.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>Enforcement</h4>
          <p>We reserve the right to investigate, warn, suspend, terminate, or report violators.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>Contact</h4>
          <p><a href="mailto:aividsgeneator@gmail.com" style={{ color: theme.accent, textDecoration: "none" }}>aividsgeneator@gmail.com</a></p>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information.",
      lastUpdated: "July 14, 2026",
      icon: <Icons.Lock />,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p>At ClipGenius, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal data.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>1. Information Collected</h4>
          <p><strong>Account:</strong> Name, email (aividsgeneator@gmail.com), username, password (encrypted).</p>
          <p><strong>Content:</strong> Video files, audio, images, transcripts, metadata.</p>
          <p><strong>Communications:</strong> Support messages, feedback, surveys.</p>
          <p><strong>Automatic:</strong> Log data, device info, interaction data, session duration.</p>
          <p><strong>Platform Data:</strong> OAuth tokens, platform identifiers, video URLs.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>2. Usage & Legal Basis</h4>
          <p>Service provision, algorithm improvement, communication, legal compliance. GDPR: contractual necessity, legitimate interests, consent, legal obligation. CCPA compliant.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>3. Data Sharing & Storage</h4>
          <p>Shared with hosting providers, payment processors (Stripe - no full credit card storage), analytics, customer support tools, email services. Stored in Supabase database, cloud storage, Redis, logging systems.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>4. Retention & Security</h4>
          <p>Account data until deletion, content per plan, usage data up to 24 months, logs up to 12 months. Encryption, access controls, audits, incident response in place.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>5. User Rights</h4>
          <p><strong>GDPR:</strong> Access, rectification, erasure, restriction, portability, objection, withdraw consent. Response within 30 days.</p>
          <p><strong>CCPA:</strong> Know, delete, opt-out of sale, non-discrimination, access. Response within 45 days.</p>
          <p>Data deletion via account settings, data export request, specific deletion, inactive accounts after 24 months.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>6. Children's Privacy & International Transfers</h4>
          <p>Not directed at under 13 (or 16 in EU/EEA). International transfers safeguarded through Standard Contractual Clauses.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>7. Contact</h4>
          <p><a href="mailto:aividsgeneator@gmail.com" style={{ color: theme.accent, textDecoration: "none" }}>aividsgeneator@gmail.com</a></p>
        </div>
      ),
    },
    {
      id: "copyright",
      title: "Copyright & Fair Use Policy",
      description: "Copyright protection, fair use guidelines, and DMCA procedures.",
      lastUpdated: "July 14, 2026",
      icon: <Icons.Copyright />,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p>ClipGenius respects intellectual property rights. This policy outlines copyright compliance and fair use guidelines.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>1. User Warranties</h4>
          <p>Users warrant they own rights or have permissions, have right to create derivative works, secured rights from third parties, won't infringe IP, and are solely responsible for fair use determination.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>2. Fair Use Factors</h4>
          <p><strong>Purpose/Character:</strong> Transformative use favored.</p>
          <p><strong>Nature of Work:</strong> Factual/published favored.</p>
          <p><strong>Amount Used:</strong> Short clips (15-60 seconds) favored.</p>
          <p><strong>Effect on Market:</strong> No substitution favored.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>3. Examples of Fair Use</h4>
          <p>Commentary, parody, education, news reporting, research, memes.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>4. Non-Fair Use Examples</h4>
          <p>Simple reposting without transformation, using substantial portions, substituting for original, harming market.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>5. Commercial Use Warning</h4>
          <p>Fair use protections may be narrower for commercial uses. Users bear full responsibility.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>6. Indemnification & DMCA</h4>
          <p>Users indemnify ClipGenius against all claims. Designated Agent: aividsgeneator@gmail.com. Takedown procedure requires identification of work, infringing material, contact info, good faith statement, accuracy statement, and signature. Counter-notification available. Repeat infringers terminated.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>7. Transformative Use & Monitoring</h4>
          <p>Service designed for transformative works, not simple reposting. We reserve right to review, monitor, remove content, and suspend/terminate access.</p>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      description: "How we use cookies and similar tracking technologies.",
      lastUpdated: "July 14, 2026",
      icon: <Icons.Cookie />,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p>ClipGenius uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and maintain user sessions securely.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>1. Essential Cookies</h4>
          <p>Required for core site functionality, including authentication, security, and session management.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>2. Analytics & Performance</h4>
          <p>We utilize aggregated analytics cookies to understand feature usage and improve platform speed and reliability.</p>
          
          <h4 style={{ color: theme.text, fontSize: 16, marginTop: 12, marginBottom: 4 }}>3. Your Choices</h4>
          <p>You can manage cookie preferences through your browser settings. Essential cookies cannot be disabled as they are required for platform functionality.</p>
        </div>
      ),
    },
  ];

  const activePolicyData = legalPolicies.find((p) => p.id === selectedPolicy);

  return (
    <SignedIn>
      <style dangerouslySetInnerHTML={{__html: `
        body { background-color: ${theme.bg}; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; color: ${theme.text}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: #2A2D3A; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3A3D4A; }
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
          {/* Large Logo */}
          <div style={{ display: "flex", alignItems: "center", padding: "0 12px", marginBottom: 40, height: 50 }}>
            <img
              src="/logo.png"
              alt="ClipGenius Logo"
              style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }}
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
              <div style={navItemStyle(true)}><Icons.Security /> Legal</div>
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
              <div style={navItemStyle(false)}><Icons.Settings /> Settings</div>
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

        {/* --- MAIN CONTENT AREA --- */}
        <div style={{ marginLeft: 260, flex: 1, padding: "48px 64px", maxWidth: 1040 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {!selectedPolicy ? (
              <>
                {/* Header matching reference image */}
                <div style={{ marginBottom: 36 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em", color: theme.text }}>Legal</h1>
                  <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>Important legal information about using ClipGenius and our services.</p>
                </div>

                {/* Cards List matching reference image layout */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {legalPolicies.map((policy) => (
                    <motion.div
                      key={policy.id}
                      onClick={() => setSelectedPolicy(policy.id)}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      style={{
                        background: theme.cardBg,
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: 16,
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.cardHoverBg;
                        e.currentTarget.style.borderColor = theme.cardBorderHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = theme.cardBg;
                        e.currentTarget.style.borderColor = theme.cardBorder;
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: theme.accentLight,
                          color: "#A78BFA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {policy.icon}
                        </div>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, margin: "0 0 4px" }}>{policy.title}</h3>
                          <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 6px", lineHeight: 1.4 }}>{policy.description}</p>
                          <span style={{ fontSize: 12, color: theme.textDarker }}>Last updated: {policy.lastUpdated}</span>
                        </div>
                      </div>
                      <div style={{ color: theme.textMuted, display: "flex", alignItems: "center", paddingLeft: 16 }}>
                        <Icons.ChevronRight />
                      </div>
                    </motion.div>
                  ))}

                  {/* Need Help Card */}
                  <div style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: 16,
                    padding: "22px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: theme.accentLight,
                        color: "#A78BFA",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Icons.Help />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, margin: "0 0 4px" }}>Need help?</h3>
                        <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, lineHeight: 1.4 }}>If you have any questions about our legal policies, please contact our support team.</p>
                      </div>
                    </div>
                    <a
                      href="mailto:aividsgeneator@gmail.com"
                      style={{
                        padding: "9px 18px",
                        borderRadius: 8,
                        background: "transparent",
                        color: "#A78BFA",
                        border: `1px solid rgba(139, 92, 246, 0.4)`,
                        textDecoration: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.accentLight;
                        e.currentTarget.style.borderColor = "#A78BFA";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
                      }}
                    >
                      <Icons.Mail /> Contact Support
                    </a>
                  </div>
                </div>

                {/* Footer matching reference image */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 64,
                  paddingTop: 24,
                  borderTop: `1px solid ${theme.cardBorder}`,
                  fontSize: 12,
                  color: theme.textDarker
                }}>
                  <div>© 2026 ClipGenius. All rights reserved.</div>
                  <div style={{ display: "flex", gap: 24 }}>
                    <span onClick={() => setSelectedPolicy("terms")} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = theme.textMuted} onMouseLeave={(e) => e.currentTarget.style.color = theme.textDarker}>Terms</span>
                    <span onClick={() => setSelectedPolicy("platform")} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = theme.textMuted} onMouseLeave={(e) => e.currentTarget.style.color = theme.textDarker}>Platform</span>
                    <span onClick={() => setSelectedPolicy("privacy")} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = theme.textMuted} onMouseLeave={(e) => e.currentTarget.style.color = theme.textDarker}>Privacy</span>
                    <span onClick={() => setSelectedPolicy("copyright")} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = theme.textMuted} onMouseLeave={(e) => e.currentTarget.style.color = theme.textDarker}>Copyright</span>
                    <span onClick={() => setSelectedPolicy("cookies")} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = theme.textMuted} onMouseLeave={(e) => e.currentTarget.style.color = theme.textDarker}>Cookies</span>
                  </div>
                </div>
              </>
            ) : (
              /* Detailed Policy View when a card is clicked */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.textMuted,
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 28,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; e.currentTarget.style.background = theme.cardBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = "transparent"; }}
                >
                  <Icons.ArrowLeft /> Back to Legal
                </button>

                <div style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 16,
                  padding: "36px 40px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, borderBottom: `1px solid ${theme.cardBorder}`, paddingBottom: 20 }}>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>{activePolicyData?.title}</h2>
                      <p style={{ fontSize: 13, color: theme.textMuted, margin: 0 }}>{activePolicyData?.description}</p>
                    </div>
                    <span style={{ fontSize: 12, color: theme.textDarker, whiteSpace: "nowrap" }}>Last updated: {activePolicyData?.lastUpdated}</span>
                  </div>

                  <div style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.8 }}>
                    {activePolicyData?.content}
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>

      </div>
    </SignedIn>
  );
}

// --- Reusable Nav Style Helper ---
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