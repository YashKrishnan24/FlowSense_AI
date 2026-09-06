import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { History, CheckCircle2, ChevronRight, Activity } from "lucide-react";

const prisma = new PrismaClient();

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

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
    : 0;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 flex items-center gap-3">
          <History className="w-8 h-8 text-blue-600" />
          Audit History
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Review all your past UI analyses, track your UX progress, and revisit actionable feedback.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500">Total Audits</div>
            <div className="text-3xl font-black text-gray-900">{totalAnalyses}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500">Average UX Score</div>
            <div className="text-3xl font-black text-gray-900">{avgScore}</div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div>
        {analyses.length === 0 ? (
           <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <History className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">No audits yet</h3>
             <p className="text-gray-500 mb-8 max-w-md">You haven't run any UX analyses yet. Your entire history will appear here once you do.</p>
             <Link href="/dashboard/analyze" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
               Run your first audit
             </Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {analyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/dashboard/reports/${analysis.id}`}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group"
              >
                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group-hover:border-blue-300 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={analysis.screenshotUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      UX Analysis Report
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        {new Date(analysis.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {analysis.recommendations.length} issues found
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Overall Score</div>
                    <div className="text-3xl font-black text-gray-900">{analysis.overallScore}</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
