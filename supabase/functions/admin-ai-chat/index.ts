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

    const formatYearMap = (m: any) => {
      if (!m || typeof m !== "object") return "N/A";
      return Object.entries(m)
        .map(([role, vals]: [string, any]) => {
          const arr = Array.isArray(vals) ? vals : [];
          const filled = arr.map((v, i) => v ? `Y${i + 1}: ${v}` : null).filter(Boolean).join(", ");
          return filled ? `${role} → ${filled}` : null;
        })
        .filter(Boolean)
        .join("; ");
    };

    const dataSummary = (responses || []).map((r: any) => (
      `--- Respondent ---\n` +
      `Name: ${r.full_name} | Nickname: ${r.school_nickname || "N/A"} | DOB: ${r.date_of_birth || "N/A"} | ` +
      `House: ${r.house} | Years: ${r.admission_year}-${r.graduation_year}\n` +
      `Leaders by year: ${formatYearMap(r.leaders_by_year)}\n` +
      `Sports captains by year: ${formatYearMap(r.captains_by_year)}\n` +
      `Prefects method: ${r.prefects_elected_or_appointed || "N/A"} | Change year: ${r.prefect_change_year || "N/A"}\n` +
      `Notable Old Cambrian: ${r.notable_old_cambrian || "N/A"}\n` +
      `Memorable event: ${r.memorable_event || "N/A"}\n` +
      `Files attached: ${r.uploaded_files?.length || 0}`
    )).join("\n\n");

    const systemPrompt = `You are an AI assistant for the Nairobi School Commemorative Book project. You have full access to all alumni questionnaire responses.

TOTAL RESPONSES: ${responses?.length || 0}

=== COMPLETE DATABASE ===
${dataSummary || "No responses yet."}
=== END DATABASE ===

The questionnaire collects, per respondent:
- Personal: name, nickname, DOB, entry/exit year, house
- A grid of school leaders (Headmaster, Chaplain, Head of School, Head of House) for each of their 4 years at the school
- A grid of sports captains (Soccer, Rugby, Hockey, Basketball, Cricket, Swimming, Tennis, Athletics) for each of their 4 years
- Whether prefects were elected or appointed, and when the change happened
- A notable Old Cambrian and a memorable event
- Uploaded documents (fees invoices, school reports, menus, programs, etc.)

KEY CAPABILITIES:
1. Individual lookups by name, nickname, house, or year.
2. Group/filter analysis by house, year range, etc.
3. **Chronological reconstruction (most important)** — combine the year-grids from all respondents to build authoritative timelines:
   - "Chronological list of headmasters" → for every respondent, map their entry year + 0..3 to each Y1-Y4 leader entry, then deduplicate and sort by year.
   - "Who was rugby captain in 1995?" → find any respondent whose entry year ≤ 1995 ≤ exit year, then read the captains_by_year['Rugby'] entry for the right year offset.
4. Pattern detection across responses (corroboration vs contradictions — flag both).
5. Notable alumni / Roll of Honour from notable_old_cambrian fields.
6. Chapter draft generation from aggregated memorable events.

Always cite which respondent provided each fact. Use markdown tables for chronological/comparative answers.`;

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
