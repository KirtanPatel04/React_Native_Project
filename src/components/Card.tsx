import React from 'react';
import { StyleSheet, View } from 'react-native';

const Card: React.FC<{ children: React.ReactNode; role?: 'summary' | 'group' }> = ({ children, role }) => (
  <View accessibilityRole={role} style={styles.card}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});

export default Card;
