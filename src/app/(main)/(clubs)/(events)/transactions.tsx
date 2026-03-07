import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedButton from "@/src/components/ThemedButton";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import InputText from "@/src/components/InputText";
import DatePicker from "@/src/components/DatePicker";
import Spacer from "@/src/components/Spacer";
import Divider from "@/src/components/Divider";
import { appStyles } from "@/src/utils/styles";
import { useTheme } from "@/src/hooks/use-theme";
import { ClubContext } from "@/src/context/ClubContext";
import { MemberRoleContext } from "@/src/context/MemberRoleContext";
import { UserContext } from "@/src/context/UserContext";
import { ROLE_ADMIN } from "@/src/utils/constants";
import {
  useGetEventTransactionsQuery,
  useAddEventTransactionMutation,
  useUpdateEventTransactionMutation,
  useDeleteEventTransactionMutation,
  useGetEventTransactionCategoriesQuery,
  useAddEventTransactionCategoryMutation,
} from "@/src/services/feeApi";
import { useSearchParams, useRouter } from "expo-router/build/hooks";
import FloatingMenu from "@/src/components/FloatingMenu";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import RoundedContainer from "@/src/components/RoundedContainer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";

const limit = 50

const EventTransactions = () => {
  const params = useSearchParams();
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const { memberRoles } = useContext(MemberRoleContext);
  const currentRole = memberRoles?.[clubInfo?.clubId] || clubInfo?.role;
  const { colors } = useTheme();
  const eventId = params.get("eventId");

  const [txnValues, setTxnValues] = useState<any>({
    txnId: null,
    txnType: "DEBIT",
    txnDate: new Date(),
    txnCategoryId: "",
    txnComment: "",
    txnAmount: "",
  });
  const [isAddTxnVisible, setIsAddTxnVisible] = useState(false);
  const [txnCategoryFilter, setTxnCategoryFilter] = useState("-1");
  const router = useRouter();
  const [txnTypeFilter, setTxnTypeFilter] = useState("ALL");

  const { data: categories = [], refetch: refetchCategories } = useGetEventTransactionCategoriesQuery({
    clubId: clubInfo.clubId,
  });
  const [addCategory, { isLoading: isAddingCategory }] = useAddEventTransactionCategoryMutation();
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    items,
    isLoading: isTxnsLoading,
    loadMore,
    isFetching: isTxnsFetching,
    refreshing,
    onRefresh,
  } = usePaginatedQuery(useGetEventTransactionsQuery, { eventId, txnType: txnTypeFilter, txnCategoryId: txnCategoryFilter }, limit);

  const [addEventTxn, { isLoading: isAdding }] = useAddEventTransactionMutation();
  const [updateEventTxn, { isLoading: isUpdating }] = useUpdateEventTransactionMutation();
  const [deleteEventTxn, { isLoading: isDeleting }] = useDeleteEventTransactionMutation();

  useEffect(() => {
    onRefresh();
  }, [txnTypeFilter, txnCategoryFilter]);

  const openAdd = () => {
    setTxnValues({
      txnId: null,
      txnType: "DEBIT",
      txnDate: new Date(),
      txnCategoryId: "",
      txnComment: "",
      txnAmount: "",
    });
    setIsAddTxnVisible(true);
  };

  const handleSave = async () => {
    if (!txnValues.txnCategoryId) {
      alert("Select category");
      return;
    }
    if (!txnValues.txnComment || txnValues.txnComment.length < 2) {
      alert("Enter details");
      return;
    }
    if (!txnValues.txnAmount || isNaN(Number(txnValues.txnAmount))) {
      alert("Enter amount");
      return;
    }

    if (txnValues.txnId) {
      await updateEventTxn({ ...txnValues, eventId, txnAmount: Number(txnValues.txnAmount), email: userInfo.email });
    } else {
      await addEventTxn({ ...txnValues, eventId, txnAmount: Number(txnValues.txnAmount), email: userInfo.email });
    }
    setIsAddTxnVisible(false);
    onRefresh();
  };

  const handleDelete = async () => {
    await deleteEventTxn({ txnId: txnValues.txnId });
    setIsAddTxnVisible(false);
    onRefresh();
  };

  // Finalization to club transactions is handled when event status is updated elsewhere.

  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={Platform.OS === "web" ? 5 : 0} />
      <RoundedContainer>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
            width: "85%",
            marginVertical: Platform.OS === "web" ? 10 : 0,
          }}
        >
          <Picker style={{ width: 125 }} onValueChange={setTxnTypeFilter} selectedValue={txnTypeFilter}>
            <Picker.Item value={"ALL"} label="ALL" />
            <Picker.Item value={"DEBIT"} label="DEBIT" />
            <Picker.Item value={"CREDIT"} label="CREDIT" />
          </Picker>
          <Picker
            style={{ width: 125 }}
            onValueChange={(val) => {
              if (val === '__edit__') {
                router.push({ pathname: '/(main)/(clubs)/(events)/transactioncategories', params: { eventId } });
                return;
              }
              setTxnCategoryFilter(val);
            }}
            selectedValue={txnCategoryFilter}
          >
            <Picker.Item value={"-1"} label={"ALL"} />
            {categories.map((c: any) => (
              <Picker.Item
                key={c.eventCategoryTypeId}
                value={c.eventCategoryTypeId}
                label={c.eventCategoryName.toUpperCase()}
              />
            ))}
            <Picker.Item value="__edit__" label="± Edit Categories" />
          </Picker>
        </View>
      </RoundedContainer>
      <Spacer space={10} />
      {isTxnsLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={items}
          ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No transactions found!</ThemedText>}
          onEndReachedThreshold={0.5}
          onRefresh={onRefresh}
          refreshing={refreshing}
          initialNumToRender={limit}
          onEndReached={loadMore}
          ListFooterComponent={() =>
            (isTxnsFetching && (
              <>
                <Spacer space={10} />
                <LoadingSpinner />
              </>
            )) || items?.length !== 0 && (
              <ThemedText style={{ alignSelf: "center", paddingBottom: 60, paddingTop: 10 }}>
                No more transactions
              </ThemedText>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              disabled={currentRole !== ROLE_ADMIN}
              onPress={() => {
                setTxnValues({
                  txnId: item.eventTransactionId,
                  txnType: item.eventTransactionType,
                  txnDate: new Date(item.eventTransactionDate),
                  txnCategoryId: item.eventTransactionCategoryTypeId,
                  txnComment: item.eventTransactionComment,
                  txnAmount: item.eventTransactionAmount,
                  lastUpdatedBy: item.updatedBy
                });
                setIsAddTxnVisible(true);
              }}
              style={{ width: "85%", alignSelf: "center" }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}>
                <View>
                  <View style={{ flexDirection: "row", }}>
                    <ThemedText style={{ fontWeight: "600" }}>{item.eventCategoryName}</ThemedText>
                    <Spacer hspace={2} />
                    {currentRole === ROLE_ADMIN && <MaterialCommunityIcons name='square-edit-outline' size={12} color={"#546E7A"} />}
                  </View>
                  <ThemedText style={{ fontSize: 12 }}>{item.eventTransactionComment}</ThemedText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <ThemedText
                    style={{
                      fontWeight: "bold",
                      color: item.eventTransactionType === "CREDIT" ? colors.success : colors.error,
                    }}
                  >
                    {item.eventTransactionType === "CREDIT" ? "+" : "-"} ₹ {item.eventTransactionAmount}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 10 }}>{item.eventTransactionDate}</ThemedText>
                </View>
              </View>
              <Divider />
            </TouchableOpacity>
          )}
        />
      )}

      <Modal isVisible={isAddTxnVisible}>
        <ThemedView style={{ borderRadius: 25, padding: 16 }}>
          <ThemedText style={appStyles.heading}>{txnValues?.txnId ? "Edit" : "Add"} Event Transaction</ThemedText>
          <Picker
            style={{ width: "80%", alignSelf: "center" }}
            selectedValue={txnValues?.txnType}
            onValueChange={(v) => setTxnValues((p: any) => ({ ...p, txnType: v }))}
          >
            <Picker.Item value={"DEBIT"} label={"DEBIT"} />
            <Picker.Item value={"CREDIT"} label={"CREDIT"} />
          </Picker>
          <DatePicker
            date={txnValues?.txnDate || new Date()}
            setDate={(d: Date) => setTxnValues((p: any) => ({ ...p, txnDate: d }))}
            label="Date"
          />
          <Picker
            style={{ width: "80%", alignSelf: "center" }}
            selectedValue={txnValues?.txnCategoryId}
            onValueChange={(val) => {
              if (val === "__ADD_NEW__") {
                setIsAddCategoryVisible(true);
              } else setTxnValues((p: any) => ({ ...p, txnCategoryId: val }));
            }}
          >
            <Picker.Item value={""} label={"Select category"} />
            {categories.map((c: any) => (
              <Picker.Item key={c.eventCategoryTypeId} value={c.eventCategoryTypeId} label={c.eventCategoryName} />
            ))}
            <Picker.Item value={"__ADD_NEW__"} label={"+ Add Category"} />
          </Picker>
          <InputText
            label="Details"
            defaultValue={txnValues?.txnComment}
            onChangeText={(t: any) => setTxnValues((p: any) => ({ ...p, txnComment: t }))}
          />
          <InputText
            label="Amount"
            defaultValue={txnValues?.txnAmount?.toString()}
            keyboardType="numeric"
            onChangeText={(t: any) => setTxnValues((p: any) => ({ ...p, txnAmount: t }))}
          />
          {txnValues?.lastUpdatedBy && <ThemedText style={{ width: "80%", alignSelf: "center", fontSize: 12, color: colors.subText }}>Updated by: {txnValues?.lastUpdatedBy}</ThemedText>}
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 16 }}>
            {isAdding || isUpdating || isDeleting ? (
              <LoadingSpinner />
            ) : (
              <>
                <ThemedButton title="Save" onPress={() => handleSave()} />
                <ThemedButton title="Cancel" onPress={() => setIsAddTxnVisible(false)} />
                {txnValues?.txnId && <ThemedIcon name='MaterialCommunityIcons:delete' size={30} onPress={() => handleDelete()} color={colors.error} />}
              </>
            )}
          </View>
        </ThemedView>
      </Modal>

      <Modal isVisible={isAddCategoryVisible} onBackdropPress={() => setIsAddCategoryVisible(false)}>
        <ThemedView style={{ borderRadius: 25, padding: 16 }}>
          <ThemedText style={appStyles.heading}>Add category</ThemedText>
          <InputText label="Category name" defaultValue={newCategoryName} onChangeText={(t: any) => setNewCategoryName(t)} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 16 }}>
            {isAddingCategory ? (
              <LoadingSpinner />
            ) : (
              <ThemedButton
                title="Save"
                onPress={async () => {
                  if (!newCategoryName || newCategoryName.trim().length < 2) {
                    alert("Enter at least 2 characters");
                    return;
                  }
                  const res: any = await addCategory({ clubId: clubInfo.clubId, categoryName: newCategoryName.trim() });
                  const createdId = res?.data?.categoryId || res?.categoryId || null;
                  setNewCategoryName("");
                  setIsAddCategoryVisible(false);
                  await refetchCategories();
                  if (createdId) setTxnValues((p: any) => ({ ...p, txnCategoryId: createdId }));
                }}
              />
            )}
            <ThemedButton title="Cancel" onPress={() => setIsAddCategoryVisible(false)} />
          </View>
        </ThemedView>
      </Modal>

      {currentRole === ROLE_ADMIN && (
        <FloatingMenu
          onPressMain={() => {
            openAdd();
          }}
          icon={<MaterialIcons name={"add"} size={32} color={"white"} />}
        />
      )}
    </ThemedView>
  );
};

export default EventTransactions;
