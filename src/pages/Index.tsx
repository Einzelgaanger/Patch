import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Trophy, 
  GraduationCap,
  ArrowRight,
  Clock,
  Building2,
  Star
} from "lucide-react";
import heroImage from "@/assets/hero-nairobi-school.jpg";

const stats = [
  { icon: Clock, value: "122+", label: "Years of Excellence" },
  { icon: Users, value: "50,000+", label: "Alumni Worldwide" },
  { icon: Trophy, value: "100+", label: "National Titles" },
  { icon: GraduationCap, value: "8", label: "Historic Houses" },
];

const houses = [
  { name: "Elgon", color: "bg-blue-600" },
  { name: "Athi", color: "bg-green-600" },
  { name: "Serengeti", color: "bg-orange-500" },
  { name: "Baringo", color: "bg-red-600" },
  { name: "Kirinyaga", color: "bg-purple-600" },
  { name: "Marsabit", color: "bg-teal-600" },
  { name: "Naivasha", color: "bg-pink-600" },
  { name: "Tana", color: "bg-cyan-600" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Nairobi School"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <p className="text-gold font-medium tracking-[0.2em] uppercase mb-4">
              Est. 1902 • To The Uttermost
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-cream mb-6 leading-tight">
              Nairobi School
              <span className="block text-gold">Alumni Association</span>
            </h1>
            <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join us in preserving our legacy. Help us document over a century of 
              excellence for our commemorative book — your stories matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/questionnaire">
                <Button variant="hero" size="xl" className="group">
                  Share Your Story
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="heroOutline" size="xl">
                  Explore Our History
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="h-8 w-8 text-gold mx-auto mb-3" />
                <p className="font-display text-3xl md:text-4xl font-bold text-cream mb-1">
                  {stat.value}
                </p>
                <p className="text-cream/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 section-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-6 gold-underline inline-block">
              A Legacy of Excellence
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mt-8">
              Originally known as the Prince of Wales School, Nairobi School has been 
              shaping Kenya's leaders since 1902. From the colonial era to independence 
              and beyond, our alumni have made indelible marks across every sector.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-elevated border-0 group hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">
                  The Impala Book
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We're compiling a comprehensive history of Nairobi School, celebrating 
                  our traditions, achievements, and the stories that define us.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-0 group hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                  <Users className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">
                  Alumni Network
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Connect with fellow Patcherians around the world. Our alumni network 
                  spans continents and generations, united by our shared heritage.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-0 group hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                  <Trophy className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">
                  Roll of Honour
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Help us document every Head of School, House Captain, and Sports 
                  Captain from 1931 to present day.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Houses Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              The Eight Houses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each house carries its own proud traditions and rivalries, 
              fostering brotherhood and healthy competition.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {houses.map((house) => (
              <Link
                key={house.name}
                to="/houses"
                className="group relative overflow-hidden rounded-xl p-6 bg-card shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${house.color}`} />
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${house.color} flex items-center justify-center`}>
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {house.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">House</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 section-navy">
        <div className="container mx-auto px-4 text-center">
          <Star className="h-12 w-12 text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Your Story is Part of Our History
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto mb-10 text-lg">
            Whether you were Head of School or simply loved your time at Patch, 
            your memories and experiences are invaluable. Help us preserve them 
            for future generations.
          </p>
          <Link to="/questionnaire">
            <Button variant="hero" size="xl" className="group">
              Fill the Questionnaire
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Notable Alumni Preview */}
      <section className="py-20 section-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-navy mb-4">
              Notable Alumni
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From statesmen to entrepreneurs, our alumni have shaped Kenya and the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Dr. Geoffrey William Griffin",
                title: "Founder of Starehe Boys Centre",
                years: "Class of 1940s",
              },
              {
                name: "Dr. George William Coventry",
                title: "13th Earl of Coventry",
                years: "English Peer",
              },
              {
                name: "And Many More...",
                title: "Leaders in Every Field",
                years: "1902 - Present",
              },
            ].map((alumnus, index) => (
              <Card key={index} className="border-0 card-elevated">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-navy/10 mx-auto mb-4 flex items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-navy" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy mb-1">
                    {alumnus.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{alumnus.title}</p>
                  <p className="text-xs text-gold font-medium">{alumnus.years}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
