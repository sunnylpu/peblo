"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            P
          </div>
          <span className="font-bold text-xl tracking-tight">Peblo</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-200 dark:shadow-indigo-900">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            AI-Powered Notes Workspace
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 pb-2">
            Write, Think, and Build<br className="hidden md:block"/> at the Speed of Thought.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A modern, collaborative notes workspace that leverages AI to summarize, extract action items, and organize your thoughts instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 w-full sm:w-auto">
                Start Writing for Free
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-slate-200 dark:border-slate-800">
                Watch Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 md:p-4 shadow-2xl overflow-hidden"
        >
          <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            {/* Abstract representation of the app dashboard */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="flex w-full h-full">
              <div className="w-64 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:block">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-8" />
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  ))}
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20" />
                   <div className="h-32 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Peblo AI. All rights reserved.
      </footer>
    </div>
  );
}
