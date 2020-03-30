import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ActionButton from 'react-native-action-button'
import ListRestaurants from '../../components/Restaurants/ListRestaurants'

import { firebaseApp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [startRestaurant, setStarRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRestaurant, setTotalRestaurant] = useState(0);
    const limiteRestaurants = 8;
    const [isReloadRestaurant, setIsReloadRestaurant] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(userinfo => {
            setUser(userinfo);
        });
    }, []);

    useEffect(() => {
        db.collection("restaurant").get().then((snap) => {
            setTotalRestaurant(snap.size);
            //console.log(snap.size);
            //console.log("jared");
        });

        (async () => {
            const resultRestaurant = [];
            const restaurants = db.collection("restaurant").orderBy('createAt', "desc").limit(limiteRestaurants);
            await restaurants.get().then(response => {
                //console.log(response);
                setStarRestaurant(response.docs[response.docs.length - 1]);
                response.forEach(doc => {
                    //console.log(doc.data());

                    let restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurant.push({ restaurant });
                });
                setRestaurants(resultRestaurant);
                //console.log(resultRestaurant);
            })
        })();
        setIsReloadRestaurant(false);
    }, [isReloadRestaurant]);

    const handleLoadMore = async () => {
        console.log("entre en hande");
        const resultRestaurants = [];
        restaurants.length < totalRestaurant && setIsLoading(true);
        const restaurantsDb = db.collection('restaurant').orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt)
            .limit(limiteRestaurants);


        await restaurantsDb.get().then(response => {
            if (response.docs.length > 0) {
                setStarRestaurant(response.docs[response.docs.length - 1]);
            }
            else {
                setIsLoading(false);
            }
            response.forEach(doc => {
                let restaurant = doc.data();
                restaurant.id = doc.id;
                resultRestaurants.push({ restaurant });
            });
            setRestaurants([...restaurants, ...resultRestaurants]);
        })
    }

    // console.log(props);

    return (
        <View style={styles.viewBody}>
            <ListRestaurants navigation={navigation} isLoading={isLoading} restaurants={restaurants} handleLoadMore={handleLoadMore} />
            {user && <AddRestaurantButton navigation={navigation} setIsReloadRestaurant={setIsReloadRestaurant}></AddRestaurantButton>}

        </View >

    )
}

function AddRestaurantButton(props) {
    const { navigation, setIsReloadRestaurant } = props;
    return (
        <ActionButton
            buttonColor="#00a680"
            onPress={() =>
                navigation.navigate("AddRestaurant", { setIsReloadRestaurant })
            }
        >

        </ActionButton >
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    }
})