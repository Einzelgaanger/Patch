import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Camera, 
  PenTool, 
  Clock,
  ArrowRight,
  Mail,
  CheckCircle2
} from "lucide-react";

const bookContents = [
  "Complete history from 1902 to present",
  "Roll of Honour: Heads of School (1931-2026)",
  "Sports Captains across all disciplines",
  "House histories and traditions",
  "Notable alumni profiles",
  "Memorable events and milestones",
  "Photo galleries from every era",
  "Alumni stories and anecdotes",
];

const contributionWays = [
  {
    icon: PenTool,
    title: "Fill the Questionnaire",
    description: "Share your memories, achievements, and stories from your time at Patch.",
  },
  {
    icon: Camera,
    title: "Share Photos",
    description: "Contribute photographs from your school days to our archive.",
  },
  {
    icon: Users,
    title: "Help Identify People",
    description: "Help us identify alumni in historical photos and records.",
  },
  {
    icon: Clock,
    title: "Fill in the Gaps",
    description: "Help us complete the Roll of Honour with missing names and years.",
  },
];

export default function BookPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 sm:py-20 section-navy">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-accent mx-auto mb-4 sm:mb-6" />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6">
            The Impala Book
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-base sm:text-lg mb-6 sm:mb-8 px-2">
            A comprehensive commemorative book celebrating over 120 years of 
            Nairobi School — from the Prince of Wales School to today.
          </p>
          <Link to="/questionnaire">
            <Button variant="hero" size="xl" className="group">
              Contribute Your Story
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About the Book */}
      <section className="py-12 sm:py-16 md:py-20 section-cream">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Preserving Our Legacy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We are compiling a definitive history of Nairobi School, documenting 
                the stories, achievements, and traditions that have shaped generations 
                of Patcherians.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                This book will be a treasure for alumni, current students, and future 
                generations — a testament to the motto "To The Uttermost" that has 
                guided us since 1902.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-accent">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Coming 2026</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border-0 card-elevated">
              <img src="/image.webp" alt="Nairobi School — The Book" className="w-full h-56 sm:h-64 lg:h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            <Card className="border-0 card-elevated lg:col-span-2">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
                  What's Inside
                </h3>
                <ul className="space-y-3">
                  {bookContents.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Roll of Honour */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-3 sm:mb-4" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Roll of Honour
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              We're documenting every Head of School, House Captain, and Sports Captain 
              from 1931 to present. Help us fill in the gaps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Card className="border-0 card-elevated text-center">
              <CardContent className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Heads of School
                </h3>
                <p className="text-sm text-muted-foreground">
                  From 1931 to 2026 — help us complete the list
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 card-elevated text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Sports Captains
                </h3>
                <p className="text-sm text-muted-foreground">
                  Rugby, Hockey, Football, Swimming, Athletics & more
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 card-elevated text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  House Captains
                </h3>
                <p className="text-sm text-muted-foreground">
                  Leaders of all eight houses throughout the years
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Contribute */}
      <section className="py-12 sm:py-16 md:py-20 section-navy">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
              How You Can Help
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
              Every Patcherian has a role to play in preserving our history.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {contributionWays.map((way, index) => (
              <Card key={index} className="bg-white/5 border-accent/20">
                <CardContent className="pt-6 sm:pt-8 pb-4 sm:pb-6 text-center px-4 sm:px-6">
                  <way.icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-display text-base sm:text-lg font-semibold text-primary-foreground mb-2">
                    {way.title}
                  </h3>
                  <p className="text-primary-foreground/60 text-xs sm:text-sm">{way.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link to="/questionnaire">
              <Button variant="hero" size="xl" className="group">
                Start Contributing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pre-order / Contact */}
      <section className="py-12 sm:py-16 md:py-20 section-cream">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-4 sm:mb-6" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Be the first to know when the book is ready for pre-order. 
            Join the alumni mailing list to receive updates.
          </p>
          <p className="text-accent font-medium">
            Contact: alumni@nairobischool.ac.ke
          </p>
        </div>
      </section>
    </Layout>
  );
}
