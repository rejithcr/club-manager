import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { Club, getClubDetails } from '@/src/helpers/club_helper'
import { MaterialIcons } from '@expo/vector-icons'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClubDetails = () => {

    const router = useRouter()
    const params = useSearchParams()
    const [clubDetails, setClubDetails] = useState<Club>()
    useEffect(() => {
        const club = getClubDetails(Number(params.get("id")));
        setClubDetails(club);
    }, [])

    const showMembers = (clubId: number) => router.push(`/(main)/(members)?clubId=${clubId}`)
    const setClubAsDefault = async () => {
        try {
            clubDetails && await AsyncStorage.setItem('defaultClubId', clubDetails.id.toString());
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <GestureHandlerRootView>
            <ScrollView>
                {/* <View style={styles.photoContainer}>
                    <MaterialIcons name={"star"} size={100} />
                </View> */}

                <Text style={appStyles.title}>{clubDetails?.name}</Text>

                <KeyValueUI data={clubDetails} hideKeys={["id"]}/>
                <View style={{ marginBottom: 20 }} />
                <ThemedButton title="Show Members" opnPress={() => showMembers(Number(clubDetails?.id))} />
                <View style={{ marginBottom: 20 }} />
                <ThemedButton title="Set as default club" opnPress={setClubAsDefault} />
            </ScrollView>
        </GestureHandlerRootView>
    )
}

export default ClubDetails


const styles = StyleSheet.create({
    photoContainer: {
        minHeight: 150,
        margin: 5,
        padding: 10,
        flex: 1,
        width: 150,
        borderRadius: 100,
        borderColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    }
});