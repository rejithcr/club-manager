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
import ThemedCheckBox from '@/src/components/themed-components/ThemedCheckBox'
import { ThemeContext } from '@/src/context/ThemeContext'
import { FlatList, TouchableOpacity, View } from 'react-native'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import { useTheme } from '@/src/hooks/use-theme'
import { router } from 'expo-router'

const Profile = () => {
    const { userInfo } = useContext(AuthContext)
    const { data: myRequests, isLoading: isLoadingMyRequests } = useHttpGet("/member", { memberId: userInfo?.memberId, requests: "true" })
    const { theme, setTheme } = useContext(ThemeContext);
    const { colors } = useTheme()
    const [isMembershipRequestShown, setIsMembershipRequestShown] = React.useState(false)
    const handleToggleMembershipRequests = () => {
        console.log(isMembershipRequestShown)
        setIsMembershipRequestShown(prev => !prev)
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <ThemedText style={appStyles.heading}>Theme</ThemedText>
                <TouchableCard onPress={() => setTheme("dark")} icon={<ThemedCheckBox checked={theme == "dark"} />}>
                    <ThemedText>Dark</ThemedText>
                </TouchableCard>
                <Spacer space={4} />
                <TouchableCard onPress={() => setTheme("light")} icon={<ThemedCheckBox checked={!theme || theme == "light"} />}>
                    <ThemedText>Light</ThemedText>
                </TouchableCard>
                <Spacer space={4} />
                <TouchableCard onPress={() => setTheme("system")} icon={<ThemedCheckBox checked={theme == "system"} />}>
                    <ThemedText>System</ThemedText>
                </TouchableCard>
                <View>
                    <View style={{
                        flexDirection: "row", width: "80%", alignItems: "center",
                        justifyContent: "space-between", alignSelf: "center",
                    }}>
                        <TouchableOpacity onPress={() => handleToggleMembershipRequests()}
                            style={{ flexDirection: "row", width: "80%", justifyContent: "flex-start", alignItems: "center" }}>
                            <ThemedIcon size={25} name={isMembershipRequestShown ? 'MaterialCommunityIcons:chevron-down-circle' : 'MaterialCommunityIcons:chevron-right-circle'} color={colors.nav} />
                            <ThemedText style={{ ...appStyles.heading, paddingLeft: 5 }}>Membership Requests</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => router.push(`/(main)/(members)/joinclub`)}>
                            <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} color={colors.add} />
                        </TouchableOpacity>
                    </View>                    
                    <View>
                        {isLoadingMyRequests && <LoadingSpinner />}
                        {!isLoadingMyRequests && isMembershipRequestShown && myRequests?.length > 0 &&
                            <FlatList
                                data={myRequests}
                                keyExtractor={(item) => item.clubId}
                                ItemSeparatorComponent={() => <Spacer space={4} />}
                                ListEmptyComponent={<ThemedText>No Requests found</ThemedText>}
                                renderItem={({ item }) =>
                                    <TouchableCard>
                                        <View style={{ flexDirection: "row", alignItems: "center", width: '80%' }}>
                                            <View style={{ marginRight: 10 }}>
                                                <ThemedIcon
                                                    size={25}
                                                    name={item.status === 'APPROVED' ? 'MaterialIcons:check-circle' : item.status === 'REJECTED' ? 'MaterialIcons:cancel' : 'FontAwesome:question-circle'}
                                                    color={item.status === 'APPROVED' ? colors.success : item.status === 'REJECTED' ? colors.error : colors.warning} />
                                            </View>
                                            <View >
                                                <ThemedText>{item.clubName}</ThemedText>
                                                <ThemedText style={{ fontSize: 10 }}>{item.comments}</ThemedText>
                                            </View>
                                        </View>
                                    </TouchableCard>
                                }
                            />}
                        {!isLoadingMyRequests && isMembershipRequestShown && myRequests?.length === 0 && <ThemedText style={{ alignSelf: "center" }}>No requests found</ThemedText>}
                    </View>
                </View>                
                <ThemedText style={appStyles.heading}>Other</ThemedText>
                <TouchableCard onPress={() => router.push(`/(main)/(profile)/editmember?memberId=${userInfo?.memberId}`)}>
                    <ThemedText>Edit your details</ThemedText>
                </TouchableCard>
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default Profile