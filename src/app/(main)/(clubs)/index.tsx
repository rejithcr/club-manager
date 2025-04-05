import { View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router/build/hooks';
import FloatingMenu from '@/src/components/FloatingMenu';
import { getClubs } from '@/src/helpers/club_helper';
import SimpleCard from '@/src/components/SimpleCard';

const ClubMain = () => {
  const [clubs, setClubs] = useState<any>([]);
  const router = useRouter()
  useEffect(() => {
    setClubs(getClubs());
  }, []);

  const showCreateClub = () => router.push("/(main)/(clubs)/createclub")
  const showDetails = (clubId: number) => router.push(`/(main)/(clubs)/clubdetails?id=${clubId}`)
  return (
    <>
      <View style={{ marginTop: 25 }} />
      <View>
        <FlatList
          data={clubs}
          renderItem={({ item }) => (
            <SimpleCard key={item.id} {...item} showDetails={showDetails} />
          )}
        />
      </View>
      <FloatingMenu onPress={showCreateClub} />
    </>
  )
}

export default ClubMain