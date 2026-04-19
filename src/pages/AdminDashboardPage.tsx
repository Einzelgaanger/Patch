/**
 * Admin Dashboard — uses hardcoded auth (localStorage) and edge functions
 * to bypass RLS (since we're not using Supabase auth for admin).
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  LogOut, Search, Users, Download, Loader2, MessageCircle, X, Send,
  ChevronDown, ChevronUp, Plus, Trash2, Pencil, Check, History,
  ArrowLeft, Bot, FileIcon,
} from "lucide-react";

const ADMIN_KEY = "NairobiSchool2026!";

interface FullResponse {
  id: string;
  full_name: string;
  school_nickname: string | null;
  date_of_birth: string | null;
  house: string;
  admission_year: number;
  graduation_year: number;
  leaders_by_year: Record<string, string[]> | null;
  captains_by_year: Record<string, string[]> | null;
  prefects_elected_or_appointed: string | null;
  prefect_change_year: string | null;
  notable_old_cambrian: string | null;
  memorable_event: string | null;
  uploaded_files: string[] | null;
  created_at: string;
}

interface ChatSession { id: string; title: string; created_at: string; updated_at: string; }
interface ChatMessage { id: string; session_id: string; role: "user" | "assistant"; content: string; created_at: string; }

const houses = ["All", "Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"];
const yearLabels = ["Year 1", "Year 2", "Year 3", "Year 4"];
const leaderRoleLabels: Record<string, string> = {
  headmaster: "Headmaster / Chief Principal",
  chaplain: "Chaplain",
  head_of_school: "Head of School",
  head_of_house: "Head of House / Captain",
};

const chatManage = async (action: string, extra: Record<string, any> = {}) => {
  const res = await supabase.functions.invoke("admin-chat-manage", {
    body: { adminKey: ADMIN_KEY, action, ...extra },
  });
  if (res.error) throw res.error;
  return res.data;
};

export default function AdminDashboardPage() {
  const [responses, setResponses] = useState<FullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [houseFilter, setHouseFilter] = useState("All");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Chat
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
    if (localStorage.getItem("admin_authenticated") !== "true") { navigate("/admin"); return; }
    fetchResponses();
  }, [navigate]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingContent]);

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

  const loadSessions = useCallback(async () => {
    try { const data = await chatManage("list_sessions"); setSessions(data.sessions || []); } catch { /* */ }
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    try { const data = await chatManage("get_messages", { sessionId }); setMessages(data.messages || []); } catch { /* */ }
  }, []);

  const createSession = async () => {
    try {
      const data = await chatManage("create_session");
      setSessions((prev) => [data.session, ...prev]);
      setActiveSessionId(data.session.id);
      setMessages([]); setShowHistory(false);
    } catch (e: any) { toast.error("Failed to create chat: " + e.message); }
  };

  const deleteSession = async (id: string) => {
    try {
      await chatManage("delete_session", { sessionId: id });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) { setActiveSessionId(null); setMessages([]); }
      toast.success("Chat deleted");
    } catch (e: any) { toast.error(e.message); }
  };

  const renameSession = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      await chatManage("rename_session", { sessionId: id, title: renameValue.trim() });
      setSessions((prev) => prev.map((s) => s.id === id ? { ...s, title: renameValue.trim() } : s));
      setRenamingId(null);
    } catch (e: any) { toast.error(e.message); }
  };

  const selectSession = async (session: ChatSession) => {
    setActiveSessionId(session.id); setShowHistory(false); await loadMessages(session.id);
  };

  useEffect(() => { if (chatOpen) loadSessions(); }, [chatOpen, loadSessions]);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userText = chatInput.trim();
    setChatInput("");

    let sessionId = activeSessionId;
    if (!sessionId) {
      try {
        const data = await chatManage("create_session", { title: userText.substring(0, 60) });
        sessionId = data.session.id;
        setActiveSessionId(sessionId);
        setSessions((prev) => [data.session, ...prev]);
      } catch { toast.error("Failed to create chat session"); return; }
    }

    try {
      const data = await chatManage("save_message", { sessionId, role: "user", content: userText });
      setMessages((prev) => [...prev, data.message]);
    } catch { /* */ }

    const isFirst = messages.filter((m) => m.role === "user").length === 0;
    if (isFirst) {
      chatManage("auto_title", { sessionId, firstMessage: userText }).then((d) => {
        setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, title: d.title } : s));
      }).catch(() => {});
    }

    setChatLoading(true);
    setStreamingContent("");

    const history = [...messages, { role: "user", content: userText }].map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ adminKey: ADMIN_KEY, messages: history }),
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl); buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) { fullContent += delta; setStreamingContent(fullContent); }
          } catch { /* */ }
        }
      }
      setStreamingContent("");
      if (fullContent) {
        try {
          const data = await chatManage("save_message", { sessionId, role: "assistant", content: fullContent });
          setMessages((prev) => [...prev, data.message]);
        } catch {
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), session_id: sessionId!, role: "assistant", content: fullContent, created_at: new Date().toISOString() }]);
        }
      }
    } catch (e: any) {
      toast.error("AI Error: " + e.message); setStreamingContent("");
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem("admin_authenticated"); navigate("/admin"); };

  const filteredResponses = responses.filter((r) => {
    const s = search.toLowerCase();
    const leadersStr = JSON.stringify(r.leaders_by_year || {}).toLowerCase();
    const captainsStr = JSON.stringify(r.captains_by_year || {}).toLowerCase();
    const matchSearch = !s ||
      r.full_name.toLowerCase().includes(s) ||
      (r.school_nickname || "").toLowerCase().includes(s) ||
      (r.notable_old_cambrian || "").toLowerCase().includes(s) ||
      (r.memorable_event || "").toLowerCase().includes(s) ||
      leadersStr.includes(s) ||
      captainsStr.includes(s) ||
      String(r.admission_year).includes(s) ||
      String(r.graduation_year).includes(s);
    const matchHouse = houseFilter === "All" || r.house === houseFilter;
    const fromY = yearFrom ? parseInt(yearFrom) : 0;
    const toY = yearTo ? parseInt(yearTo) : 9999;
    const matchYear = (r.admission_year || 0) >= fromY && (r.graduation_year || 9999) <= toY;
    return matchSearch && matchHouse && matchYear;
  }).sort((a, b) => (a.admission_year || 0) - (b.admission_year || 0));

  const exportCSV = () => {
    const headers = [
      "Name", "Nickname", "DOB", "House", "Entry Year", "Exit Year",
      "Headmaster (Y1-Y4)", "Chaplain (Y1-Y4)", "Head of School (Y1-Y4)", "Head of House (Y1-Y4)",
      ...["Soccer","Rugby","Hockey","Basketball","Cricket","Swimming","Tennis","Athletics"].map((s) => `${s} Captain (Y1-Y4)`),
      "Prefects Method", "Prefect Change Year",
      "Notable Old Cambrian", "Memorable Event", "Files", "Submitted",
    ];
    const formatYears = (arr?: string[] | null) => (arr || []).filter(Boolean).join(" | ");
    const rows = filteredResponses.map((r) => [
      r.full_name, r.school_nickname || "", r.date_of_birth || "",
      r.house, r.admission_year || "", r.graduation_year || "",
      formatYears(r.leaders_by_year?.headmaster),
      formatYears(r.leaders_by_year?.chaplain),
      formatYears(r.leaders_by_year?.head_of_school),
      formatYears(r.leaders_by_year?.head_of_house),
      ...["Soccer","Rugby","Hockey","Basketball","Cricket","Swimming","Tennis","Athletics"].map((s) => formatYears(r.captains_by_year?.[s])),
      r.prefects_elected_or_appointed || "",
      r.prefect_change_year || "",
      (r.notable_old_cambrian || "").replace(/\n/g, " "),
      (r.memorable_event || "").replace(/\n/g, " "),
      (r.uploaded_files || []).join(" | "),
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const escape = (v: any) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `responses-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const renderYearTable = (title: string, rows: { label: string; values: string[] }[]) => (
    <div>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2 border-b border-border">Role</th>
              {yearLabels.map((y) => <th key={y} className="text-left p-2 border-b border-border">{y}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="p-2 font-medium">{row.label}</td>
                {[0, 1, 2, 3].map((i) => (
                  <td key={i} className="p-2 text-muted-foreground">{row.values[i] || "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2" />
                <p className="font-display text-2xl sm:text-3xl font-bold">{responses.length}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Responses</p>
              </CardContent></Card>
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-accent">{responses.filter((r) => r.uploaded_files?.length).length}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">With Uploads</p>
              </CardContent></Card>
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold">{new Set(responses.map((r) => r.house)).size}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Houses Represented</p>
              </CardContent></Card>
              <Card className="border-0 card-elevated"><CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold">{responses.length ? Math.min(...responses.map((r) => r.admission_year || 9999)) : "—"}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Earliest Year</p>
              </CardContent></Card>
            </div>

            {/* Filters */}
            <Card className="border-0 card-elevated mb-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name, nickname, leaders, events…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <div className="md:col-span-3">
                    <Select value={houseFilter} onValueChange={setHouseFilter}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {houses.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input className="md:col-span-2" placeholder="Year from" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} />
                  <Input className="md:col-span-2" placeholder="Year to" value={yearTo} onChange={(e) => setYearTo(e.target.value)} />
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="outline" size="sm" onClick={exportCSV} disabled={!filteredResponses.length}>
                    <Download className="h-4 w-4" /> Download CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 card-elevated">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" /></div>
                ) : filteredResponses.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">No responses yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Nickname</TableHead>
                          <TableHead>House</TableHead>
                          <TableHead>Years</TableHead>
                          <TableHead className="hidden md:table-cell">Files</TableHead>
                          <TableHead className="hidden md:table-cell">Submitted</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResponses.map((r) => (
                          <React.Fragment key={r.id}>
                            <TableRow className="cursor-pointer hover:bg-muted/30" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                              <TableCell className="font-medium">{r.full_name}</TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground">{r.school_nickname || "—"}</TableCell>
                              <TableCell><span className="inline-block px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">{r.house}</span></TableCell>
                              <TableCell className="text-sm">{r.admission_year || "?"}–{r.graduation_year || "?"}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.uploaded_files?.length || 0}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>{expandedId === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</TableCell>
                            </TableRow>
                            {expandedId === r.id && (
                              <TableRow>
                                <TableCell colSpan={7} className="bg-muted/20 p-6">
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                      <div><span className="font-semibold">DOB:</span> <span className="text-muted-foreground">{r.date_of_birth || "—"}</span></div>
                                      <div><span className="font-semibold">Prefects:</span> <span className="text-muted-foreground">{r.prefects_elected_or_appointed || "—"}</span></div>
                                      <div><span className="font-semibold">Change year:</span> <span className="text-muted-foreground">{r.prefect_change_year || "—"}</span></div>
                                    </div>

                                    {r.leaders_by_year && renderYearTable("School Leaders", Object.entries(leaderRoleLabels).map(([k, label]) => ({
                                      label, values: r.leaders_by_year?.[k] || [],
                                    })))}

                                    {r.captains_by_year && renderYearTable("Sports Captains", Object.entries(r.captains_by_year).map(([sport, vals]) => ({
                                      label: `${sport} Captain`, values: vals as string[],
                                    })))}

                                    {r.notable_old_cambrian && (
                                      <div>
                                        <h4 className="font-semibold mb-1">Notable Old Cambrian</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.notable_old_cambrian}</p>
                                      </div>
                                    )}

                                    {r.memorable_event && (
                                      <div>
                                        <h4 className="font-semibold mb-1">Memorable Event</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.memorable_event}</p>
                                      </div>
                                    )}

                                    {r.uploaded_files && r.uploaded_files.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Attached Files</h4>
                                        <ul className="space-y-1">
                                          {r.uploaded_files.map((url, i) => (
                                            <li key={i}>
                                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-2">
                                                <FileIcon className="h-4 w-4" /> {url.split("/").pop()}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Chat panel */}
        {chatOpen && (
          <aside className="z-40 flex w-full max-w-md shrink-0 flex-col border-l border-border bg-card sm:w-96">
            <div className="flex items-center justify-between border-b border-border p-3">
              <div className="flex items-center gap-2">
                {showHistory && activeSessionId && (
                  <Button size="icon" variant="ghost" onClick={() => setShowHistory(false)}><ArrowLeft className="h-4 w-4" /></Button>
                )}
                <Bot className="h-5 w-5 text-accent" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => setShowHistory(!showHistory)} title="History"><History className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={createSession} title="New chat"><Plus className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setChatOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
            </div>

            {showHistory ? (
              <div className="flex-1 overflow-y-auto p-2">
                {sessions.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">No chats yet.</p>
                ) : (
                  sessions.map((s) => (
                    <div key={s.id} className={`group flex items-center gap-2 rounded p-2 hover:bg-muted ${activeSessionId === s.id ? "bg-muted" : ""}`}>
                      {renamingId === s.id ? (
                        <>
                          <Input className="h-7 text-sm" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && renameSession(s.id)} autoFocus />
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => renameSession(s.id)}><Check className="h-3 w-3" /></Button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => selectSession(s)} className="flex-1 truncate text-left text-sm">{s.title}</button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => { setRenamingId(s.id); setRenameValue(s.title); }}><Pencil className="h-3 w-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteSession(s.id)}><Trash2 className="h-3 w-3" /></Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.length === 0 && !streamingContent && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      Ask anything about the responses — e.g., "Chronological list of headmasters" or "Who was rugby captain in 1995?"
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`rounded-lg p-3 text-sm ${m.role === "user" ? "bg-accent/10 ml-6" : "bg-muted mr-6"}`}>
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ))}
                  {streamingContent && (
                    <div className="rounded-lg p-3 text-sm bg-muted mr-6">
                      <ReactMarkdown>{streamingContent}</ReactMarkdown>
                    </div>
                  )}
                  {chatLoading && !streamingContent && <div className="flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="border-t border-border p-3 flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendChat())} placeholder="Ask about the data…" disabled={chatLoading} />
                  <Button size="icon" onClick={sendChat} disabled={chatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </div>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
