import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const TextField: React.FC<Props> = ({ label, value, onChangeText, placeholder, multiline }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multiline]}
      accessibilityLabel={label}
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0b1224',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e5e7eb',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default TextField;
