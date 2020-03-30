import React, { useState, useEffect, useRef } from 'react'
import { Alert, View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image, Icon, Button } from 'react-native-elements'
import Loading from '../components/Loading'
import Toast from 'react-native-easy-toast'
import { NavigationEvents } from 'react-navigation'

import { firebaseApp } from '../utils/Firebase'
import firebase from 'firebase/app'
import "firebase/firestore"

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
    const { navigation } = props;
    const [restaurants, setRestaurants] = useState([]);
    //console.log(restaurants);
    const [reloadRestaurant, SetReloadRestaurant] = useState(false);
    const [isVisbleLoading, setIsVisibleLoading] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false);
    })


    useEffect(() => {
        if (userLogged) {
            const idUser = firebase.auth()
                .currentUser.uid;
            db.collection("favorites").where("idUser", "==", idUser)
                .get()
                .then(response => {
                    const idRestaurantsArray = [];
                    response.forEach(doc => {
                        idRestaurantsArray.push(doc.data().idRestaurant)
                    });
                    getDataRestaurants(idRestaurantsArray).then(response => {
                        const restaurants = [];
                        response.forEach(doc => {
                            let restaurant = doc.data();
                            restaurant.id = doc.id;
                            restaurants.push(restaurant);
                        })
                        setRestaurants(restaurants);
                    })
                });


        }
        SetReloadRestaurant(false);


    }, [reloadRestaurant]);

    const getDataRestaurants = idRestaurantsArray => {
        const arrayRestaurant = [];
        idRestaurantsArray.forEach(idRestaurant => {
            const result = db.collection("restaurant").doc(idRestaurant).get();
            arrayRestaurant.push(result);
        })
        //return arrayRestaurant; asi devolverá vacio
        //promesa termina de ejecutar la funcion y devuelve lo que tenias
        return Promise.all(arrayRestaurant);
    }

    if (!userLogged) {
        return <UserNotLogged SetReloadRestaurant={SetReloadRestaurant} navigation={navigation}></UserNotLogged>
    }
    if (restaurants.length === 0) { return <NotFoundRestaurant SetReloadRestaurant={SetReloadRestaurant} /> }

    return (
        <View style={styles.viewBody}>
            <NavigationEvents
                onWillFocus={() => SetReloadRestaurant(true)}

            ></NavigationEvents>
            {
                restaurants ? (
                    <FlatList
                        data={restaurants}
                        renderItem={restaurant => <Restaurant SetReloadRestaurant={SetReloadRestaurant}
                            toastRef={toastRef}
                            setIsVisibleLoading={setIsVisibleLoading}
                            restaurant={restaurant} navigation={navigation} />}
                        keyExtractor={(item, index) => index.toString()}
                    ></FlatList>
                ) : (
                        <View style={styles.loaderRestaurants}>
                            <ActivityIndicator size="large">
                                <Text>Cargando destaurantes</Text>
                            </ActivityIndicator>
                        </View>
                    )
            }
            <Toast ref={toastRef} position="center" opacity={1}></Toast>
            <Loading text="Eliminando restaurante" isVisible={setIsVisibleLoading}></Loading>
        </View>
    )
}

function Restaurant(props) {
    const [imageRestaurant, setImageRestaurant] = useState(null);
    const { restaurant, navigation, setIsVisibleLoading, SetReloadRestaurant, toastRef } = props;
    //entrar a la propiedad items
    const { id, name, images } = restaurant.item;
    useEffect(() => {
        const image = images[0];
        firebase.storage().ref(`restaurant-images/${image}`).getDownloadURL()
            .then(response => {
                setImageRestaurant(response);
            })

    }, [])

    const confirmRemoveFavorite = () => {
        Alert.alert("Eliminar restaurante de favoritos",
            "¿Estas seguro?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: removeFavorite
                }
            ],
            { cancelable: false }
        )

    }

    const removeFavorite = () => {
        setIsVisibleLoading(true);
        db.collection("favorites").where("idRestaurant", "==", id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then(response => {
                response.forEach(doc => {
                    const idFavorite = doc.id;
                    db.collection("favorites").doc(idFavorite).delete()
                        .then(() => {
                            setIsVisibleLoading(false);
                            SetReloadRestaurant(true);
                            toastRef.current.show("Eliminado correctamente");
                        })
                        .catch(() => {
                            toastRef.current.show("Error al eliminar el restaurante, intentelo mas tarde");
                        })
                })
            })
    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Restaurant", { restaurant: restaurant.item });
            }}>
                <Image resizeMode="cover"
                    source={{ uri: imageRestaurant }}
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff" ></ActivityIndicator>}
                ></Image>
            </TouchableOpacity>
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Icon
                    type="material-community"
                    name="heart"
                    color="#00a680"
                    containerStyle={styles.favorite}
                    onPress={confirmRemoveFavorite}
                    size={40}
                    underlayColor="transparent"
                ></Icon>
            </View>

        </View >
    )
}
function NotFoundRestaurant(props) {
    const { SetReloadRestaurant } = props;
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <NavigationEvents
                onWillFocus={() => SetReloadRestaurant(true)}

            ></NavigationEvents>
            <Icon type="material-community"
                name="alert-outline"
                size={50}
            ></Icon>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>No tienes restaurantes en la lista</Text>
        </ View>
    )
}

function UserNotLogged(props) {
    const { SetReloadRestaurant, navigation } = props;
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <NavigationEvents
                onWillFocus={() => SetReloadRestaurant(true)}

            ></NavigationEvents>
            <Icon type="material-community"
                name="alert-outline"
                size={50}
            ></Icon>
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Necesitas estar logeado para ver esta sección</Text>
            <Button title="Ir al login"
                onPress={() => {
                    navigation.navigate("Login")
                }}
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#00a680" }}
            ></Button>
        </ View>
    )
}


const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10
    },
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    restaurant: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff"
    },
    name: {
        fontWeight: "bold",
        fontSize: 20
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100
    }
})