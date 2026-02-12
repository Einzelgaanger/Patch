import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_KEY = "NairobiSchool2026!";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const adminKey = body.adminKey;
    if (adminKey !== ADMIN_KEY) throw new Error("Unauthorized");

    const { question } = body;
    if (!question) throw new Error("No question provided");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: responses, error } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    const summary = (responses || []).map((r: any) => (
      `Name: ${r.full_name}, House: ${r.house}, Years: ${r.admission_year}-${r.graduation_year}, ` +
      `Profession: ${r.current_profession || "N/A"}, Location: ${r.current_location || "N/A"}, ` +
      `Prefect: ${r.was_prefect ? r.prefect_position || "Yes" : "No"}, ` +
      `Sports: ${r.sports_participated?.join(", ") || "N/A"}, ` +
      `Favorite Teachers: ${r.favorite_teachers || "N/A"}, ` +
      `Memorable Events: ${r.memorable_events || "N/A"}, ` +
      `Funny Stories: ${r.funny_stories || "N/A"}, ` +
      `Academic: ${r.academic_achievements || "N/A"}, ` +
      `Sports Achievements: ${r.sports_achievements || "N/A"}, ` +
      `Career: ${r.career_achievements || "N/A"}, ` +
      `Traditions: ${r.traditions_remembered || "N/A"}, ` +
      `Comments: ${r.additional_comments || "N/A"}`
    )).join("\n\n");

    const systemPrompt = `You are an AI assistant for the Nairobi School Commemorative Book project. You help admins analyze alumni questionnaire responses. Here is the data:\n\n${summary || "No responses yet."}\n\nAnswer the admin's question based on this data. Be concise, insightful, and helpful. Use specific names and details when relevant.`;

    const aiResponse = await fetch("https://zszbzriyosbtfvlfahlq.supabase.co/functions/v1/ai-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI proxy error: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
