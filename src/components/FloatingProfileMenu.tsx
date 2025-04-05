import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'


const FloatingProfileMenu = (props: { onPress?: any; photo?: any }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity  onPress={props.onPress}>
                <Image style={styles.image}
                    source={{
                        uri: props.photo,
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

export default FloatingProfileMenu

const styles = StyleSheet.create({
    container: {
        top: 30,
        right: 30,
        position: 'absolute',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'black',
        justifyContent: "center",
        alignItems: "center"
    }

})