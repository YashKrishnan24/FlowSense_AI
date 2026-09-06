import React from "react";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import Link from "next/link";
import { AnimatedScoreRing } from "@/components/AnimatedScoreRing";

const prisma = new PrismaClient();

function getSeverityColor(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200";
    case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200";
    case "MEDIUM": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "LOW": return "text-blue-600 bg-blue-50 border-blue-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  // Await params as required in newer Next.js versions
  const { id } = await params;

  const analysis = await prisma.analysis.findUnique({
    where: { id: id },
    include: {
      recommendations: true,
      report: true
    }
  });

  if (!analysis) {
    redirect("/dashboard");
  }

  const { report, recommendations } = analysis;

  const recentHistory = await prisma.analysis.findMany({
    where: { 
      projectId: analysis.projectId, 
      id: { not: id } 
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-medium tracking-tight mb-2">Analysis Report</h1>
        <p className="text-gray-500">
          Generated on {new Date(analysis.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image & Markers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium mb-4">Analyzed Interface</h2>
            
            <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={analysis.screenshotUrl} 
                alt="Analyzed UI" 
                className="w-full object-contain"
              />
              
              {/* Render Markers */}
              {recommendations.map((rec, idx) => {
                if (rec.markerX === null || rec.markerY === null) return null;
                // Markers are usually 0-1 percentages
                const top = `${rec.markerY * 100}%`;
                const left = `${rec.markerX * 100}%`;

                return (
                  <div 
                    key={rec.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 bg-black text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg ring-2 ring-white cursor-pointer hover:scale-125 transition-transform group"
                    style={{ top, left }}
                    title={rec.category}
                  >
                    <div className="absolute inset-0 rounded-full bg-black opacity-30 animate-ping group-hover:hidden"></div>
                    <span className="relative z-10">{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Scores & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scores Overview */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium mb-6">Scores</h2>
            <div className="grid grid-cols-2 gap-4">
              <AnimatedScoreRing score={analysis.overallScore} label="Overall" />
              <AnimatedScoreRing score={analysis.accessibilityScore} label="Accessibility" />
              <AnimatedScoreRing score={analysis.visualClarityScore} label="Visual Clarity" />
              <AnimatedScoreRing score={analysis.conversionScore} label="Conversion" />
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-green-700">
                <CheckCircle2 className="w-5 h-5" /> What works well
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {(report?.strengths as string[] || []).map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-px bg-gray-100 w-full" />
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-red-700">
                <XCircle className="w-5 h-5" /> Areas to improve
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {(report?.weaknesses as string[] || []).map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Audit History (Mini) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xl font-medium mb-1">Audit History</h2>
            <p className="text-sm text-gray-500 mb-6">Track your recent UX progress</p>
            
            {recentHistory.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentHistory.map((pastAudit) => (
                  <Link
                    key={pastAudit.id}
                    href={`/dashboard/reports/${pastAudit.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-blue-300 transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={pastAudit.screenshotUrl} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {new Date(pastAudit.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Score: {pastAudit.overallScore}/100
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <span className="text-sm text-gray-500">No previous audits found.</span>
              </div>
            )}
            
            <Link 
              href="/dashboard/history"
              className="mt-6 w-full py-3 rounded-xl bg-gray-50 text-gray-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-200"
            >
              View Full History <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Bottom Full-width: Detailed Recommendations */}
        <div className="lg:col-span-12 space-y-6">
          <h2 className="text-2xl font-medium tracking-tight">Actionable Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <div key={rec.id} className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black group-hover:bg-indigo-600 transition-colors text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-500">{rec.category}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getSeverityColor(rec.severity)}`}>
                    {rec.severity}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2 leading-snug">{rec.description}</h3>
                
                <div className="mt-auto pt-6">
                  <div className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Suggested Fix
                  </div>
                  <p className="text-sm text-indigo-900 leading-relaxed bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl shadow-inner">
                    {rec.suggestedFix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
