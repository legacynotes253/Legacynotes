import { useCheckIn } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Activity, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function CheckInButton({ lastCheckIn }: { lastCheckIn: string | Date }) {
  const { mutate: checkIn, isPending } = useCheckIn();
  const { toast } = useToast();

  const handleCheckIn = () => {
    checkIn(undefined, {
      onSuccess: () => {
        toast({
          title: "Checked In Successfully",
          description: "Your active status has been verified.",
        });
      },
      onError: () => {
        toast({
          title: "Check-in Failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/10 text-center">
      <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <Activity className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-serif font-medium text-primary mb-2">
        Verify Your Presence
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Confirm you are active to reset the release timer. Your last check-in was on{" "}
        <span className="font-medium text-foreground">
          {format(new Date(lastCheckIn), "MMM do, yyyy")}
        </span>
        .
      </p>
      <Button
        size="lg"
        onClick={handleCheckIn}
        disabled={isPending}
        className="w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        {isPending ? (
          "Verifying..."
        ) : (
          <>
            <Check className="mr-2 h-5 w-5" /> I'm Here & Active
          </>
        )}
      </Button>
    </div>
  );
}
