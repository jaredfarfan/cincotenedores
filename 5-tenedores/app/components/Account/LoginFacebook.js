import React, { useState } from 'react'
import { SocialIcon } from 'react-native-elements'
import * as firebase from 'firebase'
import * as Facebook from 'expo-facebook';
import { FacebookApi } from '../../utils/Social'
import Loading from '../Loading'

export default function LoginFacebook(props) {
    const { toastRef, navigation } = props;
    const [isLoading, setIsLoading] = useState(false);
    const login = async () => {
        setIsLoading(true);
        try {
            await Facebook.initializeAsync('3056320994386864');
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                const credentials = await firebase.auth.FacebookAuthProvider.credential(token);
                await firebase.auth()
                    .signInWithCredential(credentials)
                    .then(() => {
                        toastRef.current.show('Logged in!', `Hi ${(response.json()).name}!`)
                        navigation.navigate("MyAccount");
                    }
                    ).catch(() => {
                        toastRef.current.show('Error')
                    })

            } else {
                // type === 'cancel'
                toastRef.current.show('Cancelado')
            }
        } catch ({ message }) {
            toastRef.current.show(`Facebook Login Error: ${message}`);
        }
        setIsLoading(false);
    }

    return (
        <>
            <SocialIcon
                title="Iniciar sesión con facebook"
                button
                type="facebook"
                onPress={login}
            />
            <Loading isVisible={isLoading} text="Iniciando sesión"></Loading>
        </>
    )
}