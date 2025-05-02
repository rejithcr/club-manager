import { View, Text, GestureResponderEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { Club, getClubDetails } from '@/src/helpers/club_helper'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import FloatingMenu from '@/src/components/FloatingMenu'
import LoadingSpinner from '@/src/components/LoadingSpinner'

const ClubDetails = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const params = useSearchParams()
    const [clubDetails, setClubDetails] = useState<any>()

    useEffect(() => {
        setIsLoading(true)
        getClubDetails(Number(params.get("clubId")))
            .then(response => {
                setClubDetails(response.data);
            }).finally(() => {
                setIsLoading(false)
            })
    }, [])

    const showMembers = (clubId: number) => router.push(`/(main)/(members)?clubId=${clubId}`)

    const onRefresh = () => {
        setRefreshing(true)
        throw new Error('Function not implemented.')
    }



    // const setClubAsDefault = async () => {
    //     try {
    //         clubDetails && await AsyncStorage.setItem('defaultClubId', clubDetails.id.toString());
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    return (
        <GestureHandlerRootView>
            {isLoading && <LoadingSpinner />}
            {!isLoading && <ScrollView>
                {/* <View style={styles.photoContainer}>
                    <MaterialIcons name={"star"} size={100} />
                </View> */}

                <Text style={appStyles.title}>{clubDetails?.clubName}</Text>

                <KeyValueUI data={clubDetails} hideKeys={[]} />
                <View style={{ marginBottom: 20 }} />

                <View style={{ marginBottom: 20 }} />
            </ScrollView>
            }
            <FloatingMenu actions={actions} position={"left"} color='black'
                icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
                onPressItem={(name: string | undefined) => handleMenuPress(name, clubDetails?.clubId, clubDetails?.clubName, params.get("role"))}
            />
        </GestureHandlerRootView>
    )
}

const handleMenuPress = (name: string | undefined, clubId: number | undefined, clubName: string | undefined, role: string | null) => {
    if (name == "fees") {
        router.push(`/(main)/(clubs)/(fees)?clubId=${clubId}&clubName=${clubName}`)
    } else if (name == "attendance") {
        router.push(`/(main)/(clubs)/(attendance)?clubId=${clubId}&clubName=${clubName}`)
    } else if (name == "members") {
        router.push(`/(main)/(members)?clubId=${clubId}&clubName=${clubName}&role=${role}`)
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
