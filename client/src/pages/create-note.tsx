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
          title: "Note Locked In 🔒",
          description: "Your digital time capsule is ready.",
        });
        setLocation("/notes");
      },
      onError: (error) => {
        toast({
          title: "Vibe Check Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 pt-8">
      <div className="flex flex-col gap-4">
        <Link href="/notes">
          <Button variant="outline" size="sm" className="w-fit border-2 border-black neo-shadow hover:shadow-none transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notes
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-primary italic">Create Secure Note</h1>
          <p className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Locked in. Released only when you're offline.
          </p>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-8 neo-shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-black uppercase flex items-center gap-2">
                      <Mail className="w-5 h-5" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="bestie@example.com" {...field} className="h-14 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg font-medium" />
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
                    <FormLabel className="text-xl font-black uppercase flex items-center gap-2">
                      <Phone className="w-5 h-5" /> Phone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} className="h-14 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg font-medium" />
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
                  <FormLabel className="text-xl font-black uppercase">Title / Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="The real tea..." {...field} className="h-14 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg font-medium" />
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
                  <FormLabel className="text-xl font-black uppercase">Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Spill here..."
                      className="min-h-[250px] resize-y p-6 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg leading-relaxed font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isPending} className="h-20 px-12 text-2xl font-black uppercase italic tracking-widest border-4 border-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-none neo-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                {isPending ? "Locking..." : "Lock In Note"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
