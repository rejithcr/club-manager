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
import { FlatList, StyleSheet } from 'react-native';
import Alert, {AlertProps} from '@/src/components/Alert'

const JoinClub = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [filteredClubs, setFilteredClubs] = useState<{ clubId: number, clubName: string }[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [alertConfig, setAlertConfig] = useState<AlertProps>();

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
                .catch(error => alert(error.resoinse.data.message))
                .finally(() => setIsLoading(false));
        }, 500); // 500ms delay

        setDebounceTimeout(timeout);
    };

    const handleSelectClub = (club: { clubId: number; clubName: string }) => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: `This will send your membership request for ${club.clubName} to the club admin`,
            buttons: [
                {
                    text: 'OK', onPress: () => {
                        setAlertConfig({visible: false}); 
                        setIsLoading(true);
                        requestMembership(club.clubId, userInfo.memberId, userInfo.email)
                            .then((response) => { alert(response.data.message); router.dismissTo('/(main)/(profile)') })
                            .catch(error => alert(error.response.data.error))
                            .finally(() =>{ setIsLoading(false)});
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