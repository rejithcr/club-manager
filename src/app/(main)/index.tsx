import { RefreshControl, ScrollView } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import FeeSummary from './dues';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import {  MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyClubs from './myclubs';
import { router } from 'expo-router';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { useHttpGet } from '@/src/hooks/use-http';
import ThemedView from '@/src/components/themed-components/ThemedView';
import Spacer from '@/src/components/Spacer';
import ThemedHeading from '@/src/components/themed-components/ThemedHeading';


const Main = () => {
  const router = useRouter()  
  const { userInfo } = useContext(UserContext)
  const { 
    data: duesByMember, 
    isLoading: isLoadingMemberDues, 
    refetch: refetchMemberDues 
  } = useHttpGet("/club/member", {memberId: userInfo?.memberId, duesByMember: "true"})
  const { 
    data: clubs, 
    isLoading: isLoadingMyClubs, 
    refetch: refetchClubs 
  } = useHttpGet("/club", {memberId: userInfo?.memberId})
  
  const onRefresh = () => {
    refetchMemberDues()
    refetchClubs()
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authInfo")
    router.replace("/(auth)")
  }

  return (
    <ThemedView style={{flex: 1}}>      
      <Spacer space={5} />
      <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        <ThemedHeading>My Clubs</ThemedHeading>
        {isLoadingMyClubs && <LoadingSpinner />}
        {!isLoadingMemberDues && <MyClubs clubs={clubs} />}

        {clubs?.length > 0 && <ThemedHeading>My Dues</ThemedHeading> }
        {isLoadingMemberDues && <LoadingSpinner />}
        {!isLoadingMemberDues && clubs?.length > 0 && <FeeSummary duesByMember={duesByMember} />}
        {/* <UpcomingMatches memberEmail={userInfo?.email} />
        <UpcomingEvents memberEmail={userInfo?.email} /> */}
        <Spacer space={50} />
      </ScrollView >

      <FloatingMenu actions={actions} position={"left"} color='black'
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, handleLogout)}
      />
    </ThemedView>
  )
}

export default Main


const handleMenuPress = (name: string | undefined, handleLogout: { (): void }) => {
  if (name == "createclub") {
    router.push(`/(main)/(clubs)/createclub`)
  } else if (name == "logout") {
    handleLogout()
  } else if (name == "profile") {
    router.push(`/(main)/(profile)`)
  }else {
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
  {
    color: "black",
    text: "Profile",
    icon: <MaterialCommunityIcons name={"face-man-profile"} size={15} color={"white"} />,
    name: "profile",
    position: 1
  },
];