import { View, Text, GestureResponderEvent, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { getClubDetails } from '@/src/helpers/club_helper'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import FloatingMenu from '@/src/components/FloatingMenu'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { ClubContext } from '@/src/context/ClubContext'
import ClubFeeSummary from './(fees)/ClubFeeSummary'

const ClubDetails = () => {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const params = useSearchParams()
    const [clubDetails, setClubDetails] = useState<any>()
    const { setClubInfo } = useContext(ClubContext)
    useEffect(() => {
        setIsLoading(true)
        setClubInfo({ clubId: params.get("clubId"), clubName: params.get("clubName"), role: params.get("role") })
        getClubDetails(Number(params.get("clubId")))
            .then(response => setClubDetails(response.data))
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsLoading(false))
    }, [])

    const showClubDues = (_: GestureResponderEvent): void => {
        router.push(`/(main)/(clubs)/(fees)/clubdues`)
    }

    const showFeeByMember = (_: GestureResponderEvent): void => {
        router.push(`/(main)/(clubs)/(fees)/payments`)
    }
    return (
        <GestureHandlerRootView>
            {isLoading && <LoadingSpinner />}
            {!isLoading && <ScrollView>
                <MaterialIcons style={{alignSelf:"center", marginTop:20}} name="sports-cricket" size={100}/>
                <Text style={{...appStyles.title, alignSelf:"center"}}>{clubDetails?.clubName}</Text>
                <KeyValueUI data={clubDetails} hideKeys={[]} />
                <View style={{ marginBottom: 20 }} />
                <Text style={appStyles.heading}>Summary</Text>
                <ClubFeeSummary clubId={Number(params.get("clubId"))} clubName={params.get("clubName")}
                    showClubDues={showClubDues} showFeeByMember={showFeeByMember} />
            </ScrollView>
            }
            <FloatingMenu actions={actions} position={"left"} color='black'
                icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
                onPressItem={(name: string | undefined) => handleMenuPress(name)}
            />
        </GestureHandlerRootView>
    )
}

const handleMenuPress = (name: string | undefined) => {
    if (name == "fees") {
        router.push(`/(main)/(clubs)/(fees)`)
    } else if (name == "attendance") {
        router.push(`/(main)/(clubs)/(attendance)`)
    } else if (name == "members") {
        router.push(`/(main)/(members)`)
    } else {
        throw ("Error")
    }
}

const actions = [
    {
        color: "black",
        text: "Fees",
        icon: <FontAwesome6 name={"cash-register"} size={15} color={"white"} />,
        name: "fees",
        position: 2
    },
    {
        color: "black",
        text: "Attendance",
        icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
        name: "attendance",
        position: 1
    },
    {
        color: "black",
        text: "Memebers",
        icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
        name: "members",
        position: 1
    },
];

export default ClubDetails
