<template>
  <root>
    <affilate-navigation></affilate-navigation>
  </root>
</template>
<script>
import {Root} from 'native-base'
import { StackNavigator } from "vue-native-router";
import Main from './index'
import HisTransations from './hisTransations'

const AffilateNavigation = StackNavigator(
  {
    Main,
    HisTransations
  },
  {
    initialRouteName: "Main",
    navigationOptions: {
      header: null
    }
  }
);


export default {
	components: { AffilateNavigation ,Root},
};
</script>
