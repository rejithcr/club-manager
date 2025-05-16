import LoadingSpinner from '@/src/components/LoadingSpinner';
import { AuthContext } from '@/src/context/AuthContext';
import { requestMembership, searchClubsByName } from '@/src/helpers/club_helper';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

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
        setIsLoading(true);
        requestMembership(club.clubId, userInfo.memberId, userInfo.email)
            .then(() => router.push('/(main)/(profile)'))
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsLoading(false));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search clubs by name"
                onChangeText={handleSearch}
            />
            {isLoading && <LoadingSpinner />}
            {!isLoading && filteredClubs.length === 0 && (
                <Text style={styles.emptyText}>No clubs found</Text>
            )}
            {!isLoading && filteredClubs.length > 0 && <FlatList
                data={filteredClubs}
                keyExtractor={(item) => item.clubId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.clubItem}
                        onPress={() => handleSelectClub(item)}
                    >
                        <Text style={styles.clubName}>{item.clubName}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No clubs found</Text>
                }
            />}
        </View>
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