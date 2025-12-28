import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";

export default function TermsAndConditionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedText style={styles.lastUpdated}>Last Updated: December 27, 2025</ThemedText>

        <Spacer space={10} />
        <ThemedText style={styles.text}>
          These Terms and Conditions, along with privacy policy or other terms ("Terms") constitute a binding agreement
          by and between Club Manager, ( "Website Owner" or "we" or "us" or "our") and you ("you" or "your") and relate
          to your use of our website, mobile application, and fee collection services (collectively, "Services").
        </ThemedText>
        <Spacer space={10} />
        <ThemedText style={styles.text}>
          Club Manager is a fee collection and tracking platform for clubs. The platform facilitates fee collection 
          from members and maintains collected fees in the platform account until payout is processed to clubs.
        </ThemedText>
        <Spacer space={10} />
        <ThemedText style={styles.text}>
          By using our website and availing the Services, you agree that you have read and accepted these Terms
          (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning
          any reason. It is your responsibility to periodically review these Terms to stay informed of updates.
        </ThemedText>
        <Spacer space={10} />
        <ThemedText style={styles.text}>
          The use of this website or availing of our Services is subject to the following terms of use:
        </ThemedText>
        <Spacer space={10} />
        <ThemedText style={styles.text}>
          • To access and use the Services, you agree to provide true, accurate and complete information to us during
          and after registration, and you shall be responsible for all acts done through the use of your registered
          account.{"\n\n"}
          • Members can pay fees assigned to them through the platform, and all fees collected are held in the platform account.{"\n\n"}
          • Club administrators are responsible for requesting payouts by contacting support at mindmesh.dev@gmail.com.{"\n\n"}
          • Fee payment status and remaining dues can be tracked in real-time through the application.{"\n\n"}
          • Neither we nor any third parties provide any warranty or guarantee as to the accuracy,
          timeliness, performance, completeness or suitability of the information and materials offered on this website
          or through the Services, for any specific purpose. You acknowledge that such information and materials may
          contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the
          fullest extent permitted by law.{"\n\n"}
          • Your use of our Services and the website is solely at your own risk
          and discretion. You are required to independently assess and ensure that the Services meet your requirements.
          {"\n\n"}
          • The contents of the Website and the Services are proprietary to Us and you will not have any
          authority to claim any intellectual property rights, title, or interest in its contents.{"\n\n"}
          • You
          acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these
          Terms or applicable laws.{"\n\n"}
          • Members agree to pay fees assigned by their clubs through the platform. Payment gateway charges may apply.{"\n\n"}
          • Club administrators acknowledge that payouts are processed manually through support requests and require proper verification.{"\n\n"}
          • You agree not to use the website and/or Services for any purpose that is unlawful, illegal or
          forbidden by these Terms, or Indian or local laws that might apply to you.{"\n\n"}
          • You agree and acknowledge
          that website and the Services may contain links to other third party websites. On accessing these links, you
          will be governed by the terms of use, privacy policy and such other policies of such third party websites.
          {"\n\n"}
          • You understand that upon initiating a fee payment transaction you are entering into a
          legally binding and enforceable contract with your club for the Services.{"\n\n"}
          • For refund requests of fees collected through the platform, contact support at mindmesh.dev@gmail.com with complete transaction details. Refunds will be processed within 7-10 business days after verification.{"\n\n"}
          • Notwithstanding anything contained in these Terms,
          the parties shall not be liable for any failure to perform an obligation under these Terms if performance is
          prevented or delayed by a force majeure event.{"\n\n"}
          • These Terms and any dispute or claim relating to it,
          or its enforceability, shall be governed by and construed in accordance with the laws of India.{"\n\n"}
          • All
          disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of
          the courts in Kochi, Kerala.{"\n\n"}
          • All concerns or communications relating to these Terms must be
          communicated to us at mindmesh.dev@gmail.com.
        </ThemedText>

        <Spacer space={15} />

        <ThemedText style={styles.sectionTitle}>Contact</ThemedText>
        <ThemedText style={styles.text}>
          If you have questions about these Terms and Conditions, please contact us at mindmesh.dev@gmail.com
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
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
});
