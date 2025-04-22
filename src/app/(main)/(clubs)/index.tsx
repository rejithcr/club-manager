import { View, FlatList, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import { getClubs } from '@/src/helpers/club_helper';
import TouchableCard from '@/src/components/TouchableCard';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';

const ClubMain = () => {
  const [clubs, setClubs] = useState<any>([]);
  const { userInfo } = useContext(AuthContext)
  
  const router = useRouter()
  useEffect(() => {
    getClubs(userInfo.memberId)
    .then( response => {
      const memberClubs = response.data
      console.log(memberClubs)
      setClubs(memberClubs);
  })
  }, []);

  const showCreateClub = () => router.push("/(main)/(clubs)/createclub")
  const showDetails = (clubId: number) => router.push(`/(main)/(clubs)/clubdetails?id=${clubId}`)
  return (
    <>
      <View style={{ marginTop: 25 }} />
      <View>
        <FlatList
          data={clubs}
          renderItem={({ item }) => (
            <TouchableCard key={item.club_id} showDetails={showDetails} id={item.club_id}>
              <View style={{
                flexDirection: "row", width: "100%",
                justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
              }}>
                <Text style={{ fontWeight: "bold" }}> {item.club_name}</Text>
                <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
              </View>
            </TouchableCard>
          )}
        />
      </View>
      <FloatingMenu onPressMain={showCreateClub}
        icon={<MaterialIcons name={"add"} size={32} color={"white"} />} 
        />
    </>
  )
}

export default ClubMain

const styles = StyleSheet.create({
  item: {
    flex: 0.6,
  },
})