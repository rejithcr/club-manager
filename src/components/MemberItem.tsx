import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const MemberItem = (props: {
  showDetails: any;
  firstName: string;
  date: string;
  amount: string;
  dateOfBirth: string;
  dues: number;
  lastName: string;
  id: number;
}) => {
  return (
    <TouchableOpacity onPress={()=> props.showDetails(props.id)}>
      <View style={styles.container}>
        <MaterialIcons style={styles.icon} name={"account-circle"} size={32} />
        <View style={styles.spend}>
          <Text>
            {props.firstName} {props.lastName}
          </Text>
          {props.dateOfBirth ? (
            <Text style={styles.date}>{props.dateOfBirth}</Text>
          ) : null}
        </View>
        <View style={styles.amount}>
          <Text>
            {props.dues == 0 ? (
              <MaterialIcons style={styles.icon} name={"done-all"} size={32} />
            ) : props.dues > 1000 ? (
              "Dues Rs." + (props.dues / 1000).toString() + "K"
            ) : (
              "Dues Rs." + props.dues
            )}
          </Text>
        </View>
      </View>
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
