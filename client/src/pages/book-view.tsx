import { useNotes } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Heart, Calendar, FolderHeart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function BookView() {
  const { data: notes, isLoading } = useNotes();

  if (isLoading) {
    return <div className="p-12 text-center font-bold">Opening your legacy book...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 pt-12 px-6">
      <div className="flex flex-col gap-4">
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Notes
          </Button>
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-primary flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary/20 animate-pulse" />
            My Legacy Book
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary/40" />
            All your written memories, in one place.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <motion.article
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Decorative line between notes */}
              {index !== 0 && (
                <div className="absolute -top-8 left-0 right-0 flex justify-center">
                  <div className="w-16 h-1 bg-border/20 rounded-full" />
                </div>
              )}

              <div className="bg-white border-2 border-border/40 rounded-[2.5rem] p-12 shadow-xl shadow-primary/5 relative overflow-hidden hover:border-primary/20 transition-all">
                {/* Book corner decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 opacity-40 group-hover:bg-primary/10 transition-colors" />
                
                <header className="mb-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                      <FolderHeart className="w-3 h-3" /> {note.folder || "General"}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> {format(new Date(note.createdAt || ""), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif text-foreground font-bold leading-tight">
                    {note.title}
                  </h2>
                </header>

                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground/80 leading-relaxed font-serif text-xl italic whitespace-pre-wrap">
                    "{note.content}"
                  </p>
                </div>

                <footer className="mt-10 pt-8 border-t-2 border-dashed border-border/20 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {note.recipientEmail?.[0]?.toUpperCase() || note.recipientPhone?.[0] || "?"}
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-foreground/60 uppercase tracking-wider">For</p>
                      <p className="text-muted-foreground font-medium">{note.recipientEmail || note.recipientPhone}</p>
                    </div>
                  </div>
                  
                  {note.attachments && (note.attachments as string[]).length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                      {(note.attachments as string[]).length} Memories Attached
                    </div>
                  )}
                </footer>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border/40">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-muted-foreground font-bold">Your book is empty...</h3>
            <p className="text-muted-foreground/60 mt-2">Start writing your first legacy note to see it here.</p>
            <Link href="/create">
              <Button className="mt-6 rounded-full font-bold px-8">Write Your First Note</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="text-center pt-12 pb-24">
        <div className="inline-flex items-center gap-4 text-muted-foreground/30">
          <div className="h-px w-24 bg-current" />
          <Heart className="w-6 h-6" />
          <div className="h-px w-24 bg-current" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground/40 italic">
          Your story continues...
        </p>
      </div>
    </div>
  );
}
