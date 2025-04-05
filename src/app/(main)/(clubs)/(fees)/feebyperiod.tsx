import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { Fee, getFeeByMember } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import ThemedButton from '@/src/components/ThemedButton';

const FeeByPeriod = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [feeByMembers, setFeeByMembers] = useState<Fee[] | undefined>(undefined);


    const params = useSearchParams()

    useEffect(() => {
        getFeeByMember(Number(params.get("clubId")))
            .then(data => { setFeeByMembers(data); setIsLoading(false) })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [])


    return (
        <GestureHandlerRootView>
            <Text style={appStyles.title}>{params.get("clubName")}</Text>
            {isLoading && <LoadingSpinner />}

            <FlatList
                data={feeByMembers}
                initialNumToRender={8}
                //onEndReached={fetchNextPage}
                //onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <MemberFeeItem {...item} key={item.id} />
                )}
            />
            <ThemedButton title='Update Status' onPress={()=>null} />
        </GestureHandlerRootView>
    )
}

export default FeeByPeriod

const MemberFeeItem = (props: { name: string | undefined; paid: boolean }) => {
    const [isSelected, setIsSelected] = useState(props?.paid)

    const selectItem = () => {
        setIsSelected(!isSelected)
    }

    return (
        <TouchableOpacity onPress={selectItem}>
        <View style={{
            ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap",
            flexBasis: "auto"
        }}>
            <View style={{ width: "5%" }}><Checkbox value={isSelected} /></View>
            <Text style={{ width: "70%", fontSize: 15, paddingLeft: 15 }}>{props?.name}</Text>
        </View>
        </TouchableOpacity>
    )
}