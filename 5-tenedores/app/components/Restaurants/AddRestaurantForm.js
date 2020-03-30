
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'
import Modal from '../Modal'
import uuid from "uuid/v4";

import { firebaseApp } from '../../utils/Firebase'
import firebase from 'firebase/app'
import "firebase/firestore"
const db = firebase.firestore(firebaseApp);

export default function AddRestauranForm(props) {
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAdress, setRestaurantAdress] = useState("");
    const [restaurantDescripction, setRestaurantDescripction] = useState("");

    const { navigation, toastRef, setIsLoading, setIsReloadRestaurant } = props;
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);


    const addRestaurant = () => {
        if (!restaurantName || !restaurantAdress || !restaurantDescripction) {
            toastRef.current.show("Todos los campos son obligatorios");
        }
        else if (imageSelected.length === 0) {
            toastRef.current.show("El restaurante tiene que tener al menos una foto.");
        }
        else if (!locationRestaurant) {
            toastRef.current.show("Tienes que localizar el restaurante en el mapa");
        }
        else {
            setIsLoading(true);
            uploadImageStorage(imageSelected).then(arrayImages => {
                db.collection("restaurant").add({
                    name: restaurantName,
                    adress: restaurantAdress,
                    description: restaurantDescripction,
                    location: locationRestaurant,
                    images: arrayImages,
                    rating: 0,
                    ratingTotal: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebase.auth().currentUser.uid
                }).then(() => {
                    setIsLoading(false);
                    setIsReloadRestaurant(true);
                    navigation.navigate("Restaurants");
                }).catch((error) => {
                    setIsLoading(false);
                    toastRef.current.show("Intente de nuevo");
                    console.log(error);
                });
            });

            //setIsLoading(false);
        }
    }

    const uploadImageStorage = async imageArray => {
        const imageBlob = [];
        await Promise.all(
            imageArray.map(async image => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebaseApp.storage().ref("restaurant-images").child(uuid());
                await ref.put(blob).then(result => {
                    imageBlob.push(result.metadata.name)
                });

            })
        )
        return imageBlob;
    }
    return (
        <ScrollView>
            <ImagenBanner imageRestaurant={imageSelected[0]}></ImagenBanner>
            <FormAdd setRestaurantName={setRestaurantName}
                setRestaurantAdress={setRestaurantAdress}
                setRestaurantDescripction={setRestaurantDescripction}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            ></FormAdd>
            <UploadImage toastRef={toastRef} imageSelected={imageSelected}
                setImageSelected={setImageSelected}></UploadImage>
            <Button title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}

            ></Button>

            <Map isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            ></Map>
        </ScrollView >
    )
}

function UploadImage(props) {
    const { imageSelected, setImageSelected, toastRef } = props;

    const ImageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //console.log(resultPermission);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;
        if (resultPermissionCamera === "denied") {

            toastRef.current.show("Necesario permisos de archivos. Si ha rechazado vaya a configuraciones para activarlo", 5000)
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
                ///array que añadir todo lo que tiene image selected y el uri
                setImageSelected([...imageSelected, result.uri]);


            }
            //console.log(imageSelected);
        }
    }
    const RemoveImage = image => {
        const arrayImage = imageSelected;
        Alert.alert(
            "Eliminar imagein",
            "Estas seguro que quieres eliminiar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => setImageSelected(arrayImage.filter(imageUrl => imageUrl !== image))
                }
            ],
            { cancelable: false }
        )
    }

    return (

        <View style={styles.viewIamges}>
            {imageSelected.length < 5 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={ImageSelect}
                ></Icon>
            )}
            <View style={styles.grid}>
                {imageSelected.map((imageRestaurant, index) => (
                    <View style={styles.boxContainer} key={index}>
                        <Avatar
                            key={index}
                            onPress={() => RemoveImage(imageRestaurant)}
                            style={styles.miniatureStyle}
                            source={{ uri: imageRestaurant }}
                        />
                    </View>
                ))}
            </View>
            {/*
                imageSelected.map((imageRestaurant, index) => (
                    <Avatar
                        key={index}
                        onPress={(() => RemoveImage(imageRestaurant))}
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant }}
                    ></Avatar>
                ))*/
            }




        </View >

    )
}

const withScreen = Dimensions.get("window").width;

function ImagenBanner(props) {
    const { imageRestaurant } = props;
    return (
        <View style={styles.viewPhoto}>
            {imageRestaurant ? (
                <Image source={{ uri: imageRestaurant }} style={{ width: withScreen, height: 200 }}>

                </Image>
            ) : (
                    <Image source={require("../../../assets/img/noimage.png")}></Image>
                )
            }
        </View >
    )
}

function FormAdd(props) {
    const { setRestaurantName,
        setRestaurantAdress,
        setRestaurantDescripction,
        setIsVisibleMap,
        locationRestaurant } = props;
    return (
        <View styles={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            >
            </Input>
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#e3e3e3",
                    onPress: () => setIsVisibleMap(true)

                }}
                onChange={e => setRestaurantAdress(e.nativeEvent.text)}
            >
            </Input>
            <Input
                placeholder="Descripción"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setRestaurantDescripction(e.nativeEvent.text)}
            >
            </Input>

        </View>

    )
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;
    //estados
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async () => {
            const resultPermission = await Permissions.askAsync(Permissions.LOCATION);
            const statusPermission = resultPermission.permissions.location.status;
            if (statusPermission !== "granted") {
                toastRef.current.show("Permiso denegado. Acepta permisos de localización para crear un restaurante", 5000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                console.log(loc);
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })

            }

        })();
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localización guardada correctamente");
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View

            >
                {location && (
                    <MapView style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={region => setLocation(region)
                        }
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        >
                        </MapView.Marker>
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button title="Guardar ubicación"
                        onPress={confirmLocation}
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                    >
                    </Button>
                    <Button title="Cancelar"
                        onPress={() =>
                            setIsVisibleMap(false)
                        }
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                    >
                    </Button>
                </View>
            </View>
        </Modal >
    )

}

const styles = StyleSheet.create({
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewIamges: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    }
    , textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: "#00a686",
        margin: 20
    },
    grid: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
    }
});

