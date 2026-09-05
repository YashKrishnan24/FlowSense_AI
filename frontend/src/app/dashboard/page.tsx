import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { 
  ArrowRight, Sparkles, Activity, FileSearch, 
  CheckCircle2, Eye, LayoutTemplate, MousePointerClick, 
  UploadCloud, BrainCircuit, Target, Plus
} from "lucide-react";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the user's project and recent analyses, including recommendations to count them
  const project = await prisma.project.findFirst({
    where: { userId: userId },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        include: { recommendations: true }
      }
    }
  });

  const analyses = project?.analyses || [];
  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0 
    ? Math.round(analyses.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / totalAnalyses)
    : "--";
  
  const totalIssues = analyses.reduce((acc, curr) => acc + curr.recommendations.length, 0);
  const totalRecommendations = totalIssues;

  return (
    <div className="space-y-24 pb-20">
      
      {/* 3. HERO / WELCOME SECTION */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-8">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase">
            Your UX Workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Turn your latest designs into better experiences.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Analyze your interfaces, uncover UX issues, and turn AI-powered feedback into better design decisions.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="/dashboard/analyze"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              Analyze New UI
            </Link>
            <Link 
              href="#recent-audits"
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
            >
              View Previous Audits
            </Link>
          </div>
        </div>
        
        {/* RIGHT: MINI FLOW SENSE REPORT PREVIEW */}
        <div className="flex-1 w-full max-w-lg perspective-1000">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform rotate-y-[-2deg] rotate-x-[2deg] hover:rotate-0 transition-transform duration-500 hover:scale-105">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">Overall UX Score</div>
                <div className="text-4xl font-black text-gray-900">78 <span className="text-lg text-gray-400 font-medium">/ 100</span></div>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-lg bg-green-50 border border-green-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-green-700">A11Y</span>
                  <span className="text-sm font-black text-green-800">64</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-700">VIS</span>
                  <span className="text-sm font-black text-blue-800">86</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-50 border border-purple-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-purple-700">CNV</span>
                  <span className="text-sm font-black text-purple-800">74</span>
                </div>
              </div>
            </div>
            
            <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <div className="absolute inset-x-0 top-0 h-8 bg-white border-b border-gray-200 flex items-center px-3 gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="absolute top-12 left-4 right-4 bottom-4 bg-white rounded shadow-sm border border-gray-100 p-3 flex gap-3">
                <div className="w-1/3 h-full bg-gray-50 rounded border border-gray-100 flex flex-col gap-2 p-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-2/3 h-full bg-blue-50/30 rounded border border-blue-100 relative">
                  <div className="absolute top-4 left-4 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white animate-pulse">1</div>
                  <div className="absolute bottom-4 right-8 w-6 h-6 bg-yellow-500 rounded-full text-black text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white">2</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-md bg-red-50 border border-red-100">
                <span className="font-semibold text-red-800 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Low contrast</span>
                <span className="font-bold text-red-600">High</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-md bg-yellow-50 border border-yellow-100">
                <span className="font-semibold text-yellow-800 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Cluttered layout</span>
                <span className="font-bold text-yellow-600">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KPI SECTION */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Audits", value: totalAnalyses, sub: "Interfaces analyzed", icon: <Activity className="w-4 h-4" /> },
          { label: "Average UX Score", value: avgScore, sub: "Across all audits", icon: <Target className="w-4 h-4" /> },
          { label: "Issues Found", value: totalIssues, sub: "Detected by FlowSense", icon: <FileSearch className="w-4 h-4" /> },
          { label: "Recommendations", value: totalRecommendations, sub: "Actionable improvements", icon: <Sparkles className="w-4 h-4" /> }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between text-gray-500 mb-4">
              <span className="font-semibold text-sm">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className="text-4xl font-black tracking-tight text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-xs font-medium text-gray-400">{kpi.sub}</div>
          </div>
        ))}
      </section>

      {/* 6 & 7. RECENT AUDITS SECTION */}
      <section id="recent-audits" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recent Audits</h2>
          <p className="text-gray-500">Review your latest interface analyses and track what you've improved.</p>
        </div>

        {totalAnalyses === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
            <div className="relative z-10 flex flex-col items-center max-w-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-blue-600">
                <FileSearch className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your first UX audit starts here.</h3>
              <p className="text-gray-500 mb-8">
                Upload a screenshot and let FlowSense uncover usability, accessibility, visual clarity, and conversion issues in seconds.
              </p>
              <Link 
                href="/dashboard/analyze"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 group"
              >
                Analyze Your First UI 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-gray-400 font-medium mt-4">PNG, JPG and supported web screenshots</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {analyses.map((analysis) => (
                <Link 
                  key={analysis.id} 
                  href={`/dashboard/reports/${analysis.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-6 mb-4 sm:mb-0">
                    <img 
                      src={analysis.screenshotUrl} 
                      alt="Thumbnail" 
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        Analysis Report
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 font-medium">
                        <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{analysis.recommendations.length} issues</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">UX Score</div>
                      <div className="font-black text-2xl text-gray-900">{analysis.overallScore}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      View Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <Link href="#recent-audits" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">View All History →</Link>
            </div>
          </div>
        )}
      </section>

      {/* 8. PRODUCT CAPABILITIES SECTION */}
      <section>
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">What FlowSense Analyzes</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Your UI. Under a smarter lens.</h2>
          <p className="text-gray-500">FlowSense evaluates the parts of your interface that influence usability, clarity, accessibility, and action.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Accessibility", desc: "Identify contrast, readability, and accessibility concerns.", icon: <CheckCircle2 className="w-6 h-6 text-green-600" />, bg: "bg-green-50", border: "group-hover:border-green-300" },
            { title: "Visual Clarity", desc: "Evaluate hierarchy, spacing, alignment, and visual focus.", icon: <Eye className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", border: "group-hover:border-blue-300" },
            { title: "Usability", desc: "Detect confusing layouts, interaction friction, and usability issues.", icon: <LayoutTemplate className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50", border: "group-hover:border-purple-300" },
            { title: "Conversion", desc: "Find interface elements that may weaken user action and engagement.", icon: <MousePointerClick className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50", border: "group-hover:border-orange-300" }
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group ${item.border}`}>
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. HOW IT WORKS SECTION */}
      <section className="bg-white rounded-3xl p-10 md:p-16 border border-gray-100 shadow-sm">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">How It Works</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">From screenshot to insight in seconds.</h2>
          <p className="text-gray-500">No lengthy audits. No guesswork. Just actionable UX feedback.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gray-200 -z-10"></div>
          {[
            { step: "01", title: "Upload Your UI", desc: "Drop in a screenshot of your web or mobile interface.", icon: <UploadCloud className="w-6 h-6" /> },
            { step: "02", title: "AI Analysis", desc: "FlowSense scans your interface for UX, accessibility, visual clarity, and conversion issues.", icon: <BrainCircuit className="w-6 h-6" /> },
            { step: "03", title: "Improve", desc: "Get scores, visual markers, and recommendations you can act on immediately.", icon: <Sparkles className="w-6 h-6" /> }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-white">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex flex-col items-center justify-center mb-6 shadow-xl border-4 border-white">
                <span className="text-[10px] font-bold text-gray-400 mb-0.5">{item.step}</span>
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FEEDBACK PREVIEW SECTION */}
      <section className="flex flex-col lg:flex-row items-center gap-12 bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        
        <div className="flex-1 relative z-10 w-full max-w-lg">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl relative">
            <div className="aspect-video bg-[#1a1a1c] rounded-xl border border-white/5 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-6 bg-white/5 border-b border-white/5"></div>
              <div className="absolute top-12 left-6 right-1/2 h-4 bg-white/10 rounded"></div>
              <div className="absolute top-20 left-6 right-1/3 h-4 bg-white/5 rounded"></div>
              <div className="absolute top-10 left-4 w-8 h-8 bg-red-500 rounded-full border-2 border-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]">1</div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Feedback you can actually use.</h2>
            <p className="text-gray-400 text-lg">Every audit turns your screenshot into a structured UX report with clear priorities and practical next steps.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <div className="flex gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider">High Severity</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">Visual Clarity</span>
                </div>
                <h4 className="font-bold text-lg">Low contrast text</h4>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Suggested Fix</div>
              <p className="text-gray-200 font-medium">Increase text/background contrast to improve readability. Ensure a minimum contrast ratio of 4.5:1 for normal text.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">See what your UI is missing.</h2>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">Upload a screenshot and get your first AI-powered UX audit.</p>
        <Link 
          href="/dashboard/analyze"
          className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:bg-black transition-all shadow-xl hover:scale-105 group"
        >
          Analyze My UI 
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

    </div>
  );
}
