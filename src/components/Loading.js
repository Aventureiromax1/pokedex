import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Loading({ message = 'Carregando Pokédex...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF3E3E" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#656A79',
    fontWeight: '600',
    fontFamily: 'System',
  },
});
