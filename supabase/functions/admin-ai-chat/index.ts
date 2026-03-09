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
      `Prefects Remembered: ${r.prefect_names_during_time || "N/A"} | ` +
      `Favorite Teachers: ${r.favorite_teachers || "N/A"} | ` +
      `Uniform: ${r.uniform_memories || "N/A"} | ` +
      `Timetable: ${r.timetable_description || "N/A"} | ` +
      `Daily Routine: ${r.daily_routine_memories || "N/A"} | ` +
      `Dining: ${r.dining_memories || "N/A"} | Fav Meals: ${r.favorite_meals || "N/A"} | ` +
      `Canteen: ${r.canteen_memories || "N/A"} | ` +
      `Dorm Life: ${r.dormitory_memories || "N/A"} | ` +
      `Swimming Pool: ${r.swimming_pool_memories || "N/A"} | ` +
      `Visiting Days: ${r.visiting_days_memories || "N/A"} | ` +
      `Opening/Closing: ${r.opening_closing_day || "N/A"} | ` +
      `Chapel: ${r.chapel_memories || "N/A"} | ` +
      `Entertainment: ${r.entertainment_memories || "N/A"} | ` +
      `Games/Hobbies: ${r.games_and_hobbies || "N/A"} | ` +
      `House Colours: ${r.house_colours_description || "N/A"} | ` +
      `Inter-House Competitions: ${r.inter_house_competitions || "N/A"} | ` +
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
      `Notability: ${r.notability || "N/A"} | ` +
      `Signature Contribution: ${r.signature_contribution || "N/A"} | ` +
      `School Connection: ${r.school_connection || "N/A"} | ` +
      `Legacy Note: ${r.legacy_note || "N/A"} | ` +
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

You can answer ANY question about this data. You are essentially a human-language query engine over this dataset.

## KEY CAPABILITIES:
1. **Individual lookups** — Find any person by name, nickname, house, year, admission number, profession, etc.
2. **Group analysis** — Filter by house, year range, sport, subject, club, profession, location, etc.
3. **Statistics & counts** — How many prefects, sports captains, per house, per decade, etc.
4. **Cross-referencing** — "Who played rugby AND was a prefect AND was in Baringo?"
5. **Chronological reconstruction** — This is critical for book writing:
   - When asked about events, leaders, food, uniforms, etc. across time, compile a CHRONOLOGICAL TIMELINE from all responses.
   - Example: "Give me a chronological order of headmasters" → scan ALL responses, extract headmaster_name + years, deduplicate, sort by admission_year.
   - Example: "How did food change over the decades?" → gather dining_memories + favorite_meals from all responses, group by decade, present chronologically.
   - Example: "Timeline of canteen items and prices" → extract canteen_memories, sort by era.
6. **School leader lookups** — Headmasters, housemasters, school captains, house captains, prefects, by year.
7. **Daily life comparisons across eras** — Food, routines, punishments, dress codes, canteen items, timetables.
8. **House analysis** — Colours, war cries, inter-house competition results, house culture over time.
9. **Notable alumni profiles** — For the Roll of Honour section.
10. **Chapter generation** — Generate draft book chapter content from aggregated responses on any topic.
11. **Pattern detection** — Find common themes, recurring names, shared memories across responses.

## CHRONOLOGICAL ANALYSIS INSTRUCTIONS:
When the admin asks for chronological/timeline data:
- Scan ALL responses and extract the relevant field(s)
- Group by decade or year range (using admission_year and graduation_year)
- Present as a clear timeline with dates and details
- Note where multiple respondents corroborate the same fact
- Flag contradictions between responses
- Always cite which respondent(s) provided each data point

Be thorough, specific, and use actual names and details from the data. Format responses with markdown for readability. Use tables for comparative data.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(body.messages || []),
    ];

    if (body.question && !body.messages) {
      messages.push({ role: "user", content: body.question });
    }

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
