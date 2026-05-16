"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "@/services/api";
import { useNotesStore } from "@/store/notesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Save, ArrowLeft, Loader2, Check } from "lucide-react";

export default function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { notes, updateNote, addNote } = useNotesStore();
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);

  const isNew = id === "new";
  const existingNote = notes.find((n) => n.id === id);

  const editor = useEditor({
    extensions: [StarterKit],
    content: existingNote?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      handleSave(title, editor.getHTML());
    },
  });

  useEffect(() => {
    if (!isNew && !existingNote) {
      // Fetch note if not in store
      const fetchNote = async () => {
        try {
          const res = await api.get(`/notes/${id}`);
          setTitle(res.data.note.title);
          editor?.commands.setContent(res.data.note.content);
        } catch (error) {
          console.error("Failed to fetch note");
        }
      };
      fetchNote();
    } else if (existingNote) {
      setTitle(existingNote.title);
    }
  }, [id, isNew, existingNote, editor]);

  // Debounced save
  const handleSave = useCallback(async (currentTitle: string, currentContent: string) => {
    setSaveStatus("saving");
    try {
      if (isNew) {
        // Debounce logic should actually prevent multiple creations. 
        // For simplicity, a manual save might be better for the first creation, 
        // but we'll simulate auto-save by creating it and redirecting to the new ID.
        // We will skip auto-save on 'new' until first manual interaction or just delay it.
      } else {
        await api.patch(`/notes/${id}`, {
          title: currentTitle,
          content: currentContent,
        });
        updateNote(id, { title: currentTitle, content: currentContent });
        setSaveStatus("saved");
      }
    } catch (error) {
      setSaveStatus("error");
    }
  }, [id, isNew, updateNote]);

  const saveInitialNewNote = async () => {
    if (!isNew) return;
    setSaveStatus("saving");
    try {
      const res = await api.post("/notes", {
        title: title || "Untitled",
        content: editor?.getHTML() || "",
      });
      addNote(res.data.note);
      router.replace(`/dashboard/notes/${res.data.note.id}`);
    } catch (error) {
      setSaveStatus("error");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!isNew) {
      handleSave(e.target.value, editor?.getHTML() || "");
    }
  };

  const generateSummary = async () => {
    if (isNew) {
      alert("Please save the note first before using AI");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post(`/ai/summarize/${id}`);
      setAiInsight({ type: "Summary", content: res.data.summary });
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200 dark:border-slate-800">
        {/* Editor Header */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {saveStatus === "saving" && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
              {saveStatus === "saved" && <><Check className="h-3 w-3" /> Saved</>}
              {saveStatus === "error" && <span className="text-red-500">Failed to save</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isNew && (
              <Button onClick={saveInitialNewNote} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-2" /> Save Note
              </Button>
            )}
          </div>
        </header>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note Title"
              className="text-4xl font-bold border-none px-0 focus-visible:ring-0 shadow-none bg-transparent h-auto"
            />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <aside className="w-full lg:w-80 bg-slate-50 dark:bg-slate-900/50 flex flex-col border-t lg:border-t-0 border-slate-200 dark:border-slate-800 h-64 lg:h-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 font-medium">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          AI Assistant
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={generateSummary} disabled={aiLoading || isNew} className="text-xs">
              {aiLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Summarize
            </Button>
            <Button variant="outline" size="sm" disabled={aiLoading || isNew} className="text-xs">
              Action Items
            </Button>
          </div>

          {aiInsight && (
            <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900/50 p-4 shadow-sm">
              <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                {aiInsight.type}
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiInsight.content}
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
