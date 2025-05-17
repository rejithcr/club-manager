import React, { useContext } from 'react'
import { AuthContext } from '@/src/context/AuthContext'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { appStyles } from '@/src/utils/styles'
import { useHttpGet } from '@/src/hooks/use-http'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Spacer from '@/src/components/Spacer'
import TouchableCard from '@/src/components/TouchableCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemedCheckBox from '@/src/components/themed-components/ThemedCheckBox'
import { ThemeContext } from '@/src/context/ThemeContext'
import { View } from 'react-native'

const Profile = () => {
    const { userInfo } = useContext(AuthContext)
    const { data: myRequests, isLoading: isLoadingMyRequests } = useHttpGet("/member", { memberId: userInfo?.memberId, requests: "true" })
    const { theme, setTheme } = useContext(ThemeContext);
    
    return (
        <ThemedView style={{flex:1}}>
            <GestureHandlerRootView>
            <ThemedText style={appStyles.heading}>Joining Requests</ThemedText>
            <View>
            {isLoadingMyRequests && <LoadingSpinner />}
            {!isLoadingMyRequests && myRequests?.length > 0 && myRequests.map((request: any) => (
                <ThemedView key={request.clubId.toString() + request.memberId.toString()} style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
                    <ThemedText>{request.clubName}</ThemedText>
                    <ThemedText>{request.status}</ThemedText>
                    <ThemedText>{request.comments}</ThemedText>
                </ThemedView>
            ))}
            {!isLoadingMyRequests && myRequests?.length === 0 && <ThemedText style={{alignSelf: "center"}}>No requests found</ThemedText>}
            </View>
            <ThemedText style={appStyles.heading}>Theme</ThemedText>
            <TouchableCard id={undefined} onPress={() => setTheme("dark")}>
                <ThemedText>Dark</ThemedText>
                <ThemedCheckBox checked={theme == "dark"}/>
            </TouchableCard>
            <Spacer space={2}/>
            <TouchableCard id={undefined} onPress={() => setTheme("light")}>
                <ThemedText>Light</ThemedText>
                <ThemedCheckBox checked={!theme || theme == "light"}/>
            </TouchableCard>
            <Spacer space={2}/>
            <TouchableCard id={undefined} onPress={() => setTheme("system")}>
                <ThemedText>System</ThemedText>
                <ThemedCheckBox checked={theme == "system"}/>
            </TouchableCard>
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default Profile