import { View, FlatList, Text, StyleSheet, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router/build/hooks';
import { getClubs } from '@/src/helpers/club_helper';
import TouchableCard from '@/src/components/TouchableCard';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';

const MyClubs = (props: {refresh: boolean}) => {
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
  }, [props.refresh]);

  const showDetails = (clubId: number, clubName: string, role: string) => router.push(`/(main)/(clubs)/clubdetails?clubId=${clubId}&clubName=${clubName}&role=${role}`)

  return (
    <>
      <Text style={appStyles.title}>My Clubs</Text>
      <View>
        {isLoading && <LoadingSpinner />}
        {!isLoading && clubs?.length == 0 && <Text style={{ textAlign: "center" }}>No clubs found!</Text>}
        {!isLoading && clubs?.map((item: any) => 
              <TouchableCard key={item.clubId} showDetails={() => showDetails(item.clubId, item.clubName, item.roleName)} id={item.clubId}>
                <View style={{
                  flexDirection: "row", width: "100%",
                  justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
                }}>
                  <Text style={{ fontWeight: "bold" }}>{item.clubName}</Text>
                  <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
                </View>
              </TouchableCard>
            )}
      </View>
    </>
  )
}

export default MyClubs
