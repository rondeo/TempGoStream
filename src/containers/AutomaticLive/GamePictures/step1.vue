<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('autolive.pic2word.title')}}</nb-title>
            </nb-body>
        </nb-header>
        <scroll-view :showsVerticalScrollIndicator="false">
            <view class="content">
                <view>
                    <text class="label">{{$i18n.t('title')}}</text>
                    <text-input class="text-input bg-white border" v-model="title" :placeholder="$t('title')"/>
                </view>
                <touchable-opacity class="marT10 border text-input center" v-if="(templateOptions && Object.keys(templateOptions).length >0)" :on-press="()=>{showTemplate = true}">
                    <text class="h3" v-if="!showTemplate">{{$i18n.t('autolive.react.step1')}}</text>
                    <nb-picker v-if="showTemplate"
                        mode="dropdown"
                        :selectedValue="template"
                        :onValueChange="onChangeTemplate">
                        <item class="h3" v-for="(item,id) in templateOptions" :key="id" :label="item.title" :value="id" />
                    </nb-picker>
                </touchable-opacity>
                <view class="box border marT10">
                    <text class="label h4">{{$i18n.t('autolive.pic2word.intro_game')}}</text>
                    <view class="border">
                        <image
                            :source="require('../../../../assets/images/pic2word_intro.jpg')"
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
    import React from "react"
    import {
        Picker,
        Icon
    } from "native-base"
    import {
        getBottomSpace,
        getStatusBarHeight,
        isIphoneX
    } from 'react-native-iphone-x-helper';
    import i18n from './../../../plugins/i18n'
    import {
        db
    } from '../../../plugins/firebase'
    import {
        api,
        generalCatch
    } from '../../../helpers'

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {
            Item: Picker.Item
        },
        data() {
            return {
                title: '',
                templateOptions: {},
                template: null,
                dataStream: {},
                enableNext: false,
                buttonNext: {
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity: 0.35
                },
                buttonNextActive: {
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity: 1
                },
                isLoading:false,
                showTemplate:false

            }
        },
        computed: {
            statusBarHeight() {
                if (isIphoneX()) {
                    return getStatusBarHeight() + 3;
                } else {
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
                if (this.template && this.templateOptions[this.template]) {
                    this.dataStream.setting={
                        questions : this.templateOptions[this.template].questions,
                    }
                }
                this.dataStream.title = this.title;
                this.dataStream.type="pic2word";
                this.navigation.navigate("GamePicturesStep2", {
                    dataStream: this.dataStream
                })
            },
            onChangeTemplate(newValue) {
                this.template = newValue;
            },
        },
        watch: {
            title(newText) {
                this.title = newText;
                if (newText.length > 0)
                    this.enableNext = true;
            }
        },
        mounted() {
            let templates = {};
            db.collection("user_saved").where("gs_uid", "==", this.$store.state.userInfo.id)
                                        .where("type", "==", "pic2word")
                                        .get().then(snapshot => {
                                            snapshot.forEach(doc => {
                                                templates[doc.id] = doc.data();
                                            
                                            });
                this.templateOptions = templates;
                //this.template=Object.keys(templates)[0];
            });
          
        },

    };
</script>

<style>
    .container {
        flex-direction: column;
        flex: 1;
        width: 100%;
        background-color: #F5F8FA;
    }
    
    .head-statusbar {
        background-color: #222230;
        color: white;
        opacity: 0.7;
    }
    
    .max-witdh {
        width: 100%;
    }
    
    .header {
        background-color: white;
        border-color: #D7D9E0;
        border-width: 1;
        height: 50;
        padding-left: 10;
        padding-right: 10;
    }
    
    .flex {
        flex-direction: row;
    }
    
    .h1 {
        font-size: 18;
        color: #282B34;
    }
    
    .text-bold {
        font-weight: bold
    }
    
    .text-center {
        text-align: center
    }
    
    .w20 {
        width: 20%;
    }
    
    .w60 {
        width: 60%;
    }
    .w100{
        width:100%;
    }
    
    .shadow {
        shadow-color: black;
        shadow-opacity: 0.15;
        shadow-radius: 2
    }
    
    .dark {
        color: #282B34
    }
    
    .center {
        justify-content: center;
        align-content: center;
    }
    .center-items{
        align-items:center;
    }
    
    .marB10 {
        margin-bottom: 10;
    }
    .marL16{
        margin-left:16;
    }
    .white {
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
    .h3{
        color: #333;
        font-size: 13;
        text-align: left;
    }
    .h4 {
        font-size: 14;
        line-height: 20;
    }
    .h40{
        height:40;
    }
    .border {
        border-width: 1;
        border-color: #E7EBEE;
        border-radius: 4;
    }
    .bg-white{
        background-color:#FFF;
    }
    .marT10{
        margin-top:10
    }
    .box {
        width: 100%;
        padding-left: 16;
        padding-right: 16;
        padding-top: 10;
        padding-bottom: 10;
        background-color: white;
        margin-bottom: 16;
    }
    
    .absolute {
        position: absolute;
    }
    
    .text-input {
        height: 40;
        padding-left: 16;
        padding-right: 16;
    }
    
    .button-next {
        padding: 10;
        width: 100%;
        height: 50;
        position: absolute;
        bottom: 0;
        border-radius: 1;
        background-color: #0091FF;
    }
</style>