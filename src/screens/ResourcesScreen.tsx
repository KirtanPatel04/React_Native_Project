import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { useSelfCare } from '../hooks/useSelfCare';

interface ResourceLink {
  title: string;
  description: string;
  href: string;
}

const ResourceRow: React.FC<{ title: string; description: string; href: string }> = ({ title, description, href }) => (
  <Card role="summary">
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{description}</Text>
    <PrimaryButton label="Open link" onPress={() => Linking.openURL(href)} />
  </Card>
);

const rotateResources = (pool: ResourceLink[]): ResourceLink[] => {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

const ResourcesScreen: React.FC = () => {
  const { suggestion, loading, error, reload, lastUpdated } = useSelfCare();
  const resourcePool: ResourceLink[] = useMemo(
    () => [
      {
        title: 'Mindful breaks',
        description: 'A 2-minute grounding exercise to reset between tasks.',
        href: 'https://www.mindful.org/a-five-minute-breathing-meditation/',
      },
      {
        title: 'Movement reminder',
        description: 'Gentle desk stretches that are accessible and quick.',
        href: 'https://www.healthline.com/health/deskercise',
      },
      {
        title: 'Sleep hygiene',
        description: 'Evidence-based tips to wind down after a productive day.',
        href: 'https://www.sleepfoundation.org/sleep-hygiene',
      },
      {
        title: 'Mindful eating',
        description: 'A short guide to slowing down at meals and reducing stress.',
        href: 'https://www.healthline.com/nutrition/mindful-eating-guide',
      },
      {
        title: 'Quick compassion',
        description: 'A 5-minute loving-kindness script for a kinder inner voice.',
        href: 'https://ggia.berkeley.edu/practice/loving_kindness_meditation',
      },
    ],
    [],
  );

  const [rotatingResources, setRotatingResources] = useState<ResourceLink[]>(() => rotateResources(resourcePool));
  const [resourcesUpdatedAt, setResourcesUpdatedAt] = useState<string>();

  const refreshResources = useCallback(() => {
    setRotatingResources(rotateResources(resourcePool));
    setResourcesUpdatedAt(new Date().toLocaleTimeString());
  }, [resourcePool]);

  useEffect(() => {
    refreshResources();
    const id = setInterval(refreshResources, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [refreshResources]);

  const handleManualRefresh = useCallback(() => {
    reload();
    refreshResources();
  }, [reload, refreshResources]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.hero}>Self-care resources</Text>
        <Text style={styles.body}>Short reads to keep you supported and motivated.</Text>
      </View>

      <Card role="summary">
        <Text style={styles.title}>Hourly self-care idea</Text>
        {loading && <ActivityIndicator color="#38bdf8" accessibilityLabel="Loading self-care idea" />}
        {suggestion && !loading && (
          <>
            <Text style={styles.hero}>{suggestion.activity}</Text>
            <Text style={styles.body}>Category: {suggestion.type ?? 'wellness'}</Text>
            {lastUpdated && <Text style={styles.muted}>Updated at {lastUpdated}</Text>}
          </>
        )}
        {error && (
          <Text style={[styles.body, { color: '#f472b6' }]} accessibilityRole="alert">
            {error}
          </Text>
        )}
        <PrimaryButton label="Refresh now" onPress={handleManualRefresh} accessibilityLabel="Refresh self-care idea and resources" />
        <Text style={styles.muted}>Ideas and links update automatically every hour.</Text>
      </Card>

      <View style={{ gap: 12 }}>
        {rotatingResources.map((resource) => (
          <ResourceRow key={resource.href} {...resource} />
        ))}
      </View>
      {resourcesUpdatedAt && <Text style={styles.muted}>Resources refreshed at {resourcesUpdatedAt}</Text>}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { gap: 6 },
  hero: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  body: {
    color: '#94a3b8',
    marginBottom: 12,
    fontSize: 15,
  },
  muted: {
    color: '#64748b',
    fontSize: 13,
  },
});

export default ResourcesScreen;
