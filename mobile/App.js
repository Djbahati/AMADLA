import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Amadla Energy</Text>
      <Text style={styles.subtitle}>Clean energy solutions for African communities.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Quote')}>
        <Text style={styles.buttonText}>Request a Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Projects')}>
        <Text style={styles.secondaryButtonText}>View Projects</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProjectsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Projects</Text>
      <Text style={styles.body}>This mobile experience is a companion to the web platform, with energy portfolio insights and service booking.</Text>
    </View>
  );
}

function QuoteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quote Request</Text>
      <Text style={styles.body}>Capture energy profile, budget, and location to receive a tailored recommendation.</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerStyle: styles.header, headerTintColor: '#E4F4FD' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Amadla Mobile' }} />
        <Stack.Screen name="Projects" component={ProjectsScreen} options={{ title: 'Projects' }} />
        <Stack.Screen name="Quote" component={QuoteScreen} options={{ title: 'Get a Quote' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#051523',
  },
  container: {
    flex: 1,
    backgroundColor: '#051523',
    padding: 20,
  },
  content: {
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#E4F4FD',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0B9C8',
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    color: '#E4F4FD',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#00C48C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#051523',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#00C48C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00C48C',
    fontWeight: '700',
    fontSize: 16,
  },
});
