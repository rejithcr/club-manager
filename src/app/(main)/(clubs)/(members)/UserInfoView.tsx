import Spacer from "@/src/components/Spacer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { Member } from "@/src/types/member";
import { useTheme } from "@/src/hooks/use-theme";
import { View, Image } from 'react-native'

const UserInfoView = (props: Member) => {
    const { colors } = useTheme()
    return (
        <View style={{ width: "85%", alignSelf: "center", flexDirection: "row", 
                            justifyContent: "space-between", paddingVertical: 5, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {props?.photo ? <Image source={{ uri: props?.photo }} style={{ height: 32, width: 32, borderRadius: 100, }} />
                    : <ThemedIcon name={"MaterialIcons:account-circle"} size={32} />}
                <View style={{ paddingLeft: 10 }}>
                    <View style={{ flexDirection: "row"}}>
                        <ThemedText>{props.firstName} {props.lastName}</ThemedText>
                        <Spacer hspace={2} />
                        {props.isRegistered === 1 && <ThemedIcon name='MaterialIcons:verified-user' color={colors.success} size={12}/>}                    
                    </View>                    
                    <ThemedText style={{ fontSize: 10 }}>{props.email}</ThemedText>
                </View>
            </View>
            <View style={{alignItems: "flex-end"}}>                
                <ThemedText style={{ fontSize: 12 }}>{props.phone}</ThemedText>
                <ThemedText style={{ fontSize: 9 }}>{props.lastAccessedOn}{props?.roleName}</ThemedText>
            </View>
        </View>
    )
}

export default UserInfoView;