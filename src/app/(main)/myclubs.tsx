import { View } from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useRouter } from "expo-router/build/hooks";
import TouchableCard from "@/src/components/TouchableCard";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";

const MyClubs = (props: { clubs: [] }) => {
  const router = useRouter();

  const showDetails = (
    clubId: number,
    clubName: string,
    clubDesc: string,
    clubLocation: string,
    role: string,
    upiId: string
  ) => {
    router.push(
      `/(main)/(clubs)?clubId=${clubId}&clubName=${clubName}&clubDesc=${clubDesc}&clubLocation=${clubLocation}&role=${role}&UpiId=${upiId}`
    );
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
      {props.clubs?.map((item: any, idx: number) => (
        <View key={item.clubId}>
          <Animated.View entering={SlideInLeft.duration(380).delay(idx * 80)} style={{ overflow: "hidden" }}>
            <TouchableCard
              onPress={() =>
                showDetails(item.clubId, item.clubName, item.description, item.location, item.roleName, item.upiId)
              }
              id={item.clubId}
            >
              <ThemedText>{item.clubName}</ThemedText>
            </TouchableCard>
            <Spacer space={4} />
          </Animated.View>
        </View>
      ))}
    </ThemedView>
  );
};

export default MyClubs;
