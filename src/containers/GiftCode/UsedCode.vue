<template>
    <view class="container">
        <view class="header padB6 marB10 flex">
            <text class="w50" >{{$i18n.t('giftcode.code')}}</text>
            <text class="w50">{{$i18n.t('giftcode.used')}}</text>
        </view>
        <view class="flex" v-for="item in data">
            <text  class="w50 gray h4 padR6":numberOfLines="1">{{item.id}}</text>
            <view class="w50">
                <text class="gray h4" :numberOfLines="1">{{item.used.gs_email}}</text>
                <text class="gray h5">{{getTime(item.used.time)}}</text>
            <view/>
        </view>
</template>
<script>
    import React from "react";
    import {Dimensions} from "react-native";
    import { Picker, Icon } from "native-base";
    import i18n from '../../plugins/i18n'
    import {EventBus} from '../../plugins/eventbus'
    import {chunk} from '../../helpers/handler'
    import {formatDate} from '../../helpers'

    export default {
        props: ['data'],
        components: {},
        data() {
            return {
                height: Math.round(Dimensions.get('window').height),
            }
        },
        methods: {
            getTime(time){
                return formatDate(time);
            }
        },
        filters: {
            formatDate
        }
        
    }
</script>
<style>
.container{
    margin-bottom:8;
}
    .center {
        align-items: center;
        justify-content: center;
    }
    .center-items{
        align-content:center;
    }
    .flex {
        flex-direction: row;
    }
    .item-box {
        height: 40;
        padding-left: 10;
        background-color:#F5F8FA
    }
    .white {
        color: white;
    }
    .gray{
        color:#606266;
    }
    .border {
        border-radius: 4;
        border-width: 1;
        border-color: #dcdfe6;
    }
     .button {
        width: 100;
        height: 40;
        padding-top: 8;
        padding-bottom: 8;
        padding-left: 16;
        padding-right: 16;
    }
    .marB10{
        margin-bottom:10;
    }
    .w50{
        width:50%;
    }
    .header{
        border-color:#9B9FAC;
        border-bottom-width: 1;
    }
    .padB10{
        padding-bottom:10
    }
    .padB6{
        padding-bottom:6
    }
    .padR6{
        padding-right:6;
    }
    .h4{
        font-size:13;
    }
    .h5{
        font-size:12
    }
</style>