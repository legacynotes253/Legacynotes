import { useNotes, useDeleteNote } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Mail, Calendar } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function NotesList() {
  const { data: notes, isLoading } = useNotes();
  const { mutate: deleteNote } = useDeleteNote();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteNote(id, {
      onSuccess: () => {
        toast({ title: "Note deleted", description: "The note has been permanently removed." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete note.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-primary">My Notes</h1>
          <p className="text-muted-foreground mt-1">
            Secure messages waiting to be delivered.
          </p>
        </div>
        <Button asChild className="gap-2 shadow-md">
          <Link href="/notes/new">
            <Plus className="w-4 h-4" /> New Note
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-muted/10">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No notes created yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Write your first message to a loved one. It will remain encrypted and private until released.
          </p>
          <Button asChild>
            <Link href="/notes/new">Create Note</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="group bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between md:justify-start gap-4">
                  <h3 className="font-semibold text-lg text-foreground">{note.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 md:hidden">
                    Private
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {note.recipientEmail}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Created {format(new Date(note.createdAt!), "MMM d, yyyy")}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1 max-w-2xl">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <span className="hidden md:inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mr-2">
                  Encrypted & Private
                </span>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note for
                        <span className="font-medium text-foreground"> {note.recipientEmail}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(note.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
