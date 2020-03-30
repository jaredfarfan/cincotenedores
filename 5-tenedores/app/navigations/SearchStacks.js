import { createStackNavigator } from "react-navigation-stack";

import SearchScreen from '../screens/Search'

const SearchScreenStooks = createStackNavigator({
    TopRestaurants: {
        screen: SearchScreen,
        navigationOptions: () => ({
            title: "Busca tu restaurante"
        })
    }
})


export default SearchScreenStooks;