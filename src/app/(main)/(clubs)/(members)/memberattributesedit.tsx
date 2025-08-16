import { View, TouchableOpacity, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import InputText from '@/src/components/InputText';
import ThemedButton from '@/src/components/ThemedButton';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import ThemedText from '@/src/components/themed-components/ThemedText';
import { ClubContext } from '@/src/context/ClubContext';
import { useHttpGet } from '@/src/hooks/use-http';
import { UserContext } from '@/src/context/UserContext';
import Modal from 'react-native-modal';
import { appStyles } from '@/src/utils/styles';
import Spacer from '@/src/components/Spacer';
import { addClubMemberAttribute, deleteClubMemberAttribute, saveClubMemberAttribute } from '@/src/helpers/club_helper';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Alert, { AlertProps } from '@/src/components/Alert';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { isAplhaNumeric } from '@/src/utils/validators';
import TouchableCard from '@/src/components/TouchableCard';
import { useTheme } from '@/src/hooks/use-theme';
import { useAddClubMemberAttributeMutation, useDeleteClubMemberAttributeMutation, useGetClubMemberAttributesQuery, useSaveClubMemberAttributesMutation } from '@/src/services/clubApi';

const MemberAttributesEdit = () => {
    const { userInfo } = useContext(UserContext)
    const { clubInfo } = useContext(ClubContext)
    const [isAttributeModalVisible, setIsAttributeModalVisible] = useState(false)
    const [clubMemberAttributeId, setClubMemberAttributeId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [attributeName, setAttributeName] = useState('');
    const [required, setRequired] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const { colors } = useTheme()

    const {
        data: cmaList,
        isLoading: isLoadingCMA,
    } = useGetClubMemberAttributesQuery({ clubId: clubInfo.clubId, getClubMemberAttribute: true })

    const [saveClubMemberAttributes] = useSaveClubMemberAttributesMutation();
    const [addClubMemberAttribute] = useAddClubMemberAttributeMutation();
    const [deleteClubMemberAttribute] = useDeleteClubMemberAttributeMutation();
    const handleSave = async () => {
        if (!isAplhaNumeric(attributeName)) {
            setAlertConfig({
                visible: true, title: 'Error', message: "Enter only alphanumeric with min 2 characters.",
                buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
            })
        } else {
            setIsSaving(true)
            setIsAttributeModalVisible(false)
            if (isEdit) {
              try {
                await saveClubMemberAttributes({
                  clubMemberAttributeId,
                  attributeName,
                  required,
                  email: userInfo.email,
                  editClubMemberAttribute: true,
                }).unwrap();
              } finally {
                setIsSaving(false);
              }
            } else {
                try {
                  await addClubMemberAttribute({
                    clubId: clubInfo.clubId,
                    attributeName,
                    required,
                    email: userInfo.email,
                    addClubMemberAttribute: true,
                  }).unwrap();
                } finally {
                  setIsSaving(false);
                }
            }
        }
    }
    const handleDelete = () => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: 'This will delete the attribute. This cannot be recovered.',
            buttons: [{
                text: 'OK', onPress: async () => {
                    setAlertConfig({ visible: false });
                    setIsSaving(true);
                    setIsAttributeModalVisible(false);
                    try {
                        await deleteClubMemberAttribute({ clubMemberAttributeId, deleteClubMemberAttribute: true}).unwrap();
                    } finally {
                        setIsSaving(false);
                    }
                }
            }, { text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) }]
        });
    }

    const handleShowEdit = (item: any) => {
        setIsEdit(true)
        setAttributeName(item.attribute)
        setRequired(item.required == 1)
        setClubMemberAttributeId(item.clubMemberAttributeId)
        setIsAttributeModalVisible(true)
    }

    const showAddAttributeModal = () => {
        setAttributeName('')
        setRequired(false)
        setIsEdit(false)
        setIsAttributeModalVisible(true)
    }

    return (
        <>
            <Spacer space={10} />
            {!isLoadingCMA && cmaList?.length == 0 &&
                <ThemedText style={{ width: "80%", alignSelf: "center" }}>Define club level attributes which need to be collected from each member. Eg. tshirt size, blood group, id number etc.</ThemedText>
            }
            {isLoadingCMA && <LoadingSpinner />}
            {!isLoadingCMA &&
                <FlatList
                    data={cmaList}
                    ListFooterComponent={<Spacer space={10} />}
                    ItemSeparatorComponent={() => <Spacer space={4} />}
                    renderItem={({ item }) => {
                        return <TouchableCard style={{ justifyContent: "space-between" }} onPress={() => handleShowEdit(item)}
                            icon={<ThemedIcon name={"MaterialCommunityIcons:square-edit-outline"} />}>
                            <ThemedText>{item.attribute} {item.required == 1 ? "*" : ""}</ThemedText>
                        </TouchableCard>
                    }}
                />}
            <Spacer space={10} />
            {isSaving && <LoadingSpinner />}
            {!isSaving && <TouchableOpacity style={{ alignSelf: "center" }} onPress={showAddAttributeModal}>
                <ThemedIcon name={"MaterialIcons:add-circle"} size={50} />
            </TouchableOpacity>}
            <View style={{ marginBottom: 30 }} />
            <Modal isVisible={isAttributeModalVisible}>
                <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
                    <Spacer space={5} />
                    <ThemedText style={appStyles.heading}>{isEdit ? "Edit" : "Add"} Attribute</ThemedText>
                    <Spacer space={5} />
                    <View style={{ flexDirection: 'row', alignItems: "center", alignSelf: "center", width: "80%" }}>
                        <InputText label="Attribtue Name" defaultValue={attributeName} onChangeText={(value: string) => setAttributeName(value)} />
                        <Spacer hspace={5} />
                        <View>
                            <ThemedText style={{ fontSize: 10 }}>Required*</ThemedText>
                            <Spacer space={4} />
                            {!required && <ThemedIcon name={"FontAwesome:toggle-off"} size={30} onPress={() => setRequired(true)} />}
                            {required && <ThemedIcon name={"FontAwesome:toggle-on"} size={30} onPress={() => setRequired(false)} />}
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
                        <ThemedButton title={"   Save   "} onPress={() => handleSave()} />
                        <ThemedButton title="Cancel" onPress={() => setIsAttributeModalVisible(false)} />
                        {isEdit && <ThemedIcon name='MaterialCommunityIcons:delete' size={30} onPress={() => handleDelete()} color={colors.error} />}
                    </View>
                </ThemedView>
            </Modal>
            {alertConfig?.visible && <Alert {...alertConfig} />}
        </>
    );
};


export default MemberAttributesEdit


