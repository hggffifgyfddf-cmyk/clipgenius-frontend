"use client";

import DashboardStats from "./DashboardStats";
import UploadArea from "./UploadArea";
import ActivityFeed from "./ActivityFeed";
import AnalyticsCards from "./AnalyticsCards";
import QuickActions from "./QuickActions";
import Testimonials from "./Testimonials";

export default function DashboardLayout({
  credits,
  totalClips,
  totalJobs,
  loadingCredits,
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
  jobs,
  loadingJobs,
  viewJobClips,
  createJob,
  creating,
  renderProgress,
  jobCompleted,
  setShowBuyCredits,
  setPage,
  setShowFeedback,
  loadJobs,
}) {
  return (
    <div>
      {/* Stats Row - 6 cards */}
      <DashboardStats
        credits={credits}
        totalClips={totalClips}
        totalJobs={totalJobs}
        loading={loadingCredits}
      />

      {/* Main Content - 2 Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
        {/* Left - Upload Area */}
        <div>
          <UploadArea
            file={file}
            setFile={setFile}
            youtubeUrl={youtubeUrl}
            setYoutubeUrl={setYoutubeUrl}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
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
          />

          {/* Generate Button */}
          <button
            onClick={createJob}
            disabled={creating || credits < maxClips}
            style={{
              width: "100%",
              padding: "16px",
              marginTop: 16,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              background: creating || credits < maxClips
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff",
              cursor: creating || credits < maxClips ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: creating || credits < maxClips
                ? "none"
                : "0 4px 24px rgba(99,102,241,0.25)",
            }}
            onMouseEnter={(e) => {
              if (!creating && credits >= maxClips) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (!creating && credits >= maxClips) {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.25)";
              }
            }}
          >
            {creating ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Processing...
              </span>
            ) : credits < maxClips ? (
              `Need ${maxClips - credits} more credits`
            ) : (
              "🎬 Generate Clips"
            )}
          </button>

          {/* Progress */}
          {(creating || jobCompleted) && renderProgress()}
        </div>

        {/* Right - Activity Feed */}
        <ActivityFeed jobs={jobs} loading={loadingJobs} onViewClips={viewJobClips} />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onBuyCredits={() => setShowBuyCredits(true)}
        onViewPricing={() => setPage("pricing")}
        onRefresh={loadJobs}
        onGiveFeedback={() => setShowFeedback(true)}
      />

      {/* Analytics */}
      <div style={{ marginTop: 16 }}>
        <AnalyticsCards totalClips={totalClips} />
      </div>

      {/* Testimonials */}
      <div style={{ marginTop: 16 }}>
        <Testimonials />
      </div>
    </div>
  );
}