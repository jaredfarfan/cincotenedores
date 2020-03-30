import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements'
import Modal from '../Modal'
import ChangeDisplayNameForm from './ChangeDisplayNameForm'
import ChangePasswordForm from './ChangePasswordForm'
import ChangeEmailForm from './ChangeEmailForm'

export default function AccountOptions(props) {
    const { userInfo, setReloadData, toastRef } = props;

    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const menuOptions = [
        {
            title: "Cambiar nombre y apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => {
                selectedComponent("displayName");
            }
        },
        {
            title: "Cambiar email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => {
                selectedComponent("email");
            }
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => {
                selectedComponent("password");
            }
        }

    ];

    const selectedComponent = (key) => {

        switch (key) {
            case "displayName":
                setRenderComponent(<ChangeDisplayNameForm toastRef={toastRef} setReloadData={setReloadData} setIsVisibleModal={setIsVisibleModal} displayName={userInfo.displayName}></ChangeDisplayNameForm>);
                setIsVisibleModal(true);
                break;
            case "email":
                setRenderComponent(<ChangeEmailForm toastRef={toastRef} setReloadData={setReloadData} setIsVisibleModal={setIsVisibleModal} email={userInfo.email}></ChangeEmailForm>)
                setIsVisibleModal(true);
                break;
            case "password":
                setRenderComponent(<ChangePasswordForm setIsVisibleModal={setIsVisibleModal} toastRef={toastRef}></ChangePasswordForm>)
                setIsVisibleModal(true);
                break;

            default:
                break;
        }
    }

    return (

        <View>
            {
                menuOptions.map((l, index) => (
                    <ListItem
                        key={index}
                        title={l.title}
                        leftIcon={{
                            type: l.iconType,
                            name: l.iconNameLeft,
                            color: l.iconColorLeft

                        }}
                        rightIcon={{
                            type: l.iconType,
                            name: l.iconNameRight,
                            color: l.iconColorRight

                        }}
                        onPress={l.onPress}
                        containerStyle={styles.MenuItem}
                    />

                ))
            }
            {
                renderComponent && (
                    < Modal isVisible={isVisibleModal} setIsVisible={setIsVisibleModal}>
                        {renderComponent}

                    </Modal>
                )
            }

        </View >

    )
}
const styles = StyleSheet.create({
    MenuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    }
})