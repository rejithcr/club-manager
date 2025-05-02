import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import UpcomingMatches from './upcoming_matches';
import FeeSummary from './dues';
import { useContext, useState } from 'react';
import UpcomingEvents from './upcoming_events';
import { AuthContext } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import ThemedButton from '@/src/components/ThemedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ClubMain = () => {
  const { userInfo } = useContext(AuthContext)

  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter()

  const gotoClubs = () => router.push(`/(main)/(clubs)`)

  const onRefresh = () => {
    console.log(userInfo)
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userInfo")
    router.replace("/(auth)")
  }

  return (
    <>
      {/* <FloatingProfileMenu photo={userInfo?.photo} /> */}
      <View style={{ marginTop: 25 }} />
      < ScrollView refreshControl={< RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <UpcomingMatches memberEmail={userInfo?.email} />
        <FeeSummary memberEmail={userInfo?.email} />
        <UpcomingEvents memberEmail={userInfo?.email} />
      </ScrollView >
      <FloatingMenu
        onPressMain={gotoClubs}
        icon={<MaterialIcons name={"assured-workload"} size={32} color={"white"} />}        
      />
      <ThemedButton onPress={logout} title={'Logout'} />
    </>
  )
}

export default ClubMain