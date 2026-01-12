import { useState, useRef } from "react";
import RecordRTC from "recordrtc";
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
      });
      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (err) {
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        // Stop stream
        const stream = (recorderRef.current as any).stream;
        if (stream) {
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
      });
    }
  };

  const handleKeep = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" /> Record a Voice Note
        </h4>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-bold text-destructive">Recording...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording && !audioUrl && (
          <Button 
            type="button" 
            onClick={startRecording}
            className="rounded-full bg-primary hover:bg-primary/90 font-bold"
          >
            <Mic className="w-4 h-4 mr-2" /> Start Recording
          </Button>
        )}

        {isRecording && (
          <Button 
            type="button" 
            variant="destructive"
            onClick={stopRecording}
            className="rounded-full font-bold"
          >
            <Square className="w-4 h-4 mr-2" /> Stop
          </Button>
        )}

        {audioUrl && (
          <div className="flex flex-col gap-3 w-full">
            <audio src={audioUrl} controls className="w-full h-10" />
            <div className="flex gap-2">
              <Button 
                type="button" 
                onClick={handleKeep}
                className="flex-1 rounded-full bg-primary hover:bg-primary/90 font-bold"
              >
                <Check className="w-4 h-4 mr-2" /> Use Recording
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                }}
                className="rounded-full font-bold"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
