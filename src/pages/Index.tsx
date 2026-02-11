import { useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Trophy,
  GraduationCap,
  ArrowRight,
  Clock,
  Building2,
  Quote,
  ChevronRight,
  Play,
  Star,
  Scroll
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

// Cinematic Assets
const HERO_IMAGE = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2574&auto=format&fit=crop"; // Classic Colonnade
const RUGBY_IMAGE = "https://images.unsplash.com/photo-1628779238951-be2c9f2a07f4?q=80&w=2670&auto=format&fit=crop"; // Rugby/Sport
const CHAPEL_IMAGE = "https://images.unsplash.com/photo-1548502669-5c9e05eK8769?q=80&w=2670&auto=format&fit=crop"; // Chapel-like Interior
const TEXTURE_OVERLAY = "https://www.transparenttextures.com/patterns/stardust.png";

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
      <div ref={containerRef} className="relative bg-cream selection:bg-gold selection:text-navy overflow-hidden">

        {/* --- CINEMATIC HERO --- */}
        <section className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden">
          {/* Parallax Background */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <div className="absolute inset-0 bg-navy/40 mix-blend-multiply z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-20" />
            <img
              src={HERO_IMAGE}
              alt="Nairobi School Arches"
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-30 container mx-auto px-4 text-center mt-20">
            <motion.div
              variants={staggerContainer(0.2, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              {/* Badge */}
              <motion.div variants={fadeIn("down", 0.5)} className="flexjustify-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream text-xs font-bold tracking-[0.3em] uppercase">
                  <Star className="w-3 h-3 text-gold" /> Est. 1902
                </span>
              </motion.div>

              {/* Main Title - Huge Typography */}
              <motion.h1
                variants={fadeIn("up", 0.5)}
                className="font-display text-7xl md:text-9xl font-bold text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl"
              >
                TO THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold via-yellow-200 to-gold">
                  UTTERMOST
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn("up", 0.7)}
                className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-12"
              >
                Documenting the legacy, the brotherhood, and the history of
                <span className="font-semibold text-gold"> Nairobi School</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeIn("up", 0.9)}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <Link to="/questionnaire">
                  <Button className="h-16 px-10 rounded-full bg-gold hover:bg-white text-navy font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(197,160,89,0.5)]">
                    Contribute Your Story
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/history">
                  <Button variant="outline" className="h-16 px-10 rounded-full border-white/30 text-white hover:bg-white/10 font-medium text-lg backdrop-blur-sm">
                    Explore History
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
          >
            <span className="text-white/50 text-xs tracking-widest uppercase">Scroll to Discover</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent" />
          </motion.div>
        </section>


        {/* --- BENTO GRID FEATURES --- */}
        <section className="py-32 px-4 bg-cream relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

          <div className="container mx-auto">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-navy mb-6">The Patch Chronicles</h2>
              <div className="w-24 h-1.5 bg-gold mx-auto mb-8" />
              <p className="text-navy/70 text-xl">
                We are building a living archive. From the "Prince of Wales" days to the modern era,
                every brick and every blazer has a story to tell.
              </p>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]">

              {/* Large Cell: The Book Project */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-navy/80 mix-blend-multiply z-10 transition-opacity duration-500 group-hover:opacity-90" />
                <img src={HERO_IMAGE} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                <div className="relative z-20 p-12 h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-gold/20 backdrop-blur-md mb-6 border border-gold/30">
                      <BookOpen className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">The Commemorative Book</h3>
                    <p className="text-white/70 text-lg max-w-md">
                      A premium coffee-table book capturing 120+ years of excellence.
                      Featuring never-before-seen photos, alumni interviews, and the complete history of the school.
                    </p>
                  </div>

                  <div>
                    <Link to="/questionnaire">
                      <Button className="bg-white text-navy hover:bg-gold hover:text-navy transition-colors rounded-full px-8 py-6 text-lg font-bold">
                        Pre-Order Now <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Top Right: Stats Card (Gold) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gold p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden shadow-xl group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-125 transition-transform duration-500">
                  <Trophy className="w-32 h-32 text-navy" />
                </div>
                <h4 className="font-display text-6xl font-bold text-navy mb-2">120+</h4>
                <p className="text-navy/80 font-bold uppercase tracking-wider">Years of Heritage</p>
                <p className="text-navy/70 mt-4 text-sm">From 1902 to Present Day.</p>
              </motion.div>

              {/* Bottom Right: Houses (Navy) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-navy p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10" />
                <Users className="w-12 h-12 text-gold mb-6" />
                <h4 className="font-display text-3xl font-bold text-white mb-2">The Houses</h4>
                <p className="text-white/60 mb-6 text-sm leading-relaxed">
                  Elgon, Athi, Serengeti, Baringo, Kirinyaga, Marsabit, Naivasha, Tana.
                </p>
                <Link to="/houses" className="inline-flex items-center text-gold hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
                  Explore Houses <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- STATS STRIP --- */}
        <section className="bg-navy py-20 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {stats.map((stat, i) => (
                <div key={i} className="px-8 py-8 md:py-0 text-center">
                  <h3 className="font-display text-5xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gold font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-white/40 text-sm">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* --- ROLLING TIMELINE TEASER --- */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-8">
              <span className="text-gold font-bold tracking-widest uppercase text-sm">Timeless Tradition</span>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-navy leading-tight">
                From the Railway <br /> to the World.
              </h2>
              <p className="text-lg text-navy/70 leading-relaxed">
                Nairobi School's history parallels the history of the nation itself.
                What started as a school for railway children has evolved into a powerhouse
                producing presidents, captains of industry, and global leaders.
              </p>
              <Link to="/history">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white rounded-full px-8 py-6 text-lg mt-4">
                  View Full Timeline
                </Button>
              </Link>
            </div>

            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl transform translate-x-10 translate-y-10" />
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <img src={RUGBY_IMAGE} className="rounded-2xl shadow-lg transform translate-y-12" />
                <img src="https://images.unsplash.com/photo-1598197748967-b4674cb3c266?q=80&w=2669&auto=format&fit=crop" className="rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="py-40 bg-navy relative overflow-hidden text-center px-4">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto space-y-10"
          >
            <Quote className="w-16 h-16 text-gold mx-auto opacity-50" />
            <h2 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
              "To The Uttermost"
            </h2>
            <p className="text-white/60 text-xl md:text-2xl">
              Your story is missing. Help us complete the picture.
            </p>
            <Link to="/questionnaire">
              <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-white hover:to-white hover:text-navy text-navy font-bold text-xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                Submit Your Entry Now
              </Button>
            </Link>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
}
