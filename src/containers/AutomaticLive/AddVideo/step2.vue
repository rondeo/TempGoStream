<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('auto_tool.text_logo')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content"> 
            <view class="add-text">
                <text class="label">{{$i18n.t('autolive.video.subtitle')}}</text>
                <view class="input center">
                    <text-input class="dark"  v-model="content" :placeholder="$i18n.t('autolive.caption')" :editable="allowSubtitle" />
                </view>
                <text class="label marT10">{{$i18n.t('autolive.video.scrolling')}}</text>
                 <view class="input center">
                        <nb-picker class="center"
                            mode="dropdown"
                            :enabled="allowSubtitle"
                            :iosIcon="getIosIcon()"
                            :selectedValue="selectedScroll"
                            :onValueChange="onValueChange">
                            <item v-for="item in scrollingOptions"
					            :key="item" :label="getLabel(item)" :value="item" />
                        </nb-picker>
                </view>
            </view>
            <view class="marT10">
                <text class="label">{{$i18n.t('logo')}}</text>
                <view class="input flex"> 
                    <view class="left center"> <text-input  class="dark" v-model="linkOrPathFrame" placeholder="link" :editable="allowSubtitle"/></view>
                     <view class="right">
                        <touchable-opacity :on-press="()=>{return selectImg()}" :disabled="!allowSubtitle">
                            <image
                                    :source="require('./../../../../assets/images/ic_upload.png')" 
                                    :style="{width:30, height:30}" resize-mode="contain"
                            />
                        </touchable-opacity>
                     </view>
                </view>
                <touchable-opacity class="marT10" v-if="linkOrPathFrame" :on-press="()=>{return showConfigImageDialog = true}">
                    <nb-icon name="aperture" :style="{ fontSize: 30, color: '#0091FF' }"/>
                </touchable-opacity>    
            </view>
      </view>
    <view class="button-next center center-items">
        <touchable-opacity class="max center center-items" :on-press="()=>{return onPressNext()}">
            <text class="text-center white bold">{{$i18n.t('next')}}</text>
        </touchable-opacity>
        <view class="absolute"
            v-if="uploading"
            :style="{flex: 1, justifyContent: 'center'}">
            <activity-indicator size="large" color="#fff" />
        </view>
    </view>
    <dialog-config-image v-if="showConfigImageDialog" :close="() => { showConfigImageDialog=false }"/>
  </nb-container>
</template>

<script>
import {  Dimensions, Image } from "react-native";
import React from "react";
import {Platform} from 'react-native';
import { Picker, Icon,Toast } from "native-base";
import i18n from './../../../plugins/i18n'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
import pick from './../../../api/pickImage';
import {api, generalCatch,imgurUpload} from '../../../helpers'
import {EventBus} from '../../../plugins/eventbus'
import DialogConfigImage from '../dialog/dialogConfigImage'
import { mapGetters } from 'vuex'

    export default {
        components:{
            DialogConfigImage,
            Item: Picker.Item,
        },
        props: {
            navigation: {
                type: Object
            }
        },
        data() {
            const serverOptions = ["English", "Canada"];
		    const scrollingOptions = ["no", "yes"];
            return {
                dataStream:this.navigation.getParam('dataStream', {}),
                content: '',
                scrollingOptions,
                selectedScroll: scrollingOptions[0],
                linkOrPathFrame: '',
                settingFrame:{
                    link:''
                },
                fileFrame:{},
                configSubtitleVisible: false,
                configFrameVisible: false,
                uploading: false,
                showConfigImageDialog:false,
                configVideo:null,
                plan:null,

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
                return 480;
            },
            allowSubtitle() {
                if ( this.getUserinfo('plan')["details"] && this.getUserinfo('plan')["details"]["ads"]==2 )
                    return true;
                return false;
            } 
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            getLabel(item){
                return i18n.t(`option.${item}`)
            },
            onPressNext(){
                this.uploadFrame();
            },
            onValueChange: function(value) {
                this.selectedScroll = value;
            },
            getIosIcon: function() {
                return <Icon name="arrow-dropdown" />;
            },
            selectImg(){
                pick((source, data) =>{
                    this.linkOrPathFrame=source.uri;
                    this.fileFrame = data;
                });
                if(this.linkOrPathFrame) this.configFrameVisible = true
            },
            uploadFrame() {
                if (this.linkOrPathFrame) {
                    let file = this.linkOrPathFrame;
                    this.uploading = true;
                    imgurUpload(file).then((response) => {
                        if ( response.data && response.data.link )
                            this.settingFrame.link = response.data.link
                    }).catch((e) => {
                        alert(e)
                    }).finally(() => {
                        this.uploading = false;
                        this.navigate();
                    })
                }
                this.navigate();
            },
            navigate(){
                if(this.configVideo){
                     this.dataStream.setting.frame={
                        width:this.configVideo.width+"%",
                        height:this.configVideo.height+"%",
                        left:this.configVideo.left,
                        top:this.configVideo.top,
                        link: this.settingFrame.link
                    }
                }else{
                    this.dataStream.setting.frame={
                        width:10+"%",
                        height:10+"%",
                        left:0,
                        top:0,
                        link: this.settingFrame.link
                    }
                }
                this.dataStream.setting.subtitle={
                    position:"bottom-center",
                    scrolling:this.selectedScroll,
                    text:this.content
                }
                this.navigation.navigate("AddVideoStep3",{dataStream: this.dataStream});
            }
        },
        mounted() {
            // this version dont allow user custom position of text scroll
            //this.setting.subtitle.position = this.subtitlePositionOptions[0];
            if(!this.allowSubtitle){
                Toast.show({
                    text: i18n.t('account.allow_subtitle'),
                    buttonText: "Okay",
                    type: "warning",
                    duration:6000
                })
            }
            EventBus.$on('config-image',data =>{
                this.showConfigImageDialog = false;
                this.configVideo = data;
            });
            //get plan user
            EventBus.$on('plan-user',data =>{
                this.plan = data;
                console.log('add video live step 2 -- get plan ', this.plan)
            });

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
.w100{
    width: 100%
}
.w85{
    width:85%;
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
    padding: 10;
    background-color: #F5F8FA;
    height: 100%;
}

.marT10{
    margin-top: 10;
}
.marL16{
  margin-left:16;
}
.label {
    color: #9B9FAC;
    font-size: 12;
    margin-bottom: 8;
    text-align: left;
}
.input {
    width: 100%;
    height: 40;
    background-color: #FFFFFF;
    border-radius: 2;
    border-width: 1;
    padding-left: 10;
    border-color: #E7EBEE;
}
.left{
    width: 85%;
    justify-content: center;
    padding-left: 10;
}
.right{
    width: 15%;
    justify-content: center;
    background-color: #0091FF;
    align-items: center;
    border-top-right-radius: 2;
    border-bottom-right-radius:2; 
}

.img{
    padding: 10;
    border-top-left-radius: 2;
    border-bottom-right-radius: 2;
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
    width: 100%;
    height: 50;
    position: absolute;
    bottom: 0;
    border-radius: 1;
    background-color: #0091FF;
    justify-content: center;
}
.absolute{
    position: absolute;
    z-index: 2;
}
.center-items{
    align-items: center
}
.max{
    width: 100%;
    height:100%;
}
</style>