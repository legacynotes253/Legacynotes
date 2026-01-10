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
import { ArrowLeft, Lock, Mail, Phone } from "lucide-react";
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
          title: "Note Secured",
          description: "Your message has been safely encrypted.",
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

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24 pt-12 px-6">
      <div className="flex flex-col gap-6">
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notes
          </Button>
        </Link>
        <div className="space-y-3">
          <h1 className="text-4xl font-serif text-primary">Compose Legacy</h1>
          <p className="text-muted-foreground font-light tracking-wide flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Your words are private, released only when you choose.
          </p>
        </div>
      </div>

      <div className="bg-white border border-border/60 rounded-sm p-10 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium uppercase tracking-widest text-muted-foreground/80">Recipient Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                        <Input placeholder="email@address.com" {...field} className="h-11 pl-10 border-border/50 focus-visible:ring-primary/20 bg-muted/30" />
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
                    <FormLabel className="text-sm font-medium uppercase tracking-widest text-muted-foreground/80">Recipient Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                        <Input placeholder="+1 234 567 890" {...field} className="h-11 pl-10 border-border/50 focus-visible:ring-primary/20 bg-muted/30" />
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
                  <FormLabel className="text-sm font-medium uppercase tracking-widest text-muted-foreground/80">Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="A final message..." {...field} className="h-11 border-border/50 focus-visible:ring-primary/20 bg-muted/30" />
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
                  <FormLabel className="text-sm font-medium uppercase tracking-widest text-muted-foreground/80">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="min-h-[300px] resize-none p-6 border-border/50 focus-visible:ring-primary/20 bg-muted/30 text-base leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isPending} className="px-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-sm transition-all shadow-md">
                {isPending ? "Securing..." : "Secure Note"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
