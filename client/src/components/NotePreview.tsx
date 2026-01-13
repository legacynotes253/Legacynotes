import { motion } from "framer-motion";
import { Mail, Phone, Lock, Eye, KeyRound, HelpCircle, FileAudio, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotePreviewProps {
  title: string;
  content: string;
  recipientEmail?: string;
  recipientPhone?: string;
  attachments?: string[];
  accessCode?: string;
  accessHint?: string;
  mode: "email" | "sms";
}

export function NotePreview({
  title,
  content,
  recipientEmail,
  recipientPhone,
  attachments = [],
  accessCode,
  accessHint,
  mode
}: NotePreviewProps) {
  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);
  const isAudio = (url: string) => /\.(mp3|wav|ogg|m4a)$/i.test(url);

  const previewText = content.length > 150 ? content.substring(0, 150) + "..." : content;

  if (mode === "sms") {
    return (
      <div className="flex flex-col gap-2 max-w-[280px] mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Phone className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-xs font-bold text-muted-foreground">LegacyNotes</span>
        </div>
        <div className="bg-[#E9E9EB] dark:bg-[#262629] text-black dark:text-white p-4 rounded-[1.5rem] rounded-bl-sm shadow-sm">
          <p className="text-[15px] leading-tight font-medium">
            {title}: "{previewText}"
          </p>
          <p className="text-[13px] mt-2 text-primary font-bold">
            View full note & {attachments.length} attachments:
          </p>
          <p className="text-[13px] text-blue-500 underline break-all">
            legacynotes.app/v/secure-link
          </p>
          {accessCode && (
            <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1.5 text-[12px] opacity-70">
              <Lock className="w-3 h-3" /> Secure code required
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] border-2 border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="bg-white border-b-2 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">LegacyNotes Delivery</h4>
            <p className="text-xs text-muted-foreground">To: {recipientEmail || "recipient@example.com"}</p>
          </div>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground/40 bg-muted/20 px-2 py-1 rounded-full">
          PREVIEW MODE
        </div>
      </div>

      <div className="p-8 space-y-6 bg-white m-4 rounded-[1.5rem] shadow-inner">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif text-primary font-bold">{title}</h2>
          <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-lg leading-relaxed text-foreground/80 italic font-serif">
            "{previewText}"
          </p>
          {content.length > 150 && (
            <p className="text-sm text-primary font-bold flex items-center gap-1">
              <Eye className="w-4 h-4" /> Click the link below to read the full message...
            </p>
          )}
        </div>

        {attachments.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Play className="w-4 h-4" /> Media Gallery ({attachments.length} items)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {attachments.slice(0, 3).map((url, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden border-2 border-white shadow-sm">
                  {isImage(url) ? (
                    <img src={url} className="w-full h-full object-cover" />
                  ) : isVideo(url) ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <Play className="w-6 h-6 text-primary/40" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <FileAudio className="w-6 h-6 text-primary/40" />
                    </div>
                  )}
                </div>
              ))}
              {attachments.length > 3 && (
                <div className="aspect-square rounded-xl bg-primary/5 flex items-center justify-center border-2 border-dashed border-primary/20">
                  <span className="text-primary font-bold">+{attachments.length - 3} more</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-6 text-center">
          <Button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 font-bold shadow-lg">
            Unlock Full Message
          </Button>
          {accessCode && (
            <div className="mt-4 p-4 bg-muted/30 rounded-2xl border-2 border-dashed border-border/40 inline-block">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
                <KeyRound className="w-4 h-4 text-primary" /> Security Hint
              </div>
              <p className="text-xs text-muted-foreground italic">"{accessHint || "No hint provided"}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
        Sent securely via LegacyNotes
      </div>
    </div>
  );
}
