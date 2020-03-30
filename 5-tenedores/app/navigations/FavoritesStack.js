import { createStackNavigator } from 'react-navigation-stack'
import FavoriteScreen from '../screens/Favorites'

const FavoriteScreenStack = createStackNavigator({
    FavoriteScreen: {
        screen: FavoriteScreen,
        navigationOptions: () => ({
            title: "Restaurante favorito"
        })
    }
})

export default FavoriteScreenStack;