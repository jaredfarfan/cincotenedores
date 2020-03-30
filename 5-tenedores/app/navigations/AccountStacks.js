import { createStackNavigator } from "react-navigation-stack";

import MyAccounthScreen from '../screens/Account/MyAccount'
import LoginScreen from '../screens/Account/Login'
import RegisterScreen from '../screens/Account/Register'

const MyAccountScreenStooks = createStackNavigator({
    MyAccount: {
        screen: MyAccounthScreen,
        navigationOptions: () => ({
            title: "Mi cuenta"

        })
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: () => ({
            title: "Login"
        })
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: () => ({
            title: "Nuevo registro"
        })
    }
});



export default MyAccountScreenStooks;