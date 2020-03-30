import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase'
import { reauthenticate } from '../../utils/Api'

export default function ChangeEmailForm(props) {
    const { email, setIsVisibleModal, setReloadData, toastRef } = props;
    //console.log(props);
    const [newEmail, setnewEmail] = useState("");
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [password, setPassword] = useState("");

    const updateEmail = () => {

        setError({});
        if (!newEmail || email === newEmail) {
            setError({ email: "El correo no debe ser igual o estar limpio" });
        } else {
            setIsLoading(true);
            reauthenticate(password).then(() => {

                firebase.auth()
                    .currentUser.updateEmail(newEmail)
                    .then(() => {
                        setIsLoading(false);
                        setReloadData(true);
                        toastRef.current.show("Email actualizado correctamente");
                        setIsVisibleModal(false);
                    }).catch(() => {
                        setError({ email: "Error al actualizar el email" });
                        setIsLoading(false);
                    })

            }).catch(() => {
                setError({ password: "La contraseña no es correcta" })
                setIsLoading(false);
            })


        }
    }
    return (
        <View style={styles.view}>
            <Input
                placeholder="Email"
                containerStyle={styles.input}
                defaultValue={email && email}
                onChange={
                    e => {
                        setnewEmail(e.nativeEvent.text);
                    }

                }
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                errorMessage={error.email}
            >

            </Input>
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hidePassword}
                onChange={e => {
                    setPassword(e.nativeEvent.text);
                }}
                rightIcon={{
                    type: "material-community",
                    name: hidePassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => {
                        setHidePassword(!hidePassword);
                    }
                }}
                errorMessage={error.password}
            ></Input>
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={updateEmail}
                loading={isLoading}
            >

            </Button>
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