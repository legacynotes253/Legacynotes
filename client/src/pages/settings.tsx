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
import { Slider } from "@/components/ui/slider";
import { ShieldAlert, Clock, Info } from "lucide-react";

const settingsSchema = z.object({
  checkInFrequencyDays: z.number().min(1).max(365),
  releaseDelayDays: z.number().min(1).max(90),
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
                  <Label>Every {form.watch("checkInFrequencyDays")} days</Label>
                  <span className="text-sm text-muted-foreground">Range: 1-365 days</span>
                </div>
                <Slider
                  min={1}
                  max={365}
                  step={1}
                  value={[form.watch("checkInFrequencyDays")]}
                  onValueChange={(val) => form.setValue("checkInFrequencyDays", val[0])}
                  className="py-4"
                />
                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  We will send you an email reminder to check in. If you miss a check-in, we will start the release countdown.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Release Delay
              </CardTitle>
              <CardDescription>
                Once we determine you are inactive, how long should we wait before releasing notes?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Wait {form.watch("releaseDelayDays")} days after inactivity</Label>
                  <span className="text-sm text-muted-foreground">Range: 1-90 days</span>
                </div>
                <Slider
                  min={1}
                  max={90}
                  step={1}
                  value={[form.watch("releaseDelayDays")]}
                  onValueChange={(val) => form.setValue("releaseDelayDays", val[0])}
                  className="py-4"
                />
                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  This is a grace period. During this time, we will attempt to contact you and your trusted contacts (if configured) daily.
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
