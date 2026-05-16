"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, FileText, MoreVertical, Archive, Share2, Trash2 } from "lucide-react";
import { api } from "@/services/api";
import { useNotesStore, Note } from "@/store/notesStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { notes, setNotes, isLoading, setLoading, removeNote } = useNotesStore();
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await api.get("/notes");
        setNotes(response.data.notes);
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [setNotes, setLoading]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      removeNote(id);
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold">All Notes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="mt-auto">
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeNotes = notes.filter(n => !n.isArchived);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">All Notes</h1>
        <Link href="/dashboard/notes/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Create Note</span>
          </Button>
        </Link>
      </div>

      {activeNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
          <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-slate-500 max-w-sm mb-6">
            Create your first note to start capturing ideas, meeting notes, and AI insights.
          </p>
          <Link href="/dashboard/notes/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Create your first note
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeNotes.map((note) => (
            <div 
              key={note.id} 
              className="group relative h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* handle share */ }}>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* handle archive */ }}>
                      <Archive className="mr-2 h-4 w-4" /> Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/dashboard/notes/${note.id}`} className="absolute inset-0 z-0" />
              
              <h3 className="font-semibold text-lg truncate pr-8 mb-2 relative z-10 pointer-events-none">
                {note.title || "Untitled"}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 relative z-10 pointer-events-none">
                {note.content ? note.content.replace(/<[^>]*>?/gm, '') : "No content"}
              </p>
              
              <div className="mt-auto flex items-center justify-between text-xs text-slate-400 relative z-10 pointer-events-none">
                <span>{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
                {note.isPublic && <Share2 className="h-3 w-3" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
