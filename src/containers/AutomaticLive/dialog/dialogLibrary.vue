<template>
	<view class="mask">
		<view class="dialog-content border">
            <touchable-opacity class="close" :on-press="close">
                <nb-icon name='close' :style="{color:'#0091FF'}" />
            </touchable-opacity>
            <text class="h3">{{title}}</text>
            <scroll-view>
                <view class="flex">
                    <nb-grid>
                        <nb-row v-for="(item,idx) in arrayChunk" :key="idx">
                            <nb-col v-for="(child, idxChild) in item" :key="idxChild">
                                <touchable-opacity class="item-lib border center" :on-press="()=>{ return onClickItemLibrary(child)}">
                                        <view class="item-lb-img">
                                            <image
                                                :source="{uri: child.image}"
                                                :style="{width:'100%', height:'100%'}"
                                                resize-mode="contain"
                                            />
                                        </view>
                                        <text class="strong h5 text-answer">{{child.answer}}  </text>
                                </touchable-opacity>
                            </nb-col>   
                        </nb-row>
                    </nb-grid>
                </view>
            </scroll-view>
		</view>
	</view>
</template>
<script>
    import React from "react";
    import {Dimensions} from "react-native";
    import { Picker, Icon } from "native-base";
    import i18n from '../../../plugins/i18n'
    import {EventBus} from '../../../plugins/eventbus'
    import {chunk} from '../../../helpers/handler'
    import { Toast } from "native-base"

    export default {
        props: ['close', 'visible','title','data'],
        components: {},
        data() {
            return {
                height: Math.round(Dimensions.get('window').height),
                accountVisible: false,
                arrayChunk:[],
                iSelected:false,
            }
        },
        computed: {
        },
        methods: {
            onClickItemLibrary(child){
                Toast.show({
                    text: "Selected!",
                    type: "success"
                });
                EventBus.$emit('on-click-item-library', {
                    item : child
                });
            }
        },
        mounted() {
            if(this.data){
                this.arrayChunk = chunk(this.data,3);
            }

        }
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
        background-color: white;
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
    .w100{
        width:100%;
    }
    .dialog-content {
        width: 100%;
        background-color: white;
        border-radius: 4;
        position: relative;
        padding-top: 20;
		padding-bottom: 16;
        padding-left: 8;
        padding-right: 8;
    }
    
    .close {
        position: absolute;
        top: 10;
        right: 10;
        margin:20;
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
    .img-box{
        width:120;
        height:100;
    }
    .label {
        color: #9B9FAC;
        font-size: 12;
        margin-bottom: 8;
    }
    
    .box-item {
        padding-left: 10;
        padding-right: 10;
        padding-top:10;
        padding-bottom:10;
        margin:6;
    }
    .text-answer{
        width:90%;
        height:20;
        text-align:center;
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
    .item-lib{
        width:100;
        margin-right:8;
        margin-bottom:8;
    }
    .item-lb-img{
        width:90;
        height:80;
    }
    .strong{
        font-weight: bold;
    }
    .h5{
        font-size: 10;
    }
</style>