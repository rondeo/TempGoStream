<template>
    <nb-container class="container">
        <view class="head-statusbar" :style="{paddingTop:statusBarHeight}"></view>
        <view class="header shadow flex">
            <touchable-opacity class="w20 center" :on-press="()=>{return goBack()}">
                <nb-icon class="dark" name="arrow-back" />
            </touchable-opacity>
            <view class="w60 center"><text class="text-bold text-center h1">{{$i18n.t('autolive.detail_live')}}</text></view>
        </view>
        <view class="content"> 
            <view class="box border">
                <view class="marB16 flex">
                    <view class="w50">
                        <text>{{$i18n.t('autolive.subject')}}</text>
                    </view>
                    <view class="w50">
                        <text>{{ info.title }}</text>
                    </view>
                </view>
                <view class="marB16 flex">
                    <view class="w50">
                        <text>{{$i18n.t('livestream.type')}}</text>
                    </view>
                    <view class="w50">
                        <text>{{ info.type }}</text>
                    </view>
                </view>
                <view class="marB16 flex">
                    <view class="w50">
                        <text>{{$i18n.t('livestream.status')}}</text>
                    </view>
                    <view class="w50">
                        <text>{{ info.status }}</text>
                    </view>
                </view>
                <view class="marB16 flex">
                    <view class="w50">
                        <text>{{$i18n.t('livestream.created')}}</text>
                    </view>
                    <view class="w50">
                        <text>{{ info.created }}</text>
                    </view>
                </view>
                <view class="marB16 flex">
                    <view class="w50">
                        <text>{{$i18n.t('autolive.destination')}}</text>
                    </view>
                    <view class="w50">
                        <touchable-opacity 
                            v-for="item in info.destination"
                            :on-press="()=>{return onOpenLink(item.response[0]['permalink_url'])}">
                            <text v-if="item.response && item.response[0]['permalink_url']"
                                class="h4 blue ">{{ item.response[0]['permalink_url'] }}
                            <text>
                        </touchable-opacity>
                    </view>
                </view>
                <view class="absolute center center-item"
                    v-if="loading"
                    :style="{flex: 1, justifyContent: 'center'}">
                    <activity-indicator size="large" color="#fff" />
                </view>
            </view>
        </view>
        <view class="button-next center">
            <touchable-opacity :on-press="()=>{return onShowFacebook()}">
                <text class="white bold text-center">{{$i18n.t('autolive.show_on_fb')}}</text>
            </touchable-opacity>
        </view>
  </nb-container>
</template>
<script>
    import {
        Dimensions,Linking
    } from "react-native";
    import React from "react";
    import i18n from './../../../plugins/i18n'
    import {  db  } from '../../../plugins/firebase'
    import {  getAvatar,  api, generalCatch, } from '../../../helpers'
    import {statusCode} from '../../../helpers/handler'
    import {  EventBus  } from '../../../plugins/eventbus'
    import { getBottomSpace, getStatusBarHeight,  isIphoneX  } from 'react-native-iphone-x-helper'
    import config from '../../../plugins/config' 

    export default {
        props: ['navigation'],
        components: {},
        data() {
            return {
                streamID: this.navigation.getParam('StreamID', ''),
                info: {},
                loading: true,
                show_detail: false,
                type: '',
                start_youtube: false,
                controlAvailable: false,
                unsubscribe: null
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
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            onShowFacebook() {
                console.log('show on facebook')
            },
            startYoutube() {
                api("youtube/start", {id: this.$route.params.id}).then(res => {
                    if ( res[0] && (res[0].status=="liveStarting" || res[0].status=="live") ) {
                        return true;
                    }
                    this.timer = setTimeout(this.startYoutube, 3000);
                });
		    },
            onOpenLink(path){
                const url =   config.urlFb + path;
                console.log('path '+ url)
                Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: ");
                }
                });
            }
        },
        mounted() {
            api('stream?id='+this.streamID).then(data => {
                console.log('data get details stream by id: ', data)
                this.info = data;
                this.info.status = statusCode(this.info.status);
                this.info.created =formatDate(this.info.created);
                this.loading = false;
                this.type = data.type;
                if ( this.type!='video' ) this.controlAvailable = true;
                let youtube = false;
                for (let item of data.destination) {
                    if ( item.target.id=='channel-youtube' ) {
                        youtube = true;
                    }
                }
                this.unsubscribe = db.collection("stream").doc(this.$route.params.id).onSnapshot((doc) => {
                    let new_data = doc.data();
                    this.$set(this.info, 'status', new_data.status);
                    if ( new_data.status==2 && youtube ) {
                        this.startYoutube();
                    }
                });
		    });

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
    
    .bold {
        font-weight: bold
    }
    
    .text-center {
        text-align: center
    }
    
    .w20 {
        width: 20%;
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
    .center-item{
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
        font-size: 13
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
    
    .marB16{
        margin-bottom:16;
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