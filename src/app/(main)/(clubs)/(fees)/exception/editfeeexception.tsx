import { View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useSearchParams } from 'expo-router/build/hooks'
import { UserContext } from '@/src/context/UserContext'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import { router } from 'expo-router'
import { appStyles } from '@/src/utils/styles'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import ShadowBox from '@/src/components/ShadowBox'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import { useTheme } from '@/src/hooks/use-theme'
import { ROLE_ADMIN } from '@/src/utils/constants'
import Spacer from '@/src/components/Spacer'
import { useLazyGetExceptionQuery, useUpdateFeesExceptionMutation } from '@/src/services/feeApi'
import { useLazyGetClubMembersQuery } from '@/src/services/clubApi'
import RoundedContainer from '@/src/components/RoundedContainer'

const EditFeeException = () => {
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)
    const [exceptionType, setExceptionType] = useState<string>("")
    const [exceptionAmount, setExceptionAmount] = useState<string>("")
    const [exceptionMembers, setExceptionMembers] = useState<any>([])
    const [members, setMembers] = useState<any>([]);
    const { userInfo } = useContext(UserContext)
    const { clubInfo } = useContext(ClubContext)
    const { colors } = useTheme();

    const params = useSearchParams()

    const [updateExceptionType, { isLoading: isSaving }] = useUpdateFeesExceptionMutation();

    const handleSaveException = async () => {
      const changes = exceptionMembers.filter(
        (item: { endDateAdded: any; clubFeeTypeExceptionMemberId: any }) =>
          item.endDateAdded || !item.clubFeeTypeExceptionMemberId
      );
      if (validate(exceptionType, exceptionAmount)) {
        setIsLoadingMembers(true);
        try {
          await updateExceptionType({
            feeTypeExceptionId: params.get("clubFeeTypeExceptionId"),
            exceptionType,
            exceptionAmount,
            exceptionMembers: changes,
            email: userInfo.email,
          });
          router.back();
        } catch (error) {
          console.log(error);
        }
      }
    };

    const loadExceptionDetails = async () => {
      setIsLoadingMembers(true);
      try {
        const exceptionType = await getExceptionDetails({
          clubFeeTypeExceptionId: params.get("clubFeeTypeExceptionId"),
        }).unwrap();
        setExceptionType(exceptionType.clubFeeTypeExceptionReason);
        setExceptionAmount(exceptionType.clubFeeExceptionAmount.toString());
        setExceptionMembers(exceptionType.members);
        const members = await getClubMembers({ clubId: clubInfo.clubId }).unwrap();
        const activeExceptions = exceptionType.members.filter((e: any) => !e.endDate);
        const difference = members.filter((m: any) => !activeExceptions.some((e: any) => e.memberId == m.memberId));
        setMembers(difference);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    const [getClubMembers] = useLazyGetClubMembersQuery();
    const [getExceptionDetails] = useLazyGetExceptionQuery();
    useEffect(() => {
        loadExceptionDetails();
    }, []);

    const addToException = (member: any) => {
        setExceptionMembers((prevItems: any[]) => {
            const m = prevItems.find(item => item.memberId == member.memberId)
            return (!m || (m && m.endDate)) ? [...prevItems, member] : [...prevItems]
        });
        setMembers((prevItems: any) => {
            return prevItems.filter((item: { memberId: any }) => item.memberId != member.memberId)
        })
    };

    const endException = (memberEdit: any) => {
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
                    <InputText label='Amount' keyboardType={"number-pad"} onChangeText={setExceptionAmount} value={exceptionAmount} />
                </View>

                {isLoadingMembers && <LoadingSpinner />}
                {!isLoadingMembers && exceptionMembers && exceptionMembers.length > 0 && exceptionMembers[0].memberId &&
                    exceptionMembers?.map((member: {
                        memberId: number, lastName: string, firstName: string | undefined, startDate: string,
                        clubFeeTypeExceptionMemberId: number, endDate: string | undefined, endDateAdded: string | undefined
                    }) => <><RoundedContainer><View key={member?.memberId?.toString() + member?.endDate}>
                            <ShadowBox style={{
                                flexDirection: "row", justifyContent: "space-between",
                            }}>
                                <View>
                                    <ThemedText style={{ fontSize: 15, textDecorationLine: getStrikeOut(member.endDate || member.endDateAdded) }}>{member.firstName} {member.lastName}</ThemedText>
                                    <ThemedText style={{ fontSize: 12, marginTop: 5, color: colors.subText }}>{member.startDate} {(member.endDate || member.endDateAdded) && " to "} {member.endDate || member.endDateAdded}</ThemedText>
                                </View>
                                {!member.endDate && (member.endDateAdded ? <ThemedIcon name="MaterialIcons:undo" size={20} onPress={() => endException(member)} />
                                    : <ThemedIcon name="MaterialIcons:remove-circle" size={20} onPress={() => endException(member)} color={colors.error}/>)}
                            </ShadowBox>
                        </View>
                        </RoundedContainer>
                            <Spacer space={4}/></>
                    )
                }

                <ThemedText style={{ ...appStyles.heading }}>Add Members</ThemedText>
                {isLoadingMembers && <LoadingSpinner />}
                {!isLoadingMembers &&
                    members.map((item: any) =><><RoundedContainer>
                        <TouchableOpacity key={item.memberId} onPress={() => addToException(item)}>
                            <ShadowBox>
                                <ThemedIcon name="MaterialIcons:add-circle" size={20} color={colors.add}/>
                                <ThemedText style={{ fontSize: 15, paddingLeft: 10}}>{item?.firstName} {item?.lastName}</ThemedText>
                            </ShadowBox>
                        </TouchableOpacity>
                        </RoundedContainer>
                        <Spacer space={4} /></>                        
                    )
                }
            <View style={{marginVertical:40}} />
            </ScrollView>
            
            {clubInfo.role === ROLE_ADMIN && <View style={{ position: "absolute", bottom: 50, alignSelf: "center" }} >
                {isSaving ? <LoadingSpinner /> : <ThemedButton title='Update Exception' onPress={handleSaveException} />}
            </View>}
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
    if (!isCurrency(exceptionAmount)) {
        alert("Enter numeric value for amount")
        return false
    }
    return true
}