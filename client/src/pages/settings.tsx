import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ShieldAlert, Clock, Info, Bell, Send, PalmTree } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";

const settingsSchema = z.object({
  checkInFrequencyDays: z.coerce.number().min(1).max(365),
  releaseDelayDays: z.coerce.number().min(1).max(90),
  notificationPhone: z.string().optional().or(z.literal("")),
  isVacationMode: z.boolean().default(false),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const { toast } = useToast();
  const [isSendingTest, setIsSendingTest] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      checkInFrequencyDays: 30,
      releaseDelayDays: 7,
      notificationPhone: "",
      isVacationMode: false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        checkInFrequencyDays: settings.checkInFrequencyDays,
        releaseDelayDays: settings.releaseDelayDays,
        notificationPhone: settings.notificationPhone || "",
        isVacationMode: settings.isVacationMode,
      });
    }
  }, [settings, form]);

  const handleSendTest = async () => {
    const phone = form.getValues("notificationPhone");
    if (!phone) {
      toast({
        title: "Phone Required",
        description: "Please enter a phone number first.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingTest(true);
    try {
      await apiRequest("POST", "/api/settings/test-reminder");
      toast({
        title: "Test Sent! 📱",
        description: "Check your phone for the reminder.",
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message || "Make sure you've set up Twilio.",
        variant: "destructive"
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const onSubmit = (data: SettingsValues) => {
    updateSettings(data, {
      onSuccess: () => {
        toast({
          title: "Settings Updated ✨",
          description: "Your reminder preferences have been saved.",
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
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Configure how and when your legacy notes are released.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-2 border-border/50 rounded-[2.5rem] shadow-none bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <PalmTree className="w-6 h-6 text-primary" />
                Vacation Mode
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Pause reminders and system activity while you're away.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-muted/30 p-6 rounded-[1.5rem] border-2 border-dashed border-border/10">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Activate Vacation Mode</h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    This will pause all check-in requirements until turned off.
                  </p>
                </div>
                <Switch 
                  checked={form.watch("isVacationMode")}
                  onCheckedChange={(checked) => form.setValue("isVacationMode", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 rounded-[2.5rem] shadow-none bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Bell className="w-6 h-6 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Where should we remind you to check in?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="notificationPhone" className="text-lg font-bold">Reminder Phone (SMS)</Label>
                  <span className="text-xs text-muted-foreground font-bold bg-muted px-3 py-1 rounded-full">Optional</span>
                </div>
                <div className="flex gap-3">
                  <Input
                    id="notificationPhone"
                    placeholder="+1 234 567 890"
                    {...form.register("notificationPhone")}
                    className="h-14 border-2 border-border/40 rounded-2xl focus-visible:ring-primary/10 bg-muted/20 text-lg font-medium flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleSendTest}
                    disabled={isSendingTest}
                    variant="outline"
                    className="h-14 rounded-2xl px-6 border-2 font-bold flex items-center gap-2 hover:bg-primary/5 transition-all"
                  >
                    {isSendingTest ? "Sending..." : "Test"} <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-muted/30 p-5 rounded-[1.5rem] text-sm text-muted-foreground flex items-start gap-3 border-2 border-dashed border-border/10">
                  <Info className="w-5 h-5 mt-0.5 shrink-0 text-primary/50" />
                  We'll send you an SMS reminder if you haven't checked in recently.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 rounded-[2.5rem] shadow-none bg-white">
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

          <Card className="border-2 border-border/50 rounded-[2.5rem] shadow-none bg-white">
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

          <div className="flex justify-end pt-4 pb-12">
            <Button type="submit" size="lg" disabled={isPending} className="px-12 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all">
              {isPending ? "Saving..." : "Save Settings ✨"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
