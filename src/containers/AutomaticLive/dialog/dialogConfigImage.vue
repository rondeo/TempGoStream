<template>
	<view class="mask center center-items" :style="{height}">
		<view class="dialog-content" :style="{height:heightbox}">
			<view>
                <text class="title">{{$i18n.t('autolive.config_frame')}}</text>
                <view class ="marT10 flex">
                    <text class="label w20">{{$i18n.t('autolive.video.top')}}</text>
                    <text-input class="marL10 input border" v-model="video.top" :keyboardType="'numeric'"/>
                    <text class="label"> px</text>
                </view>    
                <view class ="marT10 flex">
                    <text class="label w20">{{$i18n.t('autolive.video.left')}}</text>
                    <text-input class="marL10 input border" v-model="video.left" :keyboardType="'numeric'"/>
                    <text class="label"> px</text>
                </view>
                <view class ="marT10 flex">
                    <text class="label w20">{{$i18n.t('autolive.video.width')}}</text>
                    <text-input class="marL10 input border" v-model="video.width" :keyboardType="'numeric'"/>
                    <text class="label"> %</text>
                </view>
                <view class ="marT10 flex">
                    <text class="label w20">{{$i18n.t('autolive.video.height')}}</text>
                    <text-input class="marL10 input border" v-model="video.height" :keyboardType="'numeric'"/>
                    <text class="label"> %</text>
                </view>
            </view>
			<view class="box-item marTop20 flex">
				<touchable-opacity class="btn-unactive border center" :on-press="close">
					<text class="h4 gray">{{$i18n.t('cancel')}}</text>
				</touchable-opacity>  
				<touchable-opacity class="btn-active border center"  :on-press="() => { return submit() }">
					<text class="h4 white">OK</text>
				</touchable-opacity>  
			</view>
		</view>
	</view>
</template>
<script>
    import React from "react"
    import { Dimensions} from "react-native"
    import { Picker, Icon } from "native-base"
    import {EventBus} from '../../../plugins/eventbus'
    import i18n from '../../../plugins/i18n'

    export default {
        props: ['close', 'visible','title','textBtnActive','heightbox'],
        components: {},
        data() {
            return {
                video:{
                    top:'',
                    left:'',
                    width:'',
                    height:''
                }
            }
        },
        computed: {
            height(){
                return Math.round(Dimensions.get('window').height);
            },
        },
        methods: {
            submit(){
                EventBus.$emit('config-image',this.video);
            }
        },
    }
</script>
<style>
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 50;
        opacity: 1;
        background-color: #333;
    }
    .absolute{
        position: absolute;
    }
    .center {
        align-items: center;
        justify-content: center;
    }
    .center-items{
        align-content:center;
    }
    .right {
        align-items: flex-end;
        justify-content: center;
        text-align: right
    }
    .input{
        background-color:#FFF;
        height:40;
        padding-left:10;
        padding-right:10;
        width: 60%
    }
    .flex {
        flex-direction: row;
    }
    .item{
        padding-left: 10;
        padding-right: 10;
        height:35;
        background-color:#F5F5F5;
        border-radius: 4;
        border-color: #E0FFFF;
        margin-bottom: 8;
    }
    .marTop10 {
        margin-top: 10;
    }
    
    .marTop20 {
        margin-top: 20;
    }
    
    .dialog-content {
        width: 90%;
        background-color:#F5F8FA;
        border-radius: 4;
        padding-top: 20;
        padding-left: 10;
        padding-right: 10;
        padding-bottom:10;
        position:absolute;
        top:35;
    }
    
    .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 50;
        height: 40;
        color: gray;
    }
    
    .close-txt {
        color: gray;
    }
    
    .title {
        font-weight: bold;
        text-align: center;
        margin-bottom: 20;
    }
    
    .border {
        border-radius: 4;
        border-width: 1;
        border-color: #E7EBEE;
    }
	.letter-space{
		letter-spacing: 2;
	}
    .bold{
		font-weight:bold;
	}
    .h3 {
        color: #282B34;
        font-weight: 300;
        font-size: 16;
        margin-bottom: 8;
        margin-left: 10;
    }
	.h4 {
        font-weight: 300;
        font-size: 14;
    }
    
    .label {
        color: #9B9FAC;
        font-size: 13;
    }
    .marT10{
        margin-top: 10
    }
    .marL10{
        margin-left: 10;
    }
    .box-item {
        margin-top: 10;
        padding-left: 10;
        padding-right: 10;
    }
    
    .blue {
        color: #0091FF;
    }
    .white{
		color:#fff;
	}
    .gray {
        color: #5B5F6D;
    }
    .dark{
        color:#5B5F6D;
    }
    
    .checkbox {
        background-color: white;
        border-radius: 2;
        border-width: 1;
        border-color: #9B9FAC;
        color: #0091FF;
        margin-right: 16;
        width: 16;
        height: 16;
    }
    
    .btn-unactive {
        width: 47%;
		height:40;
        color: #9B9FAC;
        background-color: #F5F8FA;
        margin-right: 6%;
		justify-content:center;
    }
    
    .btn-active {
        width: 47%;
		height:40;
        color: #fff;
        background-color: #0091FF;
        margin-right: 10;
		justify-content:center;
    }
    .w90{
        width:90;
    }
    .w10{
        width:10;
    }
    .w20{
        width: 20%
    }
</style>