import { View, Text, Alert, FlatList, Switch, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ClubContext } from '@/src/context/ClubContext'
import { getTransactions, saveTransaction } from '@/src/helpers/transaction_helper'
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

const Transactions = () => {
  const [isLoading, setIsloading] = useState(false)
  const [isAddTxnVisible, setIsAddTxnVisible] = useState(false)
  const [txnTypeFilter, setTxnTypeFilter] = useState("ALL")
  const [txnType, setTxnType] = useState("DEBIT")
  const [txnAmount, setTxnAmount] = useState("")
  const [txnCategory, setTxnCategory] = useState("")
  const [txnComment, setTxnComment] = useState("")
  const [isFectching, setIsFetching] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(false)
  const [transactions, setTransactions] = useState<any>([])
  const [showFees, setShowFees] = useState(false)
  const [resfresh, setRefresh] = useState(false)
  const [editTxnValues, setEditTxnValues] = useState<any>({txnType:"", txnCategory: "", txnComment: "", txnAmount: ""})


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
    if (validate(txnCategory, txnComment, txnAmount)) {
      saveTransaction(clubInfo.clubId, txnType, txnCategory, txnComment, Number(txnAmount), userInfo.email)
        .then(() => {
          offset.current = 0;
          setRefresh(prev => !prev)
        })
        .catch(error => Alert.alert("Error", error.response.data.error))
        .finally(() => setIsAddTxnVisible(false))
    }
  }
  const handleEdit = (item: any) => {
    console.log(item)
    setEditTxnValues((prev: any) => ({ ...prev,txnType:item.clubTranscationType,  txnCategory: item.clubTransactionCategory, txnComment: item.clubTransactionComment, txnAmount: item.clubTransactionAmount }))
    setIsAddTxnVisible(true)
  }
  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1, marginBottom: 30 }}>
        <View style={{ width: "80%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }}>
          <Picker style={{ width: "50%" }} enabled={!showFees} itemStyle={{ color: "black" }} onValueChange={setTxnTypeFilter}>
            <Picker.Item value={'ALL'} label='ALL' />
            <Picker.Item value={'DEBIT'} label='DEBIT' />
            <Picker.Item value={'CREDIT'} label='CREDIT' />
          </Picker>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Show Fees</Text>
            <Switch onValueChange={() => setShowFees(prev => !prev)} value={showFees} thumbColor={"black"} />
          </View>
        </View>
        {isLoading && <LoadingSpinner />}
        {!isLoading && transactions?.length == 0 && <Text style={{ textAlign: "center" }}>No transactions found!</Text>}
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
                {item.clubTransactionCategory !='FEE' && item.clubTransactionCategory !='ADHOC-FEE' && <TouchableOpacity style={{ width: "10%" }} onPress={() => handleEdit(item)}>
                  <MaterialCommunityIcons name='square-edit-outline' size={20} />
                </TouchableOpacity>}
                <View style={{ width: "60%" }}>
                  <Text style={{ fontWeight: '500' }}>{item.feeName}</Text>
                  <Text style={{ fontSize: 12 }}>{item.memberName || item.clubTransactionComment}</Text>
                </View>
                <View style={{ alignItems: "flex-end", width: "30%" }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.clubTranscationType === 'CREDIT' ? '+' : '-'} Rs. {item.clubTransactionAmount}</Text>
                  <Text style={{ fontSize: 8 }}>{item.createdDate}</Text>
                </View>
              </View>
            )}
          />
        }
      </View>
      <Modal isVisible={isAddTxnVisible}>
        <View style={{ backgroundColor: "white", borderRadius: 5, paddingBottom: 20 }}>
          <Text style={appStyles.heading}>{editTxnValues ? "Edit" : "Add"} Tansaction</Text>
          <Picker style={{ width: "80%", alignSelf: "center" }} onValueChange={setTxnType} selectedValue={editTxnValues?.txnType || txnType}>
            <Picker.Item value={'DEBIT'} label='DEBIT' />
            <Picker.Item value={'CREDIT'} label='CREDIT' />
          </Picker>
          <InputText label="Category" onChangeText={setTxnCategory} defaultValue={editTxnValues?.txnCategory}/>
          <InputText label="Details" onChangeText={setTxnComment} defaultValue={editTxnValues?.txnComment}/>
          <InputText label="Amount" onChangeText={setTxnAmount} keyboardType={"numeric"} defaultValue={editTxnValues?.txnAmount}/>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <ThemedButton title={"   Save   "} onPress={() => handleSave()} />
            <ThemedButton title="Cancel" onPress={() => setIsAddTxnVisible(false)} />
          </View>
        </View>
      </Modal>
      <FloatingMenu onPressMain={() => {setEditTxnValues(null); setIsAddTxnVisible(true)}}
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