import Vue from 'vue-native-core'
import config from './config'
import * as firebase from 'react-native-firebase';


const auth = firebase.auth()
const db = firebase.firestore()


export {
    db,
    auth,
    firebase
}