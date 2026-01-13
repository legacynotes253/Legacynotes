import { useNotes, useUpdateNote } from "@/hooks/use-notes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Lock, Mail, Phone, Sparkles, ChevronRight, PenTool, Paperclip, X, FolderHeart, Mic, KeyRound, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ObjectUploader } from "@/components/ObjectUploader";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { NotePreview } from "@/components/NotePreview";
import { useUpload } from "@/hooks/use-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  recipientPhone: z.string().optional().or(z.literal("")),
  content: z.string().min(1, "Message content is required"),
  folder: z.string().default("General"),
  accessCode: z.string().optional().or(z.literal("")),
  accessHint: z.string().optional().or(z.literal("")),
}).refine((data) => data.recipientEmail || data.recipientPhone, {
  message: "Either recipient email or phone number must be provided",
  path: ["recipientEmail"],
});

type FormValues = z.infer<typeof formSchema>;

export default function EditNote() {
  const { id } = useParams();
  const { data: notes, isLoading: isLoadingNotes } = useNotes();
  const { mutate: updateNote, isPending } = useUpdateNote();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState<"email" | "sms">("email");

  const { getUploadParameters } = useUpload();
  const [attachments, setAttachments] = useState<string[]>([]);

  const note = notes?.find(n => n.id === Number(id));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      recipientEmail: "",
      recipientPhone: "",
      content: "",
      folder: "General",
      accessCode: "",
      accessHint: "",
    },
  });

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        recipientEmail: note.recipientEmail || "",
        recipientPhone: note.recipientPhone || "",
        content: note.content,
        folder: note.folder || "General",
        accessCode: note.accessCode || "",
        accessHint: note.accessHint || "",
      });
      setAttachments(note.attachments || []);
    }
  }, [note, form]);

  const onSubmit = (data: FormValues) => {
    if (!id) return;
    updateNote({ id: Number(id), data: { ...data, attachments } }, {
      onSuccess: () => {
        toast({
          title: "Note Updated ✨",
          description: "Your changes have been saved securely.",
        });
        setLocation("/notes");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const nextStep = async () => {
    const fields = step === 1 
      ? ["title", "recipientEmail", "recipientPhone"]
      : ["content"];
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  if (isLoadingNotes) return <div className="p-12 text-center font-bold">Loading note...</div>;
  if (!note) return <div className="p-12 text-center font-bold">Note not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 pt-12 px-6">
      <div className="flex flex-col gap-4">
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/5 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Notes
          </Button>
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-primary flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary/20 animate-pulse" />
            {step === 1 ? "Edit Note" : step === 2 ? "Update Message" : "Preview Delivery"}
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary/40" />
            {step === 1 ? "Update the details." : step === 2 ? "Refine your message." : "How they'll see your update."}
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-border/50 rounded-[2.5rem] p-10 shadow-xl shadow-primary/5 min-h-[500px] relative overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 h-full">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 gap-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-lg font-bold text-foreground/80">Title / Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="A special message..." {...field} className="h-14 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-lg font-bold text-foreground/80">Recipient Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-4 w-5 h-5 text-muted-foreground/30" />
                              <Input placeholder="lovedone@example.com" {...field} className="h-14 pl-12 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium w-full" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipientPhone"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-lg font-bold text-foreground/80">Recipient Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-4 top-4 w-5 h-5 text-muted-foreground/30" />
                              <Input placeholder="+1 234 567 890" {...field} className="h-14 pl-12 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium w-full" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="folder"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-lg font-bold text-foreground/80 flex items-center gap-2">
                            <FolderHeart className="w-5 h-5 text-primary/60" /> Folder
                          </FormLabel>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-14 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium w-full">
                                    <SelectValue placeholder="Select a folder" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-2xl border-2">
                                  <SelectItem value="General">General</SelectItem>
                                  <SelectItem value="Family">Family</SelectItem>
                                  <SelectItem value="Friends">Friends</SelectItem>
                                  <SelectItem value="Work">Work</SelectItem>
                                  <SelectItem value="Custom">Other (Custom)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {field.value === "Custom" || !["General", "Family", "Friends", "Work"].includes(field.value) ? (
                            <div className="mt-3">
                              <Input 
                                placeholder="Enter custom folder name..." 
                                value={field.value === "Custom" ? "" : field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="h-12 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium w-full"
                              />
                            </div>
                          ) : null}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-6 pt-4 border-t-2 border-dashed border-border/20">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                          <KeyRound className="w-5 h-5" /> Security Access
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium">
                          Optional: Protect this note with a code and provide a hint for your loved one.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="accessCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold">Access Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Secret code..." {...field} className="h-12 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accessHint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold">Hint for Recipient</FormLabel>
                              <FormControl>
                                <Input placeholder="Something they would know..." {...field} className="h-12 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-6 pr-4">
                    <Button type="button" onClick={nextStep} className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all">
                      Next: Edit Message <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-bold text-foreground/80 flex items-center gap-2">
                          <PenTool className="w-5 h-5" /> Your Secret Message
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Write your story here..."
                              className="min-h-[200px] resize-none p-6 border-2 border-border/40 rounded-[2.5rem] focus-visible:ring-primary/10 bg-muted/20 text-lg leading-relaxed font-medium"
                              {...field}
                            />
                            
                            <div className="space-y-3">
                              <FormLabel className="text-sm font-bold text-foreground/60 flex items-center gap-2">
                                <Paperclip className="w-4 h-4" /> Attachments (Optional)
                              </FormLabel>
                              
                              <div className="flex flex-wrap gap-2">
                                {attachments.map((url, index) => (
                                  <div key={index} className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full text-sm font-medium text-primary">
                                    <span className="max-w-[150px] truncate">{url.split('/').pop()}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                                      className="hover:text-primary/70 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                
                                <ObjectUploader
                                  onGetUploadParameters={getUploadParameters}
                                  onComplete={(result) => {
                                    if (result.successful) {
                                      const newUrls = result.successful
                                        .map(f => (f.response?.body as any)?.objectPath || f.uploadURL)
                                        .filter((url): url is string => typeof url === 'string');
                                      setAttachments(prev => [...prev, ...newUrls]);
                                    }
                                  }}
                                  maxNumberOfFiles={15}
                                  buttonClassName="h-9 px-4 rounded-full border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-sm transition-all flex items-center gap-2"
                                >
                                  <Paperclip className="w-4 h-4" /> Add Photos, Videos, or Music
                                </ObjectUploader>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <FormLabel className="text-sm font-bold text-foreground/60 flex items-center gap-2">
                                <Mic className="w-4 h-4" /> Record Voice Note
                              </FormLabel>
                              <VoiceRecorder 
                                onRecordingComplete={async (blob) => {
                                  try {
                                    const file = new File([blob], `voice-note-${Date.now()}.wav`, { type: 'audio/wav' });
                                    const params = await getUploadParameters(file as any);
                                    
                                    const response = await fetch(params.url, {
                                      method: params.method,
                                      body: blob,
                                      headers: params.headers
                                    });

                                    if (response.ok) {
                                      const url = new URL(params.url);
                                      const publicUrl = `${url.origin}${url.pathname}`;
                                      setAttachments(prev => [...prev, publicUrl]);
                                      toast({
                                        title: "Voice Note Added",
                                        description: "Your recording has been uploaded successfully."
                                      });
                                    }
                                  } catch (err) {
                                    toast({
                                      title: "Upload Failed",
                                      description: "Could not save your voice note.",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-6 max-w-2xl mx-auto">
                    <Button type="button" variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-primary font-bold rounded-full">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all">
                      Next: Preview Note <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-center gap-4 bg-muted/20 p-2 rounded-full w-fit mx-auto border-2">
                      <Button
                        type="button"
                        variant={previewMode === "email" ? "default" : "ghost"}
                        onClick={() => setPreviewMode("email")}
                        className="rounded-full font-bold px-6"
                        size="sm"
                      >
                        <Mail className="w-4 h-4 mr-2" /> Email Preview
                      </Button>
                      <Button
                        type="button"
                        variant={previewMode === "sms" ? "default" : "ghost"}
                        onClick={() => setPreviewMode("sms")}
                        className="rounded-full font-bold px-6"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-2" /> SMS Preview
                      </Button>
                    </div>

                    <div className="max-w-xl mx-auto w-full">
                      <NotePreview
                        title={form.getValues("title")}
                        content={form.getValues("content")}
                        recipientEmail={form.getValues("recipientEmail")}
                        recipientPhone={form.getValues("recipientPhone")}
                        attachments={attachments}
                        accessCode={form.getValues("accessCode")}
                        accessHint={form.getValues("accessHint")}
                        mode={previewMode}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 max-w-2xl mx-auto border-t-2 border-dashed border-border/20">
                    <Button type="button" variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-primary font-bold rounded-full">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Edit Message
                    </Button>
                    <Button type="submit" disabled={isPending} className="px-12 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                      {isPending ? "Updating..." : "Save Changes ✨"}
                      <Sparkles className="w-6 h-6" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </div>
    </div>
  );
}
