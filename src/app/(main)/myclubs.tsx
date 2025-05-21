import { View } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import TouchableCard from '@/src/components/TouchableCard';
import {  MaterialIcons } from '@expo/vector-icons';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedView from '@/src/components/themed-components/ThemedView';
import Spacer from '@/src/components/Spacer';
import { useTheme } from '@/src/hooks/use-theme';

const MyClubs = (props: { clubs: [] }) => {
  const router = useRouter()
  const { colors } = useTheme()

  const showDetails = (clubId: number, clubName: string, role: string) => router.push(`/(main)/(clubs)/clubdetails?clubId=${clubId}&clubName=${clubName}&role=${role}`)

  return (
    <ThemedView>
      {props.clubs?.length == 0 && 
        <ThemedView style={{ alignSelf: "center", width:"80%" , justifyContent: "center", alignItems: "center"}}>
        <ThemedText style={{marginTop:20}}>Request to join a club</ThemedText>
        <MaterialIcons name='add-home' size={50} onPress={()=> router.push(`/(main)/(members)/joinclub`)}/>
        <ThemedText style={{marginTop:20}}>Create a new club</ThemedText>
        <MaterialIcons name='add-circle' size={50} onPress={()=> router.push(`/(main)/(clubs)/createclub`)}/>
        </ThemedView>}
      {props.clubs?.map((item: any) =>
      <View key={item.clubId}>
        <TouchableCard onPress={() => showDetails(item.clubId, item.clubName, item.roleName)} id={item.clubId}>          
            <ThemedText style={{ fontWeight: "bold" }}>{item.clubName}</ThemedText>
        </TouchableCard>
        <Spacer space={4}/>
        </View>
      )}
    </ThemedView> 
  )
}

export default MyClubs
