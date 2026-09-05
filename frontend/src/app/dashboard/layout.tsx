"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-50 shadow-sm transition-all">
        <div className="flex items-center w-full max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mr-8 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3 font-extrabold tracking-tighter text-xl text-black">
              <img src="/bg-logo.png" alt="Logo" className="w-9 h-9 object-contain" onError={(e) => (e.currentTarget.style.display='none')} />
              FlowSense
            </Link>
          </motion.div>
          
          <nav className="flex items-center gap-2 text-[15px] font-semibold text-gray-500">
            <motion.div whileHover={{ scale: 1.05, color: "#000" }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/dashboard" 
                className={`px-4 py-2 rounded-lg transition-all ${pathname === "/dashboard" ? "bg-gray-100 text-black border border-gray-200 shadow-sm" : "hover:text-black hover:bg-gray-50"}`}
              >
                Overview
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, color: "#000" }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/dashboard/analyze" 
                className={`px-4 py-2 rounded-lg transition-all ${pathname === "/dashboard/analyze" ? "bg-gray-100 text-black border border-gray-200 shadow-sm" : "hover:text-black hover:bg-gray-50"}`}
              >
                New Audit
              </Link>
            </motion.div>
          </nav>
          
          <div className="ml-auto flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UserButton />
            </motion.div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        {children}
      </main>
      
      {/* Dashboard Footer */}
      <footer className="border-t border-gray-200 bg-white/50 py-10 px-6 mt-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 font-bold tracking-tighter text-lg text-black mb-1">
              <img src="/bg-logo.png" alt="Logo" className="w-5 h-5 object-contain" onError={(e) => (e.currentTarget.style.display='none')} />
              FlowSense
            </div>
            <p className="text-sm text-gray-500">AI-powered UX feedback for better interfaces.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/dashboard" className="hover:text-black transition-colors">Overview</Link>
            <Link href="/dashboard/analyze" className="hover:text-black transition-colors">New Audit</Link>
            <Link href="/dashboard" className="hover:text-black transition-colors">History</Link>
            <Link href="/dashboard" className="hover:text-black transition-colors">Settings</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-2">
          <p>© 2026 FlowSense</p>
          <p>Built for better digital experiences.</p>
        </div>
      </footer>
    </div>
  );
}
