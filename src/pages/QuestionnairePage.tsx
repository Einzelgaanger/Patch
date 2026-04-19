import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Upload, FileIcon, X, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import impalaLogo from "@/assets/impala-logo.png";

const houses = ["Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"];
const yearLabels = ["Year 1", "Year 2", "Year 3", "Year 4"];
const leaderRoles = [
  { key: "headmaster", label: "Headmaster / Chief Principal" },
  { key: "chaplain", label: "Chaplain" },
  { key: "head_of_school", label: "Head of School" },
  { key: "head_of_house", label: "Head of House / Captain" },
];
const sportRoles = [
  "Soccer", "Rugby", "Hockey", "Basketball",
  "Cricket", "Swimming", "Tennis", "Athletics",
];

type LeadersByYear = Record<string, [string, string, string, string]>;
type CaptainsByYear = Record<string, [string, string, string, string]>;

const emptyYears = (): [string, string, string, string] => ["", "", "", ""];

export default function QuestionnairePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Section 1
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [entryYear, setEntryYear] = useState("");
  const [exitYear, setExitYear] = useState("");
  const [house, setHouse] = useState("");

  // Section 4 — Leaders
  const [leaders, setLeaders] = useState<LeadersByYear>(
    Object.fromEntries(leaderRoles.map((r) => [r.key, emptyYears()])) as LeadersByYear
  );

  // Section 6 — Captains
  const [captains, setCaptains] = useState<CaptainsByYear>(
    Object.fromEntries(sportRoles.map((s) => [s, emptyYears()])) as CaptainsByYear
  );

  // Section 7 & 8
  const [prefectsMethod, setPrefectsMethod] = useState("");
  const [prefectChangeYear, setPrefectChangeYear] = useState("");

  // Section 9 & 10
  const [notableOldCambrian, setNotableOldCambrian] = useState("");
  const [memorableEvent, setMemorableEvent] = useState("");

  const updateLeader = (role: string, idx: number, value: string) => {
    setLeaders((prev) => {
      const row = [...prev[role]] as [string, string, string, string];
      row[idx] = value;
      return { ...prev, [role]: row };
    });
  };

  const updateCaptain = (sport: string, idx: number, value: string) => {
    setCaptains((prev) => {
      const row = [...prev[sport]] as [string, string, string, string];
      row[idx] = value;
      return { ...prev, [sport]: row };
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (i: number) => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const filePaths: string[] = [];
      if (uploadedFiles.length > 0) {
        const timestamp = Date.now();
        for (const file of uploadedFiles) {
          const filePath = `${timestamp}-${Math.random().toString(36).slice(2)}/${file.name}`;
          const { error: upErr } = await supabase.storage
            .from("questionnaire-uploads")
            .upload(filePath, file);
          if (upErr) { console.error("Upload error:", upErr); continue; }
          const { data: urlData } = supabase.storage
            .from("questionnaire-uploads")
            .getPublicUrl(filePath);
          filePaths.push(urlData.publicUrl);
        }
      }

      const { error } = await supabase.from("questionnaire_responses").insert({
        full_name: name || "Anonymous",
        school_nickname: nickname || null,
        date_of_birth: dob || null,
        admission_year: entryYear ? parseInt(entryYear) : 0,
        graduation_year: exitYear ? parseInt(exitYear) : 0,
        house: house || "Unknown",
        leaders_by_year: leaders as any,
        captains_by_year: captains as any,
        prefects_elected_or_appointed: prefectsMethod || null,
        prefect_change_year: prefectChangeYear || null,
        notable_old_cambrian: notableOldCambrian || null,
        memorable_event: memorableEvent || null,
        uploaded_files: filePaths.length ? filePaths : null,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Submitted!", { description: "Thank you for contributing." });
    } catch (e: any) {
      toast.error("Failed to submit", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center py-20 px-4">
        <Card className="card-elevated border-0 max-w-lg text-center p-12">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-8">
            Your story has been recorded. The Patch community thanks you for your contribution.
          </p>
          <Button
            variant="hero"
            onClick={() => {
              setSubmitted(false);
              setName(""); setNickname(""); setDob(""); setEntryYear(""); setExitYear(""); setHouse("");
              setLeaders(Object.fromEntries(leaderRoles.map((r) => [r.key, emptyYears()])) as LeadersByYear);
              setCaptains(Object.fromEntries(sportRoles.map((s) => [s, emptyYears()])) as CaptainsByYear);
              setPrefectsMethod(""); setPrefectChangeYear("");
              setNotableOldCambrian(""); setMemorableEvent(""); setUploadedFiles([]);
              window.scrollTo({ top: 0 });
            }}
          >
            Submit Another Response
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary border-b border-accent/20">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center gap-3 sm:gap-4">
          <img src={impalaLogo} alt="Nairobi School" className="h-10 w-10 sm:h-14 sm:w-14 object-contain impala-emblem" />
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold text-primary-foreground">Nairobi School</h1>
            <p className="text-accent text-xs sm:text-sm font-medium tracking-wider">COMMEMORATIVE BOOK QUESTIONNAIRE</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <motion.div initial="hidden" animate="show" variants={fadeIn("up", 0.2)} className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2">Share Your Story</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              All fields are optional — fill in what you remember.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1-3 + Entry/Exit/House */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div><Label>Nickname</Label><Input value={nickname} onChange={(e) => setNickname(e.target.value)} /></div>
                  <div><Label>Date of Birth</Label><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
                  <div>
                    <Label>House</Label>
                    <Select value={house} onValueChange={setHouse}>
                      <SelectTrigger><SelectValue placeholder="Select house" /></SelectTrigger>
                      <SelectContent>
                        {houses.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Entry Year</Label><Input inputMode="numeric" maxLength={4} value={entryYear} onChange={(e) => setEntryYear(e.target.value)} /></div>
                  <div><Label>Exit Year</Label><Input inputMode="numeric" maxLength={4} value={exitYear} onChange={(e) => setExitYear(e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>

            {/* 4 - Leaders */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">During your years, who was…</h3>
                <p className="text-muted-foreground text-sm mb-4">Fill the names you remember for each year you were at the school.</p>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 w-48">Role</th>
                        {yearLabels.map((y) => <th key={y} className="text-left p-2">{y}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {leaderRoles.map((r) => (
                        <tr key={r.key} className="border-b last:border-0">
                          <td className="p-2 font-medium text-foreground align-middle">{r.label}</td>
                          {yearLabels.map((_, i) => (
                            <td key={i} className="p-1.5">
                              <Input value={leaders[r.key][i]} onChange={(e) => updateLeader(r.key, i, e.target.value)} className="h-9" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 6 - Captains */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">During your years, who was…</h3>
                <p className="text-muted-foreground text-sm mb-4">Sports captains by year.</p>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 w-48">Sport</th>
                        {yearLabels.map((y) => <th key={y} className="text-left p-2">{y}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sportRoles.map((s) => (
                        <tr key={s} className="border-b last:border-0">
                          <td className="p-2 font-medium text-foreground align-middle">{s} Captain</td>
                          {yearLabels.map((_, i) => (
                            <td key={i} className="p-1.5">
                              <Input value={captains[s][i]} onChange={(e) => updateCaptain(s, i, e.target.value)} className="h-9" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 7 & 8 - Prefects */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Were prefects elected or appointed in your time?</Label>
                  <Select value={prefectsMethod} onValueChange={setPrefectsMethod}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elected">Elected</SelectItem>
                      <SelectItem value="Appointed">Appointed</SelectItem>
                      <SelectItem value="Both">Both / Mixed</SelectItem>
                      <SelectItem value="Unsure">Don't remember</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>When did the change occur (they were originally appointed)?</Label>
                  <Input value={prefectChangeYear} onChange={(e) => setPrefectChangeYear(e.target.value)} placeholder="e.g. 1998 or 'around the early 90s'" />
                </div>
              </CardContent>
            </Card>

            {/* 8b - Uploads */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6">
                <Label>Attach any documents you may have</Label>
                <p className="text-muted-foreground text-xs mb-3">Fees invoice, school report, menu, printed program, etc.</p>
                <label className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload files</span>
                  <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                </label>
                {uploadedFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {uploadedFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between bg-muted/50 rounded px-3 py-2 text-sm">
                        <span className="flex items-center gap-2 truncate"><FileIcon className="h-4 w-4 shrink-0" /><span className="truncate">{f.name}</span></span>
                        <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive shrink-0"><X className="h-4 w-4" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* 9 */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6">
                <Label>Name an Old Cambrian who in your view stood above many Kenyans</Label>
                <p className="text-muted-foreground text-xs mb-3">Include name, years at school, and reason.</p>
                <Textarea rows={4} value={notableOldCambrian} onChange={(e) => setNotableOldCambrian(e.target.value)} />
              </CardContent>
            </Card>

            {/* 10 */}
            <Card className="border-0 card-elevated">
              <CardContent className="pt-6">
                <Label>An event that stands out in your memory of the school</Label>
                <Textarea rows={5} value={memorableEvent} onChange={(e) => setMemorableEvent(e.target.value)} className="mt-2" />
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2 pb-10">
              <Button variant="hero" size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
