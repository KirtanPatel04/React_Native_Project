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

const fetchSelfCare = async (): Promise<SelfCareSuggestion> => {
  const response = await fetch('https://www.boredapi.com/api/activity?type=relaxation');
  if (!response.ok) {
    throw new Error('Failed to load self-care idea');
  }
  const json = await response.json();
  return { activity: json.activity, type: json.type };
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
      setState({ loading: false, error: 'Could not refresh self-care idea. Try again.' });
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60 * 60 * 1000); // refresh hourly
    return () => clearInterval(interval);
  }, [load]);

  return { ...state, reload: load };
};
