import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ShieldAlert, Clock, Info } from "lucide-react";

const settingsSchema = z.object({
  checkInFrequencyDays: z.coerce.number().min(1).max(365),
  releaseDelayDays: z.coerce.number().min(1).max(90),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const { toast } = useToast();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      checkInFrequencyDays: 30,
      releaseDelayDays: 7,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        checkInFrequencyDays: settings.checkInFrequencyDays,
        releaseDelayDays: settings.releaseDelayDays,
      });
    }
  }, [settings, form]);

  const onSubmit = (data: SettingsValues) => {
    updateSettings(data, {
      onSuccess: () => {
        toast({
          title: "Settings Updated",
          description: "Your preferences have been saved.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update settings.",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure how and when your legacy notes are released.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Check-In Frequency
              </CardTitle>
              <CardDescription>
                How often should we ask you to verify you are active?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="checkInFrequencyDays">Check-in every (days)</Label>
                  <span className="text-sm text-muted-foreground font-medium bg-muted px-2 py-1 rounded">Range: 1-365 days</span>
                </div>
                <Input
                  id="checkInFrequencyDays"
                  type="number"
                  min={1}
                  max={365}
                  {...form.register("checkInFrequencyDays")}
                  className="h-14 border-2 border-secondary/20 rounded-2xl focus-visible:ring-secondary/20 bg-muted/20 text-lg font-medium"
                />
                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground flex items-start gap-2 border border-border/50">
                  <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  We'll check in with you every {form.watch("checkInFrequencyDays") || 30} days.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-2 border-border/50 rounded-[2.5rem] shadow-none bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Clock className="w-6 h-6 text-primary" />
                Check-In Timing
              </CardTitle>
              <CardDescription className="text-base font-medium">
                How often should we ping you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="checkInFrequencyDays" className="text-lg font-bold">Check-in every (days)</Label>
                  <span className="text-xs text-muted-foreground font-bold bg-muted px-3 py-1 rounded-full">1-365 days</span>
                </div>
                <Input
                  id="checkInFrequencyDays"
                  type="number"
                  min={1}
                  max={365}
                  {...form.register("checkInFrequencyDays")}
                  className="h-14 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium"
                />
                <div className="bg-muted/30 p-5 rounded-[1.5rem] text-sm text-muted-foreground flex items-start gap-3 border-2 border-dashed border-border/10">
                  <Info className="w-5 h-5 mt-0.5 shrink-0 text-primary/50" />
                  We'll check in with you every {form.watch("checkInFrequencyDays") || 30} days.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-2 border-border/50 rounded-[2.5rem] shadow-none bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <ShieldAlert className="w-6 h-6 text-primary" />
                Release Wait Time
              </CardTitle>
              <CardDescription className="text-base font-medium">
                How long to wait before the release?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="releaseDelayDays" className="text-lg font-bold">Wait period (days)</Label>
                  <span className="text-xs text-muted-foreground font-bold bg-muted px-3 py-1 rounded-full">1-90 days</span>
                </div>
                <Input
                  id="releaseDelayDays"
                  type="number"
                  min={1}
                  max={90}
                  {...form.register("releaseDelayDays")}
                  className="h-14 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium"
                />
                <div className="bg-muted/30 p-5 rounded-[1.5rem] text-sm text-muted-foreground flex items-start gap-3 border-2 border-dashed border-border/10">
                  <Info className="w-5 h-5 mt-0.5 shrink-0 text-primary/50" />
                  Notes will be shared {form.watch("releaseDelayDays") || 7} days after a missed check-in.
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
