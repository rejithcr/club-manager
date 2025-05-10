import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import UpcomingMatches from './upcoming_matches';
import FeeSummary from './dues';
import { useContext, useEffect, useState } from 'react';
import UpcomingEvents from './upcoming_events';
import { AuthContext } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyClubs from './myclubs';
import { router } from 'expo-router';


const Main = () => {
  const { userInfo } = useContext(AuthContext)
  const [refreshing,  ] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter()

  const onRefresh = () => {
    setRefresh(prev=> !prev);
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
        <MyClubs refresh={refresh}/>
        <FeeSummary memberEmail={userInfo?.email} />
        <UpcomingEvents memberEmail={userInfo?.email} />
      </ScrollView >

      <FloatingMenu actions={actions} position={"left"} color='black'
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, logout)}
      />
    </>
  )
}

export default Main


const handleMenuPress = (name: string | undefined, logout: {(): void}) => {
  if (name == "createclub") {
    router.push(`/(main)/(clubs)/createclub`)
  } else if (name == "logout") {
    logout()
  } else {
    throw ("Error")
  }
}

const actions = [
  {
    color: "black",
    text: "Logout",
    icon: <MaterialIcons name={"logout"} size={15} color={"white"} />,
    name: "logout",
    position: 1
  },
  {
    color: "black",
    text: "Create Club",
    icon: <MaterialIcons name={"add"} size={15} color={"white"} />,
    name: "createclub",
    position: 1
  },
];