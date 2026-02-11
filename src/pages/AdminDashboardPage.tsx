import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    const isAdmin = localStorage.getItem("admin_authenticated");
    if (!isAdmin) { navigate("/admin"); return; }
    fetchResponses();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchResponses = async () => {
    try {
      const res = await supabase.functions.invoke("fetch-responses", {
        headers: { "x-admin-key": "NairobiSchool2026!" },
      });
      if (res.error) throw res.error;
      setResponses(res.data?.data || []);
    } catch (error: any) {
      toast.error("Failed to load responses: " + error.message);
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
        headers: { "x-admin-key": "NairobiSchool2026!" },
        body: { question },
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
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button variant="heroOutline" size="sm" onClick={() => setChatOpen(!chatOpen)} className="gap-1">
              <MessageCircle className="h-4 w-4" /> AI Assistant
            </Button>
            <Button variant="heroOutline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 card-elevated"><CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="font-display text-3xl font-bold">{responses.length}</p>
            <p className="text-muted-foreground text-sm">Total Responses</p>
          </CardContent></Card>
          <Card className="border-0 card-elevated"><CardContent className="pt-6 text-center">
            <p className="font-display text-3xl font-bold text-accent">{responses.filter((r) => r.was_prefect).length}</p>
            <p className="text-muted-foreground text-sm">Were Prefects</p>
          </CardContent></Card>
          <Card className="border-0 card-elevated"><CardContent className="pt-6 text-center">
            <p className="font-display text-3xl font-bold">{responses.filter((r) => r.willing_to_be_interviewed).length}</p>
            <p className="text-muted-foreground text-sm">Want Interviews</p>
          </CardContent></Card>
          <Card className="border-0 card-elevated"><CardContent className="pt-6 text-center">
            <p className="font-display text-3xl font-bold">{responses.filter((r) => r.has_photos_to_share).length}</p>
            <p className="text-muted-foreground text-sm">Have Photos</p>
          </CardContent></Card>
        </div>

        {/* Table Card */}
        <Card className="border-0 card-elevated">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Questionnaire Responses</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name, email, profession..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
              </div>
              <Select value={houseFilter} onValueChange={setHouseFilter}>
                <SelectTrigger className="w-40"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
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
                      <>
                        <TableRow key={r.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                          <TableCell>{expandedId === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</TableCell>
                          <TableCell className="font-medium">{r.full_name}</TableCell>
                          <TableCell>{r.house}</TableCell>
                          <TableCell>{r.admission_year} - {r.graduation_year}</TableCell>
                          <TableCell>{r.current_profession || "—"}</TableCell>
                          <TableCell>{r.was_prefect ? (r.prefect_position || "Yes") : "No"}</TableCell>
                          <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                        {expandedId === r.id && (
                          <TableRow key={r.id + "-detail"}>
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
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col z-50 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <h3 className="font-display font-bold">AI Assistant</h3>
            <button onClick={() => setChatOpen(false)}><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
            {chatMessages.length === 0 && (
              <div className="text-muted-foreground text-sm text-center py-8">
                Ask me anything about the responses.<br />
                e.g. "Who were prefects from Elgon?"<br />
                "Summarize the funniest stories"
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`text-sm p-3 rounded-xl max-w-[90%] ${msg.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-secondary text-foreground"}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              placeholder="Ask about the data..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              className="rounded-xl"
            />
            <Button variant="hero" size="icon" onClick={sendChat} disabled={chatLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
