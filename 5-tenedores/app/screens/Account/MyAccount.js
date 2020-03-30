import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import * as firebase from 'firebase'
import Loading from '../../components/Loading'

import UserGuest from './UserGuest'
import UserLogged from './UserLogged'

export default function MyAccount() {

    const [loging, setLogin] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            console.log(user);
            !user ? setLogin(false) : setLogin(true);
        })
    }, []);

    if (loging === null) {
        return <Loading isVisible={true} text="Cargando.." />;
    }

    return loging ? <UserLogged /> : <UserGuest />



}