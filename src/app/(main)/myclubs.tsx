import { View, Text } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import TouchableCard from '@/src/components/TouchableCard';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedView from '@/src/components/themed-components/ThemedView';
import { useTheme } from '@/src/hooks/use-theme';

const MyClubs = (props: { clubs: [] }) => {
  const router = useRouter()
  const { theme } = useTheme();
  
  const showDetails = (clubId: number, clubName: string, role: string) => router.push(`/(main)/(clubs)/clubdetails?clubId=${clubId}&clubName=${clubName}&role=${role}`)

  return (
    <ThemedView>
      {props.clubs?.length == 0 && 
        <ThemedView style={{ alignSelf: "center", width:"80%" , justifyContent: "center", alignItems: "center"}}>
        <ThemedText style={{marginTop:20}}>Request to join a club</ThemedText>
        <MaterialIcons name='add-home' size={50} onPress={()=> router.push(`/(main)/(clubs)/joinclub`)}/>
        <ThemedText style={{marginTop:20}}>Create a new club</ThemedText>
        <MaterialIcons name='add-circle' size={50} onPress={()=> router.push(`/(main)/(clubs)/createclub`)}/>
        </ThemedView>}
      {props.clubs?.map((item: any) =>
        <TouchableCard key={item.clubId} onPress={() => showDetails(item.clubId, item.clubName, item.roleName)} id={item.clubId}>
          <View style={{
            flexDirection: "row", width: "100%",
            justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
          }}>
            <ThemedText style={{ fontWeight: "bold" }}>{item.clubName}</ThemedText>
            <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
          </View>
        </TouchableCard>
      )}
    </ThemedView>
  )
}

export default MyClubs
