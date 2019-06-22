<template>
    <nb-container class="container">
        <view class="head-statusbar" :style="{paddingTop:statusBarHeight}"></view>
        <view class="header shadow flex">
            <touchable-opacity class="w20 center" :on-press="()=>{return goBack()}">
                <nb-icon class="dark" name="arrow-back" />
            </touchable-opacity>
            <view class="w80 center">
                <text class="h1 bold">{{$i18n.t('signin_up.repassword')}}</text>
            </view>
        </view>
        <view class="content"> 
                <view class="box-item">
                    <text class="h4">{{$i18n.t('signin_up.enter_email_reset')}}</text>
                    <text-input class="border input marT10" v-model="email"  placeholder="gostream@gmail.com"  :autoCapitalize="'none'"/>
                </view>
         </view>
     <view class="button-next">
        <touchable-opacity :on-press="()=>{return onReset()}">
            <text class="text-center white bold">{{$i18n.t('signin_up.reset').toUpperCase()}}</text>
        </touchable-opacity>
     </view>
  </nb-container>
</template>

<script>
import { Dimensions, Image } from "react-native"
import React from "react"
import { Picker, Icon ,Toast} from "native-base"
import i18n from './../../plugins/i18n'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
import {auth} from './../../plugins/firebase'


    export default {
        components:{
            Item: Picker.Item
        },
        props: {
            navigation: {
                type: Object
            }
        },
        data() {
            return {
                email: '',
            }
        },
        computed: {
            statusBarHeight() {
                if(isIphoneX()){
                    return getStatusBarHeight()+3;
                }else{
                    return 0;
                }
                
            },
            screenHeight() {
                return Math.round(Dimensions.get('window').height);
            },
            getBottomSpaceIpX(){
                return getBottomSpace();
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            selectImg() {
                alert('Ok')
            },
            onReset(){
               if(this.email != ''){
                    auth.sendPasswordResetEmail(this.email.trim()).then(function() {
                        alert(i18n.t('signin_up.email_sent'));
                    }).catch(function(error) {
                        alert('Sorry ' + error)
                    });
                }else{
                    Toast.show({
                        text: i18n.t('notify.content.reset_email_sent'),
                        buttonText: "Okay",
                        position: "bottom",
                        type:'danger',
                        duration:6000
                    });
                }
            },
            onValueChange: function(value) {
                this.selected = value;
            },
            getIosIcon: function() {
                return <Icon name="arrow-dropdown" />;
            }
        },
    };
</script>
<style>
.head-statusbar{
    background-color: #222230;
    color:white;
    opacity: 0.7;
}
.container {
    flex-direction: column;
    flex: 1;
}
.header{
  background-color: white;
  border-color: #D7D9E0;
  border-width: 1;
  height: 50;
  padding-left: 10;
  padding-right: 10;
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
    width: 100%
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
.white{
    color:white;
}
.bold{
    font-weight: bold;
}
.h4 {
    font-size: 15
}
.blue{
    color: #0091FF
}
.content {
    text-align: left;
    padding: 10;
    background-color: #F5F8FA;
    height: 100%;
}

.marT10{
    margin-top: 10;
}
.label {
    color: #9B9FAC;
    font-size: 12;
    margin-bottom: 8;
    text-align: left;
}
.input {
    width: 100%;
    height: 40;
    background-color: #FFFFFF;
    border-radius: 4;
    border-width: 1;
    padding-left: 16;
    border-color: #E7EBEE;
}
.left{
    width: 85%;
    justify-content: center;
    padding-left: 10;
}
.right{
    width: 15%;
    justify-content: center;
    background-color: #0091FF;
    align-items: center;
    border-top-right-radius: 2;
    border-bottom-right-radius:2; 
}

.img{
    padding: 10;
    border-top-left-radius: 2;
    border-bottom-right-radius: 2;
}
.text-normal{
    color: #5B5F6D;
    text-align: left;
    font-size: 13;
    line-height: 20;
}
.text-center{
    text-align: center;
}
.text-bold{
    font-weight: bold;
}
.touch{
    width: 20%;
    justify-content: center;
    background-color: #0091FF;
    justify-content: center;
    align-content: center;
    border-top-right-radius: 2;
    border-bottom-right-radius: 2;
}
.button-next{
    padding: 10;
    width: 100%;
    height: 50;
    position: absolute;
    bottom: 0;
    border-radius: 1;
    background-color: #0091FF;
    justify-content: center;
}

 .border {
        border-radius: 4;
        border-width: 1;
        border-color: #E7EBEE;
        padding: 10;
    }
	.letter-space{
		letter-spacing: 2;
	}
</style>