import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ label, onPress, disabled }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      pressed && styles.pressed,
      disabled && styles.disabled,
    ]}
  >
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  label: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: '#1f2937',
  },
});

export default PrimaryButton;
