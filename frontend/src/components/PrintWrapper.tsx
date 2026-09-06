"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download } from "lucide-react";

export function PrintWrapper({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: "FlowSense_UX_Analysis_Report",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={(e) => {
            e.preventDefault();
            handlePrint();
          }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-md"
        >
          <Download className="w-5 h-5" /> Download Report (PDF)
        </button>
      </div>
      <div ref={contentRef} className="print:bg-[#F4F4F6] print:p-8 print:w-full">
        {children}
      </div>
    </div>
  );
}
