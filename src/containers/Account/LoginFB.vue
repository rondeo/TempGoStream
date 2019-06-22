<template>
   <view class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('account.add_token_fb.title')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content center center-items">
            <LoginButton 
            class="login-button"
            :onLoginFinished="onLoginFinished" :onLogoutFinished="onLogoutFinished"/>
        </view>
  </view>
</template>
<script>
    import i18n from '../../plugins/i18n'
    import Vue from 'vue-native-core';
    import UUID from 'vue-uuid'
    import { Clipboard,Linking,NetInfo,Alert} from 'react-native'
    import {Toast } from "native-base";
    import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
    import {api} from '../../helpers'
    import {EventBus} from '../../plugins/eventbus'
    import { LoginButton, AccessToken,LoginManager } from 'react-native-fbsdk'

    export default {
        components:{LoginButton},
        props: {
            navigation: {
                type: Object
            }
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
        data() {
            return {
                access_token:'',
                loading:false,
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            async addFbToken(access_token) {
                if ( access_token.length>10 ) {
                    this.loading = true;
                    await api('facebook/addAccount', {  access_token  }, true);
                    LoginManager.logOut();
                    EventBus.$emit('re-load-linked','re-load');
                    this.goBack();
                } else {
                    alert(i18n.t('account.invalid_token'))
                }
            },
            onLoginFinished(err){
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    if(data.accessToken){
                        this.addFbToken(data.accessToken.toString());
                    }
                  }
                )
                console.log("addfacebook sdk " +err);
            },
            onLogoutFinished(){
                console.log("logout.")
            }
        }
    }
</script>
<style>
    .container {
        width: 100%;
        height: 100%;
        background-color: #F5F8FA;
    }
    .header{
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
    .shadow {
        shadow-color: black;
        shadow-opacity: 0.15;
        shadow-radius: 2
    }
    .content {
        padding-left: 16;
        padding-right: 16;
        padding-top:16;
        padding-bottom: 10;
        background-color: #F0F8FF
    }
    .absolute{
        position: absolute;
    }
    .flex {
        flex-direction: row;
    }
    
    .center {
        justify-content: center;
        align-content: center;
    }
    .center-items{
        align-items: center;
    }
    .box {
        padding-top:10;
        padding-bottom:10;
        padding-left: 10;
        padding-right: 10;
        margin-bottom: 10;
    }
    
    .border {
        border-radius: 4;
        border-color: #E7EBEE;
        border-width:1;
    }
    
    .h1 {
        font-size: 20;
    }
    
    .h3 {
        font-size: 14;
    }
    .w20{
        width: 20%;
    }
    .w60{
        width: 60%;
    }
    .white {
        color: white;
    }
    .blue{
        color:#0091FF
    }
    .gray {
        color: #A9A9A9;
    }
    .dark{
        color:#333;
    }
    .marB16{
        margin-bottom:16;
    }
    .marT16{
        margin-top:16;
    }
    .marL16{
        margin-left:16;
    }
    .w100{
        width: 100%;
    }
    .text-center{
        text-align:center;
    }
    .text-left{
        text-align:left;
    }
    .text-right{
        text-align: right;
    }
    .text-bold{
        font-weight:bold;
    }
    .input-from{
        padding-left: 10;
        padding-right: 10;
        width:100%;
        height:40;
        background-color:white;
    }
    .button {
        padding: 10;
        width: 100%;
        border-radius: 1;
        height:45;
        background-color: #0091FF;
    }
    .button-coppy{
        padding: 10;
        width: 50%;
        border-radius: 1;
        height:45;
        background-color: white;
    }
    .login-button{
       height: 40;
       width: 90%;
       background-color: #3366cc;
       border-radius: 4;
       align-items: center;
       align-content: center;
       justify-content: center;
    }
</style>