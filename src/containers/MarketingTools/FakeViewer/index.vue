<template>
    <nb-container>
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('fakeviews.title')}}</nb-title>
            </nb-body>
        </nb-header>
        <nb-tabs>
        <nb-tab :heading="getHeadingCompForTab1()">
            <BuyPackage/>
        </nb-tab>
       <nb-tab :heading="getHeadingCompForTab2()">
            <History/>
        </nb-tab>
        </nb-tabs>
    </nb-container>
</template>

<script>
import React from 'react'
import { TabHeading, Text } from "native-base"
import History from './History'
import BuyPackage from './BuyPackage'
import i18n from '../../../plugins/i18n'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'

export default {
    props: {
        navigation: {
        type: Object
        }
    },
    components:{
        History,BuyPackage
    },
    computed: {
      statusBarHeight() {
        if(isIphoneX()){
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
                <Text>{i18n.t("fakeviews.buy")}</Text>
            </TabHeading>
            );
        },
        getHeadingCompForTab2(){
            return (
            <TabHeading>
                <Text>{i18n.t('fakeviews.history')}</Text>
            </TabHeading>
            );
        },
        goBack(){
            this.navigation.goBack();
        }  
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
.white{
    color:white;
}
.center{
  justify-content: center;
  align-content:center;
}
.marL16{
    margin-left:16;
}
.center-items{
    align-items:center;
}
</style>
