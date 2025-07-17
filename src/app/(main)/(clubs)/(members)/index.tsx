import { useContext, useEffect, useState } from "react";
import { View, FlatList, RefreshControl, Touchable } from "react-native";
import { router, useRouter } from "expo-router";
import FloatingMenu from "@/src/components/FloatingMenu";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getClubMembers } from "@/src/helpers/club_helper";
import { ROLE_ADMIN } from "@/src/utils/constants";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import Alert, { AlertProps } from "@/src/components/Alert";
import UserInfoView from "./UserInfoView";
import TouchableCard from "@/src/components/TouchableCard";

export default function Home() {
  const [members, setMembers] = useState<any>([]);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [isLoading, setIsLoading] = useState(true)
  const { clubInfo } = useContext(ClubContext)

  const router = useRouter()

  const loadMembers = () => {
    setIsLoading(true)
    getClubMembers(clubInfo.clubId)
      .then(response => setMembers(response.data))
      .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error.response.data.error,
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
      .finally(()=> setIsLoading(false))
  }

  useEffect(() => {
    loadMembers()
  }, []);

  const showDetails = (memberId: number) => router.push(`/(main)/(members)/memberdetails?memberId=${memberId}`)

  return (    
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={10}/>
      <View style={{ height:"100%", justifyContent: "center", alignContent: "center" }}>
        {isLoading && <LoadingSpinner />}
        {!isLoading &&
          <FlatList
            data={members}
            initialNumToRender={8}
            ListFooterComponent={<Spacer space={10} />}
            ItemSeparatorComponent={() => <Spacer space={4} />}
            refreshControl={<RefreshControl refreshing={false} onRefresh={loadMembers} />}
            renderItem={({ item }) => (
              <TouchableCard onPress={() => showDetails(item.memberId)}>
                <UserInfoView {...item} key={item.memberId} />
              </TouchableCard>
            )}
          />
        }
      </View>
      {clubInfo.role == ROLE_ADMIN &&
        <FloatingMenu
          actions={actions}
          onPressItem={(name: string | undefined) => handleMenuPress(name)}
          icon={<MaterialIcons name={"menu"} size={32} color={"white"} />} />
      }
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
}


const handleMenuPress = (name: string | undefined) => {
  if (name == "attributes") {
    router.push(`/(main)/(clubs)/(members)/memberattributes`)
  } else if (name == "add") {
    router.push(`/(main)/(clubs)/(members)/addmember`)
  } else if (name == "requests") {
    router.push(`/(main)/(clubs)/membershiprequests`)
  } else {
    throw ("Error")
  }
}

const actions = [
  {
    color: "black",
    text: "Member Attributes",
    icon: <MaterialCommunityIcons name={"account-details"} size={15} color={"white"} />,
    name: "attributes",
    position: 1
  },{
    color: "black",
    text: "Membership Requests",
    icon: <MaterialCommunityIcons name={"account-details"} size={15} color={"white"} />,
    name: "requests",
    position: 1
  }, 
  {
    color: "black",
    text: "Add Memeber",
    icon: <AntDesign name={"adduser"} size={15} color={"white"} />,
    name: "add",
    position: 1
  },
];