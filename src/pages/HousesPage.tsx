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
      <section className="py-20 section-navy">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            The Eight Houses
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            Each house is more than just a dormitory — it's a family. The friendly 
            rivalries and deep bonds formed here last a lifetime.
          </p>
        </div>
      </section>

      {/* Houses Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {houses.map((house) => (
              <Card
                key={house.name}
                className="overflow-hidden border-0 card-elevated group hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-2 ${house.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl ${house.color} flex items-center justify-center shadow-lg`}
                      >
                        <Building2 className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-2xl text-foreground">
                          {house.name} House
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Formerly: {house.oldName}
                        </p>
                      </div>
                    </div>
                    <Flag className={`h-6 w-6 ${house.textColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
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
      <section className="py-20 section-cream">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            The Spirit of Competition
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
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
