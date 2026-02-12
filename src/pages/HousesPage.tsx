import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Trophy, Flag } from "lucide-react";

const houses = [
  {
    name: "Elgon",
    oldName: "Clive",
    color: "bg-blue-600",
    colorLight: "bg-blue-100",
    textColor: "text-blue-600",
    description: "Named after Mount Elgon, this house embodies the strength and endurance of Kenya's great mountains.",
    sports: ["Rugby", "Athletics", "Swimming"],
  },
  {
    name: "Athi",
    oldName: "Rhodes",
    color: "bg-green-600",
    colorLight: "bg-green-100",
    textColor: "text-green-600",
    description: "Named after the Athi River, representing the life-giving flow of knowledge and tradition.",
    sports: ["Hockey", "Basketball", "Cricket"],
  },
  {
    name: "Serengeti",
    oldName: "Nicholson",
    color: "bg-orange-500",
    colorLight: "bg-orange-100",
    textColor: "text-orange-500",
    description: "Named after the great Serengeti plains, symbolizing the vast potential of every student.",
    sports: ["Football", "Volleyball", "Athletics"],
  },
  {
    name: "Baringo",
    oldName: "Hawke",
    color: "bg-red-600",
    colorLight: "bg-red-100",
    textColor: "text-red-600",
    description: "Named after Lake Baringo, representing the depth of character and diversity of talent.",
    sports: ["Rugby", "Swimming", "Hockey"],
  },
  {
    name: "Kirinyaga",
    oldName: "Grigg",
    color: "bg-purple-600",
    colorLight: "bg-purple-100",
    textColor: "text-purple-600",
    description: "Named after Mount Kenya (Kirinyaga), the highest peak representing our highest aspirations.",
    sports: ["Athletics", "Basketball", "Football"],
  },
  {
    name: "Marsabit",
    oldName: "Scot",
    color: "bg-teal-600",
    colorLight: "bg-teal-100",
    textColor: "text-teal-600",
    description: "Named after Marsabit, symbolizing the unique and resilient spirit of our students.",
    sports: ["Cricket", "Volleyball", "Rugby"],
  },
  {
    name: "Naivasha",
    oldName: "Naivasha",
    color: "bg-pink-600",
    colorLight: "bg-pink-100",
    textColor: "text-pink-600",
    description: "The only house to retain its original name, representing continuity and tradition.",
    sports: ["Hockey", "Swimming", "Athletics"],
  },
  {
    name: "Tana",
    oldName: "Fletcher",
    color: "bg-cyan-600",
    colorLight: "bg-cyan-100",
    textColor: "text-cyan-600",
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
          <img src="/onehouseimage.jpg" alt="" className="w-full h-full object-cover object-center opacity-25" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-accent mx-auto mb-4 sm:mb-6" />
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
                className="overflow-hidden border-0 card-elevated group hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-2 ${house.color}`} />
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${house.color} flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="font-display text-xl sm:text-2xl text-foreground truncate">
                          {house.name} House
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Formerly: {house.oldName}
                        </p>
                      </div>
                    </div>
                    <Flag className={`h-5 w-5 sm:h-6 sm:w-6 ${house.textColor} shrink-0`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {house.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Trophy className={`h-4 w-4 ${house.textColor}`} />
                    {house.sports.map((sport, index) => (
                      <span
                        key={sport}
                        className={`text-xs px-2 py-1 rounded-full ${house.colorLight} ${house.textColor} font-medium`}
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Rivalry */}
      <section className="py-12 sm:py-16 md:py-20 section-cream">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-4 sm:mb-6" />
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
