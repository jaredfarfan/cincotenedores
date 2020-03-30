import React, { useRef, useState } from 'react'
import { View, Text } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm'

export default function AddRestaurant(props) {
    const { navigation } = props;
    const { setIsReloadRestaurant } = navigation.state.params;

    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    console.log(setIsReloadRestaurant);
    return (
        <View>
            <AddRestaurantForm toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
                setIsReloadRestaurant={setIsReloadRestaurant}
            ></AddRestaurantForm>
            <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
            <Loading isVisible={isLoading} text="Creando restaurante"></Loading>
        </View>
    )
}