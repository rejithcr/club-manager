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

const MemberItem = (props: {
  showDetails?: any;
  firstName: string | undefined;
  dateOfBirth: string | undefined;
  dues?: number;
  photo?: string;
  lastName: string | undefined;
  memberId: number;
}) => {
  return (
    <TouchableOpacity onPress={() => props.showDetails(props.memberId)}>
      <ShadowBox style={styles.container}>
        {props?.photo ? <Image source={{ uri: props?.photo }} style={{ height: 32, width: 32, borderRadius: 100, }} />
          : <ThemedIcon style={styles.icon} name={"MaterialIcons:account-circle"} size={32} />}
        <View style={styles.spend}>
          <ThemedText>
            {props.firstName} {props.lastName}
          </ThemedText>
          {props.dateOfBirth ? (
            <ThemedText style={styles.date}>{props.dateOfBirth}</ThemedText>
          ) : null}
        </View>
        <View style={styles.amount}>
          <ThemedText>
            {props?.dues && (props?.dues == 0 ? (
              <ThemedIcon style={styles.icon} name={"MaterialIcons:done-all"} size={32} />
            ) : props?.dues || 0 > 1000 ? (
              "Dues Rs." + (props?.dues || 0 / 1000).toString() + "K"
            ) : (
              "Dues Rs." + props?.dues
            ))}
          </ThemedText>
        </View>
      </ShadowBox>
    </TouchableOpacity>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    margin: 5,
    padding: 10,
    flex: 1,
    width: "80%",
    flexDirection: "row",
    borderColor: "#eee",
    alignItems: "center",
    alignSelf: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: 5
  },
  spend: {
    flex: 0.6,
  },
  amount: {
    flex: 0.2,
    textAlign: "right",
  },
  date: {
    fontSize: 9,
  },
  icon: {
    flex: 0.16,
  },
});
