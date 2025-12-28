import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedHeading from '@/src/components/themed-components/ThemedHeading';
import Spacer from '@/src/components/Spacer';

export default function RefundPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        <ThemedText style={styles.lastUpdated}>Last Updated: December 27, 2025</ThemedText>

        <Spacer space={10} />

        <ThemedText style={styles.sectionTitle}>1. Overview</ThemedText>
        <ThemedText style={styles.text}>
          Club Manager is a fee collection and tracking platform for clubs. The platform facilitates 
          fee collection from members and maintains the collected fees in the platform account until 
          payout is processed to clubs.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>2. Fee Collection Process</ThemedText>
        <ThemedText style={styles.text}>
          • Members can pay fees assigned to them through the platform{'\n'}
          • All fees collected are held in the platform account{'\n'}
          • Fee payment status and remaining dues can be tracked in real-time{'\n'}
          • Clubs can monitor all fee collections and member payment status
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>3. Payouts to Clubs</ThemedText>
        <ThemedText style={styles.text}>
          • Payouts to clubs are currently handled manually through support requests{'\n'}
          • Club administrators must contact support at mindmesh.dev@gmail.com to request payouts{'\n'}
          • Include club details, amount to be transferred, and bank account information{'\n'}
          • Payout processing time: 5-7 business days after verification
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>4. Refund Policy for Member Fee Payments</ThemedText>
        <ThemedText style={styles.text}>
          If any fee collected through the platform needs to be refunded to a member:{'\n'}
          • Contact support immediately at mindmesh.dev@gmail.com{'\n'}
          • Provide: Member details, transaction ID, fee amount, and reason for refund{'\n'}
          • Refund requests must be initiated by the club administrator{'\n'}
          • Refunds will be processed within 7-10 business days after verification{'\n'}
          • Refunds will be made to the original payment method used by the member
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>5. Non-Refundable Items</ThemedText>
        <ThemedText style={styles.text}>
          The following are generally non-refundable:{'\n'}
          • Platform service fees (if applicable){'\n'}
          • Payment gateway charges{'\n'}
          • Fees for services already rendered by the club{'\n'}
          • Fees refunded after the club has already received the payout
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>6. Dispute Resolution</ThemedText>
        <ThemedText style={styles.text}>
          • Disputes between clubs and members should be resolved directly first{'\n'}
          • If resolution cannot be reached, contact support at mindmesh.dev@gmail.com{'\n'}
          • Provide complete details of the dispute including transaction records{'\n'}
          • Support team will review and mediate within 3-5 business days
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>7. Changes to Policy</ThemedText>
        <ThemedText style={styles.text}>
          We reserve the right to modify this refund policy at any time. Changes will be posted 
          on this page with an updated revision date. Continued use after changes constitutes 
          acceptance of the new policy.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>8. Contact Us</ThemedText>
        <ThemedText style={styles.text}>
          For questions about refunds, payouts, or fee collections:{'\n'}
          Email: mindmesh.dev@gmail.com{'\n'}
          Response Time: 24-48 hours
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
