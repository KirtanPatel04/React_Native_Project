import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

const ScreenContainer: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} accessibilityRole="scrollbar">
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  inner: {
    gap: 16,
  },
});

export default ScreenContainer;
