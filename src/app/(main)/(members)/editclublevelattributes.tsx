import React, { useContext, useEffect, useState } from 'react'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { useHttpGet } from '@/src/hooks/use-http'
import { useSearchParams } from 'expo-router/build/hooks'
import ThemedText from '@/src/components/themed-components/ThemedText'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { appStyles } from '@/src/utils/styles'
import { View } from 'react-native'
import { router } from 'expo-router'
import { ClubContext } from '@/src/context/ClubContext'
import { ClubMemberAttribute } from '@/src/types/member'
import Modal from 'react-native-modal'
import Spacer from '@/src/components/Spacer'
import Alert, { AlertProps } from '@/src/components/Alert'
import { saveClubMemberAttributeValues } from '@/src/helpers/club_helper'
import { AuthContext } from '@/src/context/AuthContext'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'

const EditClubLevelAttributes = () => {
    const params = useSearchParams()
    const { clubInfo } = useContext(ClubContext)
    const { userInfo } = useContext(AuthContext)
    const [updatedCMAList, setUpdatedCMAList] = React.useState<any[]>([])
    const [isAttributeModalVisible, setIsAttributeModalVisible] = React.useState(false)
    const [changes, setChanges] = React.useState<any[]>([])
    const [alertConfig, setAlertConfig] = useState<AlertProps>();

    const {
        data: cmaList,
        isLoading: isLoadingCMA,
        refetch: refetchCMA
    } = useHttpGet("/club/member/attribute", { clubId: clubInfo.clubId, memberId: Number(params.get("memberId")), getClubMemberAttributeValues: true })

    useEffect(() => {
        setUpdatedCMAList(JSON.parse(JSON.stringify(cmaList || [])));
    }, [cmaList])

    const handleShowSaveModal = () => {
        const changesLocal = getChanges(cmaList, updatedCMAList);
        setChanges(changesLocal)
        if (validate(updatedCMAList)) {
            setIsAttributeModalVisible(true)
        }
    }

    const validate = (updatedCMAList: ClubMemberAttribute[]) => {
        const errors = []
        for (const cma of updatedCMAList) {
            if (cma.required && !cma.attributeValue || cma.attributeValue?.trim() === "") {
                errors.push(cma.attribute);
            }
        }
        if (errors.length !== 0) {
            setAlertConfig({
                visible: true, title: 'Error', message: `Below attributes cannot be empty.\n\n${errors.join("\n")}`,
                buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
            })
            return false
        } else {
            return true;
        }
    }
    const handleSave = () => {
        setIsAttributeModalVisible(false)
        saveClubMemberAttributeValues(clubInfo.clubId, Number(params.get("memberId")), updatedCMAList, userInfo.email)
            .then(() => {
                setAlertConfig({
                    visible: true, title: 'Success', message: "Attributes saved successfully.",
                    buttons: [{ text: 'OK', onPress: () => { setAlertConfig({ visible: false }); router.back() } }]
                })
            })
            .catch(error => {
                setAlertConfig({
                    visible: true, title: 'Error', message: error?.response?.data?.error || "Error saving attributes",
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                })
            })
            .finally(() => false);
    }

    const setAttributeValue = (value: string, clubMemberAttributeId: number) => {
        const attribute = updatedCMAList?.find((attr: ClubMemberAttribute) => attr.clubMemberAttributeId === clubMemberAttributeId);
        if (attribute) {
            attribute.attributeValue = value?.trim();
        }
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <ScrollView>
                    {isLoadingCMA ? <LoadingSpinner /> : cmaList?.map((attr: any) => {
                        return <InputText key={attr.clubMemberAttributeId} label={attr.attribute + (attr.required === 1 ? "*" : "")}
                            defaultValue={attr.attributeValue} onChangeText={(value: string) => setAttributeValue(value, attr.clubMemberAttributeId)}
                        />
                    })}
                    {cmaList?.length === 0 ?
                        <ThemedText style={{ textAlign: "center", marginTop: 20 }}>No attributes found for this club.</ThemedText>
                        :
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
                            <ThemedButton title={"   Save   "} onPress={() => handleShowSaveModal()} />
                            <ThemedButton title="Cancel" onPress={() => router.back()} />
                        </View>
                    }
                    <Spacer space={10} />
                    <Modal isVisible={isAttributeModalVisible}>
                        <ThemedView style={{ borderRadius: 5, paddingHorizontal: 20 }}>
                            <Spacer space={5} />
                            <ThemedText style={appStyles.heading}>Confirm changes</ThemedText>
                            <Spacer space={5} />
                            {changes.length > 0 ?
                                <>
                                    {changes.map((change, index) => (
                                        <View key={index}>
                                            <ThemedText key={index} style={{ fontWeight: "bold" }}>
                                                {change.attribute}:  {change.oldValue ? change.oldValue : "{blank}"} → {change.newValue}
                                            </ThemedText>
                                            <Spacer space={5} />
                                        </View>
                                    ))}
                                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
                                        <ThemedButton title={"   Save   "} onPress={() => handleSave()} />
                                        <ThemedButton title="Cancel" onPress={() => setIsAttributeModalVisible(false)} />
                                    </View>
                                </>
                                :
                                <>
                                    <ThemedText style={{ textAlign: "center", marginBottom: 20 }}>No changes made.</ThemedText>
                                    <ThemedButton title="Cancel" onPress={() => setIsAttributeModalVisible(false)} />
                                </>
                            }
                            <Spacer space={10} />
                        </ThemedView>
                    </Modal>
                    {alertConfig?.visible && <Alert {...alertConfig} />}
                </ScrollView>
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default EditClubLevelAttributes

function getChanges(list1: ClubMemberAttribute[], list2: ClubMemberAttribute[]) {
    const map1 = new Map();
    list1.forEach(obj => {
        map1.set(obj.clubMemberAttributeId, obj);
    });

    const changes: { clubMemberAttributeId: number; attribute: string; oldValue: string; newValue: string }[] = [];

    list2.forEach(obj2 => {
        const obj1 = map1.get(obj2.clubMemberAttributeId);
        if (obj1 && obj1.attributeValue !== obj2.attributeValue) {
            changes.push({
                clubMemberAttributeId: obj1.clubMemberAttributeId,
                attribute: obj1.attribute,
                oldValue: obj1.attributeValue,
                newValue: obj2.attributeValue
            });
        }
    });

    return changes;
}
