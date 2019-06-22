<template>
    <nb-container>
        <view class="head-statusbar" :style="{paddingTop:statusBarHeight}"></view>
        <view class="header shadow flex">
            <view class="center w100"><text class="text-bold text-center h1">{{$i18n.t('app.earn')}}</text></view>
        </view>
        <nb-tabs>
        <nb-tab :heading="getHeadingCompForTab1()">
            <GiftCode/>
        </nb-tab>
        <nb-tab :heading="getHeadingCompForTab2()">
            <Affilate/>
        </nb-tab>
        </nb-tabs>
    </nb-container>
</template>

<script>
import React from 'react'
import { TabHeading, Text } from "native-base"
import GiftCode from './../GiftCode/GiftCodeNavigation'
import Affilate from './../Affilate/AffilateNavigation'
import i18n from './../../plugins/i18n'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'

export default {
    components:{
        GiftCode,Affilate
    },
    computed: {
      statusBarHeight() {
          if(isIphoneX()){
            console.log('')
              return getStatusBarHeight()+3;
          }else{
              return 0;
          }
      },
    },
    methods: {
    getHeadingCompForTab1(){
        return (
          <TabHeading>
            <Text>{i18n.t('earn.gift_code')}</Text>
          </TabHeading>
        );
      },
      getHeadingCompForTab2(){
        return (
          <TabHeading>
            <Text>{i18n.t('earn.affilate')}</Text>
          </TabHeading>
        );
      },
    },  
}
</script>

<style>
 .header{
    width: 100%;
    background-color: white;
    border-color: #D7D9E0;
    border-width: 1;
    height: 50;
    padding-left: 10;
    padding-right: 10;
}
.head-statusbar{
    background-color: #222230;
    color:white;
    opacity: 0.7;
}
.flex{
  flex-direction: row;
}
.h1{
  font-size: 18;
  color: #282B34;
}
.text-bold{
  font-weight: bold
}
.text-center{
  text-align: center
}
.w20{
  width: 20%;
}
.w60{
  width: 60%;
}
.w100{
    width: 100%;
}
.shadow {
  shadow-color: black;
  shadow-opacity: 0.15;
  shadow-radius: 2
}
.dark{
  color: #282B34
}
.center{
  justify-content: center;
  align-content:center;
}
</style>
