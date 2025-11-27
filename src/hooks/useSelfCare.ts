import { useCallback, useEffect, useState } from 'react';

interface SelfCareSuggestion {
  activity: string;
  type?: string;
}

interface SelfCareState {
  suggestion?: SelfCareSuggestion;
  loading: boolean;
  error?: string;
  lastUpdated?: string;
}

const fallbackIdeas: SelfCareSuggestion[] = [
  { activity: 'Try a 5-minute box breathing exercise', type: 'breathing' },
  { activity: 'Stretch your neck and shoulders gently', type: 'movement' },
  { activity: 'Write down one thing you are grateful for', type: 'journaling' },
  { activity: 'Make a warm tea and sip it mindfully', type: 'comfort' },
  { activity: 'Send a kind text to a friend or family member', type: 'connection' },
];

const fetchSelfCare = async (): Promise<SelfCareSuggestion> => {
  const tryEndpoints = [
    'https://www.boredapi.com/api/activity?type=relaxation',
    'https://www.boredapi.com/api/activity',
  ];

  for (const url of tryEndpoints) {
    const response = await fetch(url);
    if (!response.ok) {
      continue;
    }
    const json = await response.json();
    if (json?.activity) {
      return { activity: json.activity, type: json.type };
    }
  }

  const fallback = fallbackIdeas[Math.floor(Math.random() * fallbackIdeas.length)];
  if (fallback) {
    return fallback;
  }

  throw new Error('Failed to load self-care idea');
};

export const useSelfCare = () => {
  const [state, setState] = useState<SelfCareState>({ loading: true });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const suggestion = await fetchSelfCare();
      setState({
        loading: false,
        suggestion,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      const fallback = fallbackIdeas[Math.floor(Math.random() * fallbackIdeas.length)];
      setState({
        loading: false,
        suggestion: fallback,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60 * 60 * 1000); // refresh hourly
    return () => clearInterval(interval);
  }, [load]);

  return { ...state, reload: load };
};
