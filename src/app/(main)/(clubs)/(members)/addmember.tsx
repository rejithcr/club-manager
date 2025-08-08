import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useContext, useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { View } from 'react-native';
import MemberItem from '@/src/components/MemberItem';
import { useSearchParams } from 'expo-router/build/hooks';
import { UserContext } from '@/src/context/UserContext';
import { router } from 'expo-router';
import { isValidEmail, isValidPhoneNumber } from '@/src/utils/validators';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { ClubContext } from '@/src/context/ClubContext';
import ThemedView from '@/src/components/themed-components/ThemedView';
import Spacer from '@/src/components/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedText from '@/src/components/themed-components/ThemedText';
import Alert, { AlertProps } from '@/src/components/Alert';
import { showSnackbar } from '@/src/components/snackbar/snackbarService';

import { useAddMemberMutation as useAddMember, useLazyGetMembersQuery } from "@/src/services/memberApi";
import { useAddMemberMutation as useAddMemberToClub } from "@/src/services/clubApi";

const AddMember = () => {
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const [showExistingPlayer, setShowExistingPlayer] = useState<boolean>(false);
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
    const [showPhoneSearch, setShowPhoneSearch] = useState<boolean>(true);
    const [showAddNewMemberForm, setShowAddNewMemberForm] = useState<boolean>(false);
    const [searchNumber, setSearchNumber] = useState<string>();
    const [memberDetails, setMemberDetails] = useState<any>()
    const [firstName, setFirstName] = useState<string | null>("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("")

    const { userInfo } = useContext(UserContext)
    const { clubInfo } = useContext(ClubContext)
    const params = useSearchParams()

    const clearForm = () => {
        setFirstName('')
        setLastName('')
        setPhone('')
        setEmail('')
        setSearchNumber('')
        setShowAddNewMemberForm(false)
    }

    const [addMember] = useAddMember();
    const [addMemberToClub, { isLoading: isAddingMemberToClub }] = useAddMemberToClub();

    const handleAddMemberToClub = (member: any | undefined) => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: "Clck 'OK' to add the member to club.",
            buttons: [{
                text: 'OK', onPress: () => {
                    setAlertConfig({ visible: false });
                    addMemberToClub({
                        memberId: member.memberId,
                        clubId: Number(params.get("clubId") || clubInfo.clubId),
                        addToClub: "true",
                        email: member.email,
                    });
                }
            }, { text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) }]
        });
    }

    const createAndAddToClub = async () => {
        if (validate()) {
            const payload = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "phone": phone,
                "createdBy": userInfo.email,
                "clubId": params.get("clubId") || clubInfo.clubId
            }
            try{
                await addMemberToClub(payload).unwrap();
                clearForm();
            } catch(error){
                console.log(error)
            }
        }
    }

    const validate = () => {
        if (!isValidPhoneNumber(phone)) {
            showSnackbar("Invalid Phone number", 'error')
            return false
        }
        if (!firstName || (firstName && firstName?.length < 2)) {
            showSnackbar("Please enter name with atleast 2 characters", 'error')
            return false
        }
        if (lastName.length < 1) {
            showSnackbar("Please enter last name", 'error')
            return false
        }
        if (showAddNewMemberForm && !isValidEmail(email)) {
            showSnackbar("Please enter valid email", 'error')
            return false
        }
        return true
    }
    const createMember = async () => {
        if (validate()) {
            const payload = {
                "firstName": firstName,
                "lastName": lastName,
                "email": userInfo.email,
                "createdBy": userInfo.email,
                "photo": userInfo.photo,
                "isRegistered": 1,
                "phone": phone
            }
            try {
                const response = await addMember(payload).unwrap();
                AsyncStorage.getItem("userInfo")
                    .then(userInfoLocalStorage => {
                        const userInfo = JSON.parse(userInfoLocalStorage || '{}');
                        AsyncStorage.setItem("userInfo", JSON.stringify({
                            ...userInfo,
                            memberId: response.data['memberId']
                        })).then(() => router.replace('/(auth)'));
                    })
            } catch(error){
                console.log(error);
            }
        } 
    }

    useEffect(() => {
        if (params.get("createMember")) {
            setShowRegisterForm(true)
            setShowPhoneSearch(false)
            setFirstName(params.get("name"))
            console.log(userInfo)
        }
    }, [])

    const [saerchTrigger,{ isLoading: isMemberSearchLoading }] = useLazyGetMembersQuery();
    
    const searchMember = async () => {
        if (!isValidPhoneNumber(searchNumber)) {
            showSnackbar("Invalid Phone number", 'error')
            return false
        }
        try{
            const response = await saerchTrigger({phone: searchNumber});
            if (response?.data?.memberId) {
                setShowAddNewMemberForm(false)
                setShowExistingPlayer(true);
                setMemberDetails(response?.data)
            } else {
                setShowExistingPlayer(false);
                setShowAddNewMemberForm(true)
            }
        } catch (error){
            setShowExistingPlayer(false);
            setShowAddNewMemberForm(true)
        }
    }
    const handleCancel = async () => {
        await AsyncStorage.removeItem("userInfo")
        await AsyncStorage.removeItem("accessToken")
        await AsyncStorage.removeItem("resfreshToken")
        router.dismissTo("/(auth)");
    }
    const handleSearchNumberChange = (text: string) => {
        setSearchNumber(text)
        setPhone(text)
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                {(isAddingMemberToClub || isMemberSearchLoading) && <LoadingSpinner />}
                {!(isAddingMemberToClub && isMemberSearchLoading) && <ScrollView>
                    {showPhoneSearch &&
                        <>
                            <InputText label="Enter phone number" placeholder='Search by phone number' onChangeText={handleSearchNumberChange} defaultValue={searchNumber} keyboardType="numeric" />
                            <ThemedButton title="Search" onPress={searchMember} />
                            <Spacer space={12} />
                        </>
                    }
                    {showExistingPlayer && <>
                        <MemberItem showDetails={() => handleAddMemberToClub(memberDetails)} firstName={memberDetails?.firstName} lastName={memberDetails?.lastName} memberId={0} />
                    </>}
                    {(showRegisterForm || showAddNewMemberForm) && <>
                        {!showRegisterForm && <ThemedText style={{ alignSelf: "center", fontSize: 12, color: "grey", width: "80%" }}>No member found with the given phone number. Please add new member</ThemedText>}
                        <InputText label="First Name" onChangeText={setFirstName} defaultValue={firstName} />
                        <InputText label="Last Name" onChangeText={setLastName} defaultValue={lastName} />
                        <InputText label="Phone" onChangeText={setPhone} defaultValue={searchNumber} keyboardType={"numeric"} />
                        {!showRegisterForm && <InputText label="Email" onChangeText={setEmail} defaultValue={email} keyboardType={"email-address"} />}
                        <Spacer space={10} />
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            {showRegisterForm && <ThemedButton title="Register" onPress={createMember} />}
                            {!showRegisterForm && showAddNewMemberForm && <ThemedButton title="Add Member" onPress={createAndAddToClub} />}
                            <Spacer space={10} />
                            <ThemedButton title="Cancel" onPress={handleCancel} />
                        </View>
                    </>}
                </ScrollView>
                }
                {alertConfig?.visible && <Alert {...alertConfig} />}
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default AddMember
