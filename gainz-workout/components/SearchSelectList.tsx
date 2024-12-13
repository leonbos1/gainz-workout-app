import { Colors } from '@/constants/Colors';
import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    padding: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
});
