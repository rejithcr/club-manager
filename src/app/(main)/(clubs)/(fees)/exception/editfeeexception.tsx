import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { getExceptionDetails, updateExceptionType } from '@/src/helpers/fee_helper'
import { useSearchParams } from 'expo-router/build/hooks'
import { AuthContext } from '@/src/context/AuthContext'
import { isNumeric, isValidLength } from '@/src/utils/validators'
import { router } from 'expo-router'
import { getClubMembers } from '@/src/helpers/club_helper'
import { appStyles } from '@/src/utils/styles'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import ShadowBox from '@/src/components/ShadowBox'
import { MaterialIcons } from '@expo/vector-icons'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'

const EditFeeException = () => {
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)
    const [isLoadingException, setIsLoadingException] = useState(false)
    const [exceptionType, setExceptionType] = useState<string>("")
    const [exceptionAmount, setExceptionAmount] = useState<string>("")
    const [isAmountEditable, setIsAmountEditable] = useState<boolean>(false)
    const [exceptionMembers, setExceptionMembers] = useState<any>([])
    const [members, setMembers] = useState<any>([]);
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)

    const params = useSearchParams()

    const saveException = () => {
        const changes = exceptionMembers.filter((item: { endDateAdded: any; clubFeeTypeExceptionMemberId: any }) => item.endDateAdded || !item.clubFeeTypeExceptionMemberId)
        if (validate(exceptionType, exceptionAmount)) {
            setIsLoadingMembers(true)
            updateExceptionType(params.get("clubFeeTypeExceptionId"), exceptionType, exceptionAmount, changes, userInfo.email)
                .then(() => router.back())
                .catch((error) => alert(error?.response?.data?.error))
                .finally(() => setIsLoadingMembers(false))
        }
    }



    useEffect(() => {
        setIsLoadingException(true)
        getExceptionDetails(params.get("clubFeeTypeExceptionId"))
            .then(response => {
                const exceptionType = response.data
                setExceptionType(exceptionType.clubFeeTypeExceptionReason)
                setExceptionAmount(exceptionType.clubFeeExceptionAmount)
                setExceptionMembers(exceptionType.members)
                setIsAmountEditable(exceptionType.isAmountEditable)
                setIsLoadingMembers(true)
                getClubMembers(clubInfo.clubId)
                    .then(response => {
                        const members = response.data
                        console.log(members)
                        const activeExceptions = exceptionType.members.filter((e: any) => !e.endDate)
                        const difference = members.filter(
                            (m: any) => !activeExceptions.some(
                                (e: any) => e.memberId == m.memberId)
                        );
                        console.log(difference)
                        setMembers(difference)
                    })
                    .finally(() => setIsLoadingMembers(false))

            }).finally(() => setIsLoadingException(false))
    }, []);

    const addToException = (member: any) => {
        console.log(member)
        setExceptionMembers((prevItems: any[]) => {
            const m = prevItems.find(item => item.memberId == member.memberId)
            return (!m || (m && m.endDate)) ? [...prevItems, member] : [...prevItems]
        });
        setMembers((prevItems: any) => {
            return prevItems.filter((item: { memberId: any }) => item.memberId != member.memberId)
        })
    };

    const endException = (memberEdit: any) => {
        console.log(memberEdit.clubFeeTypeExceptionMemberId, memberEdit.memberId)
        setExceptionMembers((prev: { memberId: number, endDateAdded: string, clubFeeTypeExceptionMemberId: number, endDate: string }[]) => {
            if (memberEdit?.clubFeeTypeExceptionMemberId) {
                return prev.map((member: { memberId: number, endDateAdded: string | null, endDate: string }) => {
                    if (member.memberId === memberEdit.memberId && !member.endDate) {
                        const endDateAdded = member.endDateAdded ? null : new Date().toISOString().split('T')[0]
                        return { ...member, endDateAdded }
                    }
                    return member
                })
            } else {
                return prev.filter(item => !(item.memberId === memberEdit.memberId && item.clubFeeTypeExceptionMemberId == undefined))
            }
        })
        if (!memberEdit.startDate)
            setMembers((prev: any) => [...prev, memberEdit])
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ marginBottom: 20 }}>
                    <InputText label='Exception Type' onChangeText={setExceptionType} defaultValue={exceptionType} />
                    {!isAmountEditable && <Text style={{ alignSelf: "center", fontSize: 10, color: "grey", width: "80%" }}>
                        Amount not editable as some collections are already using this value</Text>}
                    <InputText label='Amount' keyboardType={"number-pad"} onChangeText={setExceptionAmount} defaultValue={exceptionAmount.toString()} editable={isAmountEditable} />
                </View>

                {isLoadingException && <LoadingSpinner />}
                {!isLoadingException && exceptionMembers && exceptionMembers.length > 0 && exceptionMembers[0].memberId &&
                    exceptionMembers?.map((member: {
                        memberId: number, lastName: string, firstName: string | undefined, startDate: string,
                        clubFeeTypeExceptionMemberId: number, endDate: string | undefined, endDateAdded: string | undefined
                    }) => <View key={member?.memberId?.toString() + member?.endDate}>
                            <ShadowBox style={{
                                flexDirection: "row", justifyContent: "space-between",
                                width: "70%", padding: 10, marginBottom: 15
                            }}>
                                <View>
                                    <ThemedText style={{ textDecorationLine: getStrikeOut(member.endDate || member.endDateAdded) }}>{member.firstName} {member.lastName}</ThemedText>
                                    <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{member.startDate} {(member.endDate || member.endDateAdded) && " to "} {member.endDate || member.endDateAdded}</ThemedText>
                                </View>
                                {!member.endDate && (member.endDateAdded ? <ThemedIcon name="MaterialIcons:undo" size={20} onPress={() => endException(member)} />
                                    : <ThemedIcon name="MaterialIcons:remove-circle" size={20} onPress={() => endException(member)} />)}
                            </ShadowBox>
                        </View>
                    )
                }

                <ThemedText style={{ ...appStyles.heading }}>Add Members</ThemedText>
                {isLoadingMembers && <LoadingSpinner />}
                {!isLoadingMembers &&
                    members.map((item: any) =>
                        <TouchableOpacity key={item.memberId} onPress={() => addToException(item)}>
                            <ShadowBox style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
                                <ThemedIcon name="MaterialIcons:add-circle" size={20} />
                                <ThemedText style={{ width: "85%", fontSize: 15, paddingLeft: 15 }}>{item?.firstName} {item?.lastName}</ThemedText>
                            </ShadowBox>
                        </TouchableOpacity>
                    )
                }
            <View style={{marginVertical:40}} />
            </ScrollView>
            
            <View style={{ position: "absolute", bottom: 30, alignSelf: "center" }} >
                <ThemedButton title='Update Exception' onPress={saveException} />
            </View>
        </ThemedView>
    )
}

export default EditFeeException

const getStrikeOut = (endDate: string | undefined | null) => {
    return endDate ? "line-through" : "none"
}

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