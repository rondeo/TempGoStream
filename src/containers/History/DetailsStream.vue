<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-itemss">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('autolive.detail_live')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content"> 
            <view class="box border">
                <view class="marB10 flex">
                    <text class="w25 h5 marR16">{{$i18n.t('autolive.subject')}}:</text>
                    <text class="text h3 dark" :numberOfLines="4">{{ data.title }}</text>
                </view>
                <view class="marB10 flex">
                    <text class="w25 h5 marR16">{{$i18n.t('livestream.type')}}:</text>
                    <text class="h4 dark">{{ data.type }}</text>
                </view>
                <view class="marB10 flex">
                    <text class="w25 h5 marR16">{{$i18n.t('livestream.status')}}:</text>
                    <text class="h4" :style="{color:colorStatus}">{{ getStatus}}</text>
                </view>
                <view class="marB10 flex">
                    <text class="w25 h5 marR16">{{$i18n.t('livestream.created')}}:</text>
                    <text class="h4 dark">{{ getTime }}</text>
                </view>
                <view class="marB10 flex">
                    <text class="w25 h5 marR16">{{$i18n.t('autolive.destination')}}:</text>
                    <view class="marB10">
                        <touchable-opacity  class="text-stream-url"
                            v-for="item in getTarget"
                            :on-press="()=>{return onOpenLink(item)}">
                            <text :numberOfLines="1" class="h4 blue">{{item}}</text>
                        </touchable-opacity>
                    </view>
                </view>
            </view>
        </view>
        <view class="button-next center center-items" v-if="(statusCode ==2 || (statusCode ==3 ) )">
            <touchable-opacity class="center center-items" v-bind:style= "[checkEnableStop ? buttonNextActive : buttonNext]"
                :on-press="()=>{return stopLive()}" :disabled="!checkEnableStop">
                <text class="white text-bold text-center">{{$i18n.t('stop')}}</text>
            </touchable-opacity>
            <view class="absolute center center-item"
                v-if="isProcess"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="large" color="#fff" />
            </view>
        </view>
  </nb-container>
</template>
<script>
    import {  Dimensions,Linking,Alert } from "react-native"
    import React from "react"
    import i18n from '../../plugins/i18n'
    import {  db   } from '../../plugins/firebase'
    import { getAvatar, api, generalCatch, } from '../../helpers'
    import {statusCode,  formatDate } from '../../helpers/handler'
     import config from '../../plugins/config' 
    import {  EventBus  } from '../../plugins/eventbus'
    import { getBottomSpace, getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper'
   

    export default {
        props: ['navigation'],
        components: {},
        data() {
            return {
                dataParam: this.navigation.getParam('data', {}),
                show_detail: false,
                data:{},
                statusCode:0,
                colorStatus:'#333',
                enableStop:false,
                isProcess:false,
                buttonNext: {
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity: 0.35
                },
                buttonNextActive: {
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity: 1
                },
            }
        },
        computed: {
            statusBarHeight() {
                if (isIphoneX()) {
                    return getStatusBarHeight() + 3;
                } else {
                    return 0;
                }
            },
            screenHeight() {
                return Math.round(Dimensions.get('window').height);
            },
            getBottomSpaceIpX() {
                return getBottomSpace();
            },
            getStatus(){
                return statusCode(this.data.status)
            },
            getTime(){
                return formatDate(this.data.created)
            },
            getTarget(){
                var targets =[];
                if(this.data.destination){
                    const info = this.data.destination;
                    info.forEach(function(item) {
                        if(item.response && item.response['permalink_url']){
                            let target_item = item.response['permalink_url'];
                            //console.log("target_item'",target_item);
                            targets.push(target_item);
                        }
                    });
                    return targets;
                }
                return targets;
            },
            checkEnableStop(){
                if(this.data.status  != 4 ){
                    this.enableStop = true;
                }else{
                      this.enableStop = false;
                }
                return this.enableStop;
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            startYoutube() {
                api("youtube/start", {id: this.$route.params.id}).then(res => {
                    if ( res[0] && (res[0].status=="liveStarting" || res[0].status=="live") ) {
                        return true;
                    }
                    this.timer = setTimeout(this.startYoutube, 3000);
                });
		    },
            onOpenLink(url_stream){
                let url = config.urlFb + url_stream;
                //console.log("url_stream",url);
                Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: ");
                }
                });
            },
            stopLive(){
                this.isProcess = true;
                db.collection("stream").doc(this.data.id).update({
                    status: 3,
                    reason: 'user click stop'
                }).then(() => {
                    this.isProcess = false;
                    let message = i18n.t('livestream.stoped');
                    Alert.alert(message);
                    this.navigation.goBack();

                });
            }
        },
        mounted() {
            this.data = this.dataParam.data;
            //console.log('DetailStream - data: ', this.data)
            this.statusCode = this.data.status;
        },
        watch: {
            statusCode(num){
                switch(num){
                    case 1:{
                        this.colorStatus = '#20B2AA'
                        break;
                    }
                    case 2:{
                        this.colorStatus = '#228B22'
                        break;
                    }
                    case 3:{
                        this.colorStatus = '#4B0082'
                        break;
                    }
                    case 4:{
                        this.colorStatus = '#B22222'
                        break;
                    }
                    case 5:{
                        this.colorStatus = '#FF7F50'
                        break;
                    }
                }
            }
        },

    };
