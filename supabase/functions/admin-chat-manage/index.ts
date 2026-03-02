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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action } = body;

    // LIST sessions
    if (action === "list_sessions") {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ sessions: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CREATE session
    if (action === "create_session") {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ title: body.title || "New Chat" })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ session: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // RENAME session
    if (action === "rename_session") {
      const { data, error } = await supabase
        .from("chat_sessions")
        .update({ title: body.title, updated_at: new Date().toISOString() })
        .eq("id", body.sessionId)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ session: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE session (cascades to messages)
    if (action === "delete_session") {
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", body.sessionId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET messages for a session
    if (action === "get_messages") {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", body.sessionId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ messages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SAVE message
    if (action === "save_message") {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          session_id: body.sessionId,
          role: body.role,
          content: body.content,
        })
        .select()
        .single();
      if (error) throw error;

      // Update session timestamp
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", body.sessionId);

      return new Response(JSON.stringify({ message: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AUTO-TITLE: generate title from first message
    if (action === "auto_title") {
      const title = (body.firstMessage || "New Chat").substring(0, 60);
      const { error } = await supabase
        .from("chat_sessions")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", body.sessionId);
      if (error) throw error;
      return new Response(JSON.stringify({ title }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unknown action: " + action);
  } catch (error: any) {
    console.error("admin-chat-manage error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
