import InputText from '@/src/components/InputText';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Spacer from '@/src/components/Spacer';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedView from '@/src/components/themed-components/ThemedView';
import TouchableCard from '@/src/components/TouchableCard';
import { AuthContext } from '@/src/context/AuthContext';
import { requestMembership, searchClubsByName } from '@/src/helpers/club_helper';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';

const JoinClub = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [filteredClubs, setFilteredClubs] = useState<{ clubId: number, clubName: string }[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

    const { userInfo } = useContext(AuthContext)

    const handleSearch = (query: string) => {
        if (query.length < 2) {
            setFilteredClubs([]);
            return;
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            setIsLoading(true);
            searchClubsByName(query)
                .then(response => setFilteredClubs(response.data))
                .catch(error => Alert.alert("Error", error.resoinse.data.message))
                .finally(() => setIsLoading(false));
        }, 500); // 500ms delay

        setDebounceTimeout(timeout);
    };

    const handleSelectClub = (club: { clubId: number; clubName: string }) => {
        Alert.alert(
            'Are you sure!',
            `This will send your membership request for ${club.clubName} to the club admin`,
            [
                {
                    text: 'OK', onPress: () => {
                        setIsLoading(true);
                        requestMembership(club.clubId, userInfo.memberId, userInfo.email)
                            .then((response) => { Alert.alert("Info", response.data.message); router.dismissTo('/(main)/(profile)') })
                            .catch(error => Alert.alert("Error", error.response.data.error))
                            .finally(() => setIsLoading(false));
                    }
                },
                { text: 'cancel', onPress: () => null },
            ]
        );
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <InputText
                label="Search club"
                placeholder="Search clubs by name"
                onChangeText={handleSearch}
            />
            {isLoading && <LoadingSpinner />}
            {!isLoading && filteredClubs.length === 0 && (
                <ThemedText style={styles.emptyText}>No clubs found</ThemedText>
            )}
            {!isLoading && filteredClubs.length > 0 && <FlatList
                data={filteredClubs}
                keyExtractor={(item) => item.clubId.toString()}
                renderItem={({ item }) => (
                    <TouchableCard onPress={() => handleSelectClub(item)}>
                        <ThemedText style={styles.clubName}>{item.clubName}</ThemedText>
                    </TouchableCard>
                )}
                ListEmptyComponent={<ThemedText style={styles.emptyText}>No clubs found</ThemedText>}
                ItemSeparatorComponent={() => <Spacer space={2} />}
            />}
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