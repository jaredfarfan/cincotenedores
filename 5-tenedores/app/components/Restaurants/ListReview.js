import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Button, Avatar, Rating } from 'react-native-elements'

import { firebaseApp } from '../../utils/Firebase'
import firebase from 'firebase/app'
import "firebase/firestore"

const db = firebase.firestore(firebaseApp);

export default function ListReview(props) {
    const { navigation, idRestaurant, setRating } = props;
    const [reviews, setReviews] = useState([]);
    const [reviewsReload, setReviewReload] = useState(false);
    const [userLoggedd, setUserLoggedd] = useState(false);
    console.log(reviews);

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLoggedd(true) : setUserLoggedd(false);
    });

    useEffect(() => {

        (async () => {
            const resultReviews = [];
            const arrayRating = [];

            db.collection("reviews").where("idRestaurant", "==", idRestaurant)
                .get().then(response => {
                    response.forEach(doc => {

                        resultReviews.push(doc.data());
                        arrayRating.push(doc.data().rating);
                    });
                    let numSum = 0;
                    arrayRating.map(value => {
                        numSum = numSum + value;
                    });
                    const countRating = arrayRating.length;
                    const resultRating = numSum / countRating;
                    const resultRatingFinish = resultRating ? resultRating : 0;
                    setReviews(resultReviews);
                    setRating(resultRatingFinish);
                })
            setReviewReload(false);

        })()


    }, [reviewsReload])
    return (
        <View >
            {userLoggedd ? (
                <Button style={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddReview}
                    title="Escibir una opinión"
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#000000"
                    }}
                    onPress={() => {
                        navigation.navigate("AddReviewRestaurant", {
                            idRestaurant: idRestaurant, setReviewReload: setReviewReload
                        });

                    }}
                ></Button>
            ) : (
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: "center", color: "#00a68a", padding: 20 }}
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            Para escribir un comentario es necesario estar logeado{" "}
                            <Text style={{ fontWeight: "bold" }}>
                                pulsa AQUI para iniciar sesión
                            </Text>
                        </Text>
                    </View>
                )}

            <FlatList
                data={reviews}
                renderItem={review => <Review review={review}></Review>}
                keyExtractor={(item, index) => index.toString()}
            >

            </FlatList>
        </View >
    )

}

function Review(props) {
    const { title, review, rating, createAt, avatarUser } = props.review.item;
    const createReview = new Date(createAt.seconds * 1000);

    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar}>
                <Avatar
                    size={"large"}
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={{ uri: avatarUser ? avatarUser : "https://api.adorable.io/avatars/98/abott@adorable.png" }}
                >

                </Avatar>
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating imageSize={15} startingValue={rating} readonly></Rating>
                <Text style={styles.reviewData}>{createReview.getDate()}/ {createReview.getMonth() + 1}/{createReview.getFullYear()}
                - {createReview.getHours()}:{createReview.getMinutes() < 10 ? "0" : ""}
                    {createReview.getMinutes()}
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#000000"
    },
    viewReview: {
        flexDirection: "row",
        margin: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "gray",
        marginBottom: 5
    },
    reviewData: {
        marginTop: 5,
        color: "gray",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0

    }
});