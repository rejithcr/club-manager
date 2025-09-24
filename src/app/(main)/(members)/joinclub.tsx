import InputText from '@/src/components/InputText';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Spacer from '@/src/components/Spacer';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedView from '@/src/components/themed-components/ThemedView';
import TouchableCard from '@/src/components/TouchableCard';
import { UserContext } from '@/src/context/UserContext';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Alert, {AlertProps} from '@/src/components/Alert'
import { useLazyGetClubQuery, useRequestMembershipMutation } from '@/src/services/clubApi';
import RoundedContainer from '@/src/components/RoundedContainer';

const JoinClub = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [queryLength, setQueryLength] = useState(0);
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [alertConfig, setAlertConfig] = useState<AlertProps>();

    const { userInfo } = useContext(UserContext)

    const [searchClubsByName, {data: filteredClubs, isLoading: isClubsLoading}] = useLazyGetClubQuery();

    const handleSearch = (query: string) => {
        setQueryLength(query.length);
        if (query.length < 2) {
            return;
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            searchClubsByName({clubName: query, search: true});
        }, 500); 

        setDebounceTimeout(timeout);
    };
    const [requestMembership] = useRequestMembershipMutation();
    const handleSelectClub = (club: { clubId: number; clubName: string }) => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: `This will send your membership request for ${club.clubName} to the club admin`,
            buttons: [
                {
                    text: 'OK', onPress: async () => {
                        setAlertConfig({visible: false}); 
                        setIsLoading(true);
                        try {
                            await requestMembership({memberId: userInfo.memberId, clubId: club.clubId, membershipRequest: true, email: userInfo.email}).unwrap();
                            router.back();
                        } catch (error) {
                            console.log(error);
                        }finally {
                            setIsLoading(false);
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel', onPress: () => setAlertConfig({visible: false}) },
            ]
        })
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <InputText
                label="Search club"
                placeholder="Search clubs by name"
                onChangeText={handleSearch}
            />
            {(isLoading || isClubsLoading) && <LoadingSpinner />}
            {!(isLoading || isClubsLoading) && filteredClubs?.length === 0 && (
                <ThemedText style={styles.emptyText}>No clubs found</ThemedText>
            )}
            {!(isLoading || isClubsLoading) && filteredClubs?.length > 0 && queryLength >= 2 && <FlatList
                data={filteredClubs}
                keyExtractor={(item) => item.clubId.toString()}
                renderItem={({ item }) => (
                    <RoundedContainer>
                    <TouchableCard onPress={() => handleSelectClub(item)}>
                        <ThemedText style={styles.clubName}>{item.clubName}</ThemedText>
                    </TouchableCard>
                    </RoundedContainer>
                )}
                ListEmptyComponent={<ThemedText style={styles.emptyText}>No clubs found</ThemedText>}
                ItemSeparatorComponent={() => <Spacer space={2} />}
            />}
            {alertConfig?.visible && <Alert {...alertConfig}/>}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    clubItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    clubName: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 16,
        color: '#888',
    },
});

export default JoinClub;