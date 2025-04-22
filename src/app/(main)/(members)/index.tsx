import { useEffect, useState } from "react";
import { View, FlatList, Button } from "react-native";
import { getMembers } from "@/src/helpers/member_helper";
import MemberItem from "@/src/components/MemberItem";
import { useRouter } from "expo-router";
import FloatingMenu from "@/src/components/FloatingMenu";
import { useSearchParams } from "expo-router/build/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { getClubMembers } from "@/src/helpers/club_helper";

export default function Home() {
  const [members, setMembers] = useState<any>([]);
  const params = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    getClubMembers(params.get("clubId"))
    .then( response => {
      setMembers(response.data)
    })
  }, []); 

  const showDetails = (memberId: number)=> router.push(`/(main)/(members)/memberdetails?id=${memberId}`)

  const showAddMember = () => router.navigate("/(main)/(members)/addmember")
  
  return (
    <>
    <View style={{marginTop: 25}}/>
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <FlatList
        data={members}
        initialNumToRender={8}
        //onEndReached={fetchNextPage}
        //onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <MemberItem {...item} key={item.member_id} showDetails={showDetails}/>
        )}
      />
    </View>
    <FloatingMenu onPressMain={showAddMember} icon={<MaterialIcons name={"add"} size={32} color={"white"} />}/>
    </>
  );
}
