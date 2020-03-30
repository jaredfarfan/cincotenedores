import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements'
import * as firebase from 'firebase'

export default function ListRestaurants(props) {

    const { restaurants, IsLoading, handleLoadMore, navigation } = props;

    return (
        <View>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={restaurant => <Restaurant navigation={navigation} restaurant={restaurant} />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={<FooterList IsLoading={IsLoading}></FooterList>}
                >

                </FlatList>
            ) : (
                    <View style={styles.loaderRestaurant}>
                        <ActivityIndicator size="large">
                            <Text>Cargando restaurante</Text>
                        </ActivityIndicator>
                    </View>
                )
            }
        </View >
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { name, adress, description, images } = restaurant.item.restaurant;
    //    console.log(restaurant);

    const [imageRestaurant, setImageRestaurant] = useState(null);
    useEffect(() => {
        const image = images[0];
        firebase.storage().ref(`restaurant-images/${image}`).getDownloadURL().then(result => {
            setImageRestaurant(result);
            // console.log(result);
        })

    });

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Restaurant", { restaurant: restaurant.item.restaurant })
        }>
            <View style={styles.viewRestaurant}>
                <View stle={styles.viewRestarantImage}>
                    <Image
                        resizeMode="cover"
                        source={{ uri: imageRestaurant }}
                        style={styles.imageRestaurant}
                        PlaceholderContent={<ActivityIndicator color="fff"></ActivityIndicator>}
                    ></Image>
                </View>
                <View>
                    <Text style={styles.restauranName}>{name}</Text>
                    <Text style={styles.restauranAdress}>{adress}</Text>
                    <Text style={styles.restauranDescription}>{description}</Text>
                </View>
            </View>
        </TouchableOpacity >
    )

}

function FooterList(props) {
    const { IsLoading } = props;

    if (IsLoading) {
        return (<View>
            <ActivityIndicator size="large" style={styles.loaderRestaurant} />
        </View>)
    }
    else {
        return (
            <View style={styles.notFoundRestaurant}>
                <Text>No quedan restaurante para mostrar</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({

    loadingRestaurant: {
        marginTop: 20,
        alignItems: "center"
    },
    viewRestaurant: {
        flexDirection: "row",
        margin: 10
    },
    viewRestarantImage: {
        marginRight: 15
    },
    imageRestaurant: {
        width: 80,
        height: 80
    },
    restauranName: {
        fontWeight: "bold"
    },
    restauranAdress: {
        paddingTop: 2,
        color: "grey"
    },
    restauranDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    notFoundRestaurant: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center"
    },
    loaderRestaurant: {
        marginTop: 10,
        marginBottom: 10
    }
}); 