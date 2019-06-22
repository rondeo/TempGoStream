<template>
    <view class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('autolive.video.step1')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content"> 
            <view class="add-video">
                <text class="label">{{$i18n.t('add_video')}}</text>
                <view class="input-link">
                    <view class="input-left w85">
                        <text-input  v-model="link" :placeholder="'https://www.youtube.com/watch?v=E8Ba_jW6jio&t=14s'" />
                    </view>
                    <touchable-opacity  class="input-right w15 center" :on-press="()=>{return addLink()}">
                            <text class="text-white text-center">{{$i18n.t('add')}}</text>
                    </touchable-opacity>
                </view>
            </view>
            <view class="center box">
                <text class="label">{{$i18n.t('title')}}</text>
                <view class="input-link flex"> 
                    <view class="w90 padL10 center"> 
                        <text-input class="text-normal dark" v-model="titlePost"/>
                    </view>
                    <touchable-opacity class="w10 center" :on-press="()=>{titlePost = ''}">
                        <image
                        :source="require('./../../../../assets/images/ic_edit.png')" 
                        :style="{width:30, height:30}" resize-mode="contain"
                        />
                    </touchable-opacity>
                </view>
            </view>
            <view class="video-list">
                <text class="label">{{$i18n.t('video_list')}}</text>
                <view class="list-video-added"> 
                    <view class="table-header">
                        <view class="no"> <text class="text-normal text-center">#</text> </view>
                        <view class="center"> <text class="text-normal">{{$i18n.t('title')}}</text> </view>
                    </view>
                    <scroll-view :scrollBarIndicatorVisible="false">
                        <view class="table-content" v-for="(item,index) in listLink" :key="index">
                            <view class="no"> <text class="text-normal text-center">{{index}}</text> </view>
                            <view class="title-video-add-item"> <text class="text-normal">{{item.title}}</text> </view>
                            <touchable-opacity class="delete-video-add"  :on-press="()=>{return onRemoveLink(index)}"> 
                                <image
                                    :source="require('./../../../../assets/images/ic_trash.png')" 
                                    :style="{width:20, height:20}" resize-mode="contain"
                                />
                            </touchable-opacity>
                        </view>
                    </scroll-view>
                </view>
            </view>    
        </view>
        <view class="center center-items max" v-bind:style= "[linkChecked ? buttonNextActive : buttonNext]">
            <touchable-opacity class="max center center-items" :on-press="()=>{return onPressNext()}" :disabled="!linkChecked">
                <text class="text-white text-center text-bold">{{$i18n.t('next')}}</text>
            </touchable-opacity>
            <view class="absolute center-item"
                v-if="isLoading"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="large" color="#fff" />
            </view>
        </view>
    </view>
</template>

