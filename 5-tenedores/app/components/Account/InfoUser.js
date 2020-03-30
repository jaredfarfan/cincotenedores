import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Avatar } from 'react-native-elements'
import * as firebase from 'firebase'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'


export default function InfoUser(props) {

    const {
        userInfo,
        userInfo: {
            photoURL, uid, displayName, email
        },
        setReloadData,
        toastRef,
        setIsLoading,
        setTextLoading
    } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.log(resultPermission);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;
        console.log("inicio");
        console.log(resultPermissionCamera);
        console.log("fin");
        if (resultPermissionCamera === "denied") {

            toastRef.current.show("Necesario permisos de archivos")
        }
        else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if (result.cancelled) {
                toastRef.current.show("Has cancelado");
            }
            else {

                uploadImage(result.uri, uid).then(() => {
                    console.log("imagen subida corectamente");

                    updatePhotoUrl(uid);
                });

            }
        }


    }

    const uploadImage = async (uri, nameImage) => {
        console.log(uri);
        console.log(nameImage);
        setTextLoading("Actualizando avatar");
        setIsLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase.storage()
            .ref().child(`avatar/${nameImage}`);
        return ref.put(blob);



    }

    const updatePhotoUrl = uid => {
        firebase.storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async result => {
                const update = {
                    photoURL: result
                }
                await firebase.auth()
                    .currentUser.updateProfile(update);
                setReloadData(true);
                setIsLoading(false);
            }).catch(() => {
                toastRef.current.show("Error al recuperar la imagen");

            });
    }
    console.log(props);
    return (

        <View style={styles.viewUserInfo}>
            <Avatar rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={{ uri: photoURL ? photoURL : "https://api.adorable.io/avatars/93/abott@adorable.png" }}
            ></Avatar>
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}

                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold"
    }
});

