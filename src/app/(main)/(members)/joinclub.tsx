import InputText from '@/src/components/InputText';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Spacer from '@/src/components/Spacer';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedView from '@/src/components/themed-components/ThemedView';
import TouchableCard from '@/src/components/TouchableCard';
import { UserContext } from '@/src/context/UserContext';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Modal, ScrollView, Image as RNImage } from 'react-native';
import Alert, { AlertProps } from '@/src/components/Alert'
import { useLazyGetClubQuery, useRequestMembershipMutation, useLazyGetClubMemberAttributesQuery } from '@/src/services/clubApi';
import RoundedContainer from '@/src/components/RoundedContainer';
import Divider from '@/src/components/Divider';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import { useTheme } from '@/src/hooks/use-theme';
import { appStyles } from '@/src/utils/styles';
import ThemedButton from '@/src/components/ThemedButton';

const JoinClub = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [queryLength, setQueryLength] = useState(0);
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const { colors } = useTheme();

    // Attribute Modal State
    const [isAttrModalVisible, setIsAttrModalVisible] = useState(false);
    const [selectedClub, setSelectedClub] = useState<any>(null);
    const [attributeValues, setAttributeValues] = useState<Record<number, string>>({});
    const [attrErrors, setAttrErrors] = useState<Record<number, string>>({});

    const { userInfo } = useContext(UserContext)

    const [searchClubsByName, { data: filteredClubs, isFetching: isClubsLoading }] = useLazyGetClubQuery();
    const [getClubAttributes, { isFetching: isAttrLoading }] = useLazyGetClubMemberAttributesQuery();
    const [requestMembership] = useRequestMembershipMutation();

    const handleSearch = (query: string) => {
        setQueryLength(query.length);
        if (query.length < 2) {
            return;
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            searchClubsByName({ clubName: query, search: true });
        }, 500);

        setDebounceTimeout(timeout);
    };
    const handleSelectClub = async (club: { clubId: number; clubName: string }) => {
        setIsLoading(true);
        try {
            // Fetch club member attributes
            const response = await getClubAttributes({ clubId: club.clubId, getClubMemberAttribute: true }).unwrap();
            console.log(response);
            if (response && response.length > 0) {
                // Show modal if attributes exist
                setSelectedClub(club);
                setClubAttributes(response);
                setAttributeValues({});
                setAttrErrors({});
                setIsAttrModalVisible(true);
            } else {
                // No attributes, show confirmation alert
                confirmJoin(club);
            }
        } catch (error) {
            console.error("Error fetching attributes:", error);
            confirmJoin(club); // Fallback to standard join if attribute fetch fails
        } finally {
            setIsLoading(false);
        }
    }

    const [clubAttributes, setClubAttributes] = useState<any[]>([]);

    const confirmJoin = (club: any) => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: `This will send your membership request for ${club.clubName} to the club admin`,
            buttons: [
                {
                    text: 'OK', onPress: () => submitJoinRequest(club, {})
                },
                { text: 'Cancel', style: 'cancel', onPress: () => setAlertConfig({ visible: false }) },
            ]
        })
    }

    const submitJoinRequest = async (club: any, attrs: any) => {
        setAlertConfig({ visible: false });
        setIsLoading(true);
        try {
            await requestMembership({
                memberId: userInfo.memberId,
                clubId: club.clubId,
                membershipRequest: true,
                email: userInfo.email,
                attributes: attrs
            }).unwrap();

            setAlertConfig({
                visible: true,
                title: 'Success',
                message: 'Membership request submitted successfully',
                buttons: [{ text: 'OK', onPress: () => router.back() }]
            });
        } catch (error) {
            console.log(error);
            setAlertConfig({
                visible: true,
                title: 'Error',
                message: 'Failed to submit request. Please try again.',
                buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleAttrChange = (id: number, value: string) => {
        setAttributeValues(prev => ({ ...prev, [id]: value }));
        if (value.trim()) {
            setAttrErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    }

    const handleSubmitAttributes = () => {
        const errors: Record<number, string> = {};
        clubAttributes.forEach(attr => {
            if (attr.required === 1 && (!attributeValues[attr.clubMemberAttributeId] || !attributeValues[attr.clubMemberAttributeId].trim())) {
                errors[attr.clubMemberAttributeId] = `${attr.attribute} is required`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setAttrErrors(errors);
            return;
        }

        setIsAttrModalVisible(false);
        submitJoinRequest(selectedClub, attributeValues);
    }

    return (
        <ThemedView style={{ flex: 1, padding: 16 }}>
            <View style={styles.searchContainer}>
                <ThemedIcon name="MaterialIcons:search" size={24} color={colors.subText} style={styles.searchIcon} />
                <InputText
                    placeholder="Search clubs by name"
                    onChangeText={handleSearch}
                    style={styles.searchInputOverride}
                    containerStyle={styles.inputContainerStyle}
                />
            </View>

            {(isLoading || isClubsLoading) && <LoadingSpinner />}

            {!(isLoading || isClubsLoading) && filteredClubs?.length === 0 && queryLength >= 2 && (
                <ThemedView style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>No clubs found</ThemedText>
                </ThemedView>
            )}

            {!(isLoading || isClubsLoading) && filteredClubs?.length > 0 && queryLength >= 2 && (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={filteredClubs}
                        keyExtractor={(item) => item.clubId.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.resultItem}
                                onPress={() => handleSelectClub(item)}
                            >
                                <View style={styles.resultContent}>
                                    <View style={styles.clubIconContainer}>
                                        {item.logo ? (
                                            <RNImage source={{ uri: item.logo }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                        ) : (
                                            <ThemedIcon name="MaterialIcons:group" size={20} color={colors.primary} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={styles.clubNameText}>{item.clubName}</ThemedText>
                                        <ThemedText style={styles.clubSubText}>Tap to join club</ThemedText>
                                    </View>
                                    <ThemedIcon name="MaterialIcons:chevron-right" size={24} color={colors.subText} />
                                </View>
                                {index < filteredClubs.length - 1 && <Divider style={styles.divider} />}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
            {alertConfig?.visible && <Alert {...alertConfig} />}

            <Modal
                visible={isAttrModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAttrModalVisible(false)}
            >
                <ThemedView style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <ThemedText style={appStyles.heading}>Complete details</ThemedText>
                        <TouchableOpacity onPress={() => setIsAttrModalVisible(false)}>
                            <ThemedIcon name="MaterialIcons:close" size={24} color={colors.subText} />
                        </TouchableOpacity>
                    </View>

                    <ThemedText style={styles.modalSubheading}>
                        In order to join club fill up your details
                    </ThemedText>

                    <ScrollView>
                        {clubAttributes.map((attr) => (
                            <InputText
                                key={attr.clubMemberAttributeId}
                                label={attr.attribute + (attr.required === 1 ? " *" : "")}
                                placeholder={`Enter ${attr.attribute}`}
                                onChangeText={(val: string) => handleAttrChange(attr.clubMemberAttributeId, val)}
                                error={attrErrors[attr.clubMemberAttributeId]}
                                containerStyle={{ marginBottom: 15 }}
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <ThemedButton
                            title="Cancel"
                            onPress={() => setIsAttrModalVisible(false)}
                            style={{ flex: 1, backgroundColor: colors.disabled }}
                        />
                        <Spacer hspace={15} />
                        <ThemedButton
                            title="Submit Request"
                            onPress={handleSubmitAttributes}
                        />
                    </View>
                </ThemedView>
            </Modal>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 55,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchIcon: {
        marginRight: 10,
    },
    inputContainerStyle: {
        flex: 1,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },
    searchInputOverride: {
        fontSize: 16,
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        borderWidth: 0,
        elevation: 0,
    },
    resultsContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        maxHeight: '75%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    resultItem: {
        paddingHorizontal: 16,
    },
    resultContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    clubIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f0fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    clubNameText: {
        fontSize: 16,
        fontWeight: '600',
    },
    clubSubText: {
        fontSize: 13,
        color: '#757575',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#9e9e9e',
    },
    modalOverlay: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    modalContent: {
        padding: 20,
        maxHeight: '100%',
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalSubheading: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 20,
    },
    modalFooter: {
        flexDirection: 'row',
        marginTop: 20,
    },
});

export default JoinClub;