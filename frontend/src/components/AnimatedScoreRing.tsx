"use client";

import React, { useEffect, useState } from "react";

interface AnimatedScoreRingProps {
  score: number | null;
  label: string;
}

export function AnimatedScoreRing({ score, label }: AnimatedScoreRingProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const displayScore = score ?? 0;

  useEffect(() => {
    // Simple animation: ease up to the target score
    const duration = 1000; // 1 second
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCurrentScore(Math.round(displayScore * easeProgress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setCurrentScore(displayScore);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [displayScore]);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  let colorClass = "text-red-500";
  if (displayScore >= 80) colorClass = "text-green-500";
  else if (displayScore >= 50) colorClass = "text-yellow-500";

  return (
    <div className="p-5 bg-gray-50/80 rounded-3xl flex flex-col items-center justify-center border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="text-sm font-medium text-gray-500 mb-3">{label}</div>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-300 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-gray-900">{currentScore}</span>
        </div>
      </div>
    </div>
  );
}
