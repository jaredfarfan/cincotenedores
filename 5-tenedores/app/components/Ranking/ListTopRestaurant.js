import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native'

import { Card, Image, Rating, Icon } from 'react-native-elements'
import * as firebase from 'firebase'

export default function ListTopRestaurant(props) {
    const { restaurants, navigation } = props;


    return (
        <FlatList
            data={restaurants}
            renderItem={restaurant => <Restaurant restaurant={restaurant} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
        >

        </FlatList>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    console.log(props);
    const { name, description, images, rating } = restaurant.item;
    const [imageRestaurant, setImageRestaurant] = useState(null);
    const [iconColor, setIconColor] = useState("#000");

    useEffect(() => {
        const image = images[0];
        firebase.storage().ref(`restaurant-images/${image}`)
            .getDownloadURL()
            .then(response => {
                //console.log(response);
                setImageRestaurant(response);

            })

    }, [])

    useEffect(() => {
        if (restaurant.index === 0)
            setIconColor("#efb819")
        else if (restaurant.index === 1)
            setIconColor("#e3e4e5")
        else if (restaurant.index === 2)
            setIconColor("#cd7f32")

    }, [])

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Restaurant", { restaurant: restaurant.item })

            }}
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                >

                </Icon>
                <Image style={styles.restaurantImage}
                    resizeMode="cover"
                    source={{ uri: imageRestaurant }}
                ></Image>
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly
                        style={styles.riting}
                    >

                    </Rating>
                </View>
                <Text style={styles.description}>{description}</Text>



            </Card>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 30,
        borderWidth: 0
    },
    containerIcon: {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1
    },
    restaurantImage:
    {
        width: "100%",
        height: 200
    },
    titleRating: {
        flexDirection: "row",
        marginTop: 10
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    riting: {
        position: "absolute",
        right: 0
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    }
});
