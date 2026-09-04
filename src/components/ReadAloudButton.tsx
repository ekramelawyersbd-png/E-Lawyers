import { useState, useEffect, useRef } from 'react';
import { Volume2, Square, Pause, Play, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReadAloudButtonProps {
  content: string;
  title: string;
  className?: string;
}

export function ReadAloudButton({ content, title, className }: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        activeRef.current = false;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    setError(null);

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      // Basic markdown cleanup before reading
      const cleanContent = content
        .replace(/#/g, '')
        .replace(/\*/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/`/g, '');
      
      const textToRead = `${title}. \n\n${cleanContent}`;
      
      // Chunk text to avoid browser limits (e.g., Chrome's 15-second / length limit)
      const chunks = textToRead.match(/[^.!?\n]+[.!?\n]+/g) || [textToRead];
      let currentChunk = 0;
      activeRef.current = true;

      const speakNextChunk = () => {
        if (!activeRef.current || currentChunk >= chunks.length) {
          setIsPlaying(false);
          setIsPaused(false);
          activeRef.current = false;
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
        
        utterance.onend = () => {
          if (activeRef.current) {
            currentChunk++;
            speakNextChunk();
          }
        };

        utterance.onerror = (e) => {
          console.error('Speech synthesis error', e);
          // Only show error if it wasn't an intentional interruption
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            setError("Playback restricted in this view. Try opening the app in a new tab.");
          }
          activeRef.current = false;
          setIsPlaying(false);
          setIsPaused(false);
        };

        synth.speak(utterance);
      };

      synth.cancel(); // Cancel any existing speech
      setIsPlaying(true);
      setIsPaused(false);
      speakNextChunk();
    }
  };

  const handleStop = () => {
    if (!isSupported) return;
    activeRef.current = false;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isSupported) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1">
        <button
          onClick={handlePlayPause}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-sm",
            isPlaying 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          )}
          title={isPlaying ? (isPaused ? "Resume Reading" : "Pause Reading") : "Read Aloud"}
          type="button"
        >
          {isPlaying ? (
            isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
          {isPlaying ? (isPaused ? "Paused" : "Listen to Article") : "Listen to Article"}
        </button>
        
        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
            title="Stop Reading"
            type="button"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-md border border-rose-100 max-w-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
