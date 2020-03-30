import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import { SearchBar, ListItem, Icon } from 'react-native-elements'

import { FireSQL } from 'firesql'
import firebase from 'firebase/app'

import { useDebouncedCallback } from 'use-debounce'

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
    const { navigation } = props;
    const [restaurants, setRestaurant] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        onSearch();
    }, [search])

    const [onSearch] = useDebouncedCallback(() => {
        if (search) {
            fireSQL
                .query(`SELECT * FROM restaurant WHERE name LIKE '${search}%'`)
                .then(response => {
                    setRestaurant(response);


                })
        }
    }, 500)
    return (
        <View>
            <SearchBar
                placeholder="Busca tu restaurante"
                onChangeText={e =>
                    setSearch(e)
                }
                value={search}
                containerStyle={styles.searchBar}
            >

            </SearchBar>
            {restaurants.length == 0 ? (
                <NoFoundRestaurants></NoFoundRestaurants>
            ) : (
                    <FlatList
                        data={restaurants}
                        renderItem={restaurant => <Restaurant restaurant={restaurant} navigation={navigation}></Restaurant>}
                        keyExtractor={(item, index) => index.toString()}

                    >

                    </FlatList>
                )}
        </View >
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { name, images } = restaurant.item;
    const [imageRestaurant, setImageRestaurant] = useState(null);

    useEffect(() => {
        const image = images[0];
        firebase.storage().ref(`restaurant-images/${image}`)
            .getDownloadURL()
            .then(response => {
                //console.log(response);
                setImageRestaurant(response)

            })

    }, []);

    return (
        <View>
            <ListItem
                title={name}
                leftAvatar={{ source: { uri: imageRestaurant } }}
                rightIcon={<Icon type="material-community" name="chevron-right"></Icon>}
                onPress={() => {
                    navigation.navigate("Restaurant", { restaurant: restaurant.item })

                }}
            ></ListItem>
        </View>
    );
}

function NoFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Image
                source={require("../../assets/img/not_found.png")}
                resizeMode="cover"
                style={{ width: 200, height: 200 }}
            ></Image>
        </View>
    )
}
const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20
    }
});