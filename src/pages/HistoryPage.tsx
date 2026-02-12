import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Building2, 
  BookOpen,
  Flag
} from "lucide-react";

const timeline = [
  {
    year: "1902",
    title: "The Beginning",
    description: "Nairobi School was established around the present Nairobi Railways Club as a European School to serve the families of the I.B.E.A. Company.",
  },
  {
    year: "1929",
    title: "Foundation Stone Laid",
    description: "Sir Edward Grigg, Governor of Kenya colony, laid the foundation stone for a school with a capacity of 80 boys near Kabete.",
  },
  {
    year: "1931",
    title: "Prince of Wales School",
    description: "The school opened with 84 boarders and 20 day-boys. Named 'Prince of Wales School' with the Royal Impala as its emblem and the motto 'To The Uttermost'.",
  },
  {
    year: "1934",
    title: "Old Cambrian Society",
    description: "The Old Cambrian Society (Old Boys Association) was born, named after Cambria, the old name for Wales.",
  },
  {
    year: "1953",
    title: "Swimming Pool",
    description: "Construction of the school's swimming pool was completed, adding to the sports facilities.",
  },
  {
    year: "1957-1958",
    title: "The Chapel",
    description: "The foundation stone for the Chapel was laid by the Hon. Sir Evelyn Barring. Built to commemorate the 76 young men who gave their lives in World War II.",
  },
  {
    year: "1962",
    title: "Multi-Racial Admission",
    description: "Prince of Wales School became multi-racial by admitting its first non-European students — 4 Africans and 4 Asians.",
  },
  {
    year: "1966",
    title: "Nairobi School",
    description: "The school changed its name to Nairobi School. The Board of Governors became multi-racial with Hon. James Nyamweya as its first African Chairman.",
  },
  {
    year: "1972",
    title: "First African Headmaster",
    description: "Mr. D.M. Mureithi was appointed the first African Headmaster, taking over from F. W. Dollimore.",
  },
  {
    year: "2002",
    title: "Centenary Celebrations",
    description: "The school celebrated 100 years of excellence with special events and the publication of The Impala Centenary Magazine.",
  },
];

const houseRename = [
  { old: "Clive", new: "Elgon" },
  { old: "Scot", new: "Marsabit" },
  { old: "Grigg", new: "Kirinyaga" },
  { old: "Rhodes", new: "Athi" },
  { old: "Nicholson", new: "Serengeti" },
  { old: "Hawke", new: "Baringo" },
  { old: "Fletcher", new: "Tana" },
  { old: "Naivasha", new: "Naivasha" },
];

export default function HistoryPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 section-navy overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/quadimage.webp" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <p className="text-accent font-medium tracking-widest uppercase mb-3 sm:mb-4 text-sm sm:text-base">
            Since 1902
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6">
            Our Rich History
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-base sm:text-lg px-2">
            From the Prince of Wales School to Nairobi School — over a century of 
            academic excellence, sporting prowess, and character formation.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 sm:py-16 md:py-20 section-cream">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                The Prince of Wales Legacy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nairobi School was initially started in 1902 around the present Nairobi 
                Railways Club as a European School to serve the families of the I.B.E.A. 
                Company and later the white settler community.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Out of the foresight and wisdom of the late Lord Delamere in proposing 
                the building of a senior Boys School, and the support of the then Governor, 
                Sir Edward Grigg, the railway reserve grounds near Kabete were identified 
                in 1925 as the home for the School.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The school logo was completed enshrining the Royal Impala, the Prince of 
                Wales' feathers between the Royal Impala's horns as its emblem, and the 
                motto <span className="text-accent font-semibold">"TO THE UTTERMOST"</span>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Card className="border-0 card-elevated">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Calendar className="h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="font-display text-2xl font-bold text-foreground">1902</p>
                  <p className="text-sm text-muted-foreground">Founded</p>
                </CardContent>
              </Card>
              <Card className="border-0 card-elevated">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="font-display text-2xl font-bold text-foreground">Kabete</p>
                  <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                </CardContent>
              </Card>
              <Card className="border-0 card-elevated">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="font-display text-2xl font-bold text-foreground">104</p>
                  <p className="text-sm text-muted-foreground">First Students</p>
                </CardContent>
              </Card>
              <Card className="border-0 card-elevated">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="font-display text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Houses</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-foreground mb-10 sm:mb-16">
            Timeline of Excellence
          </h2>
          
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 last:pb-0">
                {/* Line */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-3 top-3 w-0.5 h-full bg-accent/30" />
                )}
                {/* Dot */}
                <div className="absolute left-0 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                {/* Content */}
                <div className="bg-card rounded-xl p-4 sm:p-6 shadow-soft ml-2 sm:ml-4">
                  <span className="text-accent font-bold text-base sm:text-lg">{item.year}</span>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* House Renaming */}
      <section className="py-12 sm:py-16 md:py-20 section-navy">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
              The House Names
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
              After independence, the houses were renamed to reflect Kenyan landmarks, 
              replacing the colonial names while preserving the spirit of competition and brotherhood.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {houseRename.map((house, index) => (
              <Card key={index} className="bg-white/5 border-accent/20">
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-primary-foreground/50 text-sm line-through mb-1">{house.old}</p>
                  <Flag className="h-5 w-5 text-accent mx-auto my-2" />
                  <p className="text-primary-foreground font-display font-semibold">{house.new}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Chapel */}
      <section className="py-12 sm:py-16 md:py-20 section-cream">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-4 sm:mb-6" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
              The School Chapel
            </h2>
            <blockquote className="text-muted-foreground italic text-lg leading-relaxed border-l-4 border-accent pl-6 text-left">
              "Built to commemorate those 76 young men from the school who, at the call of 
              King and Country, left all that was dear to them, endured hardships, faced dangers, 
              and finally passed from the sight of men by the Path of Duty and self-sacrifice. 
              They gave their lives that others might live in Freedom."
            </blockquote>
            <p className="text-accent font-medium mt-6">
              Greater love hath no man than this: That a man lay down His life for his Friends.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
