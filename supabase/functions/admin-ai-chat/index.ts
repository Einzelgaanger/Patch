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

    // Try Lovable AI proxy with LOVABLE_API_KEY
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    
    let answer = "";
    let succeeded = false;

    // Attempt 1: Use Lovable AI via the project's Supabase URL with LOVABLE_API_KEY
    if (lovableApiKey && !succeeded) {
      try {
        const aiResponse = await fetch(`${supabaseUrl}/functions/v1/ai-proxy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: question },
            ],
          }),
        });
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          answer = aiData.choices?.[0]?.message?.content || "";
          if (answer) succeeded = true;
        }
      } catch (_e) { /* try next */ }
    }

    // Attempt 2: Use Google Generative AI REST API if GOOGLE_AI_API_KEY exists
    if (!succeeded) {
      const googleKey = Deno.env.get("GOOGLE_AI_API_KEY");
      if (googleKey) {
        try {
          const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  { role: "user", parts: [{ text: `${systemPrompt}\n\nQuestion: ${question}` }] },
                ],
              }),
            }
          );
          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            answer = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (answer) succeeded = true;
          }
        } catch (_e) { /* try next */ }
      }
    }

    // Fallback: Simple data-driven answer
    if (!succeeded) {
      const total = responses?.length || 0;
      const q = question.toLowerCase();
      
      if (total === 0) {
        answer = "There are no responses yet in the database.";
      } else if (q.includes("how many") || q.includes("total") || q.includes("count")) {
        const prefects = responses!.filter((r: any) => r.was_prefect).length;
        const houses: Record<string, number> = {};
        responses!.forEach((r: any) => { houses[r.house] = (houses[r.house] || 0) + 1; });
        const houseBreakdown = Object.entries(houses).map(([h, c]) => `${h}: ${c}`).join(", ");
        answer = `There are ${total} total responses. ${prefects} were prefects. Breakdown by house: ${houseBreakdown}.`;
      } else if (q.includes("prefect")) {
        const prefects = responses!.filter((r: any) => r.was_prefect);
        answer = prefects.length === 0 
          ? "No prefects found in the responses." 
          : `Found ${prefects.length} prefects: ${prefects.map((r: any) => `${r.full_name} (${r.prefect_position || "Prefect"}, ${r.house})`).join("; ")}`;
      } else if (q.includes("house")) {
        const houses: Record<string, string[]> = {};
        responses!.forEach((r: any) => { (houses[r.house] = houses[r.house] || []).push(r.full_name); });
        answer = Object.entries(houses).map(([h, names]) => `**${h}** (${names.length}): ${names.join(", ")}`).join("\n");
      } else if (q.includes("funny") || q.includes("stories") || q.includes("story")) {
        const stories = responses!.filter((r: any) => r.funny_stories).map((r: any) => `${r.full_name}: "${r.funny_stories}"`);
        answer = stories.length === 0 ? "No funny stories shared yet." : stories.join("\n\n");
      } else if (q.includes("teacher")) {
        const teachers = responses!.filter((r: any) => r.favorite_teachers).map((r: any) => `${r.full_name}: ${r.favorite_teachers}`);
        answer = teachers.length === 0 ? "No favourite teachers mentioned yet." : teachers.join("\n\n");
      } else {
        // Generic summary
        answer = `I have ${total} responses. Here's a summary:\n` +
          responses!.slice(0, 10).map((r: any) => 
            `• ${r.full_name} (${r.house}, ${r.admission_year}-${r.graduation_year}) - ${r.current_profession || "N/A"}`
          ).join("\n") +
          (total > 10 ? `\n...and ${total - 10} more.` : "");
      }
    }

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
