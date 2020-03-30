import React, { useEffect, useState, useRef } from 'react'
import {
    View
} from 'react-native'

import Toast from 'react-native-easy-toast'

import { firebaseApp } from '../utils/Firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'

import ListTopRestaurant from '../components/Ranking/ListTopRestaurant'

const db = firebase.firestore(firebaseApp)

export default function TopRestaurants(props) {
    const { navigation } = props;
    const [restaurants, setRestaurant] = useState([]);
    const ToastRef = useRef();
    useEffect(() => {
        (async () => {
            db.collection("restaurant").orderBy("rating", "desc")
                .limit(5)
                .get().then(response => {
                    //console.log(response);
                    const restaurantArray = []
                    response.forEach(doc => {
                        const restaurant = doc.data();
                        restaurant.id = doc.id;

                        restaurantArray.push(restaurant);
                    })
                    setRestaurant(restaurantArray);
                }).catch(() => {
                    ToastRef.current.show("Error al cargar el raiting. Intentelo mas tarde");
                })
        })()

    }, [])
    return (
        <View>
            <ListTopRestaurant restaurants={restaurants} navigation={navigation}></ListTopRestaurant>
            <Toast ref={ToastRef} position="center" opacity={0.7}>

            </Toast>
        </View>
    )
}
