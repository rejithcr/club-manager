import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native'
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
import { getClubs, getDuesByMember } from '@/src/helpers/club_helper';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';


const Main = () => {
  const { userInfo } = useContext(AuthContext)
  const [isLoadingMemberDues, setIsLoadingMemberDues] = useState(false)
  const [duesByMember, setDuesByMember] = useState<any>([]);
  const [isLoadingMyClubs, setIsLoadingMyClubs] = useState(false)
  const [clubs, setClubs] = useState<any>([]);
  const router = useRouter()

  const fetchMemberDues = () => {
    setIsLoadingMemberDues(true)
    getDuesByMember(userInfo?.memberId)
      .then(response => setDuesByMember(response.data))
      .catch((error) => Alert.alert("Error", error.response.data.message))
      .finally(() => setIsLoadingMemberDues(false))
  }
  const fetchMyClubs = () => {
    setIsLoadingMyClubs(true)
    getClubs(userInfo?.memberId)
      .then(response => {console.log(response.data); setClubs(response.data)})
      .catch((error) => Alert.alert("Error", error.response.data.message))
      .finally(() => setIsLoadingMyClubs(false))
  }
  const onRefresh = () => {
    fetchMemberDues();
    fetchMyClubs()
  };
  const logout = async () => {
    await AsyncStorage.removeItem("userInfo")
    router.replace("/(auth)")
  }
  useEffect(() => {
    fetchMyClubs();
    fetchMemberDues();
  }, [])

  return (
    <>
      {/* <FloatingProfileMenu photo={userInfo?.photo} /> */}
      <View style={{ marginTop: 25 }} />
      <ScrollView refreshControl={< RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        <Text style={appStyles.title}>My Clubs</Text>
        {isLoadingMyClubs && <LoadingSpinner />}
        {!isLoadingMemberDues && <MyClubs clubs={clubs} />}

        {clubs?.length > 0 && <Text style={appStyles.title}>Dues Summary</Text> }
        {isLoadingMemberDues && <LoadingSpinner />}
        {!isLoadingMemberDues && clubs?.length > 0 && <FeeSummary duesByMember={duesByMember} />}
        {/* <UpcomingMatches memberEmail={userInfo?.email} />
        <UpcomingEvents memberEmail={userInfo?.email} /> */}
      </ScrollView >

      <FloatingMenu actions={actions} position={"left"} color='black'
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, logout)}
      />
    </>
  )
}

export default Main


const handleMenuPress = (name: string | undefined, logout: { (): void }) => {
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