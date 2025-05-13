import { View, Text } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import TouchableCard from '@/src/components/TouchableCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MyClubs = (props: { clubs: [] }) => {
  const router = useRouter()

  const showDetails = (clubId: number, clubName: string, role: string) => router.push(`/(main)/(clubs)/clubdetails?clubId=${clubId}&clubName=${clubName}&role=${role}`)

  return (
    <View>
      {props.clubs?.length == 0 && <Text style={{ alignSelf: "center", width:"80%" }}>No clubs found! To create a new club goto Menu {'->'}  Create Club</Text>}
      {props.clubs?.map((item: any) =>
        <TouchableCard key={item.clubId} showDetails={() => showDetails(item.clubId, item.clubName, item.roleName)} id={item.clubId}>
          <View style={{
            flexDirection: "row", width: "100%",
            justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
          }}>
            <Text style={{ fontWeight: "bold" }}>{item.clubName}</Text>
            <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
          </View>
        </TouchableCard>
      )}
    </View>
  )
}

export default MyClubs
