import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import ThemedText from "./themed-components/ThemedText";
import ThemedIcon from "./themed-components/ThemedIcon";
import ShadowBox from "./ShadowBox";
import Spacer from "./Spacer";
import { useTheme } from "../hooks/use-theme";

const MemberItem = (props: {
  showDetails?: any;
  firstName: string | undefined;
  photo?: string;
  lastName: string | undefined;
  memberId: number;
  isRegistered?: number;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={() => props.showDetails(props.memberId)}>
      <ShadowBox style={styles.container}>
        {props?.photo ? <Image source={{ uri: props?.photo }} style={{ height: 32, width: 32, borderRadius: 100, }} />
          : <ThemedIcon name={"MaterialIcons:account-circle"} size={32} />}

        <Spacer hspace={5} />
        <View style={{ flexDirection: "row" }}>
          <ThemedText>{props.firstName} {props.lastName}</ThemedText>
          <Spacer hspace={2} />
          {props.isRegistered === 1 && <ThemedIcon name='MaterialIcons:verified-user' color={colors.success} />}
        </View>
      </ShadowBox>
    </TouchableOpacity>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: "80%",
    flexDirection: "row",
    alignSelf: "center"
  }
});
