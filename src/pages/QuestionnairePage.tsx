import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  ClipboardList, 
  User, 
  GraduationCap, 
  Trophy, 
  BookOpen,
  Briefcase,
  Send,
  CheckCircle2,
  Loader2
} from "lucide-react";

const houses = [
  "Elgon",
  "Athi",
  "Serengeti",
  "Baringo",
  "Kirinyaga",
  "Marsabit",
  "Naivasha",
  "Tana",
];

const sports = [
  "Rugby",
  "Hockey",
  "Football",
  "Swimming",
  "Athletics",
  "Basketball",
  "Cricket",
  "Volleyball",
  "Tennis",
  "Badminton",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1930 }, (_, i) => 1931 + i);

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  current_location: z.string().max(100).optional().or(z.literal("")),
  admission_year: z.number().min(1931).max(currentYear),
  graduation_year: z.number().min(1931).max(currentYear),
  admission_number: z.string().max(50).optional().or(z.literal("")),
  house: z.string().min(1, "Please select your house"),
  was_prefect: z.boolean().default(false),
  prefect_position: z.string().max(200).optional().or(z.literal("")),
  was_sports_captain: z.boolean().default(false),
  sports_captain_details: z.string().max(500).optional().or(z.literal("")),
  was_club_leader: z.boolean().default(false),
  club_leader_details: z.string().max(500).optional().or(z.literal("")),
  sports_participated: z.array(z.string()).default([]),
  sports_achievements: z.string().max(1000).optional().or(z.literal("")),
  subjects_taken: z.string().max(500).optional().or(z.literal("")),
  academic_achievements: z.string().max(1000).optional().or(z.literal("")),
  favorite_teachers: z.string().max(1000).optional().or(z.literal("")),
  memorable_events: z.string().max(2000).optional().or(z.literal("")),
  funny_stories: z.string().max(2000).optional().or(z.literal("")),
  traditions_remembered: z.string().max(1000).optional().or(z.literal("")),
  current_profession: z.string().max(200).optional().or(z.literal("")),
  career_achievements: z.string().max(1000).optional().or(z.literal("")),
  willing_to_be_interviewed: z.boolean().default(false),
  has_photos_to_share: z.boolean().default(false),
  additional_comments: z.string().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "School Years", icon: GraduationCap },
  { id: 3, title: "Leadership", icon: Trophy },
  { id: 4, title: "Memories", icon: BookOpen },
  { id: 5, title: "Career & More", icon: Briefcase },
];

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      current_location: "",
      admission_year: undefined,
      graduation_year: undefined,
      admission_number: "",
      house: "",
      was_prefect: false,
      prefect_position: "",
      was_sports_captain: false,
      sports_captain_details: "",
      was_club_leader: false,
      club_leader_details: "",
      sports_participated: [],
      sports_achievements: "",
      subjects_taken: "",
      academic_achievements: "",
      favorite_teachers: "",
      memorable_events: "",
      funny_stories: "",
      traditions_remembered: "",
      current_profession: "",
      career_achievements: "",
      willing_to_be_interviewed: false,
      has_photos_to_share: false,
      additional_comments: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("questionnaire_responses").insert({
        full_name: data.full_name,
        email: data.email || null,
        phone: data.phone || null,
        current_location: data.current_location || null,
        admission_year: data.admission_year,
        graduation_year: data.graduation_year,
        admission_number: data.admission_number || null,
        house: data.house,
        was_prefect: data.was_prefect,
        prefect_position: data.prefect_position || null,
        was_sports_captain: data.was_sports_captain,
        sports_captain_details: data.sports_captain_details || null,
        was_club_leader: data.was_club_leader,
        club_leader_details: data.club_leader_details || null,
        sports_participated: data.sports_participated,
        sports_achievements: data.sports_achievements || null,
        subjects_taken: data.subjects_taken ? data.subjects_taken.split(",").map(s => s.trim()) : null,
        academic_achievements: data.academic_achievements || null,
        favorite_teachers: data.favorite_teachers || null,
        memorable_events: data.memorable_events || null,
        funny_stories: data.funny_stories || null,
        traditions_remembered: data.traditions_remembered || null,
        current_profession: data.current_profession || null,
        career_achievements: data.career_achievements || null,
        willing_to_be_interviewed: data.willing_to_be_interviewed,
        has_photos_to_share: data.has_photos_to_share,
        additional_comments: data.additional_comments || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Thank you for your contribution!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (isSubmitted) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto border-0 card-elevated text-center">
              <CardContent className="pt-12 pb-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Thank You!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your contribution has been submitted successfully. Your stories and 
                  memories will help us preserve Nairobi School's rich heritage.
                </p>
                <p className="text-gold font-medium">To The Uttermost!</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 section-navy">
        <div className="container mx-auto px-4 text-center">
          <ClipboardList className="h-12 w-12 text-gold mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-4">
            Alumni Questionnaire
          </h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            Help us document Nairobi School's history. Your memories and experiences 
            are invaluable for our commemorative book.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 md:gap-4 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "bg-gold/20 text-gold"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                <span className="text-sm font-medium sm:hidden">{step.id}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                Step {currentStep} of 5 — {currentStep === 5 ? "Almost done!" : "Fill in what you remember"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Kamau Mwangi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+254 7XX XXX XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="current_location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Nairobi, Kenya" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 2: School Years */}
                  {currentStep === 2 && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="admission_year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year of Admission *</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {years.reverse().map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="graduation_year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year of Graduation *</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...years].map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="admission_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admission Number</FormLabel>
                            <FormControl>
                              <Input placeholder="If you remember it" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="house"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your house" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {houses.map((house) => (
                                  <SelectItem key={house} value={house}>
                                    {house}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subjects_taken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjects Taken</FormLabel>
                            <FormControl>
                              <Input placeholder="Maths, Physics, Chemistry, etc." {...field} />
                            </FormControl>
                            <FormDescription>Separate with commas</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 3: Leadership & Sports */}
                  {currentStep === 3 && (
                    <>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="was_prefect"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                I was a School Prefect
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        {form.watch("was_prefect") && (
                          <FormField
                            control={form.control}
                            name="prefect_position"
                            render={({ field }) => (
                              <FormItem className="ml-7">
                                <FormControl>
                                  <Input placeholder="Position held (e.g., Head of School)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="was_sports_captain"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                I was a Sports Captain
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        {form.watch("was_sports_captain") && (
                          <FormField
                            control={form.control}
                            name="sports_captain_details"
                            render={({ field }) => (
                              <FormItem className="ml-7">
                                <FormControl>
                                  <Input placeholder="Sport and year (e.g., Rugby Captain 1985)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="was_club_leader"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                I led a Club or Society
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        {form.watch("was_club_leader") && (
                          <FormField
                            control={form.control}
                            name="club_leader_details"
                            render={({ field }) => (
                              <FormItem className="ml-7">
                                <FormControl>
                                  <Input placeholder="Club and position (e.g., Drama Club Chairman)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="sports_participated"
                        render={() => (
                          <FormItem>
                            <FormLabel>Sports Participated</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {sports.map((sport) => (
                                <FormField
                                  key={sport}
                                  control={form.control}
                                  name="sports_participated"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(sport)}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || [];
                                            if (checked) {
                                              field.onChange([...current, sport]);
                                            } else {
                                              field.onChange(current.filter((s) => s !== sport));
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <Label className="font-normal text-sm">{sport}</Label>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sports_achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sports Achievements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any notable achievements, records, or memorable moments..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 4: Memories */}
                  {currentStep === 4 && (
                    <>
                      <FormField
                        control={form.control}
                        name="favorite_teachers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Favorite Teachers</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Which teachers made an impact on you? Share their names and why..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="memorable_events"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Memorable Events</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Special events, competitions, ceremonies you remember..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="funny_stories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funny Stories</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any humorous incidents or pranks you remember? (appropriate ones!)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="traditions_remembered"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Traditions Remembered</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="School traditions, songs, or customs from your time..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 5: Career & Additional */}
                  {currentStep === 5 && (
                    <>
                      <FormField
                        control={form.control}
                        name="current_profession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Profession</FormLabel>
                            <FormControl>
                              <Input placeholder="Your current role or profession" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="career_achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Career Achievements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Notable achievements in your career..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="academic_achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Achievements at School</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Academic awards, positions, or achievements while at Nairobi School..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Would you like to contribute further to the book?
                        </p>
                        <FormField
                          control={form.control}
                          name="willing_to_be_interviewed"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                I'm willing to be interviewed for more details
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="has_photos_to_share"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                I have photos from my school days to share
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="additional_comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Comments</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Anything else you'd like to share..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    {currentStep > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Previous
                      </Button>
                    ) : (
                      <div />
                    )}
                    {currentStep < 5 ? (
                      <Button type="button" variant="gold" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" variant="hero" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Questionnaire
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
