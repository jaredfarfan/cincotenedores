import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button, Text } from 'react-native-elements'
import * as firebase from 'firebase'
import { reauthenticate } from '../../utils/Api'

export default function ChangePasswordForm(props) {
    const { setIsVisibleModal, toastRef } = props;
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [hideNewPassword, setHideNewPassword] = useState(true);
    const [hideNewPasswordRepeat, setHideNewHidePasswordRepeat] = useState(true);
    const updatePassword = () => {
        setError({});
        if (!password || !newPassword || !newPasswordRepeat) {
            let objError = {};
            !password && (objError.password = "No pueden estar vacíos");
            !newPassword && (objError.newPassword = "No pueden estar vacíos");
            !newPasswordRepeat && (objError.newPasswordRepeat = "No pueden estar vacíos");
            setError(objError);
        }
        else {
            if (newPassword !== newPasswordRepeat) {
                setError({
                    newPassword: "Las nuevas contraseñas tienen que ser iguales",
                    newPasswordRepeat: "Las nuevas contraseñas tienen que ser iguales"
                })
            } else {
                setIsLoading(true);
                reauthenticate(password).then(() => {
                    firebase.auth()
                        .currentUser.updatePassword(newPassword)
                        .then(() => {
                            setIsLoading(false);
                            toastRef.current.show("Contraseña actualizada correctamente");
                            setIsVisibleModal(false);
                            //pasa sacar de la sesion al cambiar de password
                            //firebase.auth().signOut();
                        }).catch(() => {
                            setError({ general: "Error al actualizar la contraseña" });
                            setIsLoading(false);
                        })
                }).catch(() => {
                    setError({ password: "La contraseña no es correcta" })
                    setIsLoading(false);
                })
            }
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                password={true}
                containerStyle={styles.input}
                secureTextEntry={hidePassword}
                onChange={
                    e => {
                        setPassword(e.nativeEvent.text);
                    }

                }
                rightIcon={{
                    type: "material-community",
                    name: hidePassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => {
                        setHidePassword(!hidePassword);
                    }
                }}
                errorMessage={error.password}
            >

            </Input>
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hideNewPassword}
                onChange={e => {
                    setNewPassword(e.nativeEvent.text);
                }}
                rightIcon={{
                    type: "material-community",
                    name: hideNewPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => {
                        setHideNewPassword(!hideNewPassword);
                    }
                }}
                errorMessage={error.newPassword}
            ></Input>
            <Input
                placeholder="Escribe de nuevo la contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hideNewPasswordRepeat}
                onChange={e => {
                    setNewPasswordRepeat(e.nativeEvent.text);
                }}
                rightIcon={{
                    type: "material-community",
                    name: hideNewPasswordRepeat ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => {
                        setHideNewHidePasswordRepeat(!hideNewPasswordRepeat);
                    }
                }}
                errorMessage={error.newPasswordRepeat}
            ></Input>
            <Button

                title="Cambiar password"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={updatePassword}
                loading={isLoading}
            >


            </Button>
            <Text>{error.general}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10,
        marginTop: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});