import { useCreateNote } from "@/hooks/use-notes";
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
import { useLocation } from "wouter";
import { ArrowLeft, Lock, Mail, Phone, Sparkles, ChevronRight, PenTool, Paperclip, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useUpload } from "@/hooks/use-upload";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  recipientPhone: z.string().optional().or(z.literal("")),
  content: z.string().min(1, "Message content is required"),
}).refine((data) => data.recipientEmail || data.recipientPhone, {
  message: "Either recipient email or phone number must be provided",
  path: ["recipientEmail"],
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNote() {
  const { mutate: createNote, isPending } = useCreateNote();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  const { getUploadParameters } = useUpload();
  const [attachments, setAttachments] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      recipientEmail: "",
      recipientPhone: "",
      content: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createNote({ ...data, attachments }, {
      onSuccess: () => {
        toast({
          title: "Note Saved ✨",
          description: "Your secret message is safe and sound.",
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
    const fields = ["title", "recipientEmail", "recipientPhone"];
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

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
            {step === 1 ? "Note Details" : "Write Message"}
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary/40" />
            {step === 1 ? "Who gets the tea?" : "Spill the real tea here."}
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
                  </div>
                  
                  <div className="flex justify-end pt-6 pr-4">
                    <Button type="button" onClick={nextStep} className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all">
                      Next: Write Message <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
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
                                  maxNumberOfFiles={5}
                                  buttonClassName="h-9 px-4 rounded-full border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-sm transition-all flex items-center gap-2"
                                >
                                  <Paperclip className="w-4 h-4" /> Add Files
                                </ObjectUploader>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-6">
                    <Button type="button" variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-primary font-bold rounded-full">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                    </Button>
                    <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all">
                      {isPending ? "Securing..." : "Keep it Safe! ✨"}
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
