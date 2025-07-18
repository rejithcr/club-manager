import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useContext, useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { View } from 'react-native';
import { getMemberByPhone, regirsterMember } from '@/src/helpers/member_helper';
import MemberItem from '@/src/components/MemberItem';
import { useSearchParams } from 'expo-router/build/hooks';
import { UserContext } from '@/src/context/UserContext';
import { router } from 'expo-router';
import { isValidEmail, isValidPhoneNumber } from '@/src/utils/validators';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { addMemberAndAssignClub, addToClub } from '@/src/helpers/club_helper';
import { ClubContext } from '@/src/context/ClubContext';
import ThemedView from '@/src/components/themed-components/ThemedView';
import Spacer from '@/src/components/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedText from '@/src/components/themed-components/ThemedText';
import Alert, { AlertProps } from '@/src/components/Alert';

const AddMember = () => {
    const [isLoading, setIsLoading] = useState(false)
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

    const addMemberToClub = (member: any | undefined) => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: "Clck 'OK' to add the member to club.",
            buttons: [{
                text: 'OK', onPress: () => {
                    setAlertConfig({ visible: false });
                    setIsLoading(true);
                    addToClub(member.memberId, Number(params.get("clubId") || clubInfo.clubId), member.email)
                        .then(response => { alert(`${response?.data.message}`); clearForm() })
                        .catch((err) => { alert(err.response.data.error); })
                        .finally(() => { setIsLoading(false) })
                }
            }, { text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) }]
        });
    }

    const createAndAddToClub = () => {
        if (validate()) {
            setIsLoading(true)
            const payload = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "phone": phone,
                "createdBy": userInfo.email,
                "clubId": params.get("clubId") || clubInfo.clubId
            }
            addMemberAndAssignClub(payload)
                .then(response => {
                    alert(`${response?.data.message}`);
                    clearForm()
                })
                .catch((err) => {
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        alert(`Error: ${err.response.status} - ${JSON.stringify(err.response.data) || 'Request failed'}`);
                    } else if (err.request) {
                        // The request was made but no response was received
                        alert('Error: No response received from the server');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        alert(`Error: ${err.message}`);
                    }
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    const validate = () => {
        console.log(phone)
        if (!isValidPhoneNumber(phone)) {
            alert("Invalid Phone number")
            return false
        }
        if (!firstName || (firstName && firstName?.length < 2)) {
            alert("Please enter name with atleast 2 characters")
            return false
        }
        if (lastName.length < 1) {
            alert("Please enter last name")
            return false
        }
        if (showAddNewMemberForm && !isValidEmail(email)) {
            alert("Please enter valid email")
            return false
        }
        return true
    }
    const createMember = () => {
        if (validate()) {
            setIsLoading(true)
            const payload = {
                "firstName": firstName,
                "lastName": lastName,
                "email": userInfo.email,
                "createdBy": userInfo.email,
                "photo": userInfo.photo,
                "isRegistered": 1,
                "phone": phone
            }
            regirsterMember(payload)
                .then(response => {
                    AsyncStorage.getItem("userInfo")
                        .then(userInfoLocalStorage => {
                            const userInfo = JSON.parse(userInfoLocalStorage || '{}');
                            AsyncStorage.setItem("userInfo", JSON.stringify({
                                ...userInfo,
                                memberId: response.data['memberId']
                            })).then(() => router.replace('/(auth)'));
                        })
                })
                .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error.response.data.error,
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
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

    const searchMember = () => {
        if (!isValidPhoneNumber(searchNumber)) {
            alert("Invalid Phone number")
            return false
        }
        setIsLoading(true)
        getMemberByPhone(searchNumber)
            .then(response => {
                console.log(response.data)
                if (response?.data?.memberId) {
                    setShowAddNewMemberForm(false)
                    setShowExistingPlayer(true);
                    setMemberDetails(response?.data)
                } else {
                    setShowExistingPlayer(false);
                    setShowAddNewMemberForm(true)
                }
            }).catch(() => {
                setShowExistingPlayer(false);
                setShowAddNewMemberForm(true)
            }).finally(() => {
                setIsLoading(false)
            })
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
                {isLoading && <LoadingSpinner />}
                {!isLoading && <ScrollView>
                    {showPhoneSearch &&
                        <>
                            <InputText label="Enter phone number" placeholder='Search by phone number' onChangeText={handleSearchNumberChange} defaultValue={searchNumber} keyboardType="numeric" />
                            <ThemedButton title="Search" onPress={searchMember} />
                            <Spacer space={12} />
                        </>
                    }
                    {showExistingPlayer && <>
                        <MemberItem showDetails={() => addMemberToClub(memberDetails)} firstName={memberDetails?.firstName} lastName={memberDetails?.lastName} memberId={0} />
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
