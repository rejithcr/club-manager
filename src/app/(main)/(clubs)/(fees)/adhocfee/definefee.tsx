import { View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import { MaterialIcons } from '@expo/vector-icons'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router } from 'expo-router'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import { UserContext } from '@/src/context/UserContext'
import { ClubContext } from '@/src/context/ClubContext'
import { getClubMembers } from '@/src/helpers/club_helper'
import { appStyles } from '@/src/utils/styles'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ShadowBox from '@/src/components/ShadowBox'
import { useTheme } from '@/src/hooks/use-theme'
import Alert, { AlertProps } from '@/src/components/Alert'
import DatePicker from '@/src/components/DatePicker'
import { useAddFeesAdhocMutation } from '@/src/services/feeApi'
import { snackbarRef } from '@/src/components/snackbar/SnackbarRef'
import { useGetClubMembersQuery } from '@/src/services/clubApi'

const DefineFee = () => {
    const [addedMembers, setAddedMembers] = useState<any[]>([])
    const [remainingMembers, setRemainingMembers] = useState<any[]>([])
    const [feeName, setFeeName] = useState("");
    const [amountPerMember, setAmountPerMember] = useState(0);
    const [feeAmount, setFeeAmount] = useState("");
    const [feeDescription, setFeeDescription] = useState("")
    const { userInfo } = useContext(UserContext)
    const { clubInfo } = useContext(ClubContext)
    const { colors } = useTheme()
    const [ date, setDate] = useState(new Date())
    
    const { data: members, isLoading: isLoadingMembers } = useGetClubMembersQuery({ clubId: clubInfo.clubId });
    
    useEffect(() => {
        setRemainingMembers(members || []);
    },[members]);

    useEffect(()=>{
        if (feeAmount && addedMembers?.length > 0) {
            setAmountPerMember(Number((Number(feeAmount)/addedMembers?.length).toFixed(2)))
        } 
    },[addedMembers,feeAmount])
    
    const [addFee, { isLoading}] = useAddFeesAdhocMutation();

    const handleAddFeeAdhoc = async () => {
      if (validate(feeName, feeAmount, addedMembers)) {
        try {
          const feeAddedMembers = addedMembers.map((m) => {
            return { ...m, clubAdocFeePaymentAmount: amountPerMember };
          });
          await addFee({
            clubId: clubInfo.clubId,
            adhocFeeName: feeName,
            adhocFeeDesc: feeDescription,
            adhocFeeAmount: feeAmount,
            adhocFeeDate: date,
            addedMembers: feeAddedMembers,
            email: userInfo.email,
          }).unwrap(); // unwrap to catch errors
          router.dismissTo(`/(main)/(clubs)/(fees)/adhocfee`);
        } catch (err) {
            console.log("Error", err)
        }
      }
    };

    const addMember = (member: any) => {
        setAddedMembers((prev_a: any) => {
            setRemainingMembers((prev_m) => prev_m.filter(pm => pm.memberId != member.memberId))
            return [...prev_a, member]
        })
    }
    const removeMember = (member: any) => {
        setRemainingMembers((prev_m: any) => {
            setAddedMembers((prev_a) => prev_a.filter(pa => pa.memberId != member.memberId))
            return [...prev_m, member]
        })
    }
    return (
        <ThemedView style={{ flex: 1 }}>
        <GestureHandlerRootView>
            <ScrollView>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <View style={{ alignItems: "center" }}>
                        <InputText
                            onChangeText={(text: string) => setFeeName(text)}
                            label={`Fee Name`}
                            defaultValue={feeName}
                        />
                        <InputText
                            onChangeText={(text: string) => setFeeDescription(text)}
                            label={`Description`}
                            defaultValue={feeDescription}
                        />
                        <DatePicker date={date} setDate={setDate} label='Date'/>
                        <InputText
                            onChangeText={(text: string) => setFeeAmount(text)}
                            label={`Fee Amount`}
                            keyboardType={'numeric'}
                            defaultValue={feeAmount}
                        />
                        <ThemedText>Rs. {amountPerMember}/member</ThemedText>
                    </View>
                }
                <View style={{ marginBottom: 10 }} />
                {!isLoading && addedMembers && addedMembers.length > 0 && addedMembers.map((item: any, index) => 
                    <TouchableOpacity key={item.memberId} onPress={() => removeMember(item)}>
                        <ShadowBox style={{ ...appStyles.shadowBox, marginBottom: 5, width: "70%", justifyContent:"space-between", flexWrap: "wrap" }}>
                            <ThemedText style={{ fontSize: 15}}>{index+1}. {item?.firstName} {item?.lastName}</ThemedText>
                            <MaterialIcons name="remove-circle" size={20} color={colors.error}/>
                        </ShadowBox>
                    </TouchableOpacity>
                )}
                <ThemedText style={appStyles.heading}>Select Members</ThemedText>
                <View style={{ marginBottom: 80 }}>
                    {isLoadingMembers && <LoadingSpinner/>}
                    {!isLoading && !isLoadingMembers && remainingMembers.map((item: any) => (
                        <TouchableOpacity key={item.memberId} onPress={() => addMember(item)}>
                            <ShadowBox style={{ ...appStyles.shadowBox, marginBottom: 5, width: "80%", flexWrap: "wrap" }}>
                                <MaterialIcons name="add-circle" size={20} color={colors.add}/>
                                <ThemedText style={{ width: "90%", fontSize: 15, paddingLeft: 15 }}>{item?.firstName} {item?.lastName}</ThemedText>
                            </ShadowBox>
                        </TouchableOpacity>
                    ))
                    }
                </View>
            </ScrollView>
            <ThemedButton style={{ position: "absolute", alginSelf: "center", bottom: 30 }} title='Start Collection' onPress={handleAddFeeAdhoc} />
        </GestureHandlerRootView>
        </ThemedView>
    )
}

export default DefineFee

const validate = (feeName: string | null | undefined, feeAmount: string, addedMembers: any[]) => {
    if (!isValidLength(feeName, 2)) {
        alert("Enter atleast 2 characters for fee name")
        return false
    }
    if (!isCurrency(feeAmount)) {
        alert("Enter numeric value for amount")
        return false
    }
    if (addedMembers?.length == 0){
        alert("Add atleast one member")
        return false
    }
    return true
}