</script>

<style>
    .container {
        flex-direction: column;
        flex: 1;
        width: 100%;
        background-color: #F5F8FA
    }
    
    .head-statusbar {
        background-color: #222230;
        color: white;
        opacity: 0.7;
    }
    
    .header {
        background-color: white;
        border-color: #D7D9E0;
        border-width: 1;
        height: 50;
        padding-left: 10;
        padding-right: 10;
    }
    
    .flex {
        flex-direction: row;
    }
    
    .h1 {
        font-size: 18;
        color: #282B34;
    }
    .h5{
        font-size:12;
    }
    .bold {
        font-weight: bold
    }
    
    .text-center {
        text-align: center
    }
    
    .w25 {
        width: 25%;
    }
    .w50 {
        width: 50%;
    }
    .w60 {
        width: 60%;
    }
    
    .w100 {
        width: 100%
    }
    
    .shadow {
        shadow-color: black;
        shadow-opacity: 0.15;
        shadow-radius: 2
    }
    
    .dark {
        color: #282B34
    }
    
   .center{
        justify-content: center;
        align-content:center;
    }
    .center-items{
        align-items:center
    }
    .absolute{
         position: absolute;
    }
    
    .white {
        color: white;
    }
    
    .bold {
        font-weight: bold;
    }
    
    .h4 {
        font-size: 14
    }
    .h3{
        font-size:15;
    }
    
    .blue {
        color: #0091FF
    }
    .white{
        color:white;
    }
    
    .content {
        text-align: left;
        padding: 10;
        background-color: #F5F8FA;
        height: 100%;
    }
    
    .marB10{
        margin-bottom:10;
    }
    .marB8{
        margin-bottom:8
    }
    .marR16{
        margin-right:16;
    }
    .marL16{
        margin-left:16;
    }
    .label {
        color: #9B9FAC;
        font-size: 12;
        text-align: left;
        margin-bottom: 8;
    }
    
    .text-normal {
        color: #5B5F6D;
        text-align: left;
        font-size: 13;
    }
    .text{
        flex:1
    }
   .text-stream-url{
       width:80%;
   } 
    .text-center {
        text-align: center;
    }
    
    .text-bold {
        font-weight: bold;
    }
    
    .table-content {
        background-color: white;
        width: 100%;
        flex-direction: row;
        height: 40;
        border-bottom-color: #E7EBEE;
        border-bottom-width: 1;
    }
    
    .title {
        width: 100%;
        height: 50;
        padding: 10;
        margin-top: 20;
    }
    
    .title-post {
        width: 100%;
        height: 50;
        flex-direction: row;
        justify-content: center;
        border-bottom-color: #E7EBEE;
        border-bottom-width: 1;
    }
    
    .button-next {
        padding-left:16;
        padding-right:16;
        padding-top:10;
        padding-bottom:10;
        width: 100%;
        height: 50;
        position: absolute;
        bottom: 0;
        border-radius: 1;
        background-color: #0091FF;
    }
    
    .places {
        background-color: white;
        justify-content: center;
    }
    
    .item-place {
        height: 40;
        justify-content: center;
        align-content: center;
        border-bottom-color: #E7EBEE;
        border-bottom-width: 1;
        padding: 8;
    }
    
    .h4 {
        font-size: 13
    }
    
    .box {
        padding-left: 16;
        padding-right: 16;
        padding-top: 10;
        padding-bottom: 10;
        background-color: white;
    }
    
    .border {
        border-radius: 4;
        border-width: 1;
        border-color: #dcdfe6
    }
</style>