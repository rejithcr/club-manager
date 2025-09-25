import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router/build/hooks";
import TouchableCard from "@/src/components/TouchableCard";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Divider from "@/src/components/Divider";
import { useTheme } from "@/src/hooks/use-theme";
import RoundedContainer from "@/src/components/RoundedContainer";

const MyClubs = (props: { clubs: [] }) => {
  const router = useRouter();
  const { colors } = useTheme();

  const showDetails = (
    clubId: number,
    clubName: string,
    clubDesc: string,
    clubLocation: string,
    role: string,
    upiId: string
  ) => {
    router.push(
      `/(main)/(clubs)?clubId=${clubId}&clubName=${clubName}&clubDesc=${clubDesc}&clubLocation=${clubLocation}&role=${role}&upiId=${upiId}`
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
      <RoundedContainer>
        {props.clubs?.map((item: any, idx: number) => (
          <View key={item.clubId}>
            <View style={{ marginVertical: 5 }}>
              <Animated.View entering={FadeInUp.duration(380).delay(idx * 80)} style={{ overflow: "hidden" }}>
                <TouchableCard
                  onPress={() =>
                    showDetails(item.clubId, item.clubName, item.description, item.location, item.roleName, item.upiId)
                  }
                  id={item.clubId}
                >
                  <ThemedText style={{ fontSize: 16 }}>{item.clubName}</ThemedText>
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
