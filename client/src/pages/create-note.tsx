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
import { ArrowLeft, Lock, Mail, Phone, Sparkles } from "lucide-react";
import { Link } from "wouter";

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
    createNote(data, {
      onSuccess: () => {
        toast({
          title: "Note Saved! ✨",
          description: "Your secret message is safe and sound.",
        });
        setLocation("/notes");
      },
      onError: (error) => {
        toast({
          title: "Oops!",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24 pt-12 px-6">
      <div className="flex flex-col gap-4">
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="w-fit -ml-2 text-secondary hover:text-secondary/80 rounded-full hover:bg-secondary/10 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Notes
          </Button>
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-primary flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            Write a Secret Note
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-secondary" />
            Locked tight! Only shared when you're away.
          </p>
        </div>
      </div>

      <div className="bg-white border-4 border-dashed border-secondary/30 rounded-[2rem] p-10 shadow-xl shadow-secondary/5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-secondary-foreground/80">Who is it for? (Email)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-secondary/40" />
                        <Input placeholder="friend@school.com" {...field} className="h-14 pl-12 border-2 border-secondary/20 rounded-2xl focus-visible:ring-secondary/20 bg-muted/20 text-lg font-medium" />
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
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-secondary-foreground/80">Their Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-4 top-4 w-5 h-5 text-secondary/40" />
                        <Input placeholder="+1 234 567 890" {...field} className="h-14 pl-12 border-2 border-secondary/20 rounded-2xl focus-visible:ring-secondary/20 bg-muted/20 text-lg font-medium" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-secondary-foreground/80">Give it a Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A special secret..." {...field} className="h-14 border-2 border-secondary/20 rounded-2xl focus-visible:ring-secondary/20 bg-muted/20 text-lg font-medium" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold text-secondary-foreground/80">Your Secret Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your story here..."
                      className="min-h-[250px] resize-none p-6 border-2 border-secondary/20 rounded-[2rem] focus-visible:ring-secondary/20 bg-muted/20 text-lg leading-relaxed font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-6">
              <Button type="submit" size="lg" disabled={isPending} className="px-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                {isPending ? "Sharing..." : "Keep it Safe!"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
