import React from "react";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { ArrowLeft, AlertTriangle, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import Link from "next/link";

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
                    className="absolute w-6 h-6 -ml-3 -mt-3 bg-black text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg ring-2 ring-white cursor-pointer hover:scale-110 transition-transform"
                    style={{ top, left }}
                    title={rec.category}
                  >
                    {idx + 1}
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
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Overall</div>
                <div className="text-3xl font-medium">{analysis.overallScore}/100</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Accessibility</div>
                <div className="text-3xl font-medium">{analysis.accessibilityScore}/100</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Visual Clarity</div>
                <div className="text-3xl font-medium">{analysis.visualClarityScore}/100</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Conversion</div>
                <div className="text-3xl font-medium">{analysis.conversionScore}/100</div>
              </div>
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

        </div>

        {/* Bottom Full-width: Detailed Recommendations */}
        <div className="lg:col-span-12 space-y-6">
          <h2 className="text-2xl font-medium tracking-tight">Actionable Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <div key={rec.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black text-white text-xs font-bold flex items-center justify-center rounded-full">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-500">{rec.category}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getSeverityColor(rec.severity)}`}>
                    {rec.severity}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">{rec.description}</h3>
                
                <div className="mt-auto pt-6">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Suggested Fix:</div>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
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
