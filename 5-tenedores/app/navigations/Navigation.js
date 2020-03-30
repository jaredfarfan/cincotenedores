import React from "react";
import { Icon } from "react-native-elements";
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import RestaurantsScreenStacks from './RestaurantsStacks'
import TopListScreenStooks from './TopListStacks'
import SearchScreenStooks from './SearchStacks'
import AccountScreenStooks from './AccountStacks'
import FavoritesScreenStacks from './FavoritesStack'


//guardas todas las rutas
const NavigationStacks = createBottomTabNavigator({
    //NUestros stacks de navegacion
    Restaurants: {
        screen: RestaurantsScreenStacks,
        navigationOptions: () => ({
            tabBarLabel: "Restaurantes",
            tabBarIcon: ({ tintColor }) => (

                <Icon type="material-community"
                    name="compass-outline"
                    size={22}
                    color={tintColor}
                />

            )
        })
    },
    Favorites: {
        screen: FavoritesScreenStacks,
        navigationOptions: () => ({
            tabBarLabel: "Favoritos",
            tabBarIcon: ({ tintColor }) => (

                <Icon type="material-community"
                    name="heart-outline"
                    size={22}
                    color={tintColor}
                />

            )
        })
    },
    TopLists: {
        screen: TopListScreenStooks,
        navigationOptions: () => ({
            tabBarLabel: "Top",
            tabBarIcon: ({ tintColor }) => (
                <Icon type="material-community"
                    name="compass-outline"
                    size={22}
                    color={tintColor}
                />

            )
        })
    },
    Search: {
        screen: SearchScreenStooks,
        navigationOptions: () => ({
            tabBarLabel: "Buscar",
            tabBarIcon: ({ tintColor }) => (
                <Icon type="material-community"
                    name="magnify"
                    size={22}
                    color={tintColor}
                />

            )
        })
    },
    Account: {
        screen: AccountScreenStooks,
        navigationOptions: () => ({
            tabBarLabel: "Mi perfil",
            tabBarIcon: ({ tintColor }) => (
                <Icon type="material-community"
                    name="account-circle"
                    size={22}
                    color={tintColor}
                />

            )
        })
    }

},
    {
        initialRouteName: "Restaurants",
        order: ["Restaurants", "Favorites", "TopLists", "Search", "Account"],
        tabBarOptions: {
            inactiveTintColor: "#646464",
            activeTintColor: "#00A680"
        }
    }
);

export default createAppContainer(NavigationStacks);