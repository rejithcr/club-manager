import { View, Text, FlatList, Button, TextInput, Platform, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedButton from "@/src/components/ThemedButton";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { UserContext } from "@/src/context/UserContext";
import { router } from "expo-router";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";
import { useTheme } from "@/src/hooks/use-theme";
import { isValidYear } from "@/src/utils/validators";
import { getCurrentMonthItem, getCurrentQuarterItem, getMonths, getQuarters } from "@/src/utils/common";
import { useLazyGetFeeCollectionsQuery, useSaveFeeCollectionMutation } from "@/src/services/feeApi";
import RoundedContainer from "@/src/components/RoundedContainer";

const StartNextPeriod = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [periods, setPeriods] = useState<{ period: string; startDate: string }[] | undefined>();
  const [isStartCollectionEnabled, setIsStartCollectionEnabled] = useState(true);

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [nextPeriodDate, setNextPeriodDate] = useState<string>();
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();
  const params = useSearchParams();
  const interval = JSON.parse(params.get("fee") || "").clubFeeTypeInterval;

  const [getNextPeriodFeeMemberList, { data: nextPeriodFee, isLoading: isLoadingPeriods }] =
    useLazyGetFeeCollectionsQuery();

  useEffect(() => {
    if (validate(year)) {
      if (interval != "YEARLY") {
        const periodList = interval === "MONTHLY" ? getMonths(Number(year)) : getQuarters(Number(year));
        setPeriods(periodList);
        setNextPeriodDate(
          interval === "MONTHLY"
            ? getCurrentMonthItem(periodList)?.startDate
            : getCurrentQuarterItem(periodList)?.startDate
        );
      } else {
        setNextPeriodDate(year + "-01-01");
        getNextPeriodFeeMemberList({
          feeTypeId: params.get("clubFeeTypeId"),
          listNextPaymentCollectionList: "true",
        });
      }
      setIsStartCollectionEnabled(true);
    } else {
      if (interval != "YEARLY") {
        setPeriods([]);
      }
      setIsStartCollectionEnabled(false);
    }
  }, [year]);

  useEffect(() => {
    if (periods && periods.length > 0) {
      getNextPeriodFeeMemberList({
        feeTypeId: params.get("clubFeeTypeId"),
        listNextPaymentCollectionList: "true",
      });
    }
  }, [periods]);

  const [saveNextPeriodFeeCollection, { isLoading: isSaving }] = useSaveFeeCollectionMutation();
  const handleStartCollection = async () => {
    let nextPeriodLabel;
    if (interval !== "YEARLY") {
      const nextP = periods?.find((p: any) => p.startDate == nextPeriodDate);
      nextPeriodLabel = nextP?.period + "-" + nextPeriodDate?.substring(0, 4);
    } else {
      nextPeriodLabel = nextPeriodDate?.substring(0, 4);
    }
    try {
      await saveNextPeriodFeeCollection({
        feeTypeId: params.get("clubFeeTypeId"),
        nextPeriodFees: nextPeriodFee,
        nextPeriodDate,
        nextPeriodLabel,
        email: userInfo.email,
      }).unwrap();
      router.dismissTo({
        pathname: "/(main)/(clubs)/(fees)/feetypedetails",
        params: { fee: params.get("fee") },
      });
    } catch (error) {
      console.error("Error saving next period fee collection:", error);
    }
  };
   
  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View
          style={{
            flexDirection: "row",
            width: "80%",
            justifyContent: "space-between",
            alignSelf: "center",
            marginBottom: 10,
            alignItems: "center",
            marginTop: Platform.OS === "web" ? 10 : 0,
          }}
        >
          <ThemedText style={{ width: "35%", fontWeight: "bold" }}>Select Period</ThemedText>
          <View style={{ width: "65%", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
            {interval != "YEARLY" && (
              <Picker
                style={{ width: "64%" }}
                selectedValue={nextPeriodDate}
                onValueChange={(itemValue, _itemIndex) => setNextPeriodDate(itemValue)}
              >
                {periods?.map((monthObj) => {
                  return <Picker.Item key={monthObj.period} label={monthObj.period} value={monthObj.startDate} />;
                })}
              </Picker>
            )}
            <TextInput
              keyboardType="numeric"
              defaultValue={"2025"}
              onChangeText={(text) => setYear(text)}
              style={{
                color: colors.text,
                width: "30%",
                fontSize: 18,
                textAlign: "center",
                borderBottomColor: colors.text,
                borderBottomWidth: 1,
                padding: 1,
              }}
            />
          </View>
        </View>
        <Spacer space={5} />
        <View style={{ flex: 1 }}>
          {isLoadingPeriods && <LoadingSpinner />}
          {!isLoadingPeriods && (
            <FlatList
              style={{ width: "100%" }}
              data={nextPeriodFee}
              initialNumToRender={8}
              ListFooterComponent={() => <Spacer space={40} />}
              ItemSeparatorComponent={() => <Spacer space={4} />}
              renderItem={({ item }) => <MemberFeeItem {...item} key={item.memberId} />}
            />
          )}
        </View>
        <Modal isVisible={isConfirmVisible}>
          <View style={{ backgroundColor: "white" }}>
            <Text>Test</Text>
            <Button title="Hide modal" onPress={() => setIsConfirmVisible(false)} />
          </View>
        </Modal>
        {isSaving ? (
          <LoadingSpinner />
        ) : (
          <ThemedButton
            style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
            title="Start Collection"
            onPress={handleStartCollection}
            disabled={!isStartCollectionEnabled}
          />
        )}
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default StartNextPeriod;

const MemberFeeItem = (props: {
  id: number;
  firstName: string | undefined;
  lastName: string | undefined;
  clubFeeAmount: number;
  exemption: string;
}) => {
  return (
    <RoundedContainer>
      <TouchableOpacity
        style={{
          display: "flex",
          width: "85%",
          padding: 10,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ThemedText>
          {props?.firstName} {props?.lastName}
        </ThemedText>
        <ThemedText>{props?.clubFeeAmount}</ThemedText>
      </TouchableOpacity>
    </RoundedContainer>
  );
};

const validate = (year: string) => {
  if (!isValidYear(year)) {
    return false;
  }
  return true;
};
