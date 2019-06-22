<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('autolive.video.step2')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content"> 
            <view class="add-text">
                <text class="label">{{$i18n.t('auto_tool.repeat')}}</text>
                <view class="input center">
                     <nb-picker class="center"
                            mode="dropdown"
                            :iosIcon="getIosIcon()"
                            :selectedValue="loop"
                            :onValueChange="onValueChange" >
                            <item  v-for="item in loopOptions" :key="item" :label="loopLabel(item)" :value="item" />
                    </nb-picker>
                </view>
            </view>
            <view class="resolution-box">
                <text class="label">{{$i18n.t('auto_tool.resolution')}}</text>
                <view class="box-select">
                    <touchable-opacity class="item-grid"  v-for="(item,index) in resolutionOptions" :key="index" :on-press="()=> {return changeResolution(item)}"  :disabled="index > maxResolution">
                            <text class="text">{{item}}</text>
                            <nb-checkbox class="circle" :checked="(item == resolution)" :style="{width:20,height:20}" />
                    </touchable-opacity>
                </view>
            </view>

            <view class="resolution-box">
                <text class="label">{{$i18n.t('auto_tool.service')}}</text>
                <view class="box-select">
                    <touchable-opacity class="item-grid"  v-for="item in serverOptions" :key="item"  :on-press="()=> {return changeServer(item)}">
                            <text>{{item}}</text>
                            <nb-checkbox class="circle" :checked="(item == server)" :style="{width:20,height:20}" />
                    </touchable-opacity>
                </view>
            </view>
      </view>
     <view class="button-next">
        <touchable-opacity :on-press="()=>{return onPressNext()}">
            <text class="text-next">{{$i18n.t('next')}}</text>
        </touchable-opacity>
     </view>
  </nb-container>
</template>

<script>
import {Dimensions,Image} from "react-native"
import React from "react";
import { Picker, Icon } from "native-base";
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
import i18n from './../../../plugins/i18n'
import {EventBus} from '../../../plugins/eventbus'
import { mapGetters } from 'vuex'

    export default {
        components:{
            Item: Picker.Item
        },
        props: {
            navigation: {
                type: Object
            }
        },
        data() {
            const serverOptions = ["English", "Canada"];
            return {
                dataStream:this.navigation.getParam('dataStream', {}),
                loopOptions: [0, 1, 2, 3, 5, 7, 10, -1],
                resolutionOptions: [480, 720, 1080],
                serverOptions,
                loop:0,
                resolution: 480,
                server:serverOptions[0],
                
            }
        },
        computed: {
            ...mapGetters([
			'getUserinfo'
            ]),
            subtitlePositionOptions () {
                const positionScrollOptions = ["bottom-right", "bottom-left", "top-right", "top-left"];
                const positionNoScrollOptions = ["bottom-center", "bottom-right", "bottom-left", "top-center", "top-right", "top-left"];
                return this.setting.subtitle.scrolling==="yes" ? positionScrollOptions : positionNoScrollOptions;
            },
            maxResolution() {
                if ( this.getUserinfo('plan')["details"] && this.getUserinfo('plan')["details"]["max_resolution"] )
                    return this.getUserinfo('plan')["details"]["max_resolution"];
                return 0;// get of index 0:480, 1:720, 2:1080
            },
            allowSubtitle() {
                if ( this.getUserinfo('plan')["details"] && this.getUserinfo('plan')["details"]["ads"]==2 )
                    return true;
                return false;
            }
        },
        methods: {
            loopLabel: function(n) {
                if ( n>=0 ) return this.$tc('autolive.video.times', n);
                return this.$t('autolive.video.no_loop');
            },
            goBack() {
                this.navigation.goBack();
            },
            onPressNext(){
                this.dataStream.setting.loop= this.loop;
                this.dataStream.setting.resolution= this.resolution;
                this.dataStream.server= this.server;
                this.dataStream.type= "video";
                this.navigation.navigate('Destination',{ dataStream : this.dataStream});
            },
            onValueChange: function(value) {
                this.loop = value;
            },
            getIosIcon: function() {
                return <Icon name="arrow-dropdown" />;
            },
            changeResolution(reso){
               this.resolution= reso;
            },
            changeServer(server){
                this.server= server;
            },
            
        },
    };
</script>
<style>
.head-statusbar{
    background-color: #222230;
    color:white;
    opacity: 0.7;
}
.container {
    flex-direction: column;
    flex: 1;
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
  font-size: 18;
  color: #282B34;
}
.text-bold{
  font-weight: bold
}
.text-center{
  text-align: center
}
.w20{
  width: 20%;
}
.w60{
  width: 60%;
}
.w85{
    width:85%
}
.w100{
    width: 100%
}
.marL16{
  margin-left:16;
}
.shadow {
  shadow-color: black;
  shadow-opacity: 0.15;
  shadow-radius: 2
}
.dark{
  color: #282B34
}
.center{
  justify-content: center;
  align-content:center;
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
.content {
text-align: left;
background-color: #F5F8FA;
height: 100%;
padding: 16;
}
.add-text {
width: 100%;
text-align: left;
}
.add-text {
    width: 100%;
    text-align: left;
}

.label {
    color: #9B9FAC;
    font-size: 12;
    line-height: 20;
    text-align: left;
}
.input {
    width: 100%;
    height: 40;
    background-color: #FFFFFF;
    border-radius: 2;
    border-width: 1;
    padding-left: 10;
    padding-right:10;
    border-color: #E7EBEE;
    margin-top: 10;
    
}
.resolution-box{
    margin-top: 30;
    margin-bottom: 10;
    height: 60;
}
.box-select{
    margin-top: 10;
    width: 100%;
    flex-direction: row;
    height: 60;
    
}
.item-grid{
    width: 32%;
    margin-left: 2%;
    justify-content: center;
    align-items: center;
    padding-left: 10;
    border-color: #0091FF;
    border-width: 1;
    background-color: white;
    border-radius: 4;
    flex-direction: row;
}
.circle{
    border-radius: 50;
    position: absolute;
    top: 5;
    left:5
}
.text-normal{
    color: #5B5F6D;
    text-align: left;
    font-size: 13;
    line-height: 20;
}
.text-center{
    text-align: center;
}
.text-bold{
    font-weight: bold;
}
.touch{
    width: 20%;
    justify-content: center;
    background-color: #0091FF;
    justify-content: center;
    align-content: center;
    border-top-right-radius: 2;
    border-bottom-right-radius: 2;
}
.button-next{
    padding: 10;
    width: 100%;
    height: 50;
    position: absolute;
    bottom: 0;
    border-radius: 1;
    background-color: #0091FF;
    justify-content: center;
}
.text-next{
    color: white;
    font-size: 13;
    font-weight: bold;
    text-align: center;
}
.h4 {
    font-size: 13
}

</style>