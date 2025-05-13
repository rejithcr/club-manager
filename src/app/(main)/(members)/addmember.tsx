import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useContext, useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { Alert, View } from 'react-native';
import { getMemberByPhone, regirsterMember } from '@/src/helpers/member_helper';
import MemberItem from '@/src/components/MemberItem';
import { useSearchParams } from 'expo-router/build/hooks';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { isValidEmail, isValidPhoneNumber } from '@/src/utils/validators';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { addMemberAndAssignClub, addToClub } from '@/src/helpers/club_helper';
import { ClubContext } from '@/src/context/ClubContext';

const AddMember = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showExistingPlayer, setShowExistingPlayer] = useState<boolean>(false);
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
    const [showPhoneSearch, setShowPhoneSearch] = useState<boolean>(true);
    const [showAddNewMemberForm, setShowAddNewMemberForm] = useState<boolean>(false);
    const [searchNumber, setSearchNumber] = useState<string>();
    const [date, setDate] = useState<Date>(new Date());
    const [memberDetails, setMemberDetails] = useState<any>()
    const [firstName, setFirstName] = useState<string | null>("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("")

    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)
    const params = useSearchParams()

    const clearForm = () => {
        setFirstName('')
        setLastName('')
        setPhone('')
        setEmail('')
        setShowAddNewMemberForm(false)
    }

    const addMemberToClub = (member: any | undefined) => {
        addToClub(member.memberId, Number(params.get("clubId") || clubInfo.clubId), member.email)
            .then(response => {
                alert(`${response?.data.message}`);
                clearForm()
            })
            .catch((err) => {
                console.log(err)
                alert(`Error: ${err?.message}`);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const createAndAddToClub = () => {
        if (validate()) {
            setIsLoading(true)
            const payload = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "phone": phone,
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
                "phone": phone
            }
            regirsterMember(payload)
                .then(_ => {
                    router.replace('/(auth)')
                })
                .catch(error => {
                    Alert.alert("Error", error.response.data.error)
                }).finally(() => {
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

    return (
        <GestureHandlerRootView>
            {isLoading && <LoadingSpinner />}
            {!isLoading && <ScrollView>
                {showPhoneSearch &&
                    <>
                        <InputText placeholder='Enter phone number' onChangeText={setSearchNumber} defaultValue={searchNumber} keyboardType="numeric" />
                        <ThemedButton title="Search" onPress={searchMember} />
                        <View style={{ marginTop: 25 }} />
                    </>
                }
                {showExistingPlayer && <>
                    <MemberItem firstName={memberDetails?.firstName} dateOfBirth={memberDetails?.dateOfBirth} lastName={memberDetails?.lastName} memberId={0} />
                    <View style={{ marginTop: 25 }} />
                    <ThemedButton title="Add Member" onPress={() => addMemberToClub(memberDetails)} />
                </>}
                {(showRegisterForm || showAddNewMemberForm) && <>
                    <InputText label="First Name" onChangeText={setFirstName} defaultValue={firstName} />
                    <InputText label="Last Name" onChangeText={setLastName} defaultValue={lastName} />
                    <InputText label="Phone" onChangeText={setPhone} defaultValue={phone} keyboardType={"numeric"} />
                    {!showRegisterForm && <InputText label="Email" onChangeText={setEmail} defaultValue={email} keyboardType={"email-address"} />}
                    {/* <DatePicker date={date} setDate={setDate} />
                <InputText placeholder='Jersey Name' />
                <InputText placeholder='Jersey Number' /> */}
                    <View style={{ marginTop: 25 }} />
                    {showRegisterForm && <ThemedButton title="Register" onPress={createMember} />}
                    {!showRegisterForm && showAddNewMemberForm && <ThemedButton title="Add Member" onPress={createAndAddToClub} />}
                </>}
            </ScrollView>
            }
        </GestureHandlerRootView>
    )
}

export default AddMember
