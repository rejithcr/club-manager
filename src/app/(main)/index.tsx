import { RefreshControl, ScrollView, Text } from 'react-native'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import UpcomingMatches from './upcoming_matches';
import FeeSummary from './fee_summary';
import { useContext, useState } from 'react';
import UpcomingEvents from './upcoming_events';
import { AuthContext } from '../../context/AuthContext';


const ClubMain = () => {
  const { userInfo } = useContext(AuthContext)

  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter()

  const gotoClubs = () => router.push(`/(main)/(clubs)`)

  const onRefresh = () => {
  };

  return (
    <>
      {/* <FloatingProfileMenu photo={userInfo?.photo} /> */}
      < ScrollView refreshControl={< RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <UpcomingMatches memberEmail={userInfo?.email} />
        <FeeSummary memberEmail={userInfo?.email} />
        <UpcomingEvents memberEmail={userInfo?.email} />
      </ScrollView >
      <FloatingMenu onPress={gotoClubs} />
    </>
  )
}

export default ClubMain