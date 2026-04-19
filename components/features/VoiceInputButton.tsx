'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  getSpeechRecognition,
  parseVoiceCommand,
  executeVoiceCommand,
  speak,
  VOICE_FEEDBACK,
  VoiceCommand,
} from '@/lib/features/voiceInput';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface VoiceInputButtonProps {
  onSearch?: (query: string) => void;
  onAdd?: (item: string) => void;
  onPlan?: (meal: string, day: string) => void;
  onNavigate?: (page: string) => void;
  onComplete?: (item: string) => void;
  onTranscript?: (transcript: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showFeedback?: boolean;
  className?: string;
}

export function VoiceInputButton({
  onSearch,
  onAdd,
  onPlan,
  onNavigate,
  onComplete,
  onTranscript,
  size = 'md',
  showFeedback = true,
  className,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast.error('Spraakherkenning wordt niet ondersteund in deze browser');
      return;
    }

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    try {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.lang = 'nl-NL';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        if (showFeedback) {
          toast.info(VOICE_FEEDBACK.START_LISTENING);
        }
      };

      recognition.onresult = (event: { resultIndex: number; results: { isFinal: boolean; [index: number]: { transcript: string } }[] }) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onTranscript?.(finalTranscript);
          handleCommand(finalTranscript);
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
        
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          toast.error(VOICE_FEEDBACK.ERROR);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start');
      toast.error('Kon spraakherkenning niet starten');
    }
  }, [isSupported, onTranscript, showFeedback]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleCommand = useCallback(async (text: string) => {
    const command = parseVoiceCommand(text);
    if (!command) return;

    const success = executeVoiceCommand(command, {
      onSearch: (query) => {
        onSearch?.(query);
        if (showFeedback) {
          speak(`${VOICE_FEEDBACK.SEARCHING} ${query}`);
        }
      },
      onAdd: (item) => {
        onAdd?.(item);
        if (showFeedback) {
          speak(`${VOICE_FEEDBACK.ADDED}: ${item}`);
        }
      },
      onPlan: (meal, day) => {
        onPlan?.(meal, day);
        if (showFeedback) {
          speak(`Gepland: ${meal} voor ${day}`);
        }
      },
      onNavigate: (page) => {
        onNavigate?.(page);
        if (showFeedback) {
          speak(`${VOICE_FEEDBACK.NAVIGATING} ${page}`);
        }
      },
      onComplete: (item) => {
        onComplete?.(item);
        if (showFeedback) {
          speak(`${item} afgevinkt`);
        }
      },
    });

    if (!success && showFeedback) {
      toast.info(VOICE_FEEDBACK.COMMAND_NOT_RECOGNIZED);
    }
  }, [onSearch, onAdd, onPlan, onNavigate, onComplete, showFeedback]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={isListening ? stopListening : startListening}
        className={cn(
          sizeClasses[size],
          'rounded-full flex items-center justify-center transition-all',
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-[#4A90A4] text-white hover:bg-[#3a7a8c]'
        )}
        aria-label={isListening ? 'Stop met luisteren' : 'Start spraakherkenning'}
      >
        {isListening ? (
          <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
        ) : (
          <Mic className={iconSizes[size]} />
        )}
      </button>

      {/* Listening indicator */}
      {isListening && transcript && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
          {transcript}
          <span className="animate-pulse">...</span>
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg whitespace-nowrap">
          Fout: {error}
        </div>
      )}
    </div>
  );
}

// Voice Command Help Component
interface VoiceCommandHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCommandHelp({ isOpen, onClose }: VoiceCommandHelpProps) {
  if (!isOpen) return null;

  const commands = [
    { example: 'Zoek pasta', description: 'Zoek naar recepten' },
    { example: 'Plan pasta voor morgen', description: 'Plan een maaltijd' },
    { example: 'Voeg kip toe', description: 'Voeg item toe aan boodschappen' },
    { example: 'Ga naar week', description: 'Navigeer naar pagina' },
    { example: 'Markeer diner als compleet', description: 'Vink maaltijd af' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Spraakcommando&apos;s
        </h3>
        <div className="space-y-3">
          {commands.map((cmd, index) => (
            <div key={index} className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-[#4A90A4] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">&quot;{cmd.example}&quot;</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{cmd.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-2 bg-[#4A90A4] text-white rounded-lg hover:bg-[#3a7a8c] transition-colors"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}
