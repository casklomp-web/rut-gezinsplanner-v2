/**
 * Voice Input Utilities
 * Feature 6: Spraak naar tekst voor zoeken, voice commands
 */

export interface VoiceCommand {
  command: string;
  action: 'search' | 'add' | 'plan' | 'navigate' | 'complete';
  params: Record<string, string>;
}

export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  supported: boolean;
}

// Check if browser supports speech recognition
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

// Get the SpeechRecognition constructor
export function getSpeechRecognition(): (new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: { isFinal: boolean; [index: number]: { transcript: string } }[] }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => unknown;
    webkitSpeechRecognition?: new () => unknown;
  };
  return (w.SpeechRecognition || w.webkitSpeechRecognition) as ReturnType<typeof getSpeechRecognition>;
}

// Voice command patterns (Dutch)
const COMMAND_PATTERNS: { pattern: RegExp; action: VoiceCommand['action']; extractParams: (match: RegExpMatchArray) => Record<string, string> }[] = [
  {
    pattern: /plan\s+(\w+)\s+voor\s+(\w+)/i,
    action: 'plan',
    extractParams: (match) => ({ meal: match[1], day: match[2] }),
  },
  {
    pattern: /zoek\s+(.+)/i,
    action: 'search',
    extractParams: (match) => ({ query: match[1] }),
  },
  {
    pattern: /zoek\s+naar\s+(.+)/i,
    action: 'search',
    extractParams: (match) => ({ query: match[1] }),
  },
  {
    pattern: /voeg\s+(.+)\s+toe/i,
    action: 'add',
    extractParams: (match) => ({ item: match[1] }),
  },
  {
    pattern: /ga\s+naar\s+(.+)/i,
    action: 'navigate',
    extractParams: (match) => ({ page: match[1] }),
  },
  {
    pattern: /open\s+(.+)/i,
    action: 'navigate',
    extractParams: (match) => ({ page: match[1] }),
  },
  {
    pattern: /markeer\s+(.+)\s+als\s+compleet/i,
    action: 'complete',
    extractParams: (match) => ({ item: match[1] }),
  },
  {
    pattern: /afgevinkt\s+(.+)/i,
    action: 'complete',
    extractParams: (match) => ({ item: match[1] }),
  },
];

// Day name mappings (Dutch)
const DAY_MAPPINGS: Record<string, string> = {
  'maandag': 'monday',
  'dinsdag': 'tuesday',
  'woensdag': 'wednesday',
  'donderdag': 'thursday',
  'vrijdag': 'friday',
  'zaterdag': 'saturday',
  'zondag': 'sunday',
  'morgen': 'tomorrow',
  'vandaag': 'today',
};

// Page name mappings
const PAGE_MAPPINGS: Record<string, string> = {
  'week': '/week',
  'weekoverzicht': '/week',
  'boodschappen': '/shopping',
  'boodschappenlijst': '/shopping',
  'recepten': '/recipes',
  'instellingen': '/settings',
  'profiel': '/profile',
  'geschiedenis': '/history',
  'vandaag': '/',
  'home': '/',
};

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  const normalizedTranscript = transcript.toLowerCase().trim();

  for (const { pattern, action, extractParams } of COMMAND_PATTERNS) {
    const match = normalizedTranscript.match(pattern);
    if (match) {
      const params = extractParams(match);
      
      // Normalize day names
      if (params.day) {
        const normalizedDay = DAY_MAPPINGS[params.day.toLowerCase()];
        if (normalizedDay) {
          params.day = normalizedDay;
        }
      }

      // Normalize page names
      if (params.page) {
        const normalizedPage = PAGE_MAPPINGS[params.page.toLowerCase()];
        if (normalizedPage) {
          params.page = normalizedPage;
        }
      }

      return { command: transcript, action, params };
    }
  }

  // Default to search if no pattern matches
  return {
    command: transcript,
    action: 'search',
    params: { query: transcript },
  };
}

export function executeVoiceCommand(
  command: VoiceCommand,
  handlers: {
    onSearch?: (query: string) => void;
    onAdd?: (item: string) => void;
    onPlan?: (meal: string, day: string) => void;
    onNavigate?: (page: string) => void;
    onComplete?: (item: string) => void;
  }
): boolean {
  switch (command.action) {
    case 'search':
      if (handlers.onSearch && command.params.query) {
        handlers.onSearch(command.params.query);
        return true;
      }
      break;
    case 'add':
      if (handlers.onAdd && command.params.item) {
        handlers.onAdd(command.params.item);
        return true;
      }
      break;
    case 'plan':
      if (handlers.onPlan && command.params.meal && command.params.day) {
        handlers.onPlan(command.params.meal, command.params.day);
        return true;
      }
      break;
    case 'navigate':
      if (handlers.onNavigate && command.params.page) {
        handlers.onNavigate(command.params.page);
        return true;
      }
      break;
    case 'complete':
      if (handlers.onComplete && command.params.item) {
        handlers.onComplete(command.params.item);
        return true;
      }
      break;
  }
  return false;
}

// Speech synthesis for feedback
export function speak(text: string, lang: string = 'nl-NL'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Common voice feedback messages (Dutch)
export const VOICE_FEEDBACK = {
  START_LISTENING: 'Ik luister...',
  STOP_LISTENING: 'Gestopt met luisteren',
  COMMAND_RECEIVED: 'Commando ontvangen',
  COMMAND_NOT_RECOGNIZED: 'Sorry, ik begreep dat niet. Probeer het opnieuw.',
  SEARCHING: 'Ik zoek naar',
  ADDED: 'Toegevoegd',
  NAVIGATING: 'Ik ga naar',
  ERROR: 'Er is iets misgegaan. Probeer het opnieuw.',
};
