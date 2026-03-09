import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Send, User, GraduationCap, BookOpen, CheckCircle, Trophy, Award, Upload, FileIcon, X, Building, Utensils, Clock, ShoppingBag, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import impalaLogo from "@/assets/impala-logo.png";

const houses = ["Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"];

const sportsList = [
  "Rugby", "Football", "Hockey", "Cricket", "Athletics", "Basketball",
  "Swimming", "Tennis", "Volleyball", "Handball", "Badminton", "Table Tennis",
  "Cross Country", "Boxing", "Squash", "Judo", "Golf",
];

const subjectsList = [
  "Mathematics", "English", "Kiswahili", "Physics", "Chemistry", "Biology",
  "History", "Geography", "CRE", "IRE", "Business Studies", "Agriculture",
  "Computer Studies", "Art & Design", "Music", "French", "Drawing and Design",
  "Aviation",
];

const clubsList = [
  "Drama Club", "Debate Club", "Chess Club", "Science Club", "Music Club",
  "Young Farmers Club", "Christian Union", "Crusaders", "Journalism Club",
  "Wildlife Club", "Mathematics Club", "French Club", "Art Club",
  "Scouts", "St. John Ambulance", "Red Cross", "Judo Club", "Golf Club",
  "Theatrical Group", "Rock Climbing Club", "Swimming Club",
];

