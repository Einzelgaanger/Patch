import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Send, User, GraduationCap, BookOpen, CheckCircle, Trophy, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";

const houses = ["Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"];

const sportsList = [
  "Rugby", "Football", "Hockey", "Cricket", "Athletics", "Basketball",
  "Swimming", "Tennis", "Volleyball", "Handball", "Badminton", "Table Tennis",
  "Cross Country", "Boxing", "Squash",
];

const subjectsList = [
  "Mathematics", "English", "Kiswahili", "Physics", "Chemistry", "Biology",
  "History", "Geography", "CRE", "IRE", "Business Studies", "Agriculture",
  "Computer Studies", "Art & Design", "Music", "French", "German",
  "Home Science", "Aviation",
];

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  currentLocation: z.string().trim().max(100).optional().or(z.literal("")),
  currentProfession: z.string().trim().max(100).optional().or(z.literal("")),
  admissionNumber: z.string().trim().max(20).optional().or(z.literal("")),
  admissionYear: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year."),
  graduationYear: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year."),
  house: z.string().min(1, "Please select your house."),
  subjectsTaken: z.array(z.string()).optional(),
  sportsParticipated: z.array(z.string()).optional(),
  wasPrefect: z.boolean().default(false),
  prefectPosition: z.string().trim().max(100).optional().or(z.literal("")),
  wasSportsCaptain: z.boolean().default(false),
  sportsCaptainDetails: z.string().trim().max(200).optional().or(z.literal("")),
  wasClubLeader: z.boolean().default(false),
  clubLeaderDetails: z.string().trim().max(200).optional().or(z.literal("")),
  academicAchievements: z.string().trim().max(1000).optional().or(z.literal("")),
  sportsAchievements: z.string().trim().max(1000).optional().or(z.literal("")),
  careerAchievements: z.string().trim().max(1000).optional().or(z.literal("")),
  favoriteTeachers: z.string().trim().max(500).optional().or(z.literal("")),
  memorableEvents: z.string().trim().max(2000).optional().or(z.literal("")),
  funnyStories: z.string().trim().max(2000).optional().or(z.literal("")),
  traditionsRemembered: z.string().trim().max(1000).optional().or(z.literal("")),
  hasPhotosToShare: z.boolean().default(false),
  willingToBeInterviewed: z.boolean().default(false),
  additionalComments: z.string().trim().max(2000).optional().or(z.literal("")),
  consentToPublish: z.boolean().refine((val) => val === true, "You must agree to the terms to submit."),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "School Days", icon: GraduationCap },
  { id: 3, title: "Leadership & Sports", icon: Trophy },
  { id: 4, title: "Memories", icon: BookOpen },
  { id: 5, title: "Achievements", icon: Award },
  { id: 6, title: "Submit", icon: CheckCircle },
];

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", currentLocation: "", currentProfession: "",
      admissionNumber: "", admissionYear: "", graduationYear: "", house: "",
      subjectsTaken: [], sportsParticipated: [],
      wasPrefect: false, prefectPosition: "", wasSportsCaptain: false, sportsCaptainDetails: "",
      wasClubLeader: false, clubLeaderDetails: "",
      academicAchievements: "", sportsAchievements: "", careerAchievements: "",
      favoriteTeachers: "", memorableEvents: "", funnyStories: "", traditionsRemembered: "",
      hasPhotosToShare: false, willingToBeInterviewed: false, additionalComments: "",
      consentToPublish: false,
    },
  });

  const nextStep = async () => {
    let fields: (keyof FormValues)[] = [];
    if (currentStep === 1) fields = ["fullName", "email", "phone", "currentLocation", "currentProfession"];
    else if (currentStep === 2) fields = ["admissionYear", "graduationYear", "house"];
    else if (currentStep === 3) fields = ["wasPrefect", "wasSportsCaptain", "wasClubLeader"];
    else if (currentStep === 4) fields = ["favoriteTeachers", "memorableEvents", "funnyStories"];
    else if (currentStep === 5) fields = ["academicAchievements", "sportsAchievements", "careerAchievements"];

    const isValid = await form.trigger(fields);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("questionnaire_responses").insert({
        full_name: values.fullName,
        email: values.email || null,
        phone: values.phone || null,
        current_location: values.currentLocation || null,
        current_profession: values.currentProfession || null,
        admission_number: values.admissionNumber || null,
        admission_year: parseInt(values.admissionYear),
        graduation_year: parseInt(values.graduationYear),
        house: values.house,
        subjects_taken: values.subjectsTaken?.length ? values.subjectsTaken : null,
        sports_participated: values.sportsParticipated?.length ? values.sportsParticipated : null,
        was_prefect: values.wasPrefect,
        prefect_position: values.prefectPosition || null,
        was_sports_captain: values.wasSportsCaptain,
        sports_captain_details: values.sportsCaptainDetails || null,
        was_club_leader: values.wasClubLeader,
        club_leader_details: values.clubLeaderDetails || null,
        academic_achievements: values.academicAchievements || null,
        sports_achievements: values.sportsAchievements || null,
        career_achievements: values.careerAchievements || null,
        favorite_teachers: values.favoriteTeachers || null,
        memorable_events: values.memorableEvents || null,
        funny_stories: values.funnyStories || null,
        traditions_remembered: values.traditionsRemembered || null,
        has_photos_to_share: values.hasPhotosToShare,
        willing_to_be_interviewed: values.willingToBeInterviewed,
        additional_comments: values.additionalComments || null,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Story submitted successfully!", {
        description: "Thank you for contributing to the Nairobi School Chronicles.",
      });
    } catch (error: any) {
      toast.error("Failed to submit", { description: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-20">
          <Card className="card-elevated border-0 max-w-lg text-center p-12">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-8">Your story has been recorded. The Patch community thanks you for your contribution.</p>
            <Button variant="hero" onClick={() => window.location.href = "/"}>Back to Home</Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-dots opacity-40 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeIn("up", 0.2)} className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Share Your Story</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your memories are the bricks that build our legacy. Help us document the true spirit of the Patch.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative px-2 md:px-8">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-primary/10 -z-10" />
              <div
                className="absolute left-0 top-1/2 h-1 bg-accent -z-10 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                    currentStep >= step.id
                      ? "bg-accent border-accent text-primary shadow-lg scale-110"
                      : "bg-card border-primary/10 text-muted-foreground"
                  }`}>
                    <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="card-elevated border-0 overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <AnimatePresence mode="wait">

                      {/* Step 1: Personal Info */}
                      {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="font-display text-foreground">Personal Info</CardTitle>
                            <CardDescription>Tell us about yourself.</CardDescription>
                          </CardHeader>
                          <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input className="rounded-xl" placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <div className="grid gap-6 sm:grid-cols-2">
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="rounded-xl" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="rounded-xl" placeholder="+254 ..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <FormField control={form.control} name="currentLocation" render={({ field }) => (
                              <FormItem><FormLabel>Current Location</FormLabel><FormControl><Input className="rounded-xl" placeholder="City, Country" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="currentProfession" render={({ field }) => (
                              <FormItem><FormLabel>Current Profession</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Engineer, Doctor" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: School Days */}
                      {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="font-display text-foreground">School Days</CardTitle>
                            <CardDescription>When and where you belonged.</CardDescription>
                          </CardHeader>
                          <div className="grid gap-6 sm:grid-cols-3">
                            <FormField control={form.control} name="admissionNumber" render={({ field }) => (
                              <FormItem><FormLabel>Admission Number</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. 12345" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="admissionYear" render={({ field }) => (
                              <FormItem><FormLabel>Admission Year *</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. 1995" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="graduationYear" render={({ field }) => (
                              <FormItem><FormLabel>Graduation Year *</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. 1999" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                          <FormField control={form.control} name="house" render={({ field }) => (
                            <FormItem>
                              <FormLabel>House *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select your house" /></SelectTrigger></FormControl>
                                <SelectContent>{houses.map((h) => (<SelectItem key={h} value={h}>{h}</SelectItem>))}</SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <div>
                            <FormLabel>Subjects Taken</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {subjectsList.map((subject) => {
                                const selected = form.watch("subjectsTaken") || [];
                                return (
                                  <label key={subject} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-secondary">
                                    <Checkbox
                                      checked={selected.includes(subject)}
                                      onCheckedChange={(checked) => {
                                        const current = form.getValues("subjectsTaken") || [];
                                        form.setValue("subjectsTaken", checked ? [...current, subject] : current.filter((s) => s !== subject));
                                      }}
                                    />
                                    {subject}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Leadership & Sports */}
                      {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="font-display text-foreground">Leadership & Sports</CardTitle>
                            <CardDescription>Your roles and athletic life at the Patch.</CardDescription>
                          </CardHeader>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
                              <Checkbox checked={form.watch("wasPrefect")} onCheckedChange={(v) => form.setValue("wasPrefect", !!v)} />
                              <span className="font-medium">I was a Prefect</span>
                            </div>
                            {form.watch("wasPrefect") && (
                              <FormField control={form.control} name="prefectPosition" render={({ field }) => (
                                <FormItem><FormLabel>Prefect Position</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Head Boy, Dining Hall Prefect" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            )}
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
                              <Checkbox checked={form.watch("wasSportsCaptain")} onCheckedChange={(v) => form.setValue("wasSportsCaptain", !!v)} />
                              <span className="font-medium">I was a Sports Captain</span>
                            </div>
                            {form.watch("wasSportsCaptain") && (
                              <FormField control={form.control} name="sportsCaptainDetails" render={({ field }) => (
                                <FormItem><FormLabel>Details</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Rugby Captain 1998" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            )}
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
                              <Checkbox checked={form.watch("wasClubLeader")} onCheckedChange={(v) => form.setValue("wasClubLeader", !!v)} />
                              <span className="font-medium">I was a Club/Society Leader</span>
                            </div>
                            {form.watch("wasClubLeader") && (
                              <FormField control={form.control} name="clubLeaderDetails" render={({ field }) => (
                                <FormItem><FormLabel>Details</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Chairman, Drama Club" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                            )}
                          </div>
                          <div>
                            <FormLabel>Sports Participated</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {sportsList.map((sport) => {
                                const selected = form.watch("sportsParticipated") || [];
                                return (
                                  <label key={sport} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-secondary">
                                    <Checkbox
                                      checked={selected.includes(sport)}
                                      onCheckedChange={(checked) => {
                                        const current = form.getValues("sportsParticipated") || [];
                                        form.setValue("sportsParticipated", checked ? [...current, sport] : current.filter((s) => s !== sport));
                                      }}
                                    />
                                    {sport}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Memories */}
                      {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="font-display text-foreground">Memories & Stories</CardTitle>
                            <CardDescription>Share moments that define your Patch experience.</CardDescription>
                          </CardHeader>
                          <FormField control={form.control} name="favoriteTeachers" render={({ field }) => (
                            <FormItem><FormLabel>Favourite Teachers</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Names, subjects, and why they stood out..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="memorableEvents" render={({ field }) => (
                            <FormItem><FormLabel>Memorable Events</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="School events, trips, competitions you remember..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="funnyStories" render={({ field }) => (
                            <FormItem><FormLabel>Funny Stories / Mischief</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="We won't tell... share the stories that made school life fun." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="traditionsRemembered" render={({ field }) => (
                            <FormItem><FormLabel>School Traditions</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Traditions, rituals, or customs you remember..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </motion.div>
                      )}

                      {/* Step 5: Achievements */}
                      {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="font-display text-foreground">Achievements</CardTitle>
                            <CardDescription>Tell us about your accomplishments in school and after.</CardDescription>
                          </CardHeader>
                          <FormField control={form.control} name="academicAchievements" render={({ field }) => (
                            <FormItem><FormLabel>Academic Achievements</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="KCSE results, awards, competitions won..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="sportsAchievements" render={({ field }) => (
                            <FormItem><FormLabel>Sports Achievements</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Titles, records, notable games..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="careerAchievements" render={({ field }) => (
                            <FormItem><FormLabel>Career Achievements (Post-School)</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What have you accomplished since leaving the Patch?" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </motion.div>
                      )}

                      {/* Step 6: Submit */}
                      {currentStep === 6 && (
                        <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="font-display text-foreground">Almost There</CardTitle>
                            <CardDescription>A few final options and you're done.</CardDescription>
                          </CardHeader>
                          <FormField control={form.control} name="additionalComments" render={({ field }) => (
                            <FormItem><FormLabel>Additional Comments</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Anything else you'd like to share..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-secondary">
                              <Checkbox checked={form.watch("hasPhotosToShare")} onCheckedChange={(v) => form.setValue("hasPhotosToShare", !!v)} />
                              <span>I have photos I'd like to share for the book</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-secondary">
                              <Checkbox checked={form.watch("willingToBeInterviewed")} onCheckedChange={(v) => form.setValue("willingToBeInterviewed", !!v)} />
                              <span>I'm willing to be interviewed for the book</span>
                            </label>
                            <FormField control={form.control} name="consentToPublish" render={({ field }) => (
                              <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-4">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>I agree to my story being published in the commemorative book. *</FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )} />
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>

                    <div className="mt-8 flex items-center justify-between gap-4">
                      <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      {currentStep < steps.length ? (
                        <Button type="button" variant="hero" onClick={nextStep} className="rounded-xl">
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit" variant="hero" className="rounded-xl" disabled={submitting}>
                          {submitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit Story</>}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
