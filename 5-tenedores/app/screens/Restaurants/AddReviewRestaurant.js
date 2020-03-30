import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'

import { firebaseApp } from '../../utils/Firebase'
import firebase from 'firebase/app'
import "firebase/firestore"
const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
    const { navigation } = props;
    const { idRestaurant, setReviewReload } = navigation.state.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const addReview = () => {
        if (rating == null) {
            toastRef.current.show("No has dado nunguna puntuación");
        }
        else if (!title) {
            toastRef.current.show("El título es obligatorio");
        }
        else if (!review) {
            toastRef.current.show("El comentario es obligatorio");
        }
        else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            //payload
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date()
            }
            db.collection("reviews").add(payload)
                .then(() => {
                    console.log("guardado");
                }).catch(() => {
                    setIsLoading(false);
                    toastRef.current.show("Error");
                })
            updateRestaurant();

        }

    }


    const updateRestaurant = () => {
        console.log(idRestaurant);
        const restaurantRef = db.collection("restaurant").doc(idRestaurant);
        //console.log(restaurantRef);
        restaurantRef.get().then(response => {
            const restaurantData = response.data();
            // console.log(restaurantData);
            //calcular el riting total
            const ratingTotal = restaurantData.ratingTotal + rating;
            //calcular cuantos votos a recibido este restaurante
            const quantityVoting = restaurantData.quantityVoting + 1;
            //calular la media re puntuacion
            const ratingResult = ratingTotal / quantityVoting;

            //actualizarRestaurante
            restaurantRef.update({ rating: ratingResult, ratingTotal: ratingTotal, quantityVoting: quantityVoting }).then(() => {
                setIsLoading(true);
                setReviewReload(true);
                navigation.goBack();
            })

        })
    }
    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={value => {
                        setRating(value);
                    }}
                ></AirbnbRating>
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="titulo"
                    containerStyle={styles.input}
                    onChange={e => setTitle(e.nativeEvent.text)}
                ></Input>
                <Input
                    placeholder="Comentario.."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={e => setReview(e.nativeEvent.text)}
                >
                </Input>
                <Button
                    title="Envia comentario"
                    onPress={addReview}
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                ></Button>
                <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
                <Loading isVisible={isLoading} text="Enviando comentario"></Loading>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        margin: 10,
        marginTop: 40,
        flex: 1,
        alignItems: "center"
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});