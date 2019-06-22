<template>
  <root>
    <gift-code-navigation></gift-code-navigation>
  </root>
</template>
<script>
import {Root} from 'native-base'
import { StackNavigator } from "vue-native-router";
import Main from './index'
import BuyGiftCode from './buyGiftCode'

const GiftCodeNavigation = StackNavigator(
  {
    Main,
    BuyGiftCode
  },
  {
    initialRouteName: "Main",
    navigationOptions: {
      header: null
    }
  }
);


export default {
	components: { GiftCodeNavigation ,Root},
};
</script>
