<template>
	<view class="mask center" :style="{height}">
		<view class="dialog-content" :style="{height:heightbox}">
			<text class="h3 dark bold">{{title}}</text>
			<view class="box-item">
				<text class="label dark">{{content}}</text>
			</view>
			<view class="box-item marTop20 right">
				<touchable-opacity class="btn-unactive border center" :on-press="close">
					<text class="h4 gray">{{$i18n.t('cancel')}}</text>
				</touchable-opacity>  
			</view>
		</view>
	</view>
</template>
<script>
    import React from "react";
    import { Dimensions} from "react-native";
    import { Picker, Icon } from "native-base";
    import i18n from './../../plugins/i18n'

    export default {
        props: ['close', 'visible','title','content','heightbox'],
        components: {},
        data() {
            return {
                height: Math.round(Dimensions.get('window').height),
            }
        },
        computed: {
        },
        methods: {
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
        background-color: #282B34;
        opacity: 1;
    }
    
    .center {
        align-items: center;
        justify-content: center;
    }
    
    .right {
        align-items: flex-end;
        justify-content: center;
        text-align: right
    }
    
    .flex {
        flex-direction: row;
    }
    
    .marTop10 {
        margin-top: 10;
    }
    
    .marTop20 {
        margin-top: 20;
    }
    
    .dialog-content {
        width: 90%;
        background-color: white;
        border-radius: 4;
        padding-top: 20;
		padding-bottom: 16;
        padding-left: 8;
        padding-right: 8;
        position:absolute;
        top:18;
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
    .bold{
        font-weight:bold;
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
        padding: 10;
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
        margin-bottom: 8;
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
		height:50;
        color: #9B9FAC;
        background-color: #F5F8FA;
        margin-right: 6%;
		justify-content:center;
    }
    
    .btn-active {
        width: 47%;
		height:50;
        color: #fff;
        background-color: #0091FF;
        margin-right: 10;
		justify-content:center;
    }
</style>