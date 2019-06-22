import Vue from 'vue-native-core'
import Vuex from 'vuex'
import config from '../plugins/config'
import { formatDate } from '../helpers/handler'



Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state: {
        active: false,
        userInfo: {
            id: 0,
            plan: {
                id: 'free',
                expired: 0
            },
            balance: 0,
            affiliate_balance: 0
        },
        breadcrumb: [],
        language: 'vi'
    },
    mutations: {
        logout(state) {
            state.userInfo = {};
        },
        updateUser(state, { payload, field }) {
            if (field)
                if (typeof state.userInfo[field] === "object")
                    Vue.set(state.userInfo, field, {...state.userInfo[field], ...payload });
                else
                    Vue.set(state.userInfo, field, payload);
            else
                state.userInfo = {...state.userInfo, ...payload };
        },
        updateBreadcrumb(state, newOne) {
            state.breadcrumb = newOne;
        }
    },
    actions: {

    },
    getters: {
        getUserinfo: state => field => {
            switch (field) {
                case 'plan_expired':
                    return state.userInfo.plan.expired === 0 ? '' : formatDate(state.userInfo.plan.expired);
                default:
                    if (field === undefined)
                        return state.userInfo;
                    else return state.userInfo[field] ? state.userInfo[field] : '';
            }
        }
    },
    strict: debug
})