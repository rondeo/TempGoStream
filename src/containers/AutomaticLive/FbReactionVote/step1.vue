<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('auto_tool.vote')}}</nb-title>
            </nb-body>
        </nb-header>
        <scroll-view :showsVerticalScrollIndicator="false">
            <view class="content">
                <view class="marT10">
                    <text class="label">{{$i18n.t('title')}}</text>
                    <view class="box border">
                        <text-input class="text-input" v-model="title" :placeholder="$t('title')"/>
                    </view>
                </view>
                <view class="marT10">
                    <text class="label">{{$i18n.t('auto_tool.background_music')}}</text>
                    <view class="box border">
                        <text-input class="text-input" v-model="audio"
                            :placeholder="$i18n.t('autolive.react.audio_no_copyright')"/>
                    </view>
                </view>
                <view class="marT10">
                    <text class="label">{{$i18n.t('autolive.react.step1')}}</text>
                    <view class="text-input border center bg-white padL16">
                        <nb-picker
                            mode="dropdown"
                            :selectedValue="teamplateSelected"
                            :onValueChange="onChangeTeamplate" >
                            <item v-for="op in optionsTeamplate" :key="op.value" :label="op.label" :value="op.value" />
                    </nb-picker>
                    </view>
                </view>
                <view class="marT10">
                    <text class="label">{{$i18n.t('image')}}</text>
                    <view class="border marB10">
                        <image
                            :source="srcImg"
                            :style="{width:'100%',height:140}" resize-mode="cover"
                        />    
                    </view>
                </view>
            </view>
        </scroll-view>  
        <view class="button-next center center-items">
            <touchable-opacity class="center center-items" v-bind:style= "[enableNext ? buttonNextActive : buttonNext]"
                :on-press="()=>{return onPressNext()}" :disabled="!enableNext">
                <text class="white text-bold text-center">{{$i18n.t('next')}}</text>
            </touchable-opacity>
        </view>
  </nb-container>
</template>
<script>
    import {Dimensions,Image } from "react-native";
    import React from "react";
    import {Picker,Icon } from "native-base";
    import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper';
    import i18n from './../../../plugins/i18n';

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {Item: Picker.Item},
        data() {
            return {
                title:'',
                audio:'',
                dataStream:{},
                optionsTeamplate:[
                    {   
                        label:i18n.t('autolive.react.reaction'),
                        value:'reaction',
                        srcImg:require('../../../../assets/images/react_vote_intro.jpg')
                    },
                    {   
                        label:i18n.t('autolive.react.comment'),
                        value:'comment',
                        srcImg:require('../../../../assets/images/react_vote_comment.jpg')
                    },
                    {   
                        label:i18n.t('autolive.react.poll'),
                        value:'poll',
                        srcImg:require('../../../../assets/images/react_vote_poll.jpg')
                    },
                ],
                teamplateSelected: 'reaction',
                srcImg:require('../../../../assets/images/react_vote_intro.jpg'),
                enableNext:false,
                buttonNext:{
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity:0.35
                },
                buttonNextActive:{
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity:1
                },

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
            screenHeight() {
                return Math.round(Dimensions.get('window').height);
            },
            screenWidth() {
                return Math.round(Dimensions.get('window').width);
            },
            getBottomSpaceIpX() {
                return getBottomSpace();
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            onPressNext() {
                this.dataStream = {
                    title:this.title,
                    setting:{
                        audio:this.audio,
                        template:this.teamplateSelected
                    },
                    type:'react'
                }
                this.navigation.navigate("ReactStep2",{dataStream:this.dataStream})
            },
            onChangeTeamplate(teamplate){
                this.teamplateSelected = teamplate;
                if(teamplate == "reaction") 
                    this.srcImg = this.optionsTeamplate[0].srcImg
                if(teamplate == "comment") 
                    this.srcImg = this.optionsTeamplate[1].srcImg
                if(teamplate == "poll") 
                    this.srcImg = this.optionsTeamplate[2].srcImg
            },
        },
        watch: {
            title(newText){
                this.title = newText;
                if(newText.length > 0)
                    this.enableNext = true;
            }
        },
       
    };
</script>

<style>
.container {
    background-color:#F5F8FA;
}
.head-statusbar{
    background-color: #222230;
    color:white;
    opacity: 0.7;
}
.max-witdh{
        width: 100%;
}
.marT10{
    margin-top:10;
}
.padL16{
    padding-left: 16;
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
.center-items{
  align-items:center;
}
.marL16{
    margin-left:16;
}
    .marB10{
        margin-bottom: 10;
    }
    .white{
        color: #FFF;
    }
    .content {
        text-align: left;
        padding: 10;
        height: 100%;
    }
    
    .label {
        color: #9B9FAC;
        font-size: 12;
        text-align: left;
        margin-bottom: 8;
    }
    
   
    .border{
        border-width: 1;
        border-color: #E7EBEE;
        border-radius: 4;
    }
    .box{
        width:100%;
        padding-left:16;
        padding-right:16;
        background-color:#fff;
    } 
    
    .bg-white{
        background-color:#FFF;
    }   

    .absolute{
        position: absolute;
    }
    .text-input{
        height:40;
    }
    .button-next {
        padding: 10;
        width: 100%;
        height: 50;
        position: absolute;
        bottom: 0;
        border-radius: 1;
        background-color: #0091FF;
        justify-content: center;
    }
</style>