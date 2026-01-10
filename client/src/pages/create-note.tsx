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
          title: "Note Created",
          description: "Your message has been securely saved.",
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
    <div className="max-w-2xl mx-auto space-y-8 pb-16 pt-10 px-4">
      <div className="flex flex-col gap-4">
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notes
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-serif">Create Secure Note</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Locked securely. Released only when you're inactive.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Recipient Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                        <Input placeholder="email@example.com" {...field} className="pl-10" />
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
                    <FormLabel className="font-medium">Recipient Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                        <Input placeholder="+1 234 567 890" {...field} className="pl-10" />
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
                  <FormLabel className="font-medium">Title / Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Note subject..." {...field} />
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
                  <FormLabel className="font-medium">Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your message here..."
                      className="min-h-[250px] resize-y p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isPending} className="min-w-[140px]">
                {isPending ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
