import { View, FlatList, Text, StyleSheet, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import { getClubs } from '@/src/helpers/club_helper';
import TouchableCard from '@/src/components/TouchableCard';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ThemedView from '@/src/components/themed-components/ThemedView';

const ClubMain = () => {
  const [clubs, setClubs] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true)
  const { userInfo } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    getClubs(userInfo.memberId)
      .then(response => {
        const memberClubs = response.data
        console.log(memberClubs)
        setClubs(memberClubs);
      })
      .catch((error) => Alert.alert("Error", error.response.data.message))
      .finally(() => setIsLoading(false))
  }, []);

  const showCreateClub = () => router.push("/(main)/(clubs)/createclub")
  const showDetails = (clubId: number, clubName: string, role: string) => router.push(`/(main)/(clubs)/clubdetails?clubId=${clubId}&clubName=${clubName}&role=${role}`)

  return (
    <ThemedView style={{flex:1}}>
      <View style={{ marginTop: 25 }} />
      <View>
        {isLoading && <LoadingSpinner />}
        {!isLoading &&
          <FlatList
            data={clubs}
            renderItem={({ item }) => (
              <TouchableCard key={item.clubId} onPress={() => showDetails(item.clubId, item.clubName, item.roleName)} id={item.clubId}>
                <View style={{
                  flexDirection: "row", width: "100%",
                  justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
                }}>
                  <Text style={{ fontWeight: "bold" }}>{item.clubName}</Text>
                  <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
                </View>
              </TouchableCard>
            )}
          />
        }
      </View>
      <FloatingMenu onPressMain={showCreateClub}
        icon={<MaterialIcons name={"add"} size={32} color={"white"} />}
      />
    </ThemedView>
  )
}

export default ClubMain

const styles = StyleSheet.create({
  item: {
    flex: 0.6,
  },
})