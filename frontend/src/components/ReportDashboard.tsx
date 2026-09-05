"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Recommendation {
  severity: "Critical" | "Moderate" | "Minor";
  impact: "High" | "Medium" | "Low";
  category: string;
  description: string;
  suggested_fix: string;
  marker_x?: number;
  marker_y?: number;
}

export interface UXReport {
  overall_score: number;
  accessibility_score: number;
  visual_clarity_score: number;
  conversion_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
}

interface ReportDashboardProps {
  report: UXReport;
  imageFile?: File | null;
}

const ScoreRing = ({ score, label }: { score: number; label: string }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const colorClass = score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center glass-panel p-4 rounded-2xl glow-primary">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={colorClass}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-400 font-medium text-center">{label}</span>
    </div>
  );
};

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ report, imageFile }) => {
  const [activeRec, setActiveRec] = useState<number | null>(null);
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'moderate': return <AlertTriangle className="w-4 h-4" />;
      case 'minor': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreRing score={report.overall_score} label="Overall Score" />
        <ScoreRing score={report.accessibility_score} label="Accessibility" />
        <ScoreRing score={report.visual_clarity_score} label="Visual Clarity" />
        <ScoreRing score={report.conversion_score} label="Conversion" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image Overlay */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Info className="text-primary" /> Analyzed Image
          </h2>
          <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/20 group">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Analyzed UI" className="w-full object-contain bg-black" />
            )}
            
            {/* Markers */}
            {report.recommendations.map((rec, idx) => {
              if (rec.marker_x === undefined || rec.marker_y === undefined) return null;
              if (rec.marker_x === null || rec.marker_y === null) return null;
              
              const isHovered = activeRec === idx;
              return (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    left: `${rec.marker_x * 100}%`,
                    top: `${rec.marker_y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setActiveRec(idx)}
                  onMouseLeave={() => setActiveRec(null)}
                >
                  <div className="relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${isHovered ? 'scale-125 z-10' : 'scale-100'}`}>
                      <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${getSeverityColor(rec.severity).split(' ')[0]}`} />
                      <div className={`relative w-4 h-4 rounded-full border-2 ${getSeverityColor(rec.severity).split(' ')[2]} ${getSeverityColor(rec.severity).split(' ')[0]}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" /> Strengths
              </h3>
              <ul className="space-y-2">
                {report.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-panel p-5 rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-400">
                <XCircle className="w-5 h-5" /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {report.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex-1">
            <h3 className="text-lg font-semibold mb-4 text-primary">Recommendations</h3>
            <div className="space-y-3">
              {report.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${activeRec === idx ? 'bg-white/5 border-primary/50 glow-primary' : 'bg-transparent'}`}
                  onMouseEnter={() => setActiveRec(idx)}
                  onMouseLeave={() => setActiveRec(null)}
                >
                  <div className="p-4 flex flex-col gap-2 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-100 pr-2">{rec.description}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 whitespace-nowrap ${getSeverityColor(rec.severity)}`}>
                        {getSeverityIcon(rec.severity)}
                        {rec.severity}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                      <span className="bg-black/30 px-2 py-1 rounded border border-white/10">Category: {rec.category}</span>
                      <span className="bg-black/30 px-2 py-1 rounded border border-white/10">Impact: {rec.impact}</span>
                    </div>

                    <div className="mt-3 bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-blue-200">
                      <strong>Fix:</strong> {rec.suggested_fix}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
