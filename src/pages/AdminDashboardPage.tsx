/**
 * Admin Dashboard — uses hardcoded auth (localStorage) and edge functions
 * to bypass RLS (since we're not using Supabase auth for admin).
 */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Search, Users, Download, Loader2, MessageCircle, X, Send, ChevronDown, ChevronUp, Filter } from "lucide-react";

interface FullResponse {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  current_location: string | null;
  current_profession: string | null;
  admission_number: string | null;
  house: string;
  admission_year: number;
  graduation_year: number;
  subjects_taken: string[] | null;
  sports_participated: string[] | null;
  was_prefect: boolean | null;
  prefect_position: string | null;
  was_sports_captain: boolean | null;
  sports_captain_details: string | null;
  was_club_leader: boolean | null;
  club_leader_details: string | null;
  academic_achievements: string | null;
  sports_achievements: string | null;
  career_achievements: string | null;
  favorite_teachers: string | null;
  memorable_events: string | null;
  funny_stories: string | null;
  traditions_remembered: string | null;
  has_photos_to_share: boolean | null;
  willing_to_be_interviewed: boolean | null;
  additional_comments: string | null;
  uploaded_files: string[] | null;
  created_at: string;
}

const houses = ["All", "Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"];

export default function AdminDashboardPage() {
  const [responses, setResponses] = useState<FullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [houseFilter, setHouseFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      navigate("/admin");
      return;
    }
    fetchResponses();
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchResponses = async () => {
    try {
      const res = await supabase.functions.invoke("fetch-responses", {
        body: { adminKey: "NairobiSchool2026!" },
      });
      if (res.error) throw res.error;
      setResponses(res.data?.data ?? []);
    } catch (error: unknown) {
      toast.error("Failed to load responses: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin");
  };

  const filteredResponses = responses.filter((r) => {
    const matchSearch = r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.current_profession || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase());
    const matchHouse = houseFilter === "All" || r.house === houseFilter;
    return matchSearch && matchHouse;
  });

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
    const a = document.createElement("a");
    a.href = url; a.download = `responses-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const question = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setChatLoading(true);

    try {
      const res = await supabase.functions.invoke("admin-ai-chat", {
        body: { question, adminKey: "NairobiSchool2026!" },
      });
      if (res.error) throw res.error;
      setChatMessages((prev) => [...prev, { role: "ai", text: res.data?.answer || "No response." }]);
    } catch (error: any) {
      setChatMessages((prev) => [...prev, { role: "ai", text: "Error: " + error.message }]);
    } finally {
      setChatLoading(false);
    }
  };

  const renderDetail = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return <div className="mb-3"><span className="font-bold text-foreground text-sm">{label}:</span> <span className="text-muted-foreground text-sm">{value}</span></div>;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
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

        {/* Table Card */}
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
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1">
                <Download className="h-4 w-4" /> Export
              </Button>
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
                      <TableHead></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>House</TableHead>
                      <TableHead>Years</TableHead>
                      <TableHead>Profession</TableHead>
                      <TableHead>Prefect</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((r) => (
                      <React.Fragment key={r.id}>
                        <TableRow className="cursor-pointer hover:bg-secondary/50" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                          <TableCell>{expandedId === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</TableCell>
                          <TableCell className="font-medium">{r.full_name}</TableCell>
                          <TableCell>{r.house}</TableCell>
                          <TableCell>{r.admission_year} - {r.graduation_year}</TableCell>
                          <TableCell>{r.current_profession || "—"}</TableCell>
                          <TableCell>{r.was_prefect ? (r.prefect_position || "Yes") : "No"}</TableCell>
                          <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                        {expandedId === r.id && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-secondary/30 p-6">
                              <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                                {renderDetail("Email", r.email)}
                                {renderDetail("Phone", r.phone)}
                                {renderDetail("Location", r.current_location)}
                                {renderDetail("Admission #", r.admission_number)}
                                {renderDetail("Subjects", r.subjects_taken?.join(", "))}
                                {renderDetail("Sports", r.sports_participated?.join(", "))}
                                {renderDetail("Sports Captain", r.was_sports_captain ? (r.sports_captain_details || "Yes") : null)}
                                {renderDetail("Club Leader", r.was_club_leader ? (r.club_leader_details || "Yes") : null)}
                                {renderDetail("Academic Achievements", r.academic_achievements)}
                                {renderDetail("Sports Achievements", r.sports_achievements)}
                                {renderDetail("Career Achievements", r.career_achievements)}
                                {renderDetail("Favourite Teachers", r.favorite_teachers)}
                                {renderDetail("Memorable Events", r.memorable_events)}
                                {renderDetail("Funny Stories", r.funny_stories)}
                                {renderDetail("Traditions", r.traditions_remembered)}
                                {renderDetail("Additional Comments", r.additional_comments)}
                                {r.has_photos_to_share && <div className="text-sm text-accent font-bold">📷 Has photos to share</div>}
                                {r.willing_to_be_interviewed && <div className="text-sm text-accent font-bold">🎙️ Willing to be interviewed</div>}
                                {r.uploaded_files && r.uploaded_files.length > 0 && (
                                  <div className="col-span-2 mt-2">
                                    <span className="font-bold text-foreground text-sm">Uploaded Files ({r.uploaded_files.length}):</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {r.uploaded_files.map((url, i) => (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline hover:text-accent/80">
                                          File {i + 1}
                                        </a>
                                      ))}
                                    </div>
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

        {/* AI Chat — plain flex: header | scrollable messages | input */}
        {chatOpen && (
          <aside className="fixed inset-y-0 right-0 z-40 flex h-full min-h-0 w-full flex-col overflow-hidden border-l border-border bg-card md:relative md:inset-auto md:z-auto md:h-full md:min-h-0 md:w-[380px] lg:w-[420px]">
            {/* Header — fixed height */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-primary px-4 py-3">
              <div>
                <h3 className="font-display text-base font-bold text-white sm:text-lg">AI Assistant</h3>
                <p className="mt-0.5 text-xs text-white/70">Ask about questionnaire responses</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages — this is the only thing that scrolls */}
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="mb-4 text-sm text-muted-foreground">Ask me anything about the responses.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Who were prefects from Elgon?",
                      "Summarize the funniest stories",
                      "Which houses had sports captains?",
                    ].map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setChatInput(example)}
                        className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent/30 hover:bg-accent/10"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-md bg-primary text-white"
                          : "rounded-bl-md border border-border bg-secondary text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
              <div ref={chatEndRef} />
            </div>

            {/* Input — fixed height at bottom */}
            <div
              className="shrink-0 border-t border-border bg-card p-3"
              style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about the data..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                  className="min-h-[44px] flex-1 rounded-xl border-border bg-background px-4 text-sm sm:min-h-[40px]"
                />
                <Button
                  size="icon"
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="h-[44px] w-[44px] shrink-0 rounded-xl sm:h-10 sm:w-10"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}


