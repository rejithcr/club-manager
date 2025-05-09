import { useContext, useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import MemberItem from "@/src/components/MemberItem";
import { router, useRouter } from "expo-router";
import FloatingMenu from "@/src/components/FloatingMenu";
import { useSearchParams } from "expo-router/build/hooks";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getClubMembers } from "@/src/helpers/club_helper";
import { ROLE_ADMIN } from "@/src/utils/constants";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";

export default function Home() {
  const [members, setMembers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true)
  const { clubInfo } = useContext(ClubContext)

  const router = useRouter()
  useEffect(() => {
    getClubMembers(clubInfo.clubId)
      .then(response => {
        setMembers(response.data)
        setIsLoading(false)
      })
  }, []);

  const showDetails = (memberId: number) => router.push(`/(main)/(members)/memberdetails?id=${memberId}`)

  return (
    <>
      <View style={{ height:"90%", justifyContent: "center", alignContent: "center" }}>
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
      {clubInfo.role == ROLE_ADMIN &&
        <FloatingMenu
          actions={actions}
          onPressItem={(name: string | undefined) => handleMenuPress(name)}
          icon={<MaterialIcons name={"menu"} size={32} color={"white"} />} />
      }
    </>
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