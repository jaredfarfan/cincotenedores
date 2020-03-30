import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { validateEmail } from '../../utils/Validation'
import * as firebase from 'firebase'
import Loading from '../../components/Loading'
import { withNavigation } from 'react-navigation'


function RegisterForm(props) {
    console.log(props);
    const [isVisibleLoading, setIsVisibleLoading] = useState(false);
    const { toastRef, navigation } = props;
    const [hidePassword, setHidePasswor] = useState(true)
    const [hideRepeatPassword, setHideRepeatPasswor] = useState(true)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const register = async () => {
        setIsVisibleLoading(true);
        if (!email || !password || !repeatPassword) {
            //vacio
            toastRef.current.show("Todos los campos son obligatorios");
        }
        else {
            if (!validateEmail(email)) {
                //incorrecto
                toastRef.current.show("El email no es correcto");
            }
            else {
                //correcto
                if (password != repeatPassword) {
                    console.log("!contraseñas")
                    toastRef.current.show("Las contraseñas no son iguales");
                }
                else {
                    //correcto
                    await firebase.auth()
                        .createUserWithEmailAndPassword(email, password)
                        .then(
                            () =>
                                //toastRef.current.show("Usuario creado correctamente")
                                navigation.navigate("MyAccount")

                        ).catch(
                            () => toastRef.current.show("Intente de nuevo")
                        );
                }
            }
        }
        setIsVisibleLoading(false);
    }


    return (
        <View styles={styles.formContainer} behavior="padding" enabled>
            <Input placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={e => setEmail(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}>

                    </Icon>
                }
            ></Input>
            <Input
                placeholder="Contraseña"
                password={true}
                secureTextEntry={hidePassword}
                containerStyle={styles.inputForm}
                onChange={e => setPassword(e.nativeEvent.text)}
                rightIcon={
                    <Icon type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => {
                            setHidePasswor(!hidePassword)
                        }}
                    >

                    </Icon>
                }
            >
            </Input>
            <Input
                placeholder="Repetir contraseña"
                password={true}
                secureTextEntry={hideRepeatPassword}
                containerStyle={styles.inputForm}
                onChange={e => setRepeatPassword(e.nativeEvent.text)}
                rightIcon={
                    <Icon type="material-community"
                        name={hideRepeatPassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={
                            () => {
                                setHideRepeatPasswor(!hideRepeatPassword)
                            }
                        }
                    >

                    </Icon>
                }
            >
            </Input>
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={register}
            ></Button>
            <Loading text="Creando cuenta" isVisible={isVisibleLoading}></Loading>
        </View>
    )
}
export default withNavigation(RegisterForm);

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    iconRight: {
        color: "#C1C1C1"
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%"
    },
    btnRegister: {
        backgroundColor: "#00a680"
    }
});


