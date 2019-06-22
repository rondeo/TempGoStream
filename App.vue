<template>
    <root>
        <style-wrapper>
            <app-navigation/>
        </style-wrapper>
    </root>
</template>
<script>
import Vue from "vue-native-core";
import { VueNativeBase, StyleProvider,Root } from "native-base";
import { StatusBar } from "react-native";
import i18n from "./src/plugins/i18n";
import store from "./src/plugins/store";
import { auth } from "./src/plugins/firebase"
import { EventBus } from "./src/plugins/eventbus";
import getTheme from "./native-base-theme/components";
import gostream from "./native-base-theme/variables/gostream";
import App from "./src/containers/App";
import StyleWrapper from "./src/containers/App/styleWrapper";
import { StackNavigator } from "vue-native-router";
import {createAppContainer,  createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import SignIn from "./src/containers/SignIn";
import SignUp from "./src/containers/SignUp";
import ResetPass from './src/containers/baseCustom/resetPass'
console.disableYellowBox = true;

Vue.use(VueNativeBase);
auth.onAuthStateChanged((user) => {
	EventBus.$emit('firebase-loaded', user);
});

const AppNavigation = createAppContainer(createStackNavigator(
  {
    SignIn:{
      screen:SignIn,
      navigationOptions: {
          header:null
      },
    },
    SignUp:{
      screen:SignUp,
      navigationOptions: {
          header:null
      },
    },
    App:{
      screen:App,
      navigationOptions: {
          header:null
      },
    },
    ResetPass:{
      screen:ResetPass,
      navigationOptions: {
          header:null
      },
    },
  },
  {
    swipeEnabled: true,
    initialRouteName: "SignIn",
    navigationOptions: {
      header: null
    }
  }
));

export default {
  i18n,
  store,
  data: {
    loading: true
  },
  components: {
    StyleWrapper,
    AppNavigation,
    Root,
  },
  mounted() {},
  beforeCreate() {
    StatusBar.setBarStyle("light-content", true);
    EventBus.$on('firebase-loaded', user => {
    });
  }
};
</script>
