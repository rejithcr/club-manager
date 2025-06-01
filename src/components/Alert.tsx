import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedView from './themed-components/ThemedView';
import ThemedText from './themed-components/ThemedText';
import Modal from 'react-native-modal'
import ThemedButton from './ThemedButton';

type AlertButton = {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
};

export type AlertProps = {
    visible: boolean;
    title?: string;
    message?: string;
    buttons?: AlertButton[];
    onRequestClose?: () => void;
};

const Alert: React.FC<AlertProps> = ({
    visible,
    title,
    message,
    buttons = [{ text: 'OK' }],
    onRequestClose,
}) => {
    return (
        <Modal isVisible={visible}>
            <ThemedView style={styles.container}>
                {title ? <ThemedText style={styles.title}>{title}</ThemedText> : null}
                {message ? <ThemedText style={styles.message}>{message}</ThemedText> : null}
                <View style={styles.buttonRow}>
                    {buttons.map((btn, idx) => (
                        <ThemedButton
                            key={idx}
                            style={styles.button}
                            onPress={() => {
                                btn.onPress?.();
                                onRequestClose?.();
                            }}
                            title={btn.text}
                        />
                    ))}
                </View>
            </ThemedView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: 50,
        minWidth: 50
    }
});

export default Alert;