import { View, Text, Alert, FlatList, Switch, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ClubContext } from '@/src/context/ClubContext'
import { deleteTransaction, getTransactions, saveTransaction, updateTransaction } from '@/src/helpers/transaction_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import FloatingMenu from '@/src/components/FloatingMenu'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import Modal from 'react-native-modal'
import ThemedButton from '@/src/components/ThemedButton'
import { appStyles } from '@/src/utils/styles'
import InputText from '@/src/components/InputText'
import { isNumeric, isValidLength } from '@/src/utils/validators'
import { AuthContext } from '@/src/context/AuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'

const Transactions = () => {
  const [isLoading, setIsloading] = useState(false)
  const [isAddTxnVisible, setIsAddTxnVisible] = useState(false)
  const [txnTypeFilter, setTxnTypeFilter] = useState("ALL")
  const [isFectching, setIsFetching] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(false)
  const [transactions, setTransactions] = useState<any>([])
  const [showFees, setShowFees] = useState(false)
  const [resfresh, setRefresh] = useState(false)
  const [txnValues, setTxnValues] = useState<any>({ txnId: null, txnType: "DEBIT", txnCategory: "", txnComment: "", txnAmount: "" })

  const { clubInfo } = useContext(ClubContext)
  const { userInfo } = useContext(AuthContext)

  const offset = useRef(0)
  const limit = 20

  useEffect(() => {
    setIsloading(true)
    offset.current = 0
    getTransactions(clubInfo.clubId, txnTypeFilter, showFees, limit, offset.current)
      .then(response => {
        setHasMoreData(response.data?.length > 0);
        setTransactions(response.data)
      })
      .catch(error => Alert.alert("Error", error.response.data.error))
      .finally(() => setIsloading(false))
  }, [resfresh, txnTypeFilter, showFees])

  const fetchNextPage = () => {
    if (hasMoreData && !isFectching) {
      setIsFetching(true)
      offset.current = offset.current + limit
      getTransactions(clubInfo.clubId, txnTypeFilter, showFees, limit, offset.current)
        .then(response => {
          setHasMoreData(response.data?.length > 0);
          setTransactions((prev: any) => [...prev, ...response.data])
        })
        .catch(error => Alert.alert("Error", error.response.data.error))
        .finally(() => setIsFetching(false))
    }
  }

  const handleSave = () => {
    if (validate(txnValues?.txnCategory, txnValues?.txnComment, txnValues?.txnAmount)) {
      if (txnValues?.txnId) {
        updateTransaction(txnValues.txnId, txnValues.txnType, txnValues.txnCategory, txnValues.txnComment, Number(txnValues.txnAmount), userInfo.email)
          .then(() => {
            offset.current = 0;
            setRefresh(prev => !prev)
          })
          .catch(error => Alert.alert("Error", error.response.data.error))
          .finally(() => setIsAddTxnVisible(false))
      } else {
        saveTransaction(clubInfo.clubId, txnValues.txnType, txnValues.txnCategory, txnValues.txnComment, Number(txnValues.txnAmount), userInfo.email)
          .then(() => {
            offset.current = 0;
            setRefresh(prev => !prev)
          })
          .catch(error => Alert.alert("Error", error.response.data.error))
          .finally(() => setIsAddTxnVisible(false))
      }
    }
  }
  const handleDelete = () => {
    console.log(txnValues)
    Alert.alert(
      'Are you sure!',
      'This will delete the transcation. This cannot be recovered.',
      [
        {
          text: 'OK', onPress: () => {
            setIsloading(true)
            deleteTransaction(txnValues.txnId)
              .then(() => {
                offset.current = 0;
                setRefresh(prev => !prev)
              })
              .catch((error: { response: { data: { error: string | undefined } } }) => {
                setIsloading(true); Alert.alert("Error", error.response.data.error)})
              .finally(() => setIsAddTxnVisible(false))
          }
        },
        { text: 'cancel', onPress: () => null },
      ],
      { cancelable: true },
    );
  }

  const handleEdit = (item: any) => {
    setTxnValues({ txnId: item.clubTransactionId, txnType: item.clubTranscationType, txnCategory: item.clubTransactionCategory, txnComment: item.clubTransactionComment, txnAmount: item.clubTransactionAmount })
    setIsAddTxnVisible(true)
  }
  const handleTxnTypeChange = (value: string) => {
    setTxnValues((prev: any) => ({ ...prev, txnType: value }))
  }
  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1}}>
        <View style={{ width: "80%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
          <Picker style={{ width: "50%"}} enabled={!showFees} onValueChange={setTxnTypeFilter}>
            <Picker.Item value={'ALL'} label='ALL' />
            <Picker.Item value={'DEBIT'} label='DEBIT' />
            <Picker.Item value={'CREDIT'} label='CREDIT' />
          </Picker>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedText>Show Fees</ThemedText>
            <Switch onValueChange={() => setShowFees(prev => !prev)} value={showFees} />
          </View>
        </View>
        {isLoading && <LoadingSpinner />}
        {!isLoading && transactions?.length == 0 && <ThemedText style={{ textAlign: "center" }}>No transactions found!</ThemedText>}
        {!isLoading && transactions &&
          <FlatList style={{ width: "100%" }}
            ItemSeparatorComponent={() => <View style={{ marginVertical: 7, borderBottomWidth: .2, borderBottomColor: "grey", width: "80%", alignSelf: "center" }} />}
            ListFooterComponent={() => isFectching && <LoadingSpinner /> || <View style={{ marginVertical: 30 }} />}
            data={transactions}
            initialNumToRender={8}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.2}
            renderItem={({ item }) => (
              <View style={{
                width: "85%", alignSelf: "center", alignItems: "center",
                flexDirection: "row", justifyContent: "flex-end"
              }}>
                {item.clubTransactionCategory != 'FEE' && item.clubTransactionCategory != 'ADHOC-FEE' && <TouchableOpacity style={{ width: "10%" }} onPress={() => handleEdit(item)}>
                  <MaterialCommunityIcons name='square-edit-outline' size={20} color={"#546E7A"}/>
                </TouchableOpacity>}
                <View style={{ width: "60%" }}>
                  <ThemedText style={{ fontWeight: '500' }}>{item.feeName}</ThemedText>
                  <ThemedText style={{ fontSize: 12 }}>{item.memberName || item.clubTransactionComment}</ThemedText>
                </View>
                <View style={{ alignItems: "flex-end", width: "30%" }}>
                  <ThemedText style={{ fontWeight: 'bold' }}>{item.clubTranscationType === 'CREDIT' ? '+' : '-'} Rs. {item.clubTransactionAmount}</ThemedText>
                  <ThemedText style={{ fontSize: 8 }}>{item.createdDate}</ThemedText>
                </View>
              </View>
            )}
          />
        }
      </ThemedView>
      <Modal isVisible={isAddTxnVisible} backdropColor='grey'>
        <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
          <ThemedText style={appStyles.heading}>{txnValues?.txnId ? "Edit" : "Add"} Tansaction</ThemedText>
          <Picker style={{ width: "80%", alignSelf: "center" }} 
            onValueChange={handleTxnTypeChange} selectedValue={txnValues?.txnType}>
            <Picker.Item value={'DEBIT'} label='DEBIT' />
            <Picker.Item value={'CREDIT'} label='CREDIT' />
          </Picker>
          <InputText label="Category" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnCategory: value }))} defaultValue={txnValues?.txnCategory} />
          <InputText label="Details" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnComment: value }))} defaultValue={txnValues?.txnComment} />
          <InputText label="Amount" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnAmount: value }))} keyboardType={"numeric"} defaultValue={txnValues?.txnAmount?.toString()} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
            <ThemedButton title={"   Save   "} onPress={() => handleSave()} />
            <ThemedButton title="Cancel" onPress={() => setIsAddTxnVisible(false)} />              
            {txnValues?.txnId && <MaterialCommunityIcons name='delete' size={30} onPress={() => handleDelete()} />}
          </View>
        </ThemedView>
      </Modal>
      <FloatingMenu onPressMain={() => { setTxnValues({txnType:"DEBIT"}); setIsAddTxnVisible(true) }}
        icon={<MaterialIcons name={"add"} size={32} color={"white"} />}
      />
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
  if (!isNumeric(txnAmount)) {
    alert("Enter numeric value for amount")
    return false
  }
  return true
}