import { View, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import { MaterialIcons } from '@expo/vector-icons'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { addAdhocFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router } from 'expo-router'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import { AuthContext } from '@/src/context/AuthContext'
import { ClubContext } from '@/src/context/ClubContext'
import { getClubMembers } from '@/src/helpers/club_helper'
import { appStyles } from '@/src/utils/styles'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ShadowBox from '@/src/components/ShadowBox'
import { useTheme } from '@/src/hooks/use-theme'

const DefineFee = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [members, setMembers] = useState<any[]>([])
    const [addedMembers, setAddedMembers] = useState<any[]>([])
    const [feeName, setFeeName] = useState("");
    const [amountPerMember, setAmountPerMember] = useState(0);
    const [feeAmount, setFeeAmount] = useState("");
    const [feeDescription, setFeeDescription] = useState("")
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)
    const { colors } = useTheme()

    useEffect(()=>{
        if (feeAmount && addedMembers?.length > 0) {
            setAmountPerMember(Number((Number(feeAmount)/addedMembers?.length).toFixed(2)))
        } 
    },[addedMembers,feeAmount])

    useEffect(() => {
        setIsLoadingMembers(true)
        getClubMembers(clubInfo.clubId)
            .then((response) => setMembers(response.data))
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsLoadingMembers(false))
    }, [])
    const addFee = () => {
        if (validate(feeName, feeAmount, addedMembers)) {
            setIsLoading(true)
            const feeAddedMembers = addedMembers.map( m=> {return {...m, clubAdocFeePaymentAmount: amountPerMember}})            
            addAdhocFee(clubInfo.clubId, feeName, feeDescription, feeAmount, feeAddedMembers,userInfo.email)
                .then((response) => {
                    console.log(response.data)
                    Alert.alert("Success", "Fee added successfully")
                    router.dismissTo(`/(main)/(clubs)/(fees)/adhocfee`)
                })
                .catch((error: any) => {
                    Alert.alert("Error", error.response.data.error) 
                    console.log(error)
                }).finally(() => setIsLoading(false))
        }
    }

    const addMember = (member: any) => {
        setAddedMembers((prev_a: any) => {
            setMembers((prev_m) => prev_m.filter(pm => pm.memberId != member.memberId))
            return [...prev_a, member]
        })
    }
    const removeMember = (member: any) => {
        setMembers((prev_m: any) => {
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
                    {!isLoading && !isLoadingMembers && members.map((item: any) => (
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
            <ThemedButton style={{ position: "absolute", alginSelf: "center", bottom: 30 }} title='Start Collection' onPress={addFee} />
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