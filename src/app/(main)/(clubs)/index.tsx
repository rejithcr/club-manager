import { View, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import { getClubs } from '@/src/helpers/club_helper';
import SimpleCard from '@/src/components/SimpleCard';

const ClubMain = () => {
  const [clubs, setClubs] = useState<any>([]);
  const router = useRouter()
  useEffect(() => {
    setClubs(getClubs());
  }, []);

  const showCreateClub = () => router.push("/(main)/(clubs)/createclub")
  const showDetails = (clubId: number) => router.push(`/(main)/(clubs)/clubdetails?id=${clubId}`)
  return (
    <>
      <View style={{ marginTop: 25 }} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <FlatList
          data={clubs}
          initialNumToRender={8}
          renderItem={({ item }) => (
            <SimpleCard key={item.id} {...item} showDetails={showDetails} />
          )}
        />
      </View>
      <FloatingMenu onPress={showCreateClub} />
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