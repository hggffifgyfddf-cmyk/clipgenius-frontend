"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnalyticsCards({ totalClips, totalJobs, credits }) {
  const [animatedDaily, setAnimatedDaily] = useState(0);
  const [animatedWeekly, setAnimatedWeekly] = useState(0);
  const [animatedMonthly, setAnimatedMonthly] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    animateNumber(Math.min(47, totalClips), setAnimatedDaily, 800);
    animateNumber(Math.min(328, totalClips * 0.7), setAnimatedWeekly, 800);
    animateNumber(Math.min(1200, totalClips * 1.2), setAnimatedMonthly, 800);
    animateNumber(totalClips, setAnimatedTotal, 1000);
  }, [totalClips]);

  const animateNumber = (target, setter, duration) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  };

  const analytics = [
    { label: "Today", value: animatedDaily, icon: "📅", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
    { label: "This Week", value: animatedWeekly, icon: "📊", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { label: "This Month", value: animatedMonthly, icon: "📈", gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" },
    { label: "All Time", value: animatedTotal, icon: "🏆", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📈</span>
        <h3 className="font-semibold text-sm">Analytics Overview</h3>
        <span className="text-[10px] text-white/30 ml-auto uppercase tracking-wider">
          {totalClips} total clips
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {analytics.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="bg-white/5 rounded-xl p-4 text-center"
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <div
              className="text-xl font-bold"
              style={{
                background: item.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {item.value}
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider font-medium mt-0.5">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}