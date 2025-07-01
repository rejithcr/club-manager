import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { addExceptionType } from '@/src/helpers/fee_helper'
import { useSearchParams } from 'expo-router/build/hooks'
import { UserContext } from '@/src/context/UserContext'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import { router } from 'expo-router'
import { getClubMembers } from '@/src/helpers/club_helper'
import { appStyles } from '@/src/utils/styles'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ShadowBox from '@/src/components/ShadowBox'
import ThemedCheckBox from '@/src/components/themed-components/ThemedCheckBox'
import Spacer from '@/src/components/Spacer'

const AddFeeException = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [exceptionType, setExceptionType] = useState<string>("")
    const [exceptionAmount, setExceptionAmount] = useState<string>("")
    const { userInfo } = useContext(UserContext)
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
        <ThemedView style={{ flex: 1 }}>
        <View>
            <View style={{ marginBottom: 20 }}>
                <InputText label='Exception Type' onChangeText={setExceptionType} />
                <InputText label='Amount' keyboardType={"numeric"} onChangeText={setExceptionAmount}/>
            </View>
            <ThemedText style={{width: "80%",  alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>Select Members</ThemedText>
            <ThemedText style={{width: "80%", alignSelf: "center", fontSize: 10}}>Select the members eligible for this fee exception</ThemedText>
            <Spacer space={5} />
            {isLoading && <LoadingSpinner />}
            {!isLoading && <View style={{ height: "65%" }}>
                <FlatList 
                    data={members}
                    ListFooterComponent={() => <View style={{ height: 50 }} />}
                    ItemSeparatorComponent={() => <Spacer space={4}/>}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => toggleSelection(item.memberId)}>
                            <ShadowBox style={{ ...appStyles.shadowBox, width: "80%", flexWrap: "wrap" }}>
                                <ThemedCheckBox checked={item.selected} />                                
                                <ThemedText style={{ width: "90%", fontSize: 15, paddingLeft: 15 }}>{item?.firstName} {item?.lastName}</ThemedText>
                            </ShadowBox>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.memberId}
                />
            </View>
            }
        </View>
        <View style={{ position: "absolute", bottom: 30, alignSelf:"center" }} >
            <ThemedButton title='Add Exception' onPress={saveException} />
        </View>
        </ThemedView>
    )
}

export default AddFeeException


const validate = (exceptionType: string | null | undefined, exceptionAmount: string) => {
    if (!isValidLength(exceptionType, 2)) {
        alert("Enter atleast 2 characters for exception type")
        return false
    }
    if (!isCurrency(exceptionAmount)) {
        alert("Enter numeric value for amount")
        return false
    }
    return true
}