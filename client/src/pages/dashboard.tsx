import { useSettings } from "@/hooks/use-settings";
import { useNotes } from "@/hooks/use-notes";
import { CheckInButton } from "@/components/check-in-button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Calendar, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { format, addDays, differenceInDays } from "date-fns";

export default function Dashboard() {
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { data: notes, isLoading: isLoadingNotes } = useNotes();

  if (isLoadingSettings || isLoadingNotes) {
    return <DashboardSkeleton />;
  }

  if (!settings) return null;

  const nextCheckInDue = addDays(
    new Date(settings.lastCheckIn),
    settings.checkInFrequencyDays
  );

  const daysUntilDue = differenceInDays(nextCheckInDue, new Date());

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-primary">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your status and manage your legacy.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <StatusBadge status={settings.status as any} />
        </div>
      </div>

      {/* Main Action Area */}
      <CheckInButton lastCheckIn={settings.lastCheckIn} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="paper-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" /> Next Check-In Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {format(nextCheckInDue, "MMM do")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : "Overdue"}
            </p>
          </CardContent>
        </Card>

        <Card className="paper-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              Every {settings.checkInFrequencyDays} Days
            </div>
            <Link href="/settings" className="text-xs text-primary hover:underline mt-1 inline-block">
              Adjust frequency
            </Link>
          </CardContent>
        </Card>

        <Card className="paper-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" /> Secured Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {notes?.length || 0}
            </div>
            <Link href="/notes" className="text-xs text-primary hover:underline mt-1 inline-block">
              View all notes
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-primary">Recent Notes</h2>
          <Button asChild size="sm" variant="outline" className="gap-2">
            <Link href="/notes/new">
              <Plus className="w-4 h-4" /> Create Note
            </Link>
          </Button>
        </div>

        {notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.slice(0, 3).map((note) => (
              <Link key={note.id} href={`/notes`}>
                <div className="group relative bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium text-primary">View</span>
                  </div>
                  <h3 className="font-medium text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{note.recipientEmail}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                    {note.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/20">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No notes yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first secure note to be delivered to a loved one.
            </p>
            <Button asChild>
              <Link href="/notes/new">Create First Note</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  );
}
