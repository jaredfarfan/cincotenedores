import firebase from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyCEJvv1PDq2Tew4IkWmUVmWly4eFM8hg-8",
    authDomain: "tenedores-16690.firebaseapp.com",
    databaseURL: "https://tenedores-16690.firebaseio.com",
    projectId: "tenedores-16690",
    storageBucket: "tenedores-16690.appspot.com",
    messagingSenderId: "1008894991308",
    appId: "1:1008894991308:web:21341bbb25cde76b2d9b69"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
