import { View, FlatList, Switch, TouchableOpacity, Platform } from 'react-native'
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
import { useAddTransactionMutation, useDeleteTransactionMutation, useGetTransactionsQuery, useUpdateTransactionMutation, useGetTransactionCategoriesQuery, useAddTransactionCategoryMutation } from '@/src/services/feeApi'
import usePaginatedQuery from '@/src/hooks/usePaginatedQuery'
import Spacer from '@/src/components/Spacer'
import Divider from '@/src/components/Divider'
import RoundedContainer from '@/src/components/RoundedContainer'

const limit = 20;

const Transactions = () => {
  const [isAddTxnVisible, setIsAddTxnVisible] = useState(false);
  const [isFeeDetailsVisible, setIsFeeDetailsVisible] = useState(false);
  const [txnTypeFilter, setTxnTypeFilter] = useState("ALL");
  const [txnCategoryFilter, setTxnCategoryFilter] = useState("-1");
  const [showFees, setShowFees] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();
  const { data: categories = [], refetch: refetchCategories } = useGetTransactionCategoriesQuery({ clubId: clubInfo.clubId });
  const [addCategory, { isLoading: isAddingCategory }] = useAddTransactionCategoryMutation();
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    items,
    isLoading: isTxnsLoading,
    loadMore,
    isFetching: isTxnsFetching,
    refreshing,
    onRefresh,
  } = usePaginatedQuery(useGetTransactionsQuery, { clubId: clubInfo.clubId, txnType: txnTypeFilter, txnCategoryId: txnCategoryFilter, showFees }, limit);

  useEffect(() => {
    onRefresh();
  }, [txnTypeFilter, showFees, txnCategoryFilter]);
  
  const [addTransaction, {isLoading: isAddingTxn}] = useAddTransactionMutation();
  const [updateTransaction, {isLoading: isUpdatingTxn}] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [txnValues, setTxnValues] = useState<any>({
    txnId: null,
    txnType: "DEBIT",
    txnDate: new Date(),
    txnCategory: null,
    txnCategoryId: null,
    txnComment: "",
    txnAmount: "",
  });

  const handleSave = async () => {
    if (validate(txnValues?.txnCategoryId, txnValues?.txnComment, txnValues?.txnAmount)) {
      if (txnValues?.txnId) {
        await updateTransaction({
          txnId: txnValues.txnId,
          txnType: txnValues.txnType,
          txnDate: txnValues.txnDate,
          txnCategory: getCategory(txnValues.txnCategoryId),
          txnCategoryId: txnValues.txnCategoryId,
          txnComment: txnValues.txnComment,
          txnAmount: Number(txnValues.txnAmount),
          email: userInfo.email
        });
      } else {
        await addTransaction({
          clubId: clubInfo.clubId,
          txnDate: txnValues.txnDate || new Date(),
          txnType: txnValues.txnType,
          txnCategory: getCategory(txnValues.txnCategoryId),
          txnCategoryId: txnValues.txnCategoryId,
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
        txnCategory: item.clubTransactionCategory, txnComment: item.clubTransactionComment, txnAmount: item.clubTransactionAmount,
        txnCategoryId: item.clubTransactionCategoryTypeId, lastUpdatedBy: item.updatedBy });
      setIsAddTxnVisible(true);
    } else if (clubInfo.role === ROLE_ADMIN){
      setTxnValues({ lastUpdatedBy: item.updatedBy, feeType: item.clubTransactionCategory });
      setIsFeeDetailsVisible(true);
    }
  }
  const handleTxnTypeChange = (value: string) => {
    setTxnValues((prev: any) => ({ ...prev, txnType: value }))
  }

  const getCategory = (id: number) => {
    return categories.find((c: any)=> c.categoryId == id)?.categoryName;
  }
  
  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1 }}> 
         <Spacer space={Platform.OS === 'web' ? 5 : 0} />                        
          <View style={{ flexDirection: "row", alignSelf:"center",  justifyContent:"flex-end", alignItems: "center",  width: "85%"}}>
            <ThemedText>Show Fees</ThemedText>
            <Switch onValueChange={() => setShowFees(prev => !prev)} value={showFees} />
          </View>
          {Platform.OS === 'web' && !showFees && <Spacer space={5} />}
          {!showFees &&
          <RoundedContainer>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignSelf:"center",  width: "85%",
              marginVertical: Platform.OS === 'web' ? 10 : 0
          }}>
            <Picker style={{ width: 125 }} enabled={!showFees} onValueChange={setTxnTypeFilter} selectedValue={txnTypeFilter}>
              <Picker.Item value={'ALL'} label='ALL' />
              <Picker.Item value={'DEBIT'} label='DEBIT' />
              <Picker.Item value={'CREDIT'} label='CREDIT' />
            </Picker>
            <Picker style={{ width: 125 }} enabled={!showFees} onValueChange={setTxnCategoryFilter} selectedValue={txnCategoryFilter}>
              <Picker.Item value={"-1"} label={'ALL'} />
              {categories.map((c: any) => (
                <Picker.Item key={c.categoryId} value={c.categoryId} label={c.categoryName.toUpperCase()} />
              ))}
            </Picker>   
          </View></RoundedContainer>}
          <Spacer space={10} />
        {isTxnsLoading ? <LoadingSpinner /> :
          <FlatList
            ItemSeparatorComponent={() => <Divider style={{width: "85%", alignSelf: "center", marginVertical: 10}} />}
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
                <View style={{ flexDirection: 'row', maxWidth: "70%"  }}>
                  <View style={{ maxWidth: "90%" }}>
                    <ThemedText style={{ fontWeight: '500' }}>{item.feeName}</ThemedText>
                    <ThemedText style={{ fontSize: 12 }}>{item.memberName || item.clubTransactionComment}</ThemedText>
                  </View>
                  <Spacer hspace={5} />
                  {(item.clubTransactionCategory != 'FEE' && item.clubTransactionCategory != 'ADHOC-FEE' && clubInfo.role === ROLE_ADMIN) ?                  
                    <MaterialCommunityIcons name='square-edit-outline' size={12} color={"#546E7A"} /> : <Spacer hspace={5} />}
                </View>
                <View style={{ alignItems: "flex-end"}}>
                  <ThemedText style={{ fontWeight: 'bold', color: item.clubTranscationType === 'CREDIT' ? colors.success : colors.error }}>{item.clubTranscationType === 'CREDIT' ? '+' : '-'} ₹ {item.clubTransactionAmount}</ThemedText>
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
          <Picker style={{ width: "80%", alignSelf: "center" }}
            selectedValue={txnValues?.txnCategoryId}
            onValueChange={(val) => {
              if (val === "__ADD_NEW__") {
                setIsAddCategoryVisible(true);
              } else {
                setTxnValues((prev: any) => ({ ...prev, txnCategory: getCategory(val), txnCategoryId: val }));
              }
            }}>
            <Picker.Item value={""} label={"Select category"} />
            {categories.map((c: any) => (
              <Picker.Item key={c.categoryId} value={c.categoryId} label={c.categoryName} />
            ))}
            <Picker.Item value={"__ADD_NEW__"} label={"+ Add new category"} />
          </Picker>
          <InputText label="Details" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnComment: value }))} defaultValue={txnValues?.txnComment} />
          <InputText label="Amount" onChangeText={(value: string) => setTxnValues((prev: any) => ({ ...prev, txnAmount: value }))} keyboardType={"numeric"} defaultValue={txnValues?.txnAmount?.toString()} />
          {txnValues?.lastUpdatedBy && <ThemedText style={{ width: "80%", alignSelf: "center" }}>Last updated by: {txnValues?.lastUpdatedBy}</ThemedText>}
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 30, alignItems: "center" }}>
            {isAddingTxn || isUpdatingTxn ? <LoadingSpinner />
            : <ThemedButton title={"   Save   "} onPress={() => handleSave()} />}
            <ThemedButton title="Cancel" onPress={() => setIsAddTxnVisible(false)} />
            {txnValues?.txnId && <ThemedIcon name='MaterialCommunityIcons:delete' size={30} onPress={() => handleDelete()} color={colors.error} />}
          </View>
        </ThemedView>
      </Modal>
      <Modal isVisible={isAddCategoryVisible} onBackdropPress={() => setIsAddCategoryVisible(false)}>
        <ThemedView style={{ borderRadius: 6, padding: 20 }}>
          <ThemedText style={appStyles.heading}>Add category</ThemedText>
          <InputText label="Category name" onChangeText={(v: string) => setNewCategoryName(v)} defaultValue={newCategoryName} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            {isAddingCategory ? <LoadingSpinner /> : <ThemedButton title="Save" onPress={async () => {
              if (!newCategoryName || newCategoryName.trim().length < 2) {
                alert('Enter at least 2 characters');
                return;
              }
              const res: any = await addCategory({ clubId: clubInfo.clubId, categoryName: newCategoryName.trim(), email: userInfo.email });
              // API expected to return { categoryId, categoryName }
              const createdId = res?.data?.categoryId || res?.categoryId || null;
              const createdName = res?.data?.createdName || res?.createdName || null;
              setIsAddCategoryVisible(false);
              // refresh categories and set selection
              await refetchCategories();
              if (createdId) {
                setTxnValues((prev: any) => ({ ...prev, txnCategory: createdName, txnCategoryId: createdId }));
              }
            }} />}
            <ThemedButton title="Cancel" onPress={() => setIsAddCategoryVisible(false)} />
          </View>
        </ThemedView>
      </Modal>
      <Modal isVisible={isFeeDetailsVisible}>
        <ThemedView style={{ borderRadius: 5, padding: 20 }}>
          <ThemedText style={{ width: "80%", alignSelf: "center" }}>Go to {txnValues?.feeType == 'FEE' ? 'fees' : 'expense splits'} page to update this transaction.</ThemedText>
          <Spacer space={10} />
          {txnValues?.lastUpdatedBy && <ThemedText style={{ width: "80%", alignSelf: "center" }}>Last updated by: {txnValues?.lastUpdatedBy}</ThemedText>}
          <Spacer space={10} />
          <ThemedButton title="Cancel" onPress={() => setIsFeeDetailsVisible(false)} />
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


const validate = (txnCategoryId: string | null, txnTypeComment: string | null, txnAmount: string) => {
  if (!txnCategoryId || txnCategoryId === "") {
    alert("Select a category")
    return false
  }
  if (!isValidLength(txnTypeComment, 2)) {
    alert("Enter atleast 2 characters for details")
    return false
  }
  if (!isCurrency(txnAmount)) {
    alert("Enter numeric value for amount")
    return false
  }
  return true
}