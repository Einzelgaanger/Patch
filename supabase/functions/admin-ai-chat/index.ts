import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_KEY = "NairobiSchool2026!";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    if (body.adminKey !== ADMIN_KEY) throw new Error("Unauthorized");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch all questionnaire data for context
    const { data: responses, error: dbError } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (dbError) throw dbError;

    const dataSummary = (responses || []).map((r: any) => (
      `Name: ${r.full_name} | Nickname: ${r.school_nickname || "N/A"} | House: ${r.house} | Years: ${r.admission_year}-${r.graduation_year} | ` +
      `Adm#: ${r.admission_number || "N/A"} | Email: ${r.email || "N/A"} | Phone: ${r.phone || "N/A"} | ` +
      `Profession: ${r.current_profession || "N/A"} | Location: ${r.current_location || "N/A"} | ` +
      `Dormitory: ${r.dormitory_name || "N/A"} | ` +
      `Subjects: ${r.subjects_taken?.join(", ") || "N/A"} | ` +
      `Clubs: ${r.clubs_societies?.join(", ") || "N/A"} | ` +
      `Prefect: ${r.was_prefect ? (r.prefect_position || "Yes") : "No"} | ` +
      `Sports Captain: ${r.was_sports_captain ? (r.sports_captain_details || "Yes") : "No"} | ` +
      `Club Leader: ${r.was_club_leader ? (r.club_leader_details || "Yes") : "No"} | ` +
      `Sports: ${r.sports_participated?.join(", ") || "N/A"} | ` +
      `Headmaster: ${r.headmaster_name || "N/A"} | Deputy: ${r.deputy_headmaster_name || "N/A"} | ` +
      `Housemaster: ${r.housemaster_name || "N/A"} | Class Teachers: ${r.class_teacher_names || "N/A"} | ` +
      `School Captain: ${r.school_captain_name || "N/A"} | House Captain: ${r.house_captain_name || "N/A"} | ` +
      `Favorite Teachers: ${r.favorite_teachers || "N/A"} | ` +
      `Uniform: ${r.uniform_memories || "N/A"} | ` +
      `Daily Routine: ${r.daily_routine_memories || "N/A"} | ` +
      `Dining: ${r.dining_memories || "N/A"} | Fav Meals: ${r.favorite_meals || "N/A"} | ` +
      `Dorm Life: ${r.dormitory_memories || "N/A"} | ` +
      `Weekends: ${r.weekend_activities || "N/A"} | ` +
      `Punishments: ${r.punishments_memories || "N/A"} | ` +
      `Memorable Events: ${r.memorable_events || "N/A"} | ` +
      `Funny Stories: ${r.funny_stories || "N/A"} | ` +
      `Rivalries: ${r.rivalry_memories || "N/A"} | ` +
      `Cultural Events: ${r.cultural_events || "N/A"} | ` +
      `Religious Life: ${r.religious_life || "N/A"} | ` +
      `Changes Witnessed: ${r.significant_changes || "N/A"} | ` +
      `Academic: ${r.academic_achievements || "N/A"} | ` +
      `Sports Achievements: ${r.sports_achievements || "N/A"} | ` +
      `Career: ${r.career_achievements || "N/A"} | ` +
      `Advice: ${r.advice_to_current || "N/A"} | ` +
      `Traditions: ${r.traditions_remembered || "N/A"} | ` +
      `Comments: ${r.additional_comments || "N/A"} | ` +
      `Photos: ${r.has_photos_to_share ? "Yes" : "No"} | ` +
      `Interview: ${r.willing_to_be_interviewed ? "Yes" : "No"} | ` +
      `Files: ${r.uploaded_files?.length || 0}`
    )).join("\n\n");

    const systemPrompt = `You are an all-powerful AI assistant for the Nairobi School Commemorative Book project admin dashboard. You have FULL access to all alumni questionnaire data.

TOTAL RESPONSES: ${responses?.length || 0}

=== COMPLETE DATABASE ===
${dataSummary || "No responses yet."}
=== END DATABASE ===

You can answer ANY question about this data:
- Individual person lookups (by name, house, year, nickname, profession, etc.)
- Group analysis (by house, year range, sport, subject, club, etc.)
- Statistics and counts
- Finding specific stories, achievements, traditions, dining memories, uniform descriptions
- Cross-referencing data (e.g. "who played rugby AND was a prefect?")
- School leader lookups (headmasters, housemasters, school captains by year)
- Daily life comparisons across eras (food, routines, punishments, dress codes)
- Generating summaries for book chapters
- Finding patterns and insights

Be thorough, specific, and use actual names and details from the data. Format responses with markdown for readability.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(body.messages || []),
    ];

    if (body.question && !body.messages) {
      messages.push({ role: "user", content: body.question });
    }

    // Call Lovable AI Gateway with streaming
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status} - ${errText}`);
    }

    // Stream the response back
    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: any) {
    console.error("admin-ai-chat error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
