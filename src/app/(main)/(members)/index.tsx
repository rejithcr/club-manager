import { useContext, useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import MemberItem from "@/src/components/MemberItem";
import { router, useRouter } from "expo-router";
import FloatingMenu from "@/src/components/FloatingMenu";
import { MaterialIcons } from "@expo/vector-icons";
import { getClubMembers } from "@/src/helpers/club_helper";
import { ROLE_ADMIN } from "@/src/utils/constants";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import Alert, { AlertProps } from "@/src/components/Alert";

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
                    visible: true, title: 'Error', message: JSON.stringify(error.response),
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
      <Spacer space={5}/>
      <View style={{ height:"90%", justifyContent: "center", alignContent: "center" }}>
        {isLoading && <LoadingSpinner />}
        {!isLoading &&
          <FlatList
            data={members}
            initialNumToRender={8}
            ListFooterComponent={<Spacer space={10} />}
            ItemSeparatorComponent={() => <Spacer space={4} />}
            refreshControl={<RefreshControl refreshing={false} onRefresh={loadMembers} />}
            renderItem={({ item }) => (
              <MemberItem {...item} key={item.member_id} showDetails={showDetails} />
            )}
          />
        }
      </View>
      {clubInfo.role == ROLE_ADMIN &&
        <FloatingMenu
         // actions={actions}
          onPressMain={() => {router.push(`/(main)/(members)/addmember`) }}
         // onPressMain={(name: string | undefined) => handleMenuPress(name)}
          icon={<MaterialIcons name={"add"} size={32} color={"white"} />} />
      }
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
}


const handleMenuPress = (name: string | undefined) => {
  if (name == "attributes") {
    router.push(`/(main)/(members)/memberattributes`)
  } else if (name == "addMember") {
    router.push(`/(main)/(members)/addmember`)
  } else {
    throw ("Error")
  }
}

const actions = [
  // {
  //   color: "black",
  //   text: "Edit Member Attributes",
  //   icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
  //   name: "attributes",
  //   position: 1
  // },
  {
    color: "black",
    text: "Add Memeber",
    icon: <MaterialIcons name={"add"} size={15} color={"white"} />,
    name: "addMember",
    position: 1
  },
];