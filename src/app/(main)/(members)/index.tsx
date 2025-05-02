import { useContext, useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { getMembers } from "@/src/helpers/member_helper";
import MemberItem from "@/src/components/MemberItem";
import { router, useRouter } from "expo-router";
import FloatingMenu from "@/src/components/FloatingMenu";
import { useSearchParams } from "expo-router/build/hooks";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getClubMembers } from "@/src/helpers/club_helper";
import { ROLE_ADMIN } from "@/src/utils/constants";
import LoadingSpinner from "@/src/components/LoadingSpinner";

export default function Home() {
  const [members, setMembers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true)

  const params = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    getClubMembers(params.get("clubId"))
      .then(response => {
        setMembers(response.data)
        setIsLoading(false)
      })
  }, []);

  const showDetails = (memberId: number) => router.push(`/(main)/(members)/memberdetails?id=${memberId}`)

  return (
    <>
      <Text style={{textAlign:"right",margin: 15}}>{params.get("clubName")}</Text>
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        {isLoading && <LoadingSpinner />}
        {!isLoading &&
          <FlatList
            data={members}
            initialNumToRender={8}
            //onEndReached={fetchNextPage}
            //onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <MemberItem {...item} key={item.member_id} showDetails={showDetails} />
            )}
          />
        }
      </View>
      {params.get("role") == ROLE_ADMIN &&
        <FloatingMenu
          actions={actions}
          onPressItem={(name: string | undefined) => handleMenuPress(name, params.get("clubId"), params.get("clubName"), params.get("role"))}
          icon={<MaterialIcons name={"menu"} size={32} color={"white"} />} />
      }
    </>
  );
}


const handleMenuPress = (name: string | undefined, clubId: string | null, clubName: string | null, role: string | null) => {
  if (name == "attributes") {
    router.push(`/(main)/(members)/memberattributes?clubId=${clubId}&clubName=${clubName}`)
  } else if (name == "addMember") {
    router.push(`/(main)/(members)/addmember?clubId=${clubId}&clubName=${clubName}`)
  } else {
    throw ("Error")
  }
}

const actions = [
  {
    color: "black",
    text: "Edit Member Attributes",
    icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
    name: "attributes",
    position: 1
  },
  {
    color: "black",
    text: "Add Memeber",
    icon: <MaterialIcons name={"add"} size={15} color={"white"} />,
    name: "addMember",
    position: 1
  },
];