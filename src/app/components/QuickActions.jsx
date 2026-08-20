"use client";

const colors = {
  text: "#ffffff",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.3)",
  border: "rgba(255,255,255,0.06)",
};

export default function QuickActions({
  onBuyCredits,
  onViewPricing,
  onRefresh,
  onGiveFeedback,
}) {
  const actions = [
    { icon: "💳", label: "Buy Credits", onClick: onBuyCredits, color: "#6366f1" },
    { icon: "📊", label: "View Pricing", onClick: onViewPricing, color: "#8b5cf6" },
    { icon: "🔄", label: "Refresh", onClick: onRefresh, color: "#06b6d4" },
    { icon: "💬", label: "Give Feedback", onClick: onGiveFeedback, color: "#22c55e" },
  ];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: "16px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>⚡</span>
        <h3 style={{ fontWeight: 600, fontSize: 14 }}>Quick Actions</h3>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            style={{
              padding: "8px 20px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              background: `rgba(${action.color === "#6366f1" ? "99,102,241" : 
                action.color === "#8b5cf6" ? "139,92,246" : 
                action.color === "#06b6d4" ? "6,182,212" : 
                "34,197,94"}, 0.1)`,
              color: action.color,
              border: `1px solid rgba(${action.color === "#6366f1" ? "99,102,241" : 
                action.color === "#8b5cf6" ? "139,92,246" : 
                action.color === "#06b6d4" ? "6,182,212" : 
                "34,197,94"}, 0.2)`,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(${
                action.color === "#6366f1" ? "99,102,241" : 
                action.color === "#8b5cf6" ? "139,92,246" : 
                action.color === "#06b6d4" ? "6,182,212" : 
                "34,197,94"
              }, 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ marginRight: 6 }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}