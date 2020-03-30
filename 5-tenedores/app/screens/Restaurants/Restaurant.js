import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native'
import { Rating, Icon, ListItem } from 'react-native-elements'
import CarouselForm from '../../components/Carousel'
import Map from '../../components/Map'
import ListReviews from '../../components/Restaurants/ListReview'
import Toast from 'react-native-easy-toast'
import { firebaseApp } from '../../utils/Firebase'
import firebase from 'firebase/app'
import "firebase/firestore"

const db = firebase.firestore(firebaseApp);


export default function Restaurant(props) {
    const screenwith = Dimensions.get("window").width;
    const { navigation } = props;
    const { restaurant } = navigation.state.params;
    //console.log(restaurant);
    const [imageRestaurant, setImageRestauran] = useState([]);
    const [rating, setRating] = useState(restaurant.rating);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useEffect(() => {
        const arrayUrl = [];
        (async () => {
            await Promise.all(restaurant.images.map(async idImage => {
                await firebase.storage()
                    .ref(`restaurant-images/${idImage}`)
                    .getDownloadURL()
                    .then(imageUrl => {

                        arrayUrl.push(imageUrl);
                    });
            }));
            setImageRestauran(arrayUrl);
        })()
    }, [])

    useEffect(() => {
        if (userLogged) {
            db.collection("favorites")
                .where("idRestaurant", "==", restaurant.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get().then(response => {
                    if (response.docs.length === 1) {
                        setIsFavorite(true);
                    }
                })
        }


    }, [])
    const addFavorite = () => {
        if (userLogged) {
            const user = firebase.auth().currentUser;
            //payload
            const payload = {
                idUser: user.uid,
                idRestaurant: restaurant.id,
                createAt: new Date()
            }
            db.collection("favorites").add(payload)
                .then(() => {
                    setIsFavorite(true);
                    toastRef.current.show("Restaurante añadido a favoritos");
                }).catch(() => {

                    toastRef.current.show("Error al añadir el restaurante a la lista de favoritos, inténtelo mas tarde");
                })
        }
        else {
            toastRef.current.show("Tienes que estar logeado", 2000);
        }


    }
    const removeFavorite = () => {
        db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get().then(response => {
                response.forEach(doc => {
                    const idFavorite = doc.id;
                    db.collection("favorites").doc(idFavorite)
                        .delete().then(() => {
                            setIsFavorite(false);
                            toastRef.current.show("Restaurante eliminado de favoritos");
                        })
                        .catch(() => {
                            toastRef.current.show("No se ha podido elimnar de favoritos");
                        })
                })
            })

    }
    return (
        <ScrollView style={styles.viewBody}>

            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#00a680" : "#000"}
                    size={35}
                    underlayColor="transparent"
                ></Icon>
            </View>
            <View>
                <CarouselForm arrayImages={imageRestaurant}
                    width={screenwith}
                    height={200}
                >

                </CarouselForm>
            </View>
            <TitleRestaurant name={restaurant.name} description={restaurant.description} rating={rating}></TitleRestaurant>
            <RestaurantInfo location={restaurant.location} name={restaurant.name} adress={restaurant.adress}></RestaurantInfo>
            <ListReviews setRating={setRating} navigation={navigation} idRestaurant={restaurant.id}></ListReviews>
            <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const { name, description, rating } = props;
    //console.log(props);
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                ></Rating>
            </View>
            <Text style={styles.descriptionRestaurant}>
                {description}
            </Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, adress } = props;
    //console.log(adress);
    const listInfo = [{
        text: adress,
        iconName: "map-marker",
        iconType: "material-community",
        action: null

    }, {
        text: "997977856",
        iconName: "phone",
        iconType: "material-community",
        action: null
    },
    {
        text: "holamundo@gmial.com",
        iconName: "email",
        iconType: "material-community",
        action: null
    }
    ]
    return (
        <View style={styles.viewRestarauntInfo}>
            <Text style={styles.restaurantInfoTitle}>Información sobre el restarurante</Text>
            <Map location={location} name={name} height={150}
            >
            </Map>
            {listInfo.map((item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00a680"
                    }}
                    containerStyle={styles.containerListItem}
                ></ListItem>
            ))}

        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRestaurantTitle: {
        margin: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    rating: {
        position: "absolute",
        right: 0
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey"
    },
    viewRestarauntInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 5
    }
})