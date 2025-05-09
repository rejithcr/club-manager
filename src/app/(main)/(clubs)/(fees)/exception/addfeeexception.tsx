import { View, Text, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { addExceptionType } from '@/src/helpers/fee_helper'
import { useSearchParams } from 'expo-router/build/hooks'
import { AuthContext } from '@/src/context/AuthContext'
import { isNumeric, isValidLength } from '@/src/utils/validators'
import { router } from 'expo-router'
import { getClubMembers } from '@/src/helpers/club_helper'
import Checkbox from 'expo-checkbox'
import { appStyles } from '@/src/utils/styles'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { ClubContext } from '@/src/context/ClubContext'

const AddFeeException = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [exceptionType, setExceptionType] = useState<string>("")
    const [exceptionAmount, setExceptionAmount] = useState<string>("")
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)

    const params = useSearchParams()

    const clubFeeTypeId = params.get("clubFeeTypeId")

    const saveException = () => {
        const exceptionMembers = getChanges()
        console.log(exceptionMembers)
        if (validate(exceptionType, exceptionAmount)) {
            setIsLoading(true)
            addExceptionType(clubFeeTypeId, exceptionType, exceptionAmount, exceptionMembers, userInfo.email)
                .then(() => router.back())
                .catch((error) => alert(error?.message))
                .finally(() => setIsLoading(false))
        }
    }


    // State for tracking selected items
    const [initialState, setInitialState] = useState<any>([]); // To store initial state

    const [members, setMembers] = useState<any>([]);

    useEffect(() => {
        setIsLoading(true)
        getClubMembers(clubInfo.clubId)
            .then(response => {
                const memberItems = response.data.map((item: any) => ({
                    ...item,
                    selected: false
                }));
                setMembers(memberItems)
                setInitialState(memberItems)
            })
            .finally(() => setIsLoading(false))
    }, []);

    // Function to toggle item selection
    const toggleSelection = (memberId: any) => {
        setMembers((prevItems: any[]) =>
            prevItems.map((item) =>
                item.memberId === memberId ? { ...item, selected: !item.selected } : item
            )
        );
    };

    // Function to handle the save button click
    const getChanges = () => {
        // Find the items where the selection status has changed
        const changedItems = members.filter((currentMember: { memberId: number; selected: boolean }) => {
            const member = initialState.find((member: { memberId: number }) => member.memberId === currentMember.memberId);
            return member && member.selected !== currentMember.selected; // Compare selection state
        });
        return changedItems;
    };

    return (
        <>
        <View>
            <View style={{ marginBottom: 20 }}>
                <InputText label='Exception Type' onChangeText={setExceptionType} />
                <InputText label='Amount' keyboardType={"numeric"} onChangeText={setExceptionAmount}/>
            </View>
            <Text style={{ ...appStyles.heading }}>Select Members</Text>
            {isLoading && <LoadingSpinner />}
            {!isLoading && <>
                <FlatList
                    data={members}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => toggleSelection(item.memberId)}>
                            <View style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
                                <View style={{ width: "5%" }}>
                                    <Checkbox value={item.selected} color={"black"} />
                                </View>
                                <Text style={{ width: "85%", fontSize: 15, paddingLeft: 15 }}>{item?.firstName}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.memberId}
                />
            </>
            }
        </View>
        <View style={{ position: "absolute", bottom: 30, alignSelf:"center" }} >
            <ThemedButton title='Add Exception' onPress={saveException} />
        </View>
        </>
    )
}

export default AddFeeException


const validate = (exceptionType: string | null | undefined, exceptionAmount: string) => {
    if (!isValidLength(exceptionType, 2)) {
        alert("Enter atleast 2 characters for exception type")
        return false
    }
    if (!isNumeric(exceptionAmount)) {
        alert("Enter numeric value for amount")
        return false
    }
    return true
}