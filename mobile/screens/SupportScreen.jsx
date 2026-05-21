import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SupportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help?</Text>
      <Text style={styles.body}>
        Get fast support for quote requests, project updates, and energy insights.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051523',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E4F4FD',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#A0B9C8',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00C48C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#051523',
    fontWeight: '700',
    fontSize: 16,
  },
});
