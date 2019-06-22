import Vue from 'vue-native-core'
import VueI18n from 'vue-i18n'
import config from './config.js'
import en from '../languages/en.json'
import vi from '../languages/vi.json'

Vue.use(VueI18n);
const messages = { en, vi };
const locale = config.language;
const i18n = new VueI18n({ locale, messages });


export default i18n