"use client";

const colors = {
  text: "#ffffff",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.3)",
  border: "rgba(255,255,255,0.06)",
};

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Love the AI! Saved me hours of editing time.",
      user: "Sarah J.",
      role: "Content Creator",
      avatar: "👩‍🎨",
    },
    {
      quote: "Best clipping tool I've ever used. Game changer!",
      user: "Mike R.",
      role: "YouTuber",
      avatar: "🎥",
    },
    {
      quote: "The AI detection is scary accurate.",
      user: "Emily K.",
      role: "Social Media Manager",
      avatar: "📱",
    },
  ];

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
        <span style={{ fontSize: 20 }}>💬</span>
        <h3 style={{ fontWeight: 600, fontSize: 14 }}>What Creators Say</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: 12,
              padding: "16px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{testimonial.avatar}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary, fontStyle: "italic", marginBottom: 8 }}>
              "{testimonial.quote}"
            </div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{testimonial.user}</div>
            <div style={{ fontSize: 10, color: colors.textTertiary }}>{testimonial.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}