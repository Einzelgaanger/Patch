import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

const houses = [
  {
    name: "Elgon",
    oldName: "Clive",
    description: "Named after Mount Elgon, this house embodies the strength and endurance of Kenya's great mountains.",
    sports: ["Rugby", "Athletics", "Swimming"],
  },
  {
    name: "Athi",
    oldName: "Rhodes",
    description: "Named after the Athi River, representing the life-giving flow of knowledge and tradition.",
    sports: ["Hockey", "Basketball", "Cricket"],
  },
  {
    name: "Serengeti",
    oldName: "Nicholson",
    description: "Named after the great Serengeti plains, symbolizing the vast potential of every student.",
    sports: ["Football", "Volleyball", "Athletics"],
  },
  {
    name: "Baringo",
    oldName: "Hawke",
    description: "Named after Lake Baringo, representing the depth of character and diversity of talent.",
    sports: ["Rugby", "Swimming", "Hockey"],
  },
  {
    name: "Kirinyaga",
    oldName: "Grigg",
    description: "Named after Mount Kenya (Kirinyaga), the highest peak representing our highest aspirations.",
    sports: ["Athletics", "Basketball", "Football"],
  },
  {
    name: "Marsabit",
    oldName: "Scot",
    description: "Named after Marsabit, symbolizing the unique and resilient spirit of our students.",
    sports: ["Cricket", "Volleyball", "Rugby"],
  },
  {
    name: "Naivasha",
    oldName: "Naivasha",
    description: "The only house to retain its original name, representing continuity and tradition.",
    sports: ["Hockey", "Swimming", "Athletics"],
  },
  {
    name: "Tana",
    oldName: "Fletcher",
    description: "Named after the Tana River, Kenya's longest river, representing our far-reaching influence.",
    sports: ["Football", "Cricket", "Basketball"],
  },
];

export default function HousesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 section-navy overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/onehouseimage.jpg" alt="" className="w-full h-full object-cover object-center opacity-80" />
          <div className="absolute inset-0 bg-primary/50" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="w-12 h-px sm:w-16 sm:h-0.5 bg-accent mx-auto mb-6 sm:mb-8" aria-hidden />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6">
            The Eight Houses
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-base sm:text-lg px-2">
            Each house is more than just a dormitory — it's a family. The friendly 
            rivalries and deep bonds formed here last a lifetime.
          </p>
        </div>
      </section>

      {/* Houses Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {houses.map((house) => (
              <Card
                key={house.name}
                className="overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant transition-all duration-300 group"
              >
                <div className="flex">
                  <div className="w-1 sm:w-1.5 flex-shrink-0 bg-accent rounded-l-sm" />
                  <CardContent className="flex-1 p-5 sm:p-6">
                    <div className="mb-3">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {house.name} House
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Formerly {house.oldName}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {house.description}
                    </p>
                    <p className="text-xs text-muted-foreground/80 uppercase tracking-wider mb-2">
                      Sports
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {house.sports.join(" · ")}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Rivalry */}
      <section className="py-12 sm:py-16 md:py-20 section-cream">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-px bg-accent mx-auto mb-6" aria-hidden />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
            The Spirit of Competition
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg leading-relaxed px-2">
            The house system at Nairobi School fosters healthy competition across academics, 
            sports, and character development. Annual inter-house competitions in rugby, 
            athletics, swimming, and academics bring out the best in every Patcherian. 
            The camaraderie and rivalries formed here last well beyond the school gates.
          </p>
        </div>
      </section>
    </Layout>
  );
}
