import { View, StyleSheet, Text } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import { appStyles } from '@/src/utils/styles';
import { ScrollView } from 'react-native-gesture-handler';
import UpcomingMatches from './upcoming_matches';
import FeeSummary from './fee_summary';
import React from 'react';
import UpcomingEvents from './upcoming_events';

const ClubMain = () => {
  const router = useRouter()

  const gotoClubs = () => router.push(`/(main)/(clubs)`)

  return (
    <>
      <ScrollView>
        <UpcomingEvents memberId={1} />
        <UpcomingMatches memberId={1} />
        <FeeSummary memberId={1} />
      </ScrollView>
      <FloatingMenu onPress={gotoClubs} />
    </>
  )
}

export default ClubMain


const styles = StyleSheet.create({
  photoContainer: {
    minHeight: 150,
    margin: 5,
    padding: 10,
    flex: 1,
    width: 150,
    borderRadius: 100,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  title: {
    margin: 20,
    fontWeight: "bold",
    fontSize: 25,
    width: "80%",
    alignSelf: "center",
  },
  detailsTable: {
    width: "80%",
    alignSelf: "center",
    alignItems: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  label: {
    width: "30%",
    padding: 10,
  },
  value: {
    width: "70%",
    padding: 10,
  },
  divider: {
    borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%"
  }
});