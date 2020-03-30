import React from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Button } from 'react-native-elements'
import { withNavigation } from 'react-navigation'

function UserGuest(props) {
    console.log(props);
    const { navigation } = props;
    return (
        <ScrollView style={styles.viewBody} centerContent={true}>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                style={styles.image}
                resizeMode="contain"
            ></Image>
            <Text style={styles.title}>
                Consulta tu perfil
        </Text>
            <Text style={styles.description}>
                ¿Como describirias tu mejor restaurante?
            </Text>
            <View style={styles.viewBtn}>
                <Button title="Ver tu perfil" onPress={
                    () => navigation.navigate("Login")

                } style={styles.btnStyle} containerStyle={styles.btnContainer}></Button>
            </View>
        </ScrollView>

    );
}

export default withNavigation(UserGuest);

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    description: {
        textAlign: "center",
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    },
    btnStyle: {
        backgroundColor: "#00a680"
    },
    btnContainer: {
        width: "70%"

    }
});