<template>
    <view class="container">
        <nb-header>
            <nb-body class="flex center-item">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('account.acc_linked')}}</nb-title>
            </nb-body>
        </nb-header> 
        <view class="content center center-item">
            <scroll-view class="list-linked-acc">
                <view class="box border item-linked flex" v-for="(item,index) in tableData" :key="index">
                    <view class="w20 center center-item">
                        <nb-thumbnail  :source="{uri: item.avatar}" />
                        <nb-thumbnail class="absolute icon-type-acc" :style="{width: 20, height: 20, borderRadius: 10}"
                            :source="{uri:`https://gostream.vn/static/images/${item.app.type}.png`}" />
                    </view>
                    <view class="w70 padL10">
                        <text class="bold dark" :numberOfLines="1">{{item.userFullname}}</text>
                        <text class="gray" :numberOfLines="1">{{item.email}} </text>
                    </view>
                    <touchable-opacity class="w10 padL10 center center-item" :on-press="()=>{return removeLinkedAccount(item.id)}">
                        <image
                            :source="require('../../../assets/images/ic_trash.png')" :style="{width:20, height:30}" resize-mode="cover"
                            />
                    </touchable-opacity>
                </view>
                <touchable-opacity class="flex center center-item item-menu border"  v-for="item in linked_network"
                    :on-press="()=>{return item.onClick()}">
                    <image
                        :source="{uri:item.icon}" :style="{width:25, height:25}" resize-mode="contain"
                    />
                    <text class="marL16">{{item.type}}</text>
                </touchable-opacity>
            </scroll-view>
            <view class="absolute center center-item"
                v-if="loading"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="large" color="#0091FF" />
            </view>
        </view>
    </view>
</template>
<script>
 import {Dimensions } from "react-native"
    import i18n from '../../plugins/i18n'
    import Vue from 'vue-native-core'
    import UUID from 'vue-uuid'
    import { Clipboard,Linking,NetInfo,Alert} from 'react-native'
    import {Toast } from "native-base"
    import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
    import {api,getAvatar} from '../../helpers'
    import user from '../../helpers/user'
    import {auth,db} from './../../plugins/firebase'
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
                    return getStatusBarHeight()+3;
                }else{
                    return 0;
                }
            },
        },  
        data() {
            return {
                loading:false,
                tableData:[],
                linked_network:[
                    {
                        icon:'https://gostream.vn/static/images/facebook.png',
                        type:'Facebook',
                        onClick: this.addFacebook
                    },
                    {
                        icon:'https://gostream.vn/static/images/youtube.png',
                        type:'Youtube',
                        onClick: this.addYoutube
                    },
                    {
                        icon:'https://gostream.vn/static/images/twitter.png',
                        type:'Twitter',
                        onClick: this.addTwitter
                    },
                ]
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            loadLinkedAccount: function() {
                this.loading = true;
                const userId = this.$store.state.userInfo.id;
                db.collection("linked_account").where("gs_uid", "==", userId).get().then((querySnapshot) => {
                    let tableData = [];
                    querySnapshot.forEach(function(doc) {
                        const data = doc.data();
                        tableData.push({
                            id: doc.id,
                            app : {
                                name: data.app.name,
                                type: data.app.type,
                                id: data.app.id
                            },
                            userFullname : data.name,
                            email : data.email,
                            avatar: data.picture?data.picture:getAvatar(data.app.type, data.id)
                        });
                    });
                    this.tableData = tableData;
                }).catch(e => {
                    console.log("error", e);
                }).finally(e => {
                    this.loading = false;
                });
            },
            addFacebook(){
                this.navigation.navigate('LoginFB');
            },
            addYoutube(){
            },
            addTwitter(){
            },
            removeLinkedAccount: function(id) {
                this.loading = true;
                db.collection("linked_account").doc(id).delete().then(() => {
                    this.loadLinkedAccount();
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            }


        },
        mounted() {
            this.loadLinkedAccount();
            EventBus.$on('re-load-linked',()=>{
                this.loadLinkedAccount();
            });
        },
    }
</script>
<style>
    .container {
        width: 100%;
        height: 100%;
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
        width:100%;
        height:100%;
        padding-left: 16;
        padding-right: 16;
        padding-top:16;
        padding-bottom: 10;
        background-color: #F5F8FA;
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
    .marT10{
        margin-top:10;
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
    .bold{
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
    .icon-type-acc{
        bottom:0;
        right:0;
    }
    .item-linked{
        height:80;
        background-color:#ebeef5;
    }
    .padL10{
        padding-left:10;
    }
    .w20{
        width:20%
    }
     .w70{
        width:70%
    }
     .w10{
        width:10%
    }
    .footer{
        padding:10;
    }
    .item-menu{
        width:100%;
        padding:10;
        background-color: #fff;
        margin-bottom:10;
    }
    .border-primary{
        border-radius: 4;
        border-color: #0091FF;
        border-width:1;
    }
    .list-linked-acc{
        height:50%
    }
</style>