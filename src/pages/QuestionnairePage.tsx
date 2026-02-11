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
  FormDescription,
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Send, Upload, User, GraduationCap, BookOpen, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/motion";

// --- Schema Definition ---
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  admissionYear: z.string().regex(/^\d{4}$/, { message: "Must be a valid 4-digit year." }),
  leavingYear: z.string().regex(/^\d{4}$/, { message: "Must be a valid 4-digit year." }),
  house: z.string().min(1, { message: "Please select your house." }),
  nickname: z.string().optional(),
  favoriteTeacher: z.string().optional(),
  memorableMoment: z.string().min(10, { message: "Please share at least a short sentence." }),
  mischief: z.string().optional(),
  upload: z.any().optional(),
  consentToPublish: z.boolean().default(false).refine((val) => val === true, {
    message: "You must agree to the terms to submit.",
  }),
});

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "School Days", icon: GraduationCap },
  { id: 3, title: "Memories", icon: BookOpen },
  { id: 4, title: "Submit", icon: CheckCircle },
];

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      admissionYear: "",
      leavingYear: "",
      house: "",
      nickname: "",
      favoriteTeacher: "",
      memorableMoment: "",
      mischief: "",
      consentToPublish: false,
    },
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await form.trigger(["fullName", "email", "phone"]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(["admissionYear", "leavingYear", "house", "nickname"]);
    } else if (currentStep === 3) {
      isValid = await form.trigger(["memorableMoment", "mischief", "favoriteTeacher"]);
    }
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Story submitted successfully!", {
      description: "Thank you for contributing to the Nairobi School Chronicles.",
    });
    // Reset form or redirect
  }

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-20 bg-cream relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.2)}
            className="relative max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-navy mb-4">Share Your Story</h1>
              <p className="text-navy/60 text-lg max-w-2xl mx-auto">
                Your memories are the bricks that build our legacy. Help us document the true spirit of the Patch.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative px-4 md:px-12">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-navy/10 -z-10" />
              <div 
                className="absolute left-0 top-1/2 h-1 bg-gold -z-10 transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                      currentStep >= step.id
                        ? "bg-gold border-gold text-navy shadow-lg scale-110"
                        : "bg-white border-navy/10 text-navy/30"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-navy/70">{step.title}</span>
                </div>
              ))}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="card-elevated border-0 overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <CardHeader>
                            <CardTitle className="font-display text-navy">Personal Info</CardTitle>
                            <CardDescription>Tell us how we can reach you.</CardDescription>
                          </CardHeader>
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                  <Input className="rounded-xl" placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" className="rounded-xl" placeholder="you@example.com" {...field} />
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
                                <FormLabel>Phone (optional)</FormLabel>
                                <FormControl>
                                  <Input className="rounded-xl" placeholder="+254 ..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <CardHeader>
                            <CardTitle className="font-display text-navy">School Days</CardTitle>
                            <CardDescription>When and where you belonged.</CardDescription>
                          </CardHeader>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="admissionYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Admission year</FormLabel>
                                  <FormControl>
                                    <Input className="rounded-xl" placeholder="e.g. 1995" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="leavingYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Leaving year</FormLabel>
                                  <FormControl>
                                    <Input className="rounded-xl" placeholder="e.g. 2000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="house"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>House</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-xl">
                                      <SelectValue placeholder="Select your house" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {["Elgon", "Athi", "Serengeti", "Baringo", "Kirinyaga", "Marsabit", "Naivasha", "Tana"].map((h) => (
                                      <SelectItem key={h} value={h}>{h}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nickname (optional)</FormLabel>
                                <FormControl>
                                  <Input className="rounded-xl" placeholder="Patch nickname" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <CardHeader>
                            <CardTitle className="font-display text-navy">Memories</CardTitle>
                            <CardDescription>Share a moment that defines your Patch story.</CardDescription>
                          </CardHeader>
                          <FormField
                            control={form.control}
                            name="memorableMoment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Memorable moment</FormLabel>
                                <FormControl>
                                  <Textarea className="rounded-xl min-h-[120px]" placeholder="A moment you will never forget..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="favoriteTeacher"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Favourite teacher (optional)</FormLabel>
                                <FormControl>
                                  <Input className="rounded-xl" placeholder="Name or subject" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mischief"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mischief (optional)</FormLabel>
                                <FormControl>
                                  <Textarea className="rounded-xl min-h-[80px]" placeholder="We won't tell..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <CardHeader>
                            <CardTitle className="font-display text-navy">Almost there</CardTitle>
                            <CardDescription>Confirm and submit your story.</CardDescription>
                          </CardHeader>
                          <FormField
                            control={form.control}
                            name="consentToPublish"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border/60 p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>I agree to the terms and consent to my story being published in the commemorative book.</FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                      <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      {currentStep < 4 ? (
                        <Button type="button" variant="hero" onClick={nextStep} className="rounded-xl">
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit" variant="hero" className="rounded-xl">
                          <Send className="mr-2 h-4 w-4" />
                          Submit story
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
