import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { LogOut, Search, Users, Download, Loader2 } from "lucide-react";

interface Response {
  id: string;
  full_name: string;
  email: string | null;
  house: string;
  admission_year: number;
  graduation_year: number;
  was_prefect: boolean;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchResponses();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .select("id, full_name, email, house, admission_year, graduation_year, was_prefect, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setResponses(data || []);
    } catch (error: any) {
      toast.error("Failed to load responses. You may not have admin access.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const filteredResponses = responses.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.house.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          <Button variant="heroOutline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 card-elevated">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="font-display text-3xl font-bold">{responses.length}</p>
              <p className="text-muted-foreground text-sm">Total Responses</p>
            </CardContent>
          </Card>
          <Card className="border-0 card-elevated">
            <CardContent className="pt-6 text-center">
              <p className="font-display text-3xl font-bold text-accent">
                {responses.filter((r) => r.was_prefect).length}
              </p>
              <p className="text-muted-foreground text-sm">Were Prefects</p>
            </CardContent>
          </Card>
          <Card className="border-0 card-elevated">
            <CardContent className="pt-6 text-center">
              <p className="font-display text-3xl font-bold">
                {new Set(responses.map((r) => r.house)).size}
              </p>
              <p className="text-muted-foreground text-sm">Houses Represented</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questionnaire Responses</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Years</TableHead>
                    <TableHead>Prefect</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.full_name}</TableCell>
                      <TableCell>{r.house}</TableCell>
                      <TableCell>{r.admission_year} - {r.graduation_year}</TableCell>
                      <TableCell>{r.was_prefect ? "Yes" : "No"}</TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
