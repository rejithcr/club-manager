import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'
import InputText from '@/src/components/InputText'
import { Picker } from '@react-native-picker/picker'
import { MaterialIcons } from '@expo/vector-icons'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import ShadowBox from '@/src/components/ShadowBox'
import { addRegularFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router } from 'expo-router'
import { isNumeric, isValidLength } from '@/src/utils/validators'
import { AuthContext } from '@/src/context/AuthContext'
import { ClubContext } from '@/src/context/ClubContext'
import { getMembers } from '@/src/helpers/member_helper'
import { getClubMembers } from '@/src/helpers/club_helper'
import Checkbox from 'expo-checkbox'
import { appStyles } from '@/src/utils/styles'

const DefineFee = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [members, setMembers] = useState<any>([])
    const [feeName, setFeeName] = useState("");
    const [feeAmount, setFeeAmount] = useState("");
    const [feeDescription, setFeeDescription] = useState("")
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)

    useEffect(() => {
        setIsLoadingMembers(true)
        getClubMembers(clubInfo.clubId)
            .then((response) => setMembers(response.data))
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsLoadingMembers(false))
    }, [])
    const addFee = () => {
        if (validate(feeName, feeAmount)) {
            setIsLoading(true)
            addRegularFee(clubInfo.clubId, feeName, feeDescription, feeAmount, userInfo.email)
                .then((response) => {
                    console.log(response.data)
                    Alert.alert("Success", "Fee added successfully")
                    router.dismissTo(`/(main)/(clubs)/(fees)`)
                })
                .catch((error: any) => {
                    Alert.alert("Error", error.response.data.error)
                    console.log(error)
                }).finally(() => setIsLoading(false))
        }
    }
    return (
        <GestureHandlerRootView>
            <View>
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

                    </View>
                }
            </View>
            <Text style={appStyles.heading}>Select Members</Text>
            <View style={{ height: "80%" }}>
                {isLoadingMembers && <LoadingSpinner />}
                {!isLoadingMembers &&
                    <FlatList style={{ width: "80%", alignSelf: "center" }}
                        data={members}
                        initialNumToRender={8}
                        renderItem={({ item }) => (
                            <ShadowBox style={{ flexDirection: "row", padding: 15, alignItems: "center" }}>
                                <Checkbox />
                                <Text style={{ marginLeft: 10 }}>{item.firstName} {item.lastName}</Text>
                            </ShadowBox>
                        )}
                    />}
            </View>

            <ThemedButton style={{ position: "absolute", alginSelf: "center", bottom: 20 }} title='Start Collection' onPress={addFee} />
        </GestureHandlerRootView>
    )
}

export default DefineFee

const validate = (feeType: string | null | undefined, feeAmount: string) => {
    if (!isValidLength(feeType, 2)) {
        alert("Enter atleast 2 characters for fee type")
        return false
    }
    if (!isNumeric(feeAmount)) {
        alert("Enter numeric value for amount")
        return false
    }
    return true
}