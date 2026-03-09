/**
 * Admin Dashboard — uses hardcoded auth (localStorage) and edge functions
 * to bypass RLS (since we're not using Supabase auth for admin).
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  LogOut, Search, Users, Download, Loader2, MessageCircle, X, Send,
  ChevronDown, ChevronUp, Filter, Plus, Trash2, Pencil, Check, History,
  ArrowLeft, Bot,
} from "lucide-react";

const ADMIN_KEY = "NairobiSchool2026!";

interface FullResponse {
  id: string; full_name: string; email: string | null; phone: string | null;
  current_location: string | null; current_profession: string | null;
  admission_number: string | null; school_nickname: string | null;
  house: string; admission_year: number; graduation_year: number;
  dormitory_name: string | null; subjects_taken: string[] | null;
  sports_participated: string[] | null; clubs_societies: string[] | null;
  was_prefect: boolean | null; prefect_position: string | null;
  was_sports_captain: boolean | null; sports_captain_details: string | null;
  was_club_leader: boolean | null; club_leader_details: string | null;
  headmaster_name: string | null; deputy_headmaster_name: string | null;
  housemaster_name: string | null; class_teacher_names: string | null;
  school_captain_name: string | null; house_captain_name: string | null;
  prefect_names_during_time: string | null;
  uniform_memories: string | null; daily_routine_memories: string | null;
  timetable_description: string | null; dining_memories: string | null;
  favorite_meals: string | null; canteen_memories: string | null;
  dormitory_memories: string | null; swimming_pool_memories: string | null;
  weekend_activities: string | null; punishments_memories: string | null;
  visiting_days_memories: string | null; opening_closing_day: string | null;
  chapel_memories: string | null; entertainment_memories: string | null;
  games_and_hobbies: string | null;
  house_colours_description: string | null; inter_house_competitions: string | null;
  favorite_teachers: string | null; memorable_events: string | null;
  funny_stories: string | null; traditions_remembered: string | null;
  rivalry_memories: string | null; cultural_events: string | null;
  religious_life: string | null; significant_changes: string | null;
  academic_achievements: string | null; sports_achievements: string | null;
  career_achievements: string | null; advice_to_current: string | null;
  notability: string | null; signature_contribution: string | null;
  school_connection: string | null; legacy_note: string | null;
  has_photos_to_share: boolean | null; willing_to_be_interviewed: boolean | null;
  additional_comments: string | null; uploaded_files: string[] | null;
  created_at: string;
}

interface ChatSession { id: string; title: string; created_at: string; updated_at: string; }
interface ChatMessage { id: string; session_id: string; role: "user" | "assistant"; content: string; created_at: string; }

const houses = ["All", "Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"];

// ── Helpers ────────────────────────────────────────────────
const chatManage = async (action: string, extra: Record<string, any> = {}) => {
  const res = await supabase.functions.invoke("admin-chat-manage", {
    body: { adminKey: ADMIN_KEY, action, ...extra },
  });
  if (res.error) throw res.error;
  return res.data;
};

export default function AdminDashboardPage() {
  // Data table state
  const [responses, setResponses] = useState<FullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [houseFilter, setHouseFilter] = useState("All");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      navigate("/admin"); return;
    }
    fetchResponses();
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // ── Data fetching ─────────────────────────────────────────
  const fetchResponses = async () => {
    try {
      const res = await supabase.functions.invoke("fetch-responses", { body: { adminKey: ADMIN_KEY } });
      if (res.error) throw res.error;
      setResponses(res.data?.data ?? []);
    } catch (e: any) {
      toast.error("Failed to load responses: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Chat session management ───────────────────────────────
  const loadSessions = useCallback(async () => {
    try {
      const data = await chatManage("list_sessions");
      setSessions(data.sessions || []);
    } catch { /* silent */ }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      const data = await chatManage("get_messages", { sessionId });
      setMessages(data.messages || []);
    } catch { /* silent */ }
  }, []);

  const createSession = async () => {
    try {
      const data = await chatManage("create_session");
      setSessions((prev) => [data.session, ...prev]);
      setActiveSessionId(data.session.id);
      setMessages([]);
      setShowHistory(false);
    } catch (e: any) {
      toast.error("Failed to create chat: " + e.message);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await chatManage("delete_session", { sessionId: id });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) { setActiveSessionId(null); setMessages([]); }
      toast.success("Chat deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const renameSession = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      await chatManage("rename_session", { sessionId: id, title: renameValue.trim() });
      setSessions((prev) => prev.map((s) => s.id === id ? { ...s, title: renameValue.trim() } : s));
      setRenamingId(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const selectSession = async (session: ChatSession) => {
    setActiveSessionId(session.id);
    setShowHistory(false);
    await loadMessages(session.id);
  };

  // Load sessions when chat opens
  useEffect(() => {
    if (chatOpen) loadSessions();
  }, [chatOpen, loadSessions]);

  // ── Streaming AI chat ─────────────────────────────────────
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userText = chatInput.trim();
    setChatInput("");

    // Auto-create session if none active
    let sessionId = activeSessionId;
    if (!sessionId) {
      try {
        const data = await chatManage("create_session", { title: userText.substring(0, 60) });
        sessionId = data.session.id;
        setActiveSessionId(sessionId);
        setSessions((prev) => [data.session, ...prev]);
      } catch (e: any) {
        toast.error("Failed to create chat session"); return;
      }
    }

    // Save user message
    try {
      const data = await chatManage("save_message", { sessionId, role: "user", content: userText });
      setMessages((prev) => [...prev, data.message]);
    } catch { /* continue */ }

    // Auto-title if first message
    const isFirst = messages.filter((m) => m.role === "user").length === 0;
    if (isFirst) {
      chatManage("auto_title", { sessionId, firstMessage: userText }).then((d) => {
        setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, title: d.title } : s));
      }).catch(() => {});
    }

    setChatLoading(true);
    setStreamingContent("");

    // Build conversation history for AI
    const history = [...messages, { role: "user", content: userText }].map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ adminKey: ADMIN_KEY, messages: history }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      // Parse SSE stream
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              setStreamingContent(fullContent);
            }
          } catch { /* partial json, skip */ }
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) fullContent += delta;
          } catch { /* skip */ }
        }
      }

      setStreamingContent("");

      // Save assistant message
      if (fullContent) {
        try {
          const data = await chatManage("save_message", { sessionId, role: "assistant", content: fullContent });
          setMessages((prev) => [...prev, data.message]);
        } catch {
          // Still show it even if save fails
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), session_id: sessionId!, role: "assistant", content: fullContent, created_at: new Date().toISOString() }]);
        }
      }
    } catch (e: any) {
      toast.error("AI Error: " + e.message);
      setStreamingContent("");
    } finally {
      setChatLoading(false);
    }
  };

  // ── UI helpers ────────────────────────────────────────────
  const handleLogout = () => { localStorage.removeItem("admin_authenticated"); navigate("/admin"); };

  const filteredResponses = responses.filter((r) => {
    const s = search.toLowerCase();
    const matchSearch = !s || 
      r.full_name.toLowerCase().includes(s) ||
      (r.current_profession || "").toLowerCase().includes(s) ||
      (r.email || "").toLowerCase().includes(s) ||
      (r.school_nickname || "").toLowerCase().includes(s) ||
      (r.admission_number || "").toLowerCase().includes(s) ||
      (r.current_location || "").toLowerCase().includes(s) ||
      (r.headmaster_name || "").toLowerCase().includes(s) ||
      (r.dormitory_name || "").toLowerCase().includes(s) ||
      String(r.admission_year).includes(s) ||
      String(r.graduation_year).includes(s);
    const matchHouse = houseFilter === "All" || r.house === houseFilter;
    return matchSearch && matchHouse;
  }).sort((a, b) => a.admission_year - b.admission_year);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Location", "Profession", "House", "Admission", "Graduation", "Prefect", "Sports Captain", "Club Leader", "Submitted"];
    const rows = filteredResponses.map((r) => [
      r.full_name, r.email || "", r.phone || "", r.current_location || "", r.current_profession || "",
      r.house, r.admission_year, r.graduation_year,
      r.was_prefect ? (r.prefect_position || "Yes") : "No",
      r.was_sports_captain ? (r.sports_captain_details || "Yes") : "No",
      r.was_club_leader ? (r.club_leader_details || "Yes") : "No",
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `responses-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const renderDetail = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return <div className="mb-3"><span className="font-bold text-foreground text-sm">{label}:</span> <span className="text-muted-foreground text-sm">{value}</span></div>;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="z-50 shrink-0 bg-primary p-3 text-primary-foreground sm:p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="font-display text-lg font-bold text-white sm:text-xl">Admin Dashboard</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => setChatOpen(!chatOpen)} className="border-2 border-white bg-white/10 text-white shadow-sm hover:bg-white/20">
              <MessageCircle className="h-4 w-4" /> AI Assistant
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-2 border-white bg-white/10 text-white shadow-sm hover:bg-white/20">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Main content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2" />
                <p className="font-display text-2xl sm:text-3xl font-bold">{responses.length}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Responses</p>
              </CardContent></Card>
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-accent">{responses.filter((r) => r.was_prefect).length}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Were Prefects</p>
              </CardContent></Card>
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold">{responses.filter((r) => r.willing_to_be_interviewed).length}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Want Interviews</p>
              </CardContent></Card>
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold">{responses.filter((r) => r.has_photos_to_share).length}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Have Photos</p>
              </CardContent></Card>
            </div>

            {/* Table */}
            <Card className="border-0 card-elevated">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Questionnaire Responses</CardTitle>
                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                  <div className="relative flex-1 min-w-[180px] md:min-w-0 md:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full md:w-64" />
                  </div>
                  <Select value={houseFilter} onValueChange={setHouseFilter}>
                    <SelectTrigger className="w-full sm:w-40"><Filter className="h-4 w-4 mr-2 shrink-0" /><SelectValue /></SelectTrigger>
                    <SelectContent>{houses.map((h) => (<SelectItem key={h} value={h}>{h}</SelectItem>))}</SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1"><Download className="h-4 w-4" /> Export</Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
                ) : filteredResponses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No responses found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Nickname</TableHead>
                          <TableHead>House</TableHead>
                          <TableHead>Years</TableHead>
                          <TableHead className="hidden md:table-cell">Location</TableHead>
                          <TableHead className="hidden lg:table-cell">Profession</TableHead>
                          <TableHead className="hidden lg:table-cell">Roles</TableHead>
                          <TableHead className="hidden xl:table-cell">Files</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResponses.map((r) => {
                          const roles = [
                            r.was_prefect ? `Prefect${r.prefect_position ? ` (${r.prefect_position})` : ""}` : "",
                            r.was_sports_captain ? `Sports Capt.${r.sports_captain_details ? ` (${r.sports_captain_details})` : ""}` : "",
                            r.was_club_leader ? `Club Leader${r.club_leader_details ? ` (${r.club_leader_details})` : ""}` : "",
                          ].filter(Boolean).join(", ");
                          return (
                          <React.Fragment key={r.id}>
                            <TableRow className="cursor-pointer hover:bg-secondary/50" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                              <TableCell>{expandedId === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</TableCell>
                              <TableCell className="font-medium">{r.full_name}</TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground">{r.school_nickname || "—"}</TableCell>
                              <TableCell><span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">{r.house}</span></TableCell>
                              <TableCell className="whitespace-nowrap">{r.admission_year || "?"} – {r.graduation_year || "?"}</TableCell>
                              <TableCell className="hidden md:table-cell">{r.current_location || "—"}</TableCell>
                              <TableCell className="hidden lg:table-cell">{r.current_profession || "—"}</TableCell>
                              <TableCell className="hidden lg:table-cell text-xs max-w-[200px] truncate">{roles || "—"}</TableCell>
                              <TableCell className="hidden xl:table-cell">{r.uploaded_files?.length || 0}</TableCell>
                              <TableCell className="whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                            {expandedId === r.id && (
                              <TableRow>
                                <TableCell colSpan={10} className="bg-secondary/30 p-6">
                                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-2 mb-1 border-b border-border pb-1">Personal</h4>
                                    {renderDetail("Email", r.email)}
                                    {renderDetail("Phone", r.phone)}
                                    {renderDetail("Location", r.current_location)}
                                    {renderDetail("Admission #", r.admission_number)}
                                    {renderDetail("Nickname", r.school_nickname)}
                                    {renderDetail("Dormitory", r.dormitory_name)}

                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-3 mb-1 border-b border-border pb-1">Academics & Activities</h4>
                                    {renderDetail("Subjects", r.subjects_taken?.join(", "))}
                                    {renderDetail("Clubs & Societies", r.clubs_societies?.join(", "))}
                                    {renderDetail("Sports", r.sports_participated?.join(", "))}
                                    {renderDetail("Prefect Position", r.was_prefect ? (r.prefect_position || "Yes") : null)}
                                    {renderDetail("Sports Captain", r.was_sports_captain ? (r.sports_captain_details || "Yes") : null)}
                                    {renderDetail("Club Leader", r.was_club_leader ? (r.club_leader_details || "Yes") : null)}

                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-3 mb-1 border-b border-border pb-1">School Leaders</h4>
                                    {renderDetail("Headmaster", r.headmaster_name)}
                                    {renderDetail("Deputy Headmaster", r.deputy_headmaster_name)}
                                    {renderDetail("Housemaster", r.housemaster_name)}
                                    {renderDetail("Class Teachers", r.class_teacher_names)}
                                    {renderDetail("School Captain", r.school_captain_name)}
                                    {renderDetail("House Captain", r.house_captain_name)}
                                    {renderDetail("Prefects Remembered", r.prefect_names_during_time)}
                                    {renderDetail("Favourite Teachers", r.favorite_teachers)}

                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-3 mb-1 border-b border-border pb-1">Daily Life</h4>
                                    {renderDetail("Uniform Memories", r.uniform_memories)}
                                    {renderDetail("Timetable", r.timetable_description)}
                                    {renderDetail("Daily Routine", r.daily_routine_memories)}
                                    {renderDetail("Dining Memories", r.dining_memories)}
                                    {renderDetail("Favourite Meals", r.favorite_meals)}
                                    {renderDetail("Canteen / Tuck Shop", r.canteen_memories)}
                                    {renderDetail("Dormitory Life", r.dormitory_memories)}
                                    {renderDetail("Swimming Pool", r.swimming_pool_memories)}
                                    {renderDetail("Visiting Days", r.visiting_days_memories)}
                                    {renderDetail("Opening/Closing Day", r.opening_closing_day)}
                                    {renderDetail("Weekend Activities", r.weekend_activities)}
                                    {renderDetail("Punishments", r.punishments_memories)}

                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-3 mb-1 border-b border-border pb-1">House Life & Culture</h4>
                                    {renderDetail("House Colours & Identity", r.house_colours_description)}
                                    {renderDetail("Inter-House Competitions", r.inter_house_competitions)}
                                    {renderDetail("Chapel & Services", r.chapel_memories)}
                                    {renderDetail("Entertainment", r.entertainment_memories)}
                                    {renderDetail("Games & Hobbies", r.games_and_hobbies)}

                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-3 mb-1 border-b border-border pb-1">Memories</h4>
                                    {renderDetail("Memorable Events", r.memorable_events)}
                                    {renderDetail("Funny Stories", r.funny_stories)}
                                    {renderDetail("Rivalries", r.rivalry_memories)}
                                    {renderDetail("Cultural Events", r.cultural_events)}
                                    {renderDetail("Religious Life", r.religious_life)}
                                    {renderDetail("Significant Changes", r.significant_changes)}
                                    {renderDetail("Traditions", r.traditions_remembered)}

                                    <h4 className="col-span-2 font-display text-sm font-bold text-accent mt-3 mb-1 border-b border-border pb-1">Achievements & Alumni</h4>
                                    {renderDetail("Academic Achievements", r.academic_achievements)}
                                    {renderDetail("Sports Achievements", r.sports_achievements)}
                                    {renderDetail("Career Achievements", r.career_achievements)}
                                    {renderDetail("Advice to Current Students", r.advice_to_current)}
                                    {renderDetail("Notability", r.notability)}
                                    {renderDetail("Signature Contribution", r.signature_contribution)}
                                    {renderDetail("School Connection", r.school_connection)}
                                    {renderDetail("Legacy Note", r.legacy_note)}
                                    {renderDetail("Additional Comments", r.additional_comments)}

                                    {r.has_photos_to_share && <div className="text-sm text-accent font-bold">📷 Has photos to share</div>}
                                    {r.willing_to_be_interviewed && <div className="text-sm text-accent font-bold">🎙️ Willing to be interviewed</div>}
                                    {r.uploaded_files && r.uploaded_files.length > 0 && (
                                      <div className="col-span-2 mt-2">
                                        <span className="font-bold text-foreground text-sm">Uploaded Files ({r.uploaded_files.length}):</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {r.uploaded_files.map((url: string, i: number) => (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline hover:text-accent/80">File {i + 1}</a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* ── AI Chat Panel ─────────────────────────────────── */}
        {chatOpen && (
          <aside className="fixed inset-y-0 right-0 z-40 flex h-full w-full flex-col overflow-hidden border-l border-border bg-card md:relative md:inset-auto md:z-auto md:w-[420px] lg:w-[480px]">
            {/* Chat Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-primary px-4 py-3">
              <div className="flex items-center gap-2">
                {showHistory && (
                  <button onClick={() => setShowHistory(false)} className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <Bot className="h-5 w-5 text-white" />
                <div>
                  <h3 className="font-display text-sm font-bold text-white sm:text-base">
                    {showHistory ? "Chat History" : (sessions.find((s) => s.id === activeSessionId)?.title || "AI Assistant")}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowHistory(!showHistory)} className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white" title="Chat history">
                  <History className="h-4 w-4" />
                </button>
                <button onClick={createSession} className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white" title="New chat">
                  <Plus className="h-4 w-4" />
                </button>
                <button onClick={() => setChatOpen(false)} className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showHistory ? (
              /* ── Session List ──────────────────────────────── */
              <div className="flex-1 overflow-y-auto p-3">
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <History className="h-8 w-8 mb-3 opacity-40" />
                    <p className="text-sm">No chat history yet</p>
                    <Button size="sm" className="mt-4" onClick={createSession}><Plus className="h-4 w-4 mr-1" /> Start a chat</Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                          s.id === activeSessionId ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        {renamingId === s.id ? (
                          <div className="flex flex-1 items-center gap-1">
                            <Input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && renameSession(s.id)}
                              className="h-7 text-xs"
                              autoFocus
                            />
                            <button onClick={() => renameSession(s.id)} className="shrink-0 rounded p-1 hover:bg-accent/20">
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setRenamingId(null)} className="shrink-0 rounded p-1 hover:bg-accent/20">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 truncate" onClick={() => selectSession(s)}>
                              <p className="truncate">{s.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{new Date(s.updated_at).toLocaleDateString()}</p>
                            </div>
                            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); setRenamingId(s.id); setRenameValue(s.title); }}
                                className="rounded p-1 text-muted-foreground hover:bg-accent/20 hover:text-foreground"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                                className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ── Chat Messages ──────────────────────────────── */
              <>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  {messages.length === 0 && !streamingContent && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-sm font-medium text-foreground mb-1">Ask me anything about the data</p>
                      <p className="text-xs text-muted-foreground mb-4">I can search, analyze, and summarize alumni responses</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {[
                          "Who were prefects from Elgon?",
                          "Summarize the funniest stories",
                          "Which alumni are in Nairobi?",
                          "Show me all sports captains",
                        ].map((ex) => (
                          <button
                            key={ex}
                            onClick={() => setChatInput(ex)}
                            className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent/30 hover:bg-accent/10"
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "rounded-br-md bg-primary text-white"
                            : "rounded-bl-md border border-border bg-secondary text-foreground"
                        }`}>
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : msg.content}
                        </div>
                      </div>
                    ))}
                    {/* Streaming message */}
                    {streamingContent && (
                      <div className="flex justify-start">
                        <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-secondary px-4 py-2.5 text-sm leading-relaxed text-foreground">
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown>{streamingContent}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                    {chatLoading && !streamingContent && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /><span>Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-border bg-card p-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask anything about the data..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                      className="min-h-[44px] flex-1 rounded-xl border-border bg-background px-4 text-sm"
                    />
                    <Button
                      size="icon"
                      onClick={sendChat}
                      disabled={chatLoading || !chatInput.trim()}
                      className="h-[44px] w-[44px] shrink-0 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
