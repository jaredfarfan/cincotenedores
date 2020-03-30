import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, Button } from 'react-native'
import { Divider } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
import LoginForm from '../../components/Account/LoginForm'
import Toast from 'react-native-easy-toast'
import LoginFacebook from '../../components/Account/LoginFacebook'

function Login(props) {
    const { navigation } = props;
    const toastRef = useRef();
    return (
        <ScrollView>
            <Image source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                style={styles.logo}
                resizeMode="contain"
            ></Image>
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef}></LoginForm>

                <CreateAccount navigation={navigation}></CreateAccount>
            </View>
            <Divider style={styles.divider}>

            </Divider>
            <View style={styles.viewContainer}>
                <LoginFacebook toastRef={toastRef} navigation={navigation} />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.5} >

            </Toast>
        </ScrollView>
    )
}

export default withNavigation(Login);

function CreateAccount(props) {
    const { navigation } = props;
    return (
        <Text style={styles.textRegister}>
            ¿Aun no tienes una cuenta?{" "}
            <Text style={styles.btnRegister} onPress={
                () => navigation.navigate("Register")
            }>Registrar</Text>
        </Text >
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    }
})
