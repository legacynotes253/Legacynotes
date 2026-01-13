import { useNotes, useDeleteNote } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Mail, Calendar, Paperclip, Phone, Edit2, FolderHeart, Music, Image as ImageIcon, Video, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
  const [selectedFolder, setSelectedFolder] = useState<string>("All");

  const folders = ["All", ...Array.from(new Set(notes?.map(n => n.folder) || []))];
  const filteredNotes = selectedFolder === "All" 
    ? notes 
    : notes?.filter(n => n.folder === selectedFolder);

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
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/book">
            <Button variant="outline" className="gap-2 rounded-full h-11 px-6 border-2 hover:bg-primary/5 transition-all">
              <BookOpen className="w-4 h-4 text-primary" /> Read My Book
            </Button>
          </Link>
          <Button asChild className="gap-2 shadow-md rounded-full h-11 px-6">
            <Link href="/notes/new">
              <Plus className="w-4 h-4" /> New Note
            </Link>
          </Button>
        </div>
      </div>

      {!isLoading && (notes?.length || 0) > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {folders.map(folder => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
              className="rounded-full px-5 font-bold transition-all"
            >
              {folder}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-[2rem] bg-muted/5">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-bold mb-2">No notes created yet</h2>
          <p className="text-muted-foreground max-w-md mb-6 font-medium">
            Write your first message to a loved one. It will remain encrypted and private until released.
          </p>
          <Button asChild className="rounded-full h-12 px-8 font-bold">
            <Link href="/notes/new">Create Your First Note</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredNotes?.map((note) => (
            <div
              key={note.id}
              className="group bg-white border-2 border-border/40 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between md:justify-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border-2 border-primary/10">
                      <FolderHeart className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl text-primary">{note.title}</h3>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                    {note.folder || "General"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
                  {note.recipientEmail && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary/60" />
                      </div>
                      {note.recipientEmail}
                    </div>
                  )}
                  {note.recipientPhone && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary/60" />
                      </div>
                      {note.recipientPhone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary/60" />
                    </div>
                    <span>Created {format(new Date(note.createdAt!), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                      <Edit2 className="w-4 h-4 text-primary/60" />
                    </div>
                    <span>Last edited {format(new Date(note.lastEdited), "MMM d, yyyy HH:mm")}</span>
                  </div>
                </div>

                <div className="bg-muted/10 p-4 rounded-2xl">
                  <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed font-medium">
                    {note.content}
                  </p>
                </div>

                {note.attachments && note.attachments.length > 0 && (
                  <div className="flex flex-col gap-4 pt-2">
                    {/* Image Preview Grid */}
                    {note.attachments.some(url => url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i)) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {note.attachments
                          .filter(url => url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image/i))
                          .map((url, idx) => (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-border/10 relative group/img">
                              <img src={url} alt="Attachment" className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                              >
                                <ImageIcon className="w-6 h-6" />
                              </a>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Video Preview */}
                    {note.attachments.some(url => url.match(/\.(mp4|webm|ogg|mov)$/i)) && (
                      <div className="space-y-3">
                        {note.attachments
                          .filter(url => url.match(/\.(mp4|webm|ogg|mov)$/i))
                          .map((url, idx) => (
                            <div key={idx} className="aspect-video rounded-2xl overflow-hidden border-2 border-border/10 bg-black relative group/vid">
                              <video controls className="w-full h-full object-contain">
                                <source src={url} />
                                Your browser does not support the video element.
                              </video>
                              <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2 pointer-events-none">
                                <Video className="w-3 h-3 text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Video</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Audio Preview */}
                    {note.attachments.some(url => url.match(/\.(mp3|wav|ogg|m4a)$/i)) && (
                      <div className="space-y-2">
                        {note.attachments
                          .filter(url => url.match(/\.(mp3|wav|ogg|m4a)$/i))
                          .map((url, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-primary/5 border-2 border-primary/10 p-3 rounded-2xl">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Music className="w-5 h-5 text-primary" />
                              </div>
                              <audio controls className="h-8 flex-1">
                                <source src={url} />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Other Attachments */}
                    <div className="flex flex-wrap gap-2">
                      {note.attachments
                        .filter(url => !url.match(/\.(jpg|jpeg|png|gif|webp|mp3|wav|ogg|m4a|mp4|webm|mov)$|^data:image/i))
                        .map((url, idx) => (
                          <a 
                            key={idx} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Paperclip className="w-3 h-3" />
                            {url.split('/').pop()}
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="icon" className="w-11 h-11 rounded-full text-primary hover:text-primary hover:bg-primary/10 transition-all">
                  <Link href={`/notes/edit/${note.id}`}>
                    <Edit2 className="w-5 h-5" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem] border-2">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-serif text-primary">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-lg font-medium">
                        This action cannot be undone. This will permanently delete the note.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="rounded-full h-11 px-6 font-bold">Keep Note</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(note.id)} className="bg-destructive hover:bg-destructive/90 rounded-full h-11 px-8 font-bold">
                        Delete Forever
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
