import { View, Text, StyleSheet, RefreshControl, GestureResponderEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { Club, getClubDetails } from '@/src/helpers/club_helper'
import { MaterialIcons } from '@expo/vector-icons'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingMenu from '@/src/components/FloatingMenu'
import ClubFeeSummary from './(fees)/ClubFeeSummary'

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
        router.push(`/(main)/(clubs)/(fees)/feebyperiod?clubId=${clubDetails?.id}&clubName=${clubDetails?.name}`)
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

                <KeyValueUI data={clubDetails} hideKeys={["id"]} />
                <View style={{ marginBottom: 20 }} />
                <ThemedButton title="Show Members" onPress={() => showMembers(Number(clubDetails?.id))} />
                <View style={{ marginBottom: 20 }} />
                {/* <ThemedButton title="Set as default club" opnPress={setClubAsDefault} /> */}
                    <ClubFeeSummary clubId={clubDetails?.id} clubName={clubDetails?.name} 
                    showClubDues={showClubDues} showFeeByMember={showFeeByMember}/>
            </ScrollView>
            <FloatingMenu onPress={undefined} />
        </GestureHandlerRootView>
    )
}

export default ClubDetails
