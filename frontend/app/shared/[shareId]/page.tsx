"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Sparkles, FileText } from "lucide-react";

export default function SharedNotePage({ params }: { params: Promise<{ shareId: string }> }) {
  const resolvedParams = use(params);
  const { shareId } = resolvedParams;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        // Assume backend has a route like GET /api/notes/shared/:shareId
        // We'll use a direct fetch or handle it accordingly.
        // For now, let's pretend the endpoint exists or we use the regular one if public
        const res = await api.get(`/notes/shared/${shareId}`);
        setNote(res.data.note);
      } catch (err: any) {
        setError("Note not found or is no longer public.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex justify-center">
        <div className="max-w-3xl w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <Skeleton className="h-12 w-3/4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-20 w-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Note Unavailable</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
            <div className="h-6 w-6 rounded flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              P
            </div>
            Peblo Shared Note
          </div>
          <span>•</span>
          <span>Last updated {format(new Date(note.updatedAt), "MMMM d, yyyy")}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8 sm:p-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
              {note.title || "Untitled"}
            </h1>
            
            <div 
              className="prose prose-slate dark:prose-invert max-w-none prose-lg"
              dangerouslySetInnerHTML={{ __html: note.content || "<p>No content</p>" }}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500 flex flex-col items-center gap-4">
          <p>Powered by Peblo AI Workspace</p>
          <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors font-medium">
            <Sparkles className="h-4 w-4" /> Create your own workspace
          </a>
        </div>
      </div>
    </div>
  );
}
