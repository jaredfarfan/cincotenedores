import { createStackNavigator } from "react-navigation-stack";

import TopRestaurantsScreen from '../screens/TopRestaurants'

const TopListScreenStooks = createStackNavigator({
    TopRestaurants: {
        screen: TopRestaurantsScreen,
        navigationOptions: () => ({
            title: "Los mejores restauranes"
        })
    }
})


export default TopListScreenStooks;