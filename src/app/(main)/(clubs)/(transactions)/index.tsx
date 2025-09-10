import { View, FlatList, Switch, TouchableOpacity, RefreshControl, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ClubContext } from '@/src/context/ClubContext'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import FloatingMenu from '@/src/components/FloatingMenu'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import Modal from 'react-native-modal'
import ThemedButton from '@/src/components/ThemedButton'
import { appStyles } from '@/src/utils/styles'
import InputText from '@/src/components/InputText'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import { UserContext } from '@/src/context/UserContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { useTheme } from '@/src/hooks/use-theme'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import { ROLE_ADMIN } from '@/src/utils/constants'
import DatePicker from '@/src/components/DatePicker'
import Alert, { AlertProps } from '@/src/components/Alert'
import { useAddTransactionMutation, useDeleteTransactionMutation, useGetTransactionsQuery, useUpdateTransactionMutation } from '@/src/services/feeApi'
import usePaginatedQuery from '@/src/hooks/usePaginatedQuery'
import Spacer from '@/src/components/Spacer'

const limit = 20;

const Transactions = () => {
  const [isAddTxnVisible, setIsAddTxnVisible] = useState(false)
  const [txnTypeFilter, setTxnTypeFilter] = useState("ALL")
  const [showFees, setShowFees] = useState(false)
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [txnValues, setTxnValues] = useState<any>({ txnId: null, txnType: "DEBIT", txnDate: new Date(), txnCategory: "", txnComment: "", txnAmount: "" })
  const { clubInfo } = useContext(ClubContext)
  const { userInfo } = useContext(UserContext)
  const { colors } = useTheme()

  const {
    items,
    isLoading: isTxnsLoading,
    loadMore,
    isFetching: isTxnsFetching,
    refreshing,
    onRefresh,
  } = usePaginatedQuery(useGetTransactionsQuery, { clubId: clubInfo.clubId, txnType: txnTypeFilter, showFees }, limit);

  
  useEffect(() => {
    onRefresh();
  }, [txnTypeFilter, showFees]);
  

  const [addTransaction, {isLoading: isAddingTxn}] = useAddTransactionMutation();
  const [updateTransaction, {isLoading: isUpdatingTxn}] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleSave = async () => {
    if (validate(txnValues?.txnCategory, txnValues?.txnComment, txnValues?.txnAmount)) {
      if (txnValues?.txnId) {
        await updateTransaction({
          txnId: txnValues.txnId,
          txnType: txnValues.txnType,
          txnDate: txnValues.txnDate,
          txnCategory: txnValues.txnCategory,
          txnComment: txnValues.txnComment,
          txnAmount: Number(txnValues.txnAmount),
          email: userInfo.email
        });
      } else {
        await addTransaction({
          clubId: clubInfo.clubId,
          txnDate: txnValues.txnDate || new Date(),
          txnType: txnValues.txnType,
          txnCategory: txnValues.txnCategory,
          txnComment: txnValues.txnComment,
          txnAmount: Number(txnValues.txnAmount),
          email: userInfo.email,
        });
      }
      setIsAddTxnVisible(false);
    }
  }
  const handleDelete = () => {
    setAlertConfig({
      visible: true,
      title: "Are you sure!",
      message: "This will delete the transcation. This cannot be recovered.",
      buttons: [
        {
          text: "OK",
          onPress: async () => {
            setAlertConfig({ visible: false });
            setIsAddTxnVisible(false);
            await deleteTransaction({ txnId: txnValues.txnId });
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };

  const handleEdit = (item: any) => {
    if(item.clubTransactionCategory != 'FEE' && item.clubTransactionCategory != 'ADHOC-FEE' && clubInfo.role === ROLE_ADMIN){
      setTxnValues({ txnId: item.clubTransactionId, txnType: item.clubTranscationType, txnDate: new Date(item.clubTransactionDate), 
        txnCategory: item.clubTransactionCategory, txnComment: item.clubTransactionComment, txnAmount: item.clubTransactionAmount });
      setIsAddTxnVisible(true);
    }
  }
  const handleTxnTypeChange = (value: string) => {
    setTxnValues((prev: any) => ({ ...prev, txnType: value }))
  }

  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1 }}>
        <View style={{
          width: "80%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between",
          marginVertical: Platform.OS === 'web' ? 20 : 0
        }}>
          <Picker style={{ width: "50%" }} enabled={!showFees} onValueChange={setTxnTypeFilter}>
            <Picker.Item value={'ALL'} label='ALL' />
            <Picker.Item value={'DEBIT'} label='DEBIT' />
            <Picker.Item value={'CREDIT'} label='CREDIT' />
          </Picker>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedText>Show Fees</ThemedText>
            <Switch onValueChange={() => setShowFees(prev => !prev)} value={showFees} />
          </View>
        </View>
        {isTxnsLoading ? <LoadingSpinner /> :
          <FlatList style={{ width: "100%" }}
            ItemSeparatorComponent={() => <View style={{ marginVertical: 7, borderBottomWidth: .3, borderBottomColor: "grey", width: "85%", alignSelf: "center" }} />}
            ListFooterComponent={() => isTxnsFetching && <LoadingSpinner /> || <View style={{ marginVertical: 30 }} />}
            data={items}
            initialNumToRender={limit}
            onEndReached={loadMore}
            ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No transactions found!</ThemedText>}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEdit(item)} style={{
                width: "85%", alignSelf: "center", alignItems: "center",
                flexDirection: "row", justifyContent: "space-between"
              }}>
                <View style={{ flexDirection: 'row' }}>
                  <View>
                    <ThemedText style={{ fontWeight: '500' }}>{item.feeName}</ThemedText>
                    <ThemedText style={{ fontSize: 12 }}>{item.memberName || item.clubTransactionComment}</ThemedText>
                  </View>
                  <Spacer hspace={5} />
                  {item.clubTransactionCategory != 'FEE' && item.clubTransactionCategory != 'ADHOC-FEE' && clubInfo.role === ROLE_ADMIN &&                  
                    <MaterialCommunityIcons name='square-edit-outline' size={12} color={"#546E7A"} />}
                    </View>
                <View style={{ alignItems: "flex-end"}}>
                  <ThemedText style={{ fontWeight: 'bold', color: item.clubTranscationType === 'CREDIT' ? colors.success : colors.error }}>{item.clubTranscationType === 'CREDIT' ? '+' : '-'} Rs. {item.clubTransactionAmount}</ThemedText>
                  <ThemedText style={{ fontSize: 8 }}>{item.clubTransactionDate}</ThemedText>
                </View>
              </TouchableOpacity>
            )}
          />
        }
      </ThemedView>
      <Modal isVisible={isAddTxnVisible}>
        <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}> 
          <ThemedText style={appStyles.heading}>{txnValues?.txnId ? "Edit" : "Add"} Tansaction</ThemedText>
          <Picker style={{ width: "80%", alignSelf: "center" }}
            onValueChange={handleTxnTypeChange} selectedValue={txnValues?.txnType}>
            <Picker.Item value={'DEBIT'} label='DEBIT' />
            <Picker.Item value={'CREDIT'} label='CREDIT' />
          </Picker>
          <DatePicker date={txnValues?.txnDate || new Date()} setDate={(value: Date) => setTxnValues((prev: any) => ({ ...prev, txnDate: value }))} label='Date'/>
          <InputText label="Category" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnCategory: value }))} defaultValue={txnValues?.txnCategory} />
          <InputText label="Details" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnComment: value }))} defaultValue={txnValues?.txnComment} />
          <InputText label="Amount" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnAmount: value }))} keyboardType={"numeric"} defaultValue={txnValues?.txnAmount?.toString()} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
            {isAddingTxn || isUpdatingTxn ? <LoadingSpinner />
            : <ThemedButton title={"   Save   "} onPress={() => handleSave()} />}
            <ThemedButton title="Cancel" onPress={() => setIsAddTxnVisible(false)} />
            {txnValues?.txnId && <ThemedIcon name='MaterialCommunityIcons:delete' size={30} onPress={() => handleDelete()} color={colors.error} />}
          </View>
        </ThemedView>
      </Modal>
      {alertConfig?.visible && <Alert {...alertConfig} />}
      {clubInfo.role === ROLE_ADMIN &&
        <FloatingMenu onPressMain={() => { setTxnValues({ txnType: "DEBIT" }); setIsAddTxnVisible(true) }}
          icon={<MaterialIcons name={"add"} size={32} color={"white"} />}
        />}
    </GestureHandlerRootView>
  )
}

export default Transactions


const validate = (txnTypeCategory: string | null, txnTypeComment: string | null, txnAmount: string) => {
  if (!isValidLength(txnTypeCategory, 2)) {
    alert("Enter atleast 2 characters for category")
    return false
  }
  if (!isValidLength(txnTypeComment, 2)) {
    alert("Enter atleast 2 characters for comment")
    return false
  }
  if (!isCurrency(txnAmount)) {
    alert("Enter numeric value for amount")
    return false
  }
  return true
}