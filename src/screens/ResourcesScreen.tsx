import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

const ResourceRow: React.FC<{ title: string; description: string; href: string }> = ({ title, description, href }) => (
  <Card role="summary">
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{description}</Text>
    <PrimaryButton label="Open link" onPress={() => Linking.openURL(href)} />
  </Card>
);

const ResourcesScreen: React.FC = () => (
  <ScreenContainer>
    <View style={styles.header}>
      <Text style={styles.hero}>Self-care resources</Text>
      <Text style={styles.body}>Short reads to keep you supported and motivated.</Text>
    </View>

    <ResourceRow
      title="Mindful breaks"
      description="A 2-minute grounding exercise to reset between tasks."
      href="https://www.mindful.org/a-five-minute-breathing-meditation/"
    />
    <ResourceRow
      title="Movement reminder"
      description="Gentle desk stretches that are accessible and quick."
      href="https://www.healthline.com/health/deskercise"
    />
    <ResourceRow
      title="Sleep hygiene"
      description="Evidence-based tips to wind down after a productive day."
      href="https://www.sleepfoundation.org/sleep-hygiene"
    />
  </ScreenContainer>
);

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
});

export default ResourcesScreen;
