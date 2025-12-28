import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedHeading from '@/src/components/themed-components/ThemedHeading';
import Spacer from '@/src/components/Spacer';

export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        <ThemedText style={styles.lastUpdated}>Last Updated: December 28, 2025</ThemedText>

        <Spacer space={10} />

        <ThemedText style={styles.sectionTitle}>1. Introduction</ThemedText>
        <ThemedText style={styles.text}>
          Club Manager ("we," "us," or "our") operates the Club Manager platform. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you use our 
          application and website, including all related features and services.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>2. Information We Collect</ThemedText>
        <ThemedText style={styles.text}>
          We collect information you provide directly:{'\n'}
          • Name and email address{'\n'}
          • Phone number (optional){'\n'}
          • Club affiliation and member information{'\n'}
          • Payment information and transaction history{'\n'}
          • Profile information and preferences{'\n'}
          • Communication data when you contact us
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>3. How We Use Your Information</ThemedText>
        <ThemedText style={styles.text}>
          We use collected information for:{'\n'}
          • Providing and maintaining the fee collection platform{'\n'}
          • Processing member payments and club payouts{'\n'}
          • Tracking and reporting fee payment status{'\n'}
          • Sending service updates and communications{'\n'}
          • Resolving disputes and providing customer support{'\n'}
          • Improving our platform features and user experience{'\n'}
          • Complying with legal and regulatory requirements
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>4. Data Security</ThemedText>
        <ThemedText style={styles.text}>
          We implement appropriate technical and organizational measures to protect your personal 
          data against unauthorized access, alteration, disclosure, or destruction. However, no 
          method of transmission over the internet or electronic storage is completely secure. 
          While we strive to use commercially acceptable means, we cannot guarantee absolute security.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>5. Information Sharing</ThemedText>
        <ThemedText style={styles.text}>
          We do not sell or rent your personal information. We may share information:{'\n'}
          • With club administrators regarding member payment status{'\n'}
          • With members regarding their fees and payment history{'\n'}
          • With service providers who assist in platform operations{'\n'}
          • When required by law or to comply with legal process{'\n'}
          • To protect our rights, privacy, safety, or property
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>6. Your Privacy Rights</ThemedText>
        <ThemedText style={styles.text}>
          Depending on your location, you may have the right to:{'\n'}
          • Access your personal data{'\n'}
          • Correct inaccurate information{'\n'}
          • Request deletion of your data{'\n'}
          • Opt out of marketing communications{'\n'}
          • Request a copy of your data in portable format{'\n'}
          • File a complaint with relevant authorities
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>7. Data Retention</ThemedText>
        <ThemedText style={styles.text}>
          We retain your personal data for as long as necessary to provide our services and fulfill 
          the purposes outlined in this policy. Payment and transaction records are retained as required 
          for financial and legal compliance. You may request deletion of your account and associated 
          data by contacting us at mindmesh.dev@gmail.com.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>8. Cookies and Tracking</ThemedText>
        <ThemedText style={styles.text}>
          We use cookies and similar tracking technologies to enhance your experience, remember preferences, 
          and analyze platform usage. You can control cookie preferences through your browser settings. 
          Disabling cookies may affect some platform features.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>9. Third-Party Links</ThemedText>
        <ThemedText style={styles.text}>
          Our platform may contain links to third-party websites and services. This Privacy Policy applies 
          only to Club Manager. We are not responsible for the privacy practices of third-party sites. 
          Please review their privacy policies before providing any information.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>11. Changes to This Policy</ThemedText>
        <ThemedText style={styles.text}>
          We may update this Privacy Policy from time to time to reflect changes in our practices or 
          applicable laws. We will notify you of significant changes by posting the updated policy 
          and updating the "Last Updated" date. Continued use constitutes acceptance of the updated policy.
        </ThemedText>

        <Spacer space={15} />

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
  lastUpdated: {
    fontSize: 13,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
});
