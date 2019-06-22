import VueI18n from 'vue-i18n'
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage'
import { EventBus } from './eventbus'
// the format example vn-VN so to get locale for laguage have to vn :)

// getDataLanguage = async () => {
//     let storeLang = "";
//     try {
//         const value = await AsyncStorage.getItem('@language');
//         if (value !== null) {
//             storeLang = value;
//             console.log('have stored', value)
//         } else {
//             storeLang = DeviceInfo.getDeviceLocale().substring(0, 2).toLocaleLowerCase();
//             console.log('get information device', storeLang);
//         }
//         const locale = storeLang == "vi" ? "vi" : "en";
//         i18n = new VueI18n({ locale, messages });
//     } catch (ex) {
//         console.log('error when get language:   ' + ex);
//         storeLang = "vi";
//         i18n = new VueI18n({ locale: storeLang, messages });
//     }
// }
export default {
    "language": 'vi',
    "firebase": {
        apiKey: "AIzaSyC4JdFyt7GrfcRZdjtKIYbQ97IqIRVxt0M",
        authDomain: "gostream-838c9.firebaseapp.com",
        databaseURL: "https://gostream-838c9.firebaseio.com",
        projectId: "gostream-838c9",
        storageBucket: "gostream-838c9.appspot.com",
        messagingSenderId: "818399337045"
    },
    "apiURL": "https://gostream.vn/api",
    "domain": "https://gostream.vn",
    "urlFb": "https://www.facebook.com",
    "secret_token": "^*B(H()"

}