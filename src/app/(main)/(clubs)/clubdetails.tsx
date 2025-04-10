import { View, Text, GestureResponderEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { Club, getClubDetails } from '@/src/helpers/club_helper'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { FloatingAction } from "react-native-floating-action";
import ClubFeeSummary from './(fees)/ClubFeeSummary'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { router } from 'expo-router'

const ClubDetails = () => {
    const [refreshing, setRefreshing] = useState(false)
    const router = useRouter()
    const params = useSearchParams()
    const [clubDetails, setClubDetails] = useState<Club>()
    useEffect(() => {
        const club = getClubDetails(Number(params.get("id")));
        setClubDetails(club);
    }, [])

    const showMembers = (clubId: number) => router.push(`/(main)/(members)?clubId=${clubId}`)

    const onRefresh = () => {
        setRefreshing(true)
        throw new Error('Function not implemented.')
    }

    const showClubDues = (event: GestureResponderEvent): void => {
        router.push(`/(main)/(clubs)/(fees)/clubdues?clubId=${clubDetails?.id}&clubName=${clubDetails?.name}`)
    }
    const showFeeByMember = (event: GestureResponderEvent): void => {
        router.push(`/(main)/(clubs)/(fees)/payments?clubId=${clubDetails?.id}&clubName=${clubDetails?.name}`)
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
            <ScrollView>
                {/* <View style={styles.photoContainer}>
                    <MaterialIcons name={"star"} size={100} />
                </View> */}

                <Text style={appStyles.title}>{clubDetails?.name}</Text>

                <KeyValueUI data={clubDetails} hideKeys={["id", "name", "createdDate"]} />
                <View style={{ marginBottom: 20 }} />
                {/* <ThemedButton title="Set as default club" opnPress={setClubAsDefault} /> */}
                <ClubFeeSummary clubId={clubDetails?.id} clubName={clubDetails?.name}
                    showClubDues={showClubDues} showFeeByMember={showFeeByMember} />

                <View style={{ marginBottom: 20 }} />
                <ThemedButton title="Show Members" onPress={() => showMembers(Number(clubDetails?.id))} />
            </ScrollView>
            <FloatingAction actions={actions} position={"left"} color='black' tintColor='red'
                floatingIcon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
                onPressItem={name => handleMenuPress(name, clubDetails?.id, clubDetails?.name)}
            />
        </GestureHandlerRootView>
    )
}

const handleMenuPress = (name: string | undefined, clubId: number | undefined, clubBame: string | undefined) => {
    if (name == "define_fees") {
        router.push(`/(main)/(clubs)/(fees)?clubId=${clubId}&clubName=${clubBame}`)
    } else if (name == "attendance") {
        router.push(`/(main)/(clubs)/(attendance)?clubId=${clubId}&clubBame=${clubBame}`)
    } else {
        throw ("Error")
    }
}

const actions = [
    {
        color: "black",
        text: "Define Fee",
        icon: <FontAwesome6 name={"cash-register"} size={15} color={"white"} />,
        name: "define_fees",
        position: 2
    },
    {
        color: "black",
        text: "Attendance",
        icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
        name: "attendance",
        position: 1
    },
];
export default ClubDetails
