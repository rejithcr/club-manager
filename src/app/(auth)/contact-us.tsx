import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedHeading from '@/src/components/themed-components/ThemedHeading';
import Spacer from '@/src/components/Spacer';

export default function ContactUsScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:mindmesh.dev@gmail.com');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedText style={styles.sectionTitle}>Get in Touch</ThemedText>
        <ThemedText style={styles.text}>
          We'd love to hear from you! Whether you have questions, feedback, or need support, 
          our team is here to help.
        </ThemedText>

        <Spacer space={20} />

        <ThemedText style={styles.sectionTitle}>Email Support</ThemedText>
        <ThemedText 
          style={{...styles.text, ...styles.link}} 
          onPress={handleEmailPress}
        >
          mindmesh.dev@gmail.com
        </ThemedText>
        <Spacer space={20} />

        <ThemedText style={styles.sectionTitle}>Address</ThemedText>
        <ThemedText style={styles.text}>
          Columbia 13G, Skyline Ivy League, Kakkanad, Kochi, KERALA, PIN: 683020
        </ThemedText>


        <Spacer space={20} />

        <ThemedText style={styles.sectionTitle}>Response Time</ThemedText>
        <ThemedText style={styles.text}>
          We typically respond to all inquiries within 3-5 days during business days.
        </ThemedText>

        <Spacer space={20} />

        <ThemedText style={styles.sectionTitle}>Business Hours</ThemedText>
        <ThemedText style={styles.text}>
          Monday - Friday: 9:00 AM - 6:00 PM (IST){'\n'}
          Saturday: 10:00 AM - 4:00 PM (IST){'\n'}
          Sunday: Closed
        </ThemedText>

        <Spacer space={30} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