const formSchema = z.object({
  fullName: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email.").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  currentLocation: z.string().trim().max(100).optional().or(z.literal("")),
  currentProfession: z.string().trim().max(100).optional().or(z.literal("")),
  admissionNumber: z.string().trim().max(20).optional().or(z.literal("")),
  schoolNickname: z.string().trim().max(100).optional().or(z.literal("")),
  admissionYear: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year.").optional().or(z.literal("")),
  graduationYear: z.string().regex(/^\d{4}$/, "Must be a valid 4-digit year.").optional().or(z.literal("")),
  house: z.string().optional().or(z.literal("")),
  dormitoryName: z.string().trim().max(100).optional().or(z.literal("")),
  subjectsTaken: z.array(z.string()).optional(),
  sportsParticipated: z.array(z.string()).optional(),
  clubsSocieties: z.array(z.string()).optional(),
  wasPrefect: z.boolean().default(false),
  prefectPosition: z.string().trim().max(100).optional().or(z.literal("")),
  wasSportsCaptain: z.boolean().default(false),
  sportsCaptainDetails: z.string().trim().max(200).optional().or(z.literal("")),
  wasClubLeader: z.boolean().default(false),
  clubLeaderDetails: z.string().trim().max(200).optional().or(z.literal("")),
  // School leaders
  headmasterName: z.string().trim().max(200).optional().or(z.literal("")),
  deputyHeadmasterName: z.string().trim().max(200).optional().or(z.literal("")),
  housemasterName: z.string().trim().max(200).optional().or(z.literal("")),
  classTeacherNames: z.string().trim().max(500).optional().or(z.literal("")),
  schoolCaptainName: z.string().trim().max(200).optional().or(z.literal("")),
  houseCaptainName: z.string().trim().max(200).optional().or(z.literal("")),
  prefectNamesDuringTime: z.string().trim().max(2000).optional().or(z.literal("")),
  // Daily life
  uniformMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  dailyRoutineMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  timetableDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  diningMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  favoriteMeals: z.string().trim().max(500).optional().or(z.literal("")),
  canteenMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  dormitoryMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  swimmingPoolMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  weekendActivities: z.string().trim().max(2000).optional().or(z.literal("")),
  punishmentsMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  visitingDaysMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  openingClosingDay: z.string().trim().max(2000).optional().or(z.literal("")),
  chapelMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  entertainmentMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  gamesAndHobbies: z.string().trim().max(2000).optional().or(z.literal("")),
  // House life
  houseColoursDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  interHouseCompetitions: z.string().trim().max(2000).optional().or(z.literal("")),
  // Memories
  favoriteTeachers: z.string().trim().max(500).optional().or(z.literal("")),
  memorableEvents: z.string().trim().max(2000).optional().or(z.literal("")),
  funnyStories: z.string().trim().max(2000).optional().or(z.literal("")),
  traditionsRemembered: z.string().trim().max(1000).optional().or(z.literal("")),
  rivalryMemories: z.string().trim().max(2000).optional().or(z.literal("")),
  culturalEvents: z.string().trim().max(2000).optional().or(z.literal("")),
  religiousLife: z.string().trim().max(2000).optional().or(z.literal("")),
  significantChanges: z.string().trim().max(2000).optional().or(z.literal("")),
  // Achievements & Alumni profile
  academicAchievements: z.string().trim().max(1000).optional().or(z.literal("")),
  sportsAchievements: z.string().trim().max(1000).optional().or(z.literal("")),
  careerAchievements: z.string().trim().max(1000).optional().or(z.literal("")),
  adviceToCurrent: z.string().trim().max(1000).optional().or(z.literal("")),
  notability: z.string().trim().max(1000).optional().or(z.literal("")),
  signatureContribution: z.string().trim().max(1000).optional().or(z.literal("")),
  schoolConnection: z.string().trim().max(1000).optional().or(z.literal("")),
  legacyNote: z.string().trim().max(1000).optional().or(z.literal("")),
  // Final
  hasPhotosToShare: z.boolean().default(false),
  willingToBeInterviewed: z.boolean().default(false),
  additionalComments: z.string().trim().max(2000).optional().or(z.literal("")),
  consentToPublish: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "School Days", icon: GraduationCap },
  { id: 3, title: "Leadership", icon: Trophy },
  { id: 4, title: "School Leaders", icon: Building },
  { id: 5, title: "Daily Life", icon: Clock },
  { id: 6, title: "House & Canteen", icon: Palette },
  { id: 7, title: "Memories", icon: BookOpen },
  { id: 8, title: "Achievements", icon: Award },
  { id: 9, title: "Alumni Profile", icon: User },
  { id: 10, title: "Submit", icon: CheckCircle },
];

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", currentLocation: "", currentProfession: "",
      admissionNumber: "", schoolNickname: "", admissionYear: "", graduationYear: "", house: "",
      dormitoryName: "",
      subjectsTaken: [], sportsParticipated: [], clubsSocieties: [],
      wasPrefect: false, prefectPosition: "", wasSportsCaptain: false, sportsCaptainDetails: "",
      wasClubLeader: false, clubLeaderDetails: "",
      headmasterName: "", deputyHeadmasterName: "", housemasterName: "",
      classTeacherNames: "", schoolCaptainName: "", houseCaptainName: "", prefectNamesDuringTime: "",
      uniformMemories: "", dailyRoutineMemories: "", timetableDescription: "",
      diningMemories: "", favoriteMeals: "", canteenMemories: "",
      dormitoryMemories: "", swimmingPoolMemories: "", weekendActivities: "", punishmentsMemories: "",
      visitingDaysMemories: "", openingClosingDay: "", chapelMemories: "",
      entertainmentMemories: "", gamesAndHobbies: "",
      houseColoursDescription: "", interHouseCompetitions: "",
      favoriteTeachers: "", memorableEvents: "", funnyStories: "", traditionsRemembered: "",
      rivalryMemories: "", culturalEvents: "", religiousLife: "", significantChanges: "",
      academicAchievements: "", sportsAchievements: "", careerAchievements: "", adviceToCurrent: "",
      notability: "", signatureContribution: "", schoolConnection: "", legacyNote: "",
      hasPhotosToShare: false, willingToBeInterviewed: false, additionalComments: "",
      consentToPublish: false,
    },
  });

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      let filePaths: string[] = [];
      if (uploadedFiles.length > 0) {
        setUploading(true);
        const timestamp = Date.now();
        for (const file of uploadedFiles) {
          const filePath = `${timestamp}-${Math.random().toString(36).slice(2)}/${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("questionnaire-uploads")
            .upload(filePath, file);
          if (uploadError) { console.error("Upload error:", uploadError); continue; }
          const { data: urlData } = supabase.storage
            .from("questionnaire-uploads")
            .getPublicUrl(filePath);
          filePaths.push(urlData.publicUrl);
        }
        setUploading(false);
      }

      const { error } = await supabase.from("questionnaire_responses").insert({
        full_name: values.fullName || "Anonymous",
        email: values.email || null,
        phone: values.phone || null,
        current_location: values.currentLocation || null,
        current_profession: values.currentProfession || null,
        admission_number: values.admissionNumber || null,
        school_nickname: values.schoolNickname || null,
        admission_year: values.admissionYear ? parseInt(values.admissionYear) : 0,
        graduation_year: values.graduationYear ? parseInt(values.graduationYear) : 0,
        house: values.house || "Unknown",
        dormitory_name: values.dormitoryName || null,
        subjects_taken: values.subjectsTaken?.length ? values.subjectsTaken : null,
        sports_participated: values.sportsParticipated?.length ? values.sportsParticipated : null,
        clubs_societies: values.clubsSocieties?.length ? values.clubsSocieties : null,
        was_prefect: values.wasPrefect,
        prefect_position: values.prefectPosition || null,
        was_sports_captain: values.wasSportsCaptain,
        sports_captain_details: values.sportsCaptainDetails || null,
        was_club_leader: values.wasClubLeader,
        club_leader_details: values.clubLeaderDetails || null,
        headmaster_name: values.headmasterName || null,
        deputy_headmaster_name: values.deputyHeadmasterName || null,
        housemaster_name: values.housemasterName || null,
        class_teacher_names: values.classTeacherNames || null,
        school_captain_name: values.schoolCaptainName || null,
        house_captain_name: values.houseCaptainName || null,
        prefect_names_during_time: values.prefectNamesDuringTime || null,
        uniform_memories: values.uniformMemories || null,
        daily_routine_memories: values.dailyRoutineMemories || null,
        timetable_description: values.timetableDescription || null,
        dining_memories: values.diningMemories || null,
        favorite_meals: values.favoriteMeals || null,
        canteen_memories: values.canteenMemories || null,
        dormitory_memories: values.dormitoryMemories || null,
        swimming_pool_memories: values.swimmingPoolMemories || null,
        weekend_activities: values.weekendActivities || null,
        punishments_memories: values.punishmentsMemories || null,
        visiting_days_memories: values.visitingDaysMemories || null,
        opening_closing_day: values.openingClosingDay || null,
        chapel_memories: values.chapelMemories || null,
        entertainment_memories: values.entertainmentMemories || null,
        games_and_hobbies: values.gamesAndHobbies || null,
        house_colours_description: values.houseColoursDescription || null,
        inter_house_competitions: values.interHouseCompetitions || null,
        favorite_teachers: values.favoriteTeachers || null,
        memorable_events: values.memorableEvents || null,
        funny_stories: values.funnyStories || null,
        traditions_remembered: values.traditionsRemembered || null,
        rivalry_memories: values.rivalryMemories || null,
        cultural_events: values.culturalEvents || null,
        religious_life: values.religiousLife || null,
        significant_changes: values.significantChanges || null,
        academic_achievements: values.academicAchievements || null,
        sports_achievements: values.sportsAchievements || null,
        career_achievements: values.careerAchievements || null,
        advice_to_current: values.adviceToCurrent || null,
        notability: values.notability || null,
        signature_contribution: values.signatureContribution || null,
        school_connection: values.schoolConnection || null,
        legacy_note: values.legacyNote || null,
        has_photos_to_share: values.hasPhotosToShare,
        willing_to_be_interviewed: values.willingToBeInterviewed,
        additional_comments: values.additionalComments || null,
        uploaded_files: filePaths.length > 0 ? filePaths : null,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Story submitted successfully!", {
        description: "Thank you for contributing to the Nairobi School Chronicles.",
      });
    } catch (error: any) {
      toast.error("Failed to submit", { description: error.message });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeFile = (index: number) => setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center py-20 px-4">
        <Card className="card-elevated border-0 max-w-lg text-center p-12">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-8">Your story has been recorded. The Patch community thanks you for your contribution to the Commemorative Book.</p>
          <Button variant="hero" onClick={() => { setSubmitted(false); setCurrentStep(1); form.reset(); setUploadedFiles([]); }}>Submit Another Response</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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

      <div className="absolute top-0 left-0 w-full h-full bg-dots opacity-40 pointer-events-none" />
      <div className="container mx-auto px-3 sm:px-6 relative z-10 py-4 sm:py-8">
        <motion.div initial="hidden" animate="show" variants={fadeIn("up", 0.2)} className="relative max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">Share Your Story</h2>
            <p className="text-muted-foreground text-xs sm:text-base max-w-2xl mx-auto">
              Your memories are the bricks that build our legacy. Help us document the true spirit of the Patch.
            </p>
          </div>

          {/* Progress Steps - scrollable on mobile */}
          <div className="mb-6 sm:mb-8">
            <div className="flex sm:hidden items-center justify-between mb-2 px-1">
              <span className="text-xs font-medium text-muted-foreground">Step {currentStep} of {steps.length}</span>
              <span className="text-xs font-semibold text-accent">{steps[currentStep - 1].title}</span>
            </div>
            <div className="w-full h-2 bg-primary/10 rounded-full sm:hidden mb-4">
              <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
            </div>
            <div className="hidden sm:flex justify-between items-center relative px-0 sm:px-2">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-primary/10 -z-10" />
              <div className="absolute left-0 top-1/2 h-1 bg-accent -z-10 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
              {steps.map((step) => (
                <button type="button" key={step.id} onClick={() => { setCurrentStep(step.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 border-3 ${
                    currentStep >= step.id ? "bg-accent border-accent text-primary shadow-lg scale-110" : "bg-card border-primary/10 text-muted-foreground"
                  }`}>
                    <step.icon className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                  <span className="text-[7px] md:text-[10px] font-medium text-muted-foreground">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="card-elevated border-0 overflow-hidden">
                <CardContent className="p-3 sm:p-6 md:p-8">
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
                        <FormField control={form.control} name="schoolNickname" render={({ field }) => (
                          <FormItem><FormLabel>School Nickname</FormLabel><FormControl><Input className="rounded-xl" placeholder="What were you known as at school?" {...field} /></FormControl><FormMessage /></FormItem>
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
                        <div className="grid gap-6 sm:grid-cols-2">
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
                          <FormField control={form.control} name="dormitoryName" render={({ field }) => (
                            <FormItem><FormLabel>Dormitory Name</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Dorm A, etc." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <div>
                          <FormLabel>Subjects Taken</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {subjectsList.map((subject) => {
                              const selected = form.watch("subjectsTaken") || [];
                              return (
                                <label key={subject} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-secondary">
                                  <Checkbox checked={selected.includes(subject)} onCheckedChange={(checked) => {
                                    const current = form.getValues("subjectsTaken") || [];
                                    form.setValue("subjectsTaken", checked ? [...current, subject] : current.filter((s) => s !== subject));
                                  }} />
                                  {subject}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <FormLabel>Clubs & Societies</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {clubsList.map((club) => {
                              const selected = form.watch("clubsSocieties") || [];
                              return (
                                <label key={club} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-secondary">
                                  <Checkbox checked={selected.includes(club)} onCheckedChange={(checked) => {
                                    const current = form.getValues("clubsSocieties") || [];
                                    form.setValue("clubsSocieties", checked ? [...current, club] : current.filter((s) => s !== club));
                                  }} />
                                  {club}
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
                              <FormItem><FormLabel>Which sport and year?</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Rugby Captain 1998" {...field} /></FormControl><FormMessage /></FormItem>
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
                                  <Checkbox checked={selected.includes(sport)} onCheckedChange={(checked) => {
                                    const current = form.getValues("sportsParticipated") || [];
                                    form.setValue("sportsParticipated", checked ? [...current, sport] : current.filter((s) => s !== sport));
                                  }} />
                                  {sport}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: School Leaders */}
                    {currentStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">School Leaders & Staff</CardTitle>
                          <CardDescription>Help us document who led the school during your time. This helps build the Roll of Honour.</CardDescription>
                        </CardHeader>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField control={form.control} name="headmasterName" render={({ field }) => (
                            <FormItem><FormLabel>Headmaster / Principal</FormLabel><FormControl><Input className="rounded-xl" placeholder="Who was the headmaster?" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="deputyHeadmasterName" render={({ field }) => (
                            <FormItem><FormLabel>Deputy Headmaster</FormLabel><FormControl><Input className="rounded-xl" placeholder="Deputy head during your time" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField control={form.control} name="housemasterName" render={({ field }) => (
                            <FormItem><FormLabel>Your Housemaster</FormLabel><FormControl><Input className="rounded-xl" placeholder="Who was your housemaster?" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="classTeacherNames" render={({ field }) => (
                            <FormItem><FormLabel>Class Teachers</FormLabel><FormControl><Input className="rounded-xl" placeholder="Names of your class teachers" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField control={form.control} name="schoolCaptainName" render={({ field }) => (
                            <FormItem><FormLabel>School Captain / Head Boy</FormLabel><FormControl><Input className="rounded-xl" placeholder="Who was Head of School?" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="houseCaptainName" render={({ field }) => (
                            <FormItem><FormLabel>Your House Captain</FormLabel><FormControl><Input className="rounded-xl" placeholder="Who led your house?" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="prefectNamesDuringTime" render={({ field }) => (
                          <FormItem><FormLabel>Other Prefects You Remember</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="List prefects you remember from your time — names, positions (e.g. Dining Hall Prefect, Games Prefect), and years if possible..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="favoriteTeachers" render={({ field }) => (
                          <FormItem><FormLabel>Favourite Teachers & Why</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Names, subjects, and why they stood out..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </motion.div>
                    )}

                    {/* Step 5: Daily Life */}
                    {currentStep === 5 && (
                      <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">Daily Life at the Patch</CardTitle>
                          <CardDescription>What was a typical day, week, or term like? (Inspired by the 1972 and 2011 records)</CardDescription>
                        </CardHeader>
                        <FormField control={form.control} name="uniformMemories" render={({ field }) => (
                          <FormItem><FormLabel>Uniform & Dress Code</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Describe the uniform — school dress, town dress, Sunday dress, sports kit. What were the rules? Did dress code change over the years?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="timetableDescription" render={({ field }) => (
                          <FormItem><FormLabel>Weekly Timetable & Schedule</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="Describe a typical week — what happened on each day? Monday activities, Wednesday shopping, Saturday sports, Sunday chapel? What time did you wake up and sleep?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dailyRoutineMemories" render={({ field }) => (
                          <FormItem><FormLabel>Daily Routine</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Walk us through a typical day — wake-up bell, morning prep, classes, breaks, games time, evening prep, lights out..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="diningMemories" render={({ field }) => (
                          <FormItem><FormLabel>Dining Hall & Food</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What was the food like? Breakfast (tea & 3 slices of bread?), lunch (rice & beans?), supper (ugali & cabbage?). How did meals change over the years?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="favoriteMeals" render={({ field }) => (
                          <FormItem><FormLabel>Favourite (or Most Hated) Meals</FormLabel><FormControl><Input className="rounded-xl" placeholder="e.g. Sunday eggs, githeri, spaghetti & beans, cocoa tea..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="canteenMemories" render={({ field }) => (
                          <FormItem><FormLabel>Canteen / Tuck Shop</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What was sold in the canteen during your time? Snacks, drinks, sweets? How much did things cost? Did the canteen change over the years?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dormitoryMemories" render={({ field }) => (
                          <FormItem><FormLabel>Dormitory Life</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What was life like in the dorms? Pranks, friendships, late-night stories, monos system..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="swimmingPoolMemories" render={({ field }) => (
                          <FormItem><FormLabel>Swimming Pool / Lido</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Memories of the swimming pool — swimming standards, lido supervisors, swimming matches, diving competitions..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="visitingDaysMemories" render={({ field }) => (
                          <FormItem><FormLabel>Visiting Days</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What were visiting days like? What did parents bring? Where did you go? Any memorable visiting day stories?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="openingClosingDay" render={({ field }) => (
                          <FormItem><FormLabel>Opening & Closing Days</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Describe opening day and closing day — the excitement, packing, luggage, transport..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </motion.div>
                    )}

                    {/* Step 6: House Life & Canteen */}
                    {currentStep === 6 && (
                      <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">House Life & Extra-Curricular</CardTitle>
                          <CardDescription>Tell us about house culture, competitions, and life beyond the classroom.</CardDescription>
                        </CardHeader>
                        <FormField control={form.control} name="houseColoursDescription" render={({ field }) => (
                          <FormItem><FormLabel>House Colours & Identity</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="What were your house colours? Describe the house identity — motto, war cry, house songs, house spirit. How did you earn your house colours?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="interHouseCompetitions" render={({ field }) => (
                          <FormItem><FormLabel>Inter-House Competitions</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="How did inter-house competitions work? Sports days, rugby, hockey, swimming, athletics, drama, music, academics. Which house dominated? Any legendary matches or rivalries?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="weekendActivities" render={({ field }) => (
                          <FormItem><FormLabel>Weekend & Free Time Activities</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Saturday shopping trips to town, Sunday walks, film screenings in school hall, games..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="entertainmentMemories" render={({ field }) => (
                          <FormItem><FormLabel>Entertainment & Films</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Saturday night films in school hall, concerts, piano recitals, band practice, variety shows..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="chapelMemories" render={({ field }) => (
                          <FormItem><FormLabel>Chapel & Sunday Services</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Sunday morning services, Holy Communion, Compline, the Chaplain, confirmations, Lenten services..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="gamesAndHobbies" render={({ field }) => (
                          <FormItem><FormLabel>Games, Hobbies & Pastimes</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What did you do for fun? Card games, rock climbing expeditions, golf, art outings, stamp collecting..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="punishmentsMemories" render={({ field }) => (
                          <FormItem><FormLabel>Punishments & Discipline</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Detentions, manual labour, duty masters, any memorable punishment stories..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </motion.div>
                    )}

                    {/* Step 7: Memories */}
                    {currentStep === 7 && (
                      <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">Memories & Stories</CardTitle>
                          <CardDescription>Share moments that define your Patch experience.</CardDescription>
                        </CardHeader>
                        <FormField control={form.control} name="memorableEvents" render={({ field }) => (
                          <FormItem><FormLabel>Memorable Events</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="School events, trips, competitions, visiting dignitaries, national events you witnessed from school..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="funnyStories" render={({ field }) => (
                          <FormItem><FormLabel>Funny Stories / Mischief</FormLabel><FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="We won't tell... share the stories that made school life fun." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="traditionsRemembered" render={({ field }) => (
                          <FormItem><FormLabel>School Traditions</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Traditions, rituals, customs — initiation of Form Ones, house traditions, end-of-year customs..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="rivalryMemories" render={({ field }) => (
                          <FormItem><FormLabel>Inter-School Rivalries</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Memorable matches and rivalries with Lenana, Alliance, St Mary's, Strathmore, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="culturalEvents" render={({ field }) => (
                          <FormItem><FormLabel>Cultural Events & Drama</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Drama festivals, music concerts, Swahili debates, cultural days, school plays..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="religiousLife" render={({ field }) => (
                          <FormItem><FormLabel>Religious & Spiritual Life</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="CU meetings, Crusaders, Christian meetings, prayer meetings, speakers who visited..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="significantChanges" render={({ field }) => (
                          <FormItem><FormLabel>Significant Changes You Witnessed</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What changed during your time? New buildings, policy changes, historical events, name changes..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </motion.div>
                    )}

                    {/* Step 8: Achievements */}
                    {currentStep === 8 && (
                      <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">Achievements</CardTitle>
                          <CardDescription>Tell us about your accomplishments in school and after.</CardDescription>
                        </CardHeader>
                        <FormField control={form.control} name="academicAchievements" render={({ field }) => (
                          <FormItem><FormLabel>Academic Achievements</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="KCSE/KACE results, awards, competitions won, university admissions..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="sportsAchievements" render={({ field }) => (
                          <FormItem><FormLabel>Sports Achievements</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Titles, records, notable games, national representation..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="careerAchievements" render={({ field }) => (
                          <FormItem><FormLabel>Career Achievements (Post-School)</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What have you accomplished since leaving the Patch?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="adviceToCurrent" render={({ field }) => (
                          <FormItem><FormLabel>Advice to Current Students</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What advice would you give to boys currently at Nairobi School?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </motion.div>
                    )}

                    {/* Step 9: Alumni Profile */}
                    {currentStep === 9 && (
                      <motion.div key="step9" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">Notable Alumni Profile</CardTitle>
                          <CardDescription>Help us build mini-profiles for the Alumni Roll of Honour section of the book. This is optional but very valuable.</CardDescription>
                        </CardHeader>
                        <div className="p-4 bg-secondary rounded-xl text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-2">Why we ask this:</p>
                          <p>The book will feature a "Roll of Honour" with mini-profiles of notable alumni. If you or someone you know from school has made significant contributions in any field — public service, law, business, medicine, sport, arts — please share the details below.</p>
                        </div>
                        <FormField control={form.control} name="notability" render={({ field }) => (
                          <FormItem><FormLabel>Field & Why Remembered</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="e.g. Public Service — Served as Cabinet Secretary for Education. Or: Sport — Represented Kenya in rugby at international level." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="signatureContribution" render={({ field }) => (
                          <FormItem><FormLabel>Signature Contribution / Major Achievement</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="What is the single most notable achievement?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="schoolConnection" render={({ field }) => (
                          <FormItem><FormLabel>How Did Nairobi School Shape You?</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="How did your time at the Patch influence your career, character, or life path?" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="legacyNote" render={({ field }) => (
                          <FormItem><FormLabel>Legacy Note</FormLabel><FormControl><Textarea className="rounded-xl min-h-[60px]" placeholder="A concluding line or quote that captures your legacy or philosophy." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </motion.div>
                    )}

                    {/* Step 10: Submit */}
                    {currentStep === 10 && (
                      <motion.div key="step10" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="font-display text-foreground">Almost There</CardTitle>
                          <CardDescription>Upload files and finalize your submission.</CardDescription>
                        </CardHeader>
                        <FormField control={form.control} name="additionalComments" render={({ field }) => (
                          <FormItem><FormLabel>Additional Comments</FormLabel><FormControl><Textarea className="rounded-xl min-h-[80px]" placeholder="Anything else you'd like to share that we haven't asked about..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        {/* File Upload Section */}
                        <div className="space-y-3">
                          <FormLabel>Upload Photos, Videos, or Documents</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Share any photos, videos, PDFs, or other files that could help with the book. No limits on file size or number.
                          </p>
                          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <label className="cursor-pointer">
                              <span className="text-accent font-medium hover:underline">Click to upload files</span>
                              <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileSelect} />
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Images, videos, PDFs, documents — any format welcome</p>
                          </div>
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              {uploadedFiles.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                                  <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="text-sm truncate flex-1">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                  <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-secondary">
                            <Checkbox checked={form.watch("hasPhotosToShare")} onCheckedChange={(v) => form.setValue("hasPhotosToShare", !!v)} />
                            <span>I have additional photos I'd like to share for the book</span>
                          </label>
                          <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-secondary">
                            <Checkbox checked={form.watch("willingToBeInterviewed")} onCheckedChange={(v) => form.setValue("willingToBeInterviewed", !!v)} />
                            <span>I'm willing to be interviewed for the book</span>
                          </label>
                          <FormField control={form.control} name="consentToPublish" render={({ field }) => (
                            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-4">
                              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
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
                      <Button type="submit" variant="hero" className="rounded-xl" disabled={submitting || uploading}>
                        {uploading ? "Uploading files..." : submitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit Story</>}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </motion.div>
      </div>

      {/* Simple footer */}
      <div className="bg-primary py-6 text-center">
        <p className="text-primary-foreground/60 text-sm">© {new Date().getFullYear()} Nairobi School Commemorative Book Project</p>
      </div>
    </div>
  );
}
