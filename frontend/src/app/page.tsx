"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Upload, Search, Zap, Eye, MousePointer2, BarChart3, Users, Code, Rocket, Briefcase, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

export default function Home() {
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 50], ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.9)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // Cursor Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-[#070709] relative overflow-hidden text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Interactive Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[800px] h-[800px] rounded-full blur-[160px] bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent -z-10"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ backgroundColor: navBg, borderColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
            <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter text-white">
              <img src="/bg-logo.png" alt="Logo" className="w-9 h-9 object-contain" onError={(e) => (e.currentTarget.style.display='none')} />
              FlowSense
            </Link>
          </motion.div>
          <div className="hidden md:flex items-center gap-12 text-[15px] font-semibold text-gray-400">
            <motion.div whileHover={{ scale: 1.05, color: "#fff" }} whileTap={{ scale: 0.95 }}>
              <Link href="#features" className="transition-colors">Features</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, color: "#fff" }} whileTap={{ scale: 0.95 }}>
              <Link href="#how-it-works" className="transition-colors">How it works</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, color: "#fff" }} whileTap={{ scale: 0.95 }}>
              <Link href="#why-flowsense" className="transition-colors">Why FlowSense</Link>
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/sign-in" 
              className="bg-white text-black px-7 py-3 rounded-full text-[15px] font-bold hover:bg-gray-200 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 text-left"
          >
            <motion.div variants={fadeUp} className="text-blue-500 font-bold tracking-widest text-[11px] uppercase mb-6">
              AI-Powered UX Auditing
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-6xl sm:text-[80px] font-bold tracking-tight mb-8 leading-[1.05] text-white">
              Turn Your UI Into <br /> a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Better Experience.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[17px] text-gray-400 mb-10 max-w-xl leading-relaxed font-medium">
              Upload a screenshot. Get an instant AI-powered UX audit with scores, visual issue markers, and actionable recommendations.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full text-[15px] font-bold hover:bg-gray-200 transition-all gap-2 group"
                >
                  Analyze My UI 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="#how-it-works"
                  className="inline-flex items-center justify-center bg-[#18181b] border border-white/10 text-white px-8 py-4 rounded-full text-[15px] font-bold hover:bg-[#27272a] transition-all gap-2"
                >
                  See How It Works
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-[13px] font-semibold text-gray-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Accessibility</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Visual Clarity</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Usability</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Conversion</div>
            </motion.div>
          </motion.div>

          {/* Hero Graphic Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 w-full relative"
          >
            <div className="w-full aspect-[4/3] bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              {/* Fake dashboard UI inside hero */}
              <div className="absolute top-6 left-6 right-6 bottom-6 bg-white border border-gray-200 rounded-xl flex overflow-hidden shadow-2xl">
                <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-4">
                  <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                  <div className="h-8 w-full bg-blue-50 rounded-md border border-blue-100"></div>
                  <div className="h-8 w-full bg-gray-200 rounded-md"></div>
                  <div className="h-8 w-full bg-gray-200 rounded-md"></div>
                </div>
                <div className="w-3/4 p-6 relative bg-white">
                  <div className="h-40 w-full bg-gray-100 rounded-lg border border-gray-200 mb-4"></div>
                  <div className="flex gap-4">
                    <div className="h-24 flex-1 bg-gray-100 rounded-lg border border-gray-200"></div>
                    <div className="h-24 flex-1 bg-gray-100 rounded-lg border border-gray-200"></div>
                  </div>
                  {/* Fake Issue Marker */}
                  <div className="absolute top-12 left-1/3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg animate-pulse">1</div>
                  <div className="absolute top-32 right-1/4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold border-2 border-white shadow-lg">2</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* WHY FLOWSENSE */}
        <motion.section 
          id="why-flowsense"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-32 scroll-mt-24 text-center border-t border-white/5"
        >
          <motion.h2 variants={fadeUp} className="text-[32px] font-bold tracking-tight mb-4 text-white">
            Great-looking interfaces can still have UX problems.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[15px] text-gray-400 max-w-2xl mx-auto leading-relaxed mb-16">
            Small spacing issues. Weak visual hierarchy. Poor contrast. Confusing interactions. Missed conversion opportunities.
            FlowSense analyzes your interface the way a UX reviewer would — helping you discover problems before your users do.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-red-500/20">
                <Search className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px] mb-2">Spot the Friction</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">Find usability issues that are easy to overlook.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px] mb-2">See What Matters</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">Understand which problems have the biggest impact.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px] mb-2">Know What to Fix</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">Get clear, actionable recommendations instead of vague feedback.</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* WHAT FLOWSENSE DOES */}
        <motion.section 
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-32 scroll-mt-24 border-t border-white/5"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="text-purple-500 font-bold tracking-widest text-[11px] uppercase mb-4">What FlowSense Does</div>
            <h2 className="text-[40px] font-bold tracking-tight mb-4 text-white">Your UI. Under <span className="text-blue-400">a smarter lens.</span></h2>
            <p className="text-[15px] text-gray-400 max-w-xl mx-auto">
              FlowSense turns a simple screenshot into a structured UX report powered by AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 border border-green-500/20">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold text-[17px] mb-3">Accessibility</h3>
              <p className="text-gray-400 text-[14px] leading-relaxed">Identify contrast, readability and accessibility concerns.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-[17px] mb-3">Visual Clarity</h3>
              <p className="text-gray-400 text-[14px] leading-relaxed">Evaluate hierarchy, spacing, alignment and visual focus.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                <MousePointer2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-[17px] mb-3">Usability</h3>
              <p className="text-gray-400 text-[14px] leading-relaxed">Detect confusing layouts and friction points.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold text-[17px] mb-3">Conversion</h3>
              <p className="text-gray-400 text-[14px] leading-relaxed">Find elements that may be weakening user action and engagement.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section 
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-32 scroll-mt-24 border-t border-white/5"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="text-purple-500 font-bold tracking-widest text-[11px] uppercase mb-4">How it works</div>
            <h2 className="text-[40px] font-bold tracking-tight mb-4 text-white">From screenshot to insight in seconds.</h2>
            <p className="text-[15px] text-gray-400 max-w-xl mx-auto">
              No lengthy audits. No guesswork. Just actionable UX feedback.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl w-full lg:w-1/3 flex flex-col hover:border-white/10 transition-colors h-[220px]">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-[16px] mb-2">1. Upload your UI</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">Drop in a screenshot of your web or mobile interface.</p>
            </motion.div>
            
            <ChevronRight className="hidden lg:block w-6 h-6 text-gray-600" />

            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl w-full lg:w-1/3 flex flex-col hover:border-white/10 transition-colors h-[220px]">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Search className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold text-[16px] mb-2">2. AI Analysis</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">FlowSense scans the interface for UX, accessibility, visual and conversion issues.</p>
            </motion.div>

            <ChevronRight className="hidden lg:block w-6 h-6 text-gray-600" />

            <motion.div variants={fadeUp} className="bg-[#0f0f12] border border-white/5 p-8 rounded-2xl w-full lg:w-1/3 flex flex-col hover:border-white/10 transition-colors h-[220px]">
              <div className="w-12 h-12 bg-blue-400/10 rounded-xl flex items-center justify-center mb-6 border border-blue-400/20">
                <Zap className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-white font-semibold text-[16px] mb-2">3. Get Recommendations</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">Get scores, issue markers and specific recommendations you can act on immediately.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* FEEDBACK SECTION */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-32 border-t border-white/5"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-[40px] font-bold tracking-tight mb-4 text-white">Feedback you can actually use.</h2>
            <p className="text-[15px] text-gray-400 max-w-xl mx-auto">
              Don't just find what's wrong. Understand what to change.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mock Image Display */}
            <motion.div variants={fadeUp} className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex items-center justify-center">
              <div className="w-full h-full min-h-[250px] bg-[#18181b] rounded-xl flex flex-col overflow-hidden border border-white/5 relative">
                {/* Browser bar */}
                <div className="bg-[#27272a] h-8 w-full flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-gray-500 text-sm">
                  [ UI Screenshot Analyzed Here ]
                </div>
              </div>
            </motion.div>

            {/* Mock Scores */}
            <motion.div variants={fadeUp} className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-8 flex flex-col justify-center">
              <div className="mb-8 text-center">
                <div className="text-gray-400 text-sm mb-2">Overall Score</div>
                <div className="text-5xl font-bold text-green-400">78<span className="text-2xl text-gray-600">/100</span></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[13px] mb-2"><span className="text-gray-300">Accessibility</span><span className="text-white">64</span></div>
                  <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[64%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] mb-2"><span className="text-gray-300">Visual Clarity</span><span className="text-white">86</span></div>
                  <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full w-[86%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] mb-2"><span className="text-gray-300">Conversion</span><span className="text-white">74</span></div>
                  <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full w-[74%]"></div></div>
                </div>
              </div>
            </motion.div>

            {/* Mock Context */}
            <motion.div variants={fadeUp} className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="text-white font-semibold mb-6">Every issue comes with context.</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400 text-sm">!</div>
                  <div>
                    <div className="text-white text-[14px] font-medium mb-1">Severity</div>
                    <div className="text-gray-400 text-[12px]">Know what needs attention first.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400"><Search className="w-4 h-4"/></div>
                  <div>
                    <div className="text-white text-[14px] font-medium mb-1">Visual markers</div>
                    <div className="text-gray-400 text-[12px]">See exactly where an issue appears.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400"><CheckCircle2 className="w-4 h-4"/></div>
                  <div>
                    <div className="text-white text-[14px] font-medium mb-1">Suggested fixes</div>
                    <div className="text-gray-400 text-[12px]">Get practical recommendations instead of generic advice.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* BUILT FOR PEOPLE */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-32 border-t border-white/5"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-[32px] font-bold tracking-tight mb-4 text-white">Built for people who build digital products.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20"><Users className="w-5 h-5"/></div>
              <div>
                <h3 className="text-white font-semibold text-[15px]">Designers</h3>
                <p className="text-gray-500 text-[12px]">Validate designs before handoff.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20"><Code className="w-5 h-5"/></div>
              <div>
                <h3 className="text-white font-semibold text-[15px]">Developers</h3>
                <p className="text-gray-500 text-[12px]">Catch UI issues while coding.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/20"><Rocket className="w-5 h-5"/></div>
              <div>
                <h3 className="text-white font-semibold text-[15px]">Founders</h3>
                <p className="text-gray-500 text-[12px]">Improve UX without a UX team.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#111113] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 border border-orange-500/20"><Briefcase className="w-5 h-5"/></div>
              <div>
                <h3 className="text-white font-semibold text-[15px]">Product Teams</h3>
                <p className="text-gray-500 text-[12px]">Faster feedback loops.</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA BOTTOM */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="pb-32"
        >
          <motion.div variants={fadeUp} className="relative w-full rounded-3xl overflow-hidden p-16 text-center border border-blue-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 backdrop-blur-3xl -z-10"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 blur-[2px]"></div>
            
            <h2 className="text-[40px] font-bold tracking-tight mb-4 text-white">See what your UI is missing.</h2>
            <p className="text-[16px] text-gray-300 mb-10">Upload a screenshot and get your first AI-powered UX audit.</p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full text-[15px] font-bold hover:bg-gray-200 transition-all gap-2"
              >
                Analyze My UI 
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <p className="text-gray-400 text-xs mt-4">No setup. Just upload and analyze.</p>
          </motion.div>
        </motion.section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040405] py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-extrabold text-xl tracking-tighter text-white">
            <img src="/bg-logo.png" alt="Logo" className="w-5 h-5 object-contain" onError={(e) => (e.currentTarget.style.display='none')} />
            FlowSense
          </div>
          <div className="text-gray-500 text-sm">
            AI-powered UX feedback for better interfaces.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#why-flowsense" className="hover:text-white transition-colors">Why FlowSense</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
