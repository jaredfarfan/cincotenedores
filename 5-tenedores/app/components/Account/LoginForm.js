import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { validateEmail } from '../../utils/Validation'
import Loading from '../Loading'
import * as Firebase from 'firebase'
import { withNavigation, withOrientation } from 'react-navigation'

function LoginForm(props) {
    const { toastRef, navigation } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isVisbleLoading, setIsVisibleLoading] = useState(false);
    const Login = async () => {
        setIsVisibleLoading(true);

        if (!email || !password) {
            toastRef.current.show("Todos los campos son obligatorios");
        }
        else {
            if (!validateEmail(email)) {
                toastRef.current.show("Email no valido");
            }
            else {
                await Firebase.auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                        navigation.navigate("MyAccount");
                    })
                    .catch(() => {
                        toastRef.current.show("Intente de nuevo");
                    })
            }
        }
        setIsVisibleLoading(false);
    }
    const [hidePassword, setHidePasswor] = useState(true)
    return (
        <View style={styles.formContainer}>
            <Input containerStyle={styles.inputForm} placeholder="Correo electronico"
                onChange={e => setEmail(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    >

                    </Icon>
                }
            >
            </Input>
            <Input placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={hidePassword}
                onChange={a => setPassword(a.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => {
                            setHidePasswor(!hidePassword)
                        }}
                    >

                    </Icon>
                }
            ></Input>
            <Button
                buttonStyle={styles.btnLogin}
                containerStyle={styles.btnContainerLogin}
                title="Iniciar sesión"
                onPress={Login}></Button>
            <Loading isVisible={isVisbleLoading} text="Iniciando sesion"></Loading>
        </View>

    )
}
export default withNavigation(LoginForm)
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    iconRight: {
        color: "#c1c1c1"
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%"
    },
    btnLogin: {
        backgroundColor: "#00a680"
    }
})