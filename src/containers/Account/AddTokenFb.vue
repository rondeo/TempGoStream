<template>
   <view class="container">
        <nb-header>
            <nb-body class="flex center-item">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('account.add_token_fb.title')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content">
            <scroll-view>
                <view class="box border">
                    <text class="h3 marB16 gray">{{$i18n.t('account.add_token_fb.input_email')}}</text>
                    <view class="border center input-from marB16">
                        <text-input v-model="email" :autoCapitalize="'none'"/>
                    </view> 
                    <text class="h3 marB16 gray">{{$i18n.t('account.add_token_fb.input_pass')}}</text>
                    <view class="border center input-from">
                        <text-input  v-model="pass" :secureTextEntry="true" :autoCapitalize="'none'"/>
                    </view>
                </view>
                <view class="button marT16 center center-item" >
                    <touchable-opacity class="center center-item" :on-press="()=>{return getAcessToken()}">
                        <text class="white text-bold text-center">{{$i18n.t('account.add_token_fb.add_now').toUpperCase()}}</text>
                    </touchable-opacity>
                    <view class="absolute center center-item"
                        v-if="loading"
                        :style="{flex: 1, justifyContent: 'center'}">
                        <activity-indicator size="large" color="#FFFFFF" />
                    </view> 
                </view>
                <touchable-opacity  :on-press="()=>{return onOpenLink()}">
                    <text class="h3 blue marT16 text-right" :style="{textDecorationLine:'underline'}">{{$i18n.t('account.add_token_fb.guide')}}</text>
                </touchable-opacity>
                <!--<view v-if= "tokenVisible" class="marT16 border box center center-item" >
                    <text class="h3 blue">{{access_token}}</text>
                    <view class="border marT16 button-coppy" v-if="btnCoppyVisible">
                        <touchable-opacity class="center center-item" :on-press="()=>{return coppyToken(access_token)}">
                            <text class="dark text-bold text-center w100">{{$i18n.t('account.add_token_fb.coppy').toUpperCase()}}</text>
                        </touchable-opacity>
                    </view>
                </view>-->
            </scroll-view>
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
    Vue.use(UUID)
    import md5 from 'md5'
    import {EventBus} from '../../plugins/eventbus'

    export default {
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
                email: '',
                pass:'',
                access_token:'',
                loading:false,
                tokenVisible:false,
                btnCoppyVisible:false
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            async getAcessToken(){
                if(this.email == "" || this.pass == ""){
                    Toast.show({
                        text: i18n.t('account.add_token_fb.require_email'),
                        duration: 3000,
                        type: "danger"
                    });
                    return;
                }
                const netStatus = await NetInfo.fetch() ;
                if (netStatus === 'none' || netStatus === 'NONE') {
                    Alert.alert(i18n.t('no_internet'))
                    return ;
                }
                this.tokenVisible= true;
                this.loginFB(this.email,this.pass).then(this.successCallback,this.failureCallback);
            },
            successCallback(result) {
                if(result && result.access_token){
                    this.access_token = result.access_token;
                    if(this.access_token != ""){
                        this.addFbToken(this.access_token);
                        this.btnCoppyVisible = true;
                    }
                }
                if(result && result.error_code){
                    let mess = i18n.t('error.mess') +  result.error_msg + "\n"+ i18n.t('error.code') +result.error_code;
                    alert(mess);
                }
                this.loading= false;
            },
            failureCallback(error) {
                console.log("Error when get acess_token " + error);
                this.loading= false;
            },
            loginFB: function(email, password) {
                this.loading = true;
                const sim = this.randBetween(2e4, 4e4);
                let deviceID = this.$uuid.v1();
                let adID = this.$uuid.v1();
                let formData = {
                    adid: adID,
                    format: 'json',
                    device_id: deviceID,
                    email: email,
                    password: password,
                    cpl: 'true',
                    family_device_id: deviceID,
                    credentials_type: 'device_based_login_password',
                    generate_session_cookies: '1',
                    error_detail_type: 'button_with_disabled',
                    source: 'device_based_login',
                    machine_id: this.randString(24),
                    meta_inf_fbmeta: '',
                    advertiser_id: adID,
                    currently_logged_in_userid: '0',
                    locale: 'en_US',
                    client_country_code: 'US',
                    method: 'auth.login',
                    fb_api_req_friendly_name: 'authenticate',
                    fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
                    api_key: '882a8490361da98702bf97a021ddc14d'
                    };
                   // console.log('formData',formData)
                formData.sig = this.getSig(this.sortObj(formData));
                let conf = {
                    method: 'post',
                    body: JSON.stringify(formData),
                    headers: {
                            'x-fb-connection-bandwidth': this.randBetween(2e7, 3e7),
                            'x-fb-sim-hni': sim,
                            'x-fb-net-hni': sim,
                            'x-fb-connection-quality': 'EXCELLENT',
                            'x-fb-connection-type': 'cell.CTRadioAccessTechnologyHSDPA',
                            'user-agent':
                            'Dalvik/1.6.0 (Linux; U; Android 4.4.2; NX55 Build/KOT5506) [FBAN/FB4A;FBAV/106.0.0.26.68;FBBV/45904160;FBDM/{density=3.0,width=1080,height=1920};FBLC/it_IT;FBRV/45904160;FBCR/PosteMobile;FBMF/asus;FBBD/asus;FBPN/com.facebook.katana;FBDV/ASUS_Z00AD;FBSV/5.0;FBOP/1;FBCA/x86:armeabi-v7a;]',
                            'content-type': 'application/x-www-form-urlencoded',
                            'x-fb-http-engine': 'Liger',
                            'content-type' : 'application/json'
                        }
                };
                return fetch("https://b-api.facebook.com/method/auth.login", conf).then(response => response.json())
            },
            sortObj: function(obj) {
                let keys = Object.keys(obj).sort(),
                sortedObj = {};
                for (let i in keys) {
                    sortedObj[keys[i]] = obj[keys[i]];
                }
                return sortedObj;
            },
            randBetween: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            randString: function(limit) {
                limit = limit || 10;
                let text = 'abcdefghijklmnopqrstuvwxyz';
                text = text.charAt(Math.floor(Math.random() * text.length));
                const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
                for (let i = 0; i < limit - 1; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            },
            getSig: function(formData) {
                let sig = '';
                Object.keys(formData).forEach(function(key) {
                    sig += `${key}=${formData[key]}`;
                });
                sig = md5(sig + '62f8ce9f74b12f84c123cc23437a4a32');
                return sig;
            },
            coppyToken(token){
                if(!token)
                    return;
                Clipboard.setString(token);
                Toast.show({
                    text: i18n.t('account.add_token_fb.coppied'),
                    duration: 3000,
                    type: "success"
                })
            },
            onOpenLink(){
                let url ='http://gsapi.co/token-guide.html';
                Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: ");
                }
                });
            },
            //start method to add token facebook
            async addFbToken(access_token) {
                if ( access_token.length>10 ) {
                    this.loading = true;
                    await api('facebook/addAccount', {
                        access_token
                    }, true);
                    EventBus.$emit('re-load-linked','re-load');
                    this.goBack();
                } else {
                    alert(i18n.t('account.invalid_token'))
                }
            },
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
    .center-item{
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
</style>