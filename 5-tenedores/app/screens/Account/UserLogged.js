import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import * as firebase from 'firebase'
import InfoUser from '../../components/Account/InfoUser'
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AcountOptions from './../../components/Account/AcountOptions'

export default function UserLogged() {
    const [userInfo, setUserInfo] = useState({});
    const [reloaData, setReloadData] = useState(false);
    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [textLoading, setTextLoading] = useState("");

    useEffect(() => {
        (
            async () => {
                const user = await firebase.auth().currentUser;
                setUserInfo(user.providerData[0]);
                console.log(user);

            })();
        setReloadData(false);
    }, [reloaData]);
    return (
        <View style={styles.viewUserInfo}>
            <InfoUser
                toastRef={toastRef}
                setReloadData={setReloadData}
                userInfo={userInfo}
                setIsLoading={setIsLoading}
                setTextLoading={setTextLoading}
            ></InfoUser>
            <AcountOptions toastRef={toastRef} userInfo={userInfo} setReloadData={setReloadData}></AcountOptions>
            <Button title="Cerrar sesion"
                onPress={() => {
                    firebase.auth().signOut()
                }}
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
            ></Button>
            <Toast ref={toastRef} position="center" opacity={0.5}>

            </Toast>
            <Loading text={textLoading} isVisible={isLoading}></Loading>
        </View>

    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 3,
        borderBottomColor: "#e3e3e3",
        paddingBottom: 10,
        paddingTop: 10
    },
    btnCloseSessionText: {
        color: "#00a680"
    }
})