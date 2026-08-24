import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();

    // Basic job settings
    const preset = body.preset || "viral";
    const ratio = body.ratio || "9:16";
    const clipLength = Number(body.clipLength || 18);
    const maxClips = Number(body.maxClips || 10);
    const videoPath = body.videoPath;
    const youtubeUrl = body.youtubeUrl; // ✅ supports YouTube links

    // ✅ Read subtitle fields – frontend now sends snake_case
    const subtitle_on = body.subtitle_on !== undefined ? body.subtitle_on : true;
    const subtitle_color = body.subtitle_color || "white";
    const subtitle_style = body.subtitle_style || "normal";           // "highlighted" for karaoke
    const subtitle_highlight_color = body.subtitle_highlight_color || "red";

    // Require at least one source
    if (!videoPath && !youtubeUrl) {
      return Response.json({ error: "Missing videoPath or youtubeUrl" }, { status: 400 });
    }

    const sb = supabaseAdmin();

    // Insert the job with all fields
    const { data: job, error } = await sb
      .from("jobs")
      .insert([
        {
          user_id: userId,
          preset,
          ratio,
          clip_length: clipLength,
          max_clips: maxClips,
          status: "queued",
          video_path: videoPath || null,
          youtube_url: youtubeUrl || null,
          subtitle_on,
          subtitle_color,
          subtitle_style,                     // ✅ stored in DB
          subtitle_highlight_color,           // ✅ stored in DB
          clips_data: [],
          clip_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("JOB INSERT ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // ✅ Enhanced logging – includes highlight color
    console.log("✅ JOB CREATED:", {
      id: job.id,
      type: youtubeUrl ? "YOUTUBE" : "UPLOAD",
      color: subtitle_color,
      style: subtitle_style,
      highlight: subtitle_highlight_color,
    });

    return Response.json({ success: true, job });
  } catch (err) {
    console.error("CREATE JOB CRASH:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}