import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router/build/hooks";
import TouchableCard from "@/src/components/TouchableCard";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Divider from "@/src/components/Divider";
import RoundedContainer from "@/src/components/RoundedContainer";
import { useContext } from "react";
import { ClubContext } from "@/src/context/ClubContext";

const MyClubs = (props: { clubs: [] }) => {
  const router = useRouter();
  const { setClubInfo } = useContext(ClubContext);

  const showDetails = async (
    clubId: number,
    clubName: string,
    role: string
  ) => {
    await setClubInfo({ clubId, clubName, role });
    router.push('/(main)/(clubs)');
  };

  return (
    <ThemedView>
      {props.clubs?.length == 0 && (
        <ThemedView style={{ alignSelf: "center", width: "80%", justifyContent: "center", alignItems: "center" }}>
          <ThemedText style={{ marginTop: 20 }}>Request to join a club</ThemedText>
          <ThemedIcon
            name="MaterialIcons:add-home"
            size={50}
            onPress={() => router.push(`/(main)/(members)/joinclub`)}
          />
          <ThemedText style={{ marginTop: 20 }}>Create a new club</ThemedText>
          <ThemedIcon name="MaterialIcons:add-circle" size={50} onPress={() => router.push(`/(main)/createclub`)} />
        </ThemedView>
      )}
      <RoundedContainer visible={props.clubs?.length !== 0}>
        {props.clubs?.map((item: any, idx: number) => (
          <View key={item.clubId}>
            <View style={{ marginVertical: 5 }}>
              <Animated.View entering={FadeInUp.duration(380).delay(idx * 80)} style={{ overflow: "hidden" }}>
                <TouchableCard
                  onPress={() =>
                    showDetails(item.clubId, item.clubName, item.roleName)
                  }
                  id={item.clubId}
                >
                  <ThemedText>{item.clubName}</ThemedText>
                </TouchableCard>
              </Animated.View>
            </View>
            {idx < props.clubs.length - 1 && <Divider />}
          </View>
        ))}
      </RoundedContainer>
    </ThemedView>
  );
};

export default MyClubs;