<script>
    import {Dimensions,Image,Keyboard,KeyboardAvoidingView ,Alert} from "react-native"
    import i18n from './../../../plugins/i18n'
    import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
    import {api, generalCatch} from '../../../helpers'
    import {EventBus} from '../../../plugins/eventbus'
    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        data() {
            return {
                dataStream:{},
                keyboardVisible: false,
			    keyboardHeight: 0,
                link: '',
                titlePost:'',
                linkChecked: false,
                isLoading:false,
                listLink:[],
                buttonNext:{
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity:0.35,
                    alignItems:'center'
                },
                buttonNextActive:{
                    padding: 10,
                    width: '100%',
                    height: 50,
                    position: 'absolute',
                    bottom: 0,
                    borderRadius: 1,
                    backgroundColor: '#0091FF',
                    opacity:1,
                    alignItems:'center'
                },
                clearText:false
               
            }
        },
        components: {},
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
            getBottomSpace(){
                return getBottomSpace()
            }

        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            onPressNext(){
                this.dataStream.setting={links: this.listLink.map(item => item.link)}
                this.dataStream.title= this.titlePost;
                this.navigation.navigate("AddVideoStep2",{dataStream:this.dataStream})
            },
            addLink(){
                if(this.link.trim() == ''){
                    let mess = i18n.t('notify.content.empty_link');
                    Alert.alert(mess);
                    return;
                }
                this.isLoading= true;
                api('other/checkLink?url='+encodeURIComponent(this.link.trim())).then(data => {
                    this.listLink.push({
                        title: data["title"],
                        duration: data["duration"],
                        link: data["last_url"]?data["last_url"]:this.link
                    });
                    if ( data["title"] && this.titlePost ==="" ) this.titlePost = data["title"];
                    this.linkChecked = true;
                    this.isLoading= false;
                }).catch(generalCatch).finally(() => {
                   this.isLoading= false;
                });
            },
            onRemoveLink: function(index) {
                this.listLink.splice(index, 1);
            },
        },
        created() {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                this.keyboardVisible = true;
                this.keyboardHeight = e.endCoordinates.height;
                //console.log('keyboardHeight index',this.keyboardHeight)
            });
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                this.keyboardVisible = false;
                //console.log('keyboard hide')
            });
        },
        beforeDestroy() {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
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
    background-color: #F5F8FA;
}
.content{
    padding: 6;
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
.box{
    margin-top: 16;
    padding-left: 10;
    padding-right: 10;
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
.padL10{
    padding-left: 10;
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
    align-items: center;
}
.absolute{
  position: absolute;
  z-index: 2
}
.center-item{
  justify-content: center;
  align-content: center;
  align-items:center
}
.blue{
    color: #0091FF
}
.add-video {
    width: 100%;
    padding-left: 10;
    padding-right: 10;
    text-align: left;
    margin-top: 10;
}

.label {
    margin-bottom: 8;
    color: #9B9FAC;
    font-size: 12;
    line-height: 20;
    text-align: left;
}
.center{
    justify-content: center;
    align-content: center;
}
.input-link {
    width: 100%;
    height: 40;
    flex-direction: row;
    background-color: white;
    border-radius: 6;
    border-width: 1;
    border-color: #E7EBEE;
}
.w85{
    width: 85%;
}
.w15{
     width: 15%;
}
.input-left {
    padding-right:8;
    padding-left:8;
    justify-content: center;
}

.input-right {
    background-color: #0091FF;
    width: 30%;
    border-top-right-radius: 4;
    border-bottom-right-radius: 4;
}

.text-white{
    color: white;
}
.video-list{
    width: 100%;
    max-height: 130;
    flex-direction: column;
    padding-left: 10;
    padding-right: 10;
    margin-top: 16;
    margin-bottom: 16;
}
.list-video-added{
    border-width: 1;
    border-color: #E7EBEE;
    border-radius: 4;
}
.table-header{
    background-color: #E7EBEE;
    border-top-left-radius: 4;
    border-top-right-radius: 4;
    width: 100%;
    flex-direction: row;
    height: 40;
}
.no{
    width: 10%;
    justify-content: center;
    text-align: center;
}

.text-normal{
    color: #5B5F6D;
    text-align: left;
    font-size: 13;
    padding: 3
    
}
.marB0{
    margin-bottom: 0;
}
.marL16{
  margin-left:16;
}
.w10{
    width: 10%
}
.w90{
    width: 90%
}
.text-center{
    text-align: center;
}
.text-bold{
    font-weight: bold;
}
.table-content{
    background-color: white;
    width: 100%;
    flex-direction: row;
    border-bottom-color: #E7EBEE;
    border-bottom-width: 1;
}
.title-video-add-item{
    width: 77%;
}
.w100{
    width:100;
}
.delete-video-add{
    width: 15%;
    justify-content: center;
}
.title{
    width: 100%;
    margin-top: 16;
    padding-left: 10;
    justify-content: center;
}
.title-post{
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    border-bottom-color: #E7EBEE;
    border-bottom-width: 1;
    margin-top: 6;
}
.button-next{
    padding: 10;
    width: 100%;
    height: 50;
    position: absolute;
    bottom: 0;
    border-radius: 1;
    background-color: #0091FF;
    opacity:0.4;
}
.max{
    width: 100%;
    height:100%;
}

</style>