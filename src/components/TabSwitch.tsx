import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import ThemedText from './themed-components/ThemedText';

interface TabSwitchProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabSwitch = ({ tabs, activeTab, onTabChange }: TabSwitchProps) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { borderBottomColor: colors.border }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => onTabChange(tab)}
                        style={StyleSheet.flatten([
                            styles.tab,
                            isActive && { borderBottomColor: colors.nav, borderBottomWidth: 2 }
                        ])}
                    >
                        <ThemedText style={StyleSheet.flatten([
                            styles.tabText,
                            { color: isActive ? colors.text : colors.subText },
                            isActive && { fontWeight: '600' }
                        ])}>
                            {tab}
                        </ThemedText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
        paddingHorizontal: 4,
    },
    tabText: {
        fontSize: 14,
    },
});

export default TabSwitch;
