import { useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Trophy,
  ArrowRight,
  Quote,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

// Nairobi School — local assets (public/) and fallback Wikimedia
const SCHOOL_IMAGES = {
  hero: "/homepageimage.webp",
  bento: "/image1.webp",
  quad: "/quadimage.webp",
  rugby: "/rugby%20imgae.webp",
  // Fallbacks (Wikimedia Commons, CC BY-SA 4.0)
  administration: "https://upload.wikimedia.org/wikipedia/commons/d/de/Administration_block_at_Nairobi_School.jpg",
  chapel: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Chapel14.jpg",
} as const;

const stats = [
  { value: "1902", label: "Founded", desc: "Before the railway reached the lake." },
  { value: "15k+", label: "Alumni", desc: "Leaders in every sector worldwide." },
  { value: "8", label: "Houses", desc: "Elgon, Athi, Serengeti, and more." },
];

export default function Index() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Layout>
      <div ref={containerRef} className="relative bg-background selection:bg-accent selection:text-primary overflow-hidden">

        {/* --- CINEMATIC HERO --- */}
        <section className="relative h-screen min-h-[100dvh] min-h-[560px] sm:min-h-[640px] md:min-h-[800px] lg:min-h-[900px] flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <div className="absolute inset-0 bg-primary/50 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-20" />
            <img
              src={SCHOOL_IMAGES.hero}
              alt="Nairobi School — Campus"
              className="w-full h-full object-cover object-center scale-105 opacity-80"
              onError={(e) => { (e.target as HTMLImageElement).src = SCHOOL_IMAGES.administration; }}
            />
          </motion.div>

          <div className="relative z-30 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-28 md:mt-20">
            <motion.div
              variants={staggerContainer(0.2, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeIn("down", 0.5)} className="flex justify-center mb-4 sm:mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-foreground text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                  <Star className="w-3 h-3 text-accent" /> Est. 1902
                </span>
              </motion.div>

              <motion.h1
                variants={fadeIn("up", 0.5)}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white leading-[0.95] tracking-tighter mb-4 sm:mb-8 drop-shadow-2xl px-1"
              >
                TO THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-accent via-amber-200 to-accent">
                  UTTERMOST
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn("up", 0.7)}
                className="text-white/80 text-base sm:text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-12 px-2"
              >
                Documenting the legacy, the brotherhood, and the history of
                <span className="font-semibold text-accent"> Nairobi School</span>.
              </motion.p>

              <motion.div
                variants={fadeIn("up", 0.9)}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              >
                <Link to="/questionnaire">
                  <Button variant="hero" className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl text-base sm:text-lg font-bold w-full sm:w-auto">
                    Contribute Your Story
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Link to="/history" className="w-full sm:w-auto">
                  <Button variant="glass" className="h-12 sm:h-16 px-6 sm:px-10 rounded-full font-medium text-base sm:text-lg w-full sm:w-auto border-2 border-white text-white bg-white/15 hover:bg-white/25">
                    Explore History
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- BENTO GRID FEATURES --- */}
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 bg-secondary relative">
          <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
          <div className="container mx-auto relative">
            <div className="mb-10 sm:mb-16 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">The Patch Chronicles</h2>
              <div className="w-24 h-1.5 bg-accent mx-auto mb-6 sm:mb-8 rounded-full" />
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl px-2">
                We are building a living archive. From the "Prince of Wales" days to the modern era,
                every brick and every blazer has a story to tell.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 sm:gap-6 h-auto md:h-[800px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 md:row-span-2 relative group rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl min-h-[320px] sm:min-h-[400px] md:min-h-0"
              >
                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-90" />
                <img src={SCHOOL_IMAGES.bento} alt="Nairobi School — The Commemorative Book" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="relative z-20 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-2 sm:p-3 rounded-xl bg-accent/20 backdrop-blur-md mb-4 sm:mb-6 border border-accent/30">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">The Commemorative Book</h3>
                    <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-md">
                      A premium coffee-table book capturing 120+ years of excellence.
                      Featuring never-before-seen photos, alumni interviews, and the complete history of the school.
                    </p>
                  </div>
                  <div>
                    <Link to="/questionnaire">
                      <Button variant="hero" className="rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold">
                        Pre-Order Now <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-accent p-6 sm:p-8 rounded-2xl md:rounded-3xl flex flex-col justify-center relative overflow-hidden shadow-elegant group min-h-[140px] sm:min-h-0"
              >
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 transform group-hover:scale-125 transition-transform duration-500">
                  <Trophy className="w-20 h-20 sm:w-32 sm:h-32 text-primary" />
                </div>
                <h4 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-1 sm:mb-2">120+</h4>
                <p className="text-primary/80 font-bold uppercase tracking-wider text-sm sm:text-base">Years of Heritage</p>
                <p className="text-primary/70 mt-2 sm:mt-4 text-xs sm:text-sm">From 1902 to Present Day.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-primary p-6 sm:p-8 rounded-2xl md:rounded-3xl flex flex-col justify-center relative overflow-hidden shadow-elegant min-h-[140px] sm:min-h-0"
              >
                <div className="absolute inset-0 court-pattern opacity-50" />
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-accent mb-4 sm:mb-6 relative z-10" />
                <h4 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-1 sm:mb-2 relative z-10">The Houses</h4>
                <p className="text-primary-foreground/60 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed relative z-10">
                  Elgon, Athi, Serengeti, Baringo, Kirinyaga, Marsabit, Naivasha, Tana.
                </p>
                <Link to="/houses" className="inline-flex items-center text-accent hover:text-primary-foreground transition-colors font-bold text-xs sm:text-sm uppercase tracking-widest relative z-10">
                  Explore Houses <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- STATS STRIP --- */}
        <section className="bg-primary py-10 sm:py-14 md:py-16 lg:py-20 border-y border-primary-foreground/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/10">
              {stats.map((stat, i) => (
                <div key={i} className="px-4 sm:px-8 py-6 sm:py-8 md:py-0 text-center">
                  <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-1 sm:mb-2">{stat.value}</h3>
                  <p className="text-accent font-bold uppercase tracking-widest mb-1 sm:mb-2 text-sm sm:text-base">{stat.label}</p>
                  <p className="text-primary-foreground/40 text-xs sm:text-sm">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ROLLING TIMELINE TEASER --- */}
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
            <div className="md:w-1/2 space-y-4 sm:space-y-6 md:space-y-8 text-center md:text-left">
              <span className="text-accent font-bold tracking-widest uppercase text-xs sm:text-sm">Timeless Tradition</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                From the Railway <br /> to the World.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Nairobi School's history parallels the history of the nation itself.
                What started as a school for railway children has evolved into a powerhouse
                producing presidents, captains of industry, and global leaders.
              </p>
              <Link to="/history">
                <Button variant="default" className="rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg mt-2 sm:mt-4">
                  View Full Timeline
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl transform translate-x-10 translate-y-10" />
              <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
                <img src={SCHOOL_IMAGES.quad} alt="Nairobi School quadrangle" className="rounded-xl sm:rounded-2xl shadow-lg object-cover w-full h-48 sm:h-56 md:h-64 lg:h-80 transform translate-y-6 sm:translate-y-12" />
                <img src={SCHOOL_IMAGES.rugby} alt="Nairobi School rugby" className="rounded-xl sm:rounded-2xl shadow-lg object-cover w-full h-48 sm:h-56 md:h-64 lg:h-80 object-center" />
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-primary relative overflow-hidden text-center px-4 sm:px-6">
          <div className="absolute inset-0 court-pattern opacity-30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-10"
          >
            <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto opacity-50" />
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              "To The Uttermost"
            </h2>
            <p className="text-primary-foreground/60 text-base sm:text-xl md:text-2xl">
              Your story is missing. Help us complete the picture.
            </p>
            <Link to="/questionnaire">
              <Button variant="hero" className="text-base sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-xl">
                Submit Your Entry Now
              </Button>
            </Link>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
}
