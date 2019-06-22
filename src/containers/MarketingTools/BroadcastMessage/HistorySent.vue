<template>
    <nb-container class="container" >
        <scroll-view :scrollBarIndicatorVisible="false">
            <view class="center center-item">
                <view class="absolute padT20 center center-item"
                        v-if="loading"
                        :style="{justifyContent: 'center'}">
                        <activity-indicator size="small" color="#0091FF" />
                </view>  
            </view>    
            <view class="content">
                <view class="border bg-white app-box marT10" v-if="tableData.length>0">
                    <view  class="item-list" v-for="item in tableData">
                        <view class="flex">
                            <text class="h3 dark">{{$t('linked_account.fanpage')}}:</text>
                            <text class="marL10 h3 primary">{{item.fanpage.name }}</text>
                        </view>
                        <view class="flex">
                            <text class="h3 dark">{{$t('time')}}:</text>
                            <text class="h3 marL10 dark">{{item.create_time}}</text>
                        </view>
                        <view class="flex">
                            <text class="h3 dark">{{$t('broadcast.reach')}}:</text>
                            <text class="h3 marL10 dark">{{item.reach}}</text>
                        </view>
                        <view class="flex">
                            <text class="h3 dark">{{$t('broadcast.content')}}:</text>
                            <text class="h3 marL10 dark" :numberOfLines="3">{{item.content}}</text>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <text class="h3 red">{{$t('empty')}}</text>
                </view>
            </view>
        </scroll-view> 
  </nb-container>
</template>
<script>
    import React from "react"
    import {Dimensions,Image,KeyboardAvoidingView,Alert } from "react-native"
    import {Picker,Icon,Toast } from "native-base"
    import {getBottomSpace } from 'react-native-iphone-x-helper'
    import BaseDialog from '../../baseCustom/baseDialog'
    import i18n from '../../../plugins/i18n'
    import {api, generalCatch, formatDate} from '../../../helpers'
    import {mapGetters} from 'vuex'
    import {db,auth} from '../../../plugins/firebase'
    import Money from '../../Account/Money'
    import {EventBus} from '../../../plugins/eventbus'
    import user from '../../../helpers/user'

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {
            BaseDialog,
            Money,
            KeyboardAvoidingView
        },
        data() {
            return {
                access_token: '',
                fanpage: null,
                loading:false,
                tableData: []
            }
        },
        computed: {
        },
        methods: {
            loadHistory: function() {
                this.loading = true;
                db.collection("broadcast_history").where("gs_uid", "==", this.$store.state.userInfo.id)
                        .orderBy('create_time', 'desc').limit(20).get().then(snapshot => {
                    let broadcasted = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if ( data['reach']===undefined && data.response.broadcast_id ) {
                            api('facebook/broadcast', {
                                mode: 'insights',
                                access_token: data.fanpage.access_token,
                                estimate_id: data.response.broadcast_id,
                                id: doc.id
                            });
                        }
                        broadcasted.push({
                            content: data['content'].substring(0, 200),
                            create_time: formatDate(data['create_time'], true),
                            fanpage: data['fanpage'],
                            reach: data['reach']?data['reach']:0
                        });
                    });
                    this.tableData = broadcasted;
                    this.loading = false;
                })
            },
        },
        mounted() {
		    this.loadHistory();
            EventBus.$on('load-his-broad-message',(data) => {
                this.loadHistory();
            })
        },
        beforeMount: function() {
            this.$store.commit('updateBreadcrumb', [{title: 'marketing'}, {title: "broadcast"}])
        },
        beforeDestroy: function() {
            clearTimeout(this.timer);
        },
        mixins: [user]
    };
</script>

<style>
    .container {
        width: 100%;
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
.flex{
  flex-direction: row;
}
.h1{
  font-size: 16;
  color: #282B34;
}
.h3{
    font-size: 14;
}
.h5{
    font-size:12;
}
.bold{
  font-weight: bold
}
.text-center{
  text-align: center
}
.w10{
  width: 10%;
}
.w40{
  width: 40%;
}
.w50{
    width: 50%
}
.shadow {
  shadow-color: black;
  shadow-opacity: 0.15;
  shadow-radius: 2
}
.dark{
  color: #aaa
}
.primary{
    color:#0091FF
}
.red{
    color:red
}
.center{
  justify-content: center;
  align-content:center;
}
.center-items {
    align-items: center;
}
.white{
    color:white;
}
.bold{
    font-weight: bold;
}
.h4 {
    font-size: 13
}
.blue{
    color: #0091FF
}
.red{
    color: red
}
.max-width{
    width: 100%;
}

.text-center{
    text-align: center;
}

.white{
    color: #FFF;
}

.bg-blue{
    background-color: #0091FF;
}

.content {
    padding: 10;
}

.item-box {
    margin: 10;
}
.input-text{
    background-color: #E7EBEE;
    height: 50;
}
.bg-white{
    background-color:white;
}
.w70{
    width: 70%
}
.w30{
    width: 30%
}
.label {
    color: #9B9FAC;
    font-size: 12;
    text-align: left;
    margin-bottom: 8;
}
.marT10{
    margin-top:10;
}
.padT20{
    padding-top:20;
}
.marL10{
    margin-left:10;
}
.padL16{
    padding-left:16;
}
.marB10{
    margin-bottom:10;
}
.marT8{
    margin-top:8;
}
.center{
    justify-content: center;
    align-content: center;
    align-items: center;
}
.flex{
    flex-direction: row;
}
.text-center {
    text-align: center;
}

.bold {
    font-weight: bold;
}
.white{
    color:#fff;
}
.picker{
        width: 55%;
        background-color: white;
}
.border{
    border-width: 1;
    border-color: #E7EBEE;
    border-radius: 4;
}
.border-left{
    border-top-left-radius: 4;
    border-bottom-left-radius: 4;
    border-width: 1;
    border-color: #E7EBEE;
}
.border-right{
    border-top-right-radius: 4;
    border-bottom-right-radius: 4;
    border-width: 1;
    border-color: #E7EBEE;
}
.btn-upgrade{
    margin-left: 5%;
    width: 40%;
    border-radius: 4;
    background-color: #0091FF;
}
.picker-img{
    background-color: #9B9FAC;
    height: 160;
}

.img-picked{
    z-index: 1;
    opacity: 0.25;
    width: 100%;
    height: 100%;
}
.absolute{
    position: absolute;
}
.button-next {
    padding: 10;
    height: 50;
    border-radius: 4;
    background-color: #0091FF;
    justify-content: center;
    margin:20;
}
.app-box{
    padding:10;
}
.item-list{
    padding:6;
    border-top-width:1;
    border-top-color:#aaa;
    margin-bottom:3
}
</style>