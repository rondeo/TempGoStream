<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('place_post')}}</nb-title>
            </nb-body>
            <nb-right>
                <touchable-opacity :on-press="cancel">
                    <text class="text-bold text-center blue h4">{{$i18n.t('cancel')}}</text>
                </touchable-opacity>    
            </nb-right>
        </nb-header>
        <view class="content"> 
            <view class="border input center"> 
                <nb-picker
                    mode="dropdown"
                    :selectedValue="selected"
                    :onValueChange="onValueChange" >
                    <item :label="labelItem1Picker" value="post_now" />
                    <item :label="labelItem2Picker" value="post_later"/>
                    <item :label="labelItem3Picker" value="post_frequency" />
                </nb-picker>
            </view>    
            <view  class="marT10" v-if="isShowTimer"> 
                <view>
                    <text class="label">{{$i18n.t('time')}}</text>
                    <touchable-opacity class="flex border input center-items" :on-press="()=>{return showTimePicker()}"> 
                        <text-input class="text-normal" v-model="selectedTime" :placeholder="'hh:mm:ss'"/>
                        <DateTimePicker
                            :date="dateInit"
                            :mode="'time'"
                            :isVisible="isTimePickerVisible"
                            :minimumDate="dateInit"
                            :onConfirm="updateTime"
                            :onCancel="hideTimePicker"
                        />
                    </touchable-opacity>
                </view>
                <view class="marT10">
                    <text class="label">{{$i18n.t('day_post')}}</text>
                    <touchable-opacity class="flex border input center-items" :on-press="()=>{return showDatePicker()}">  
                        <text-input class="text-normal" v-model="selectedDay" :placeholder="'yyyy-mm-dd'"/>
                        <DateTimePicker
                            :date="dateInit"
                            :mode="'date'"
                            :minimumDate="dateInit"
                            :isVisible="isDatePickerVisible"
                            :onConfirm="updateDate"
                            :onCancel="hideDatePicker"
                        />
                    </touchable-opacity>
                </view>
            </view>
            <view>
                <touchable-opacity class="input-link" :on-press="()=>{return onPressAdd()}">
                    <view class="input-left">
                        <image
                            :source="require('../../../assets/images/ic_plus_circle.png')" 
                            :style="{width:25, height:25}" resize-mode="contain"
                        />
                    </view>
                    <view class="input-right">
                       <text class="text-add">{{$i18n.t('add_destination')}}</text>
                    </view>
                </touchable-opacity>
            </view>
            <view class="video-list">
                <text class="label">{{$i18n.t('autolive.targets_list')}}</text>
                <view class="list-video-added"> 
                    <view class="table-header">
                        <view class="no"> <text class="text-normal text-center">#</text></view>
                        <view class="title-video-add"> <text class="text-normal">{{$i18n.t('name')}}</text></view>
                    </view>
                    <scroll-view>
                        <view class="table-content" v-for="(item,index) in destination" :key="index">
                            <view class="no"> <text class="text-normal text-center">{{index}}</text> </view>
                            <view class="title-video-add-item"> <text class="text-normal">{{item.target.name}}</text> </view>
                            <touchable-opacity class="delete-video-add" :on-press="()=>{ return onRemoveTarget(index)}"> 
                                <image
                                    :source="require('../../../assets/images/ic_trash.png')" 
                                    :style="{width:30, height:30}" resize-mode="contain"
                                />
                            </touchable-opacity>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
        <view class="button-next center center-items max" v-bind:style= "[enableNext ? buttonNextActive : buttonNext]">
            <touchable-opacity class="max center center-items" :on-press="()=>{return onPressNext()}" :disabled="!enableNext">
                <text class="text-add text-bold">{{$i18n.t('next')}}</text>
            </touchable-opacity>
            <view class="absolute center center-items"
                v-if="isProcess"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="large" color="#fff" />
            </view>
        </view>
        <dialog-fb-api :close="() => { faceBookDialogVisible=false }" v-if="faceBookDialogVisible"/>
        <dialog-youtube-orther :close="() => { youtubeDialogVisible=false }" v-if="youtubeDialogVisible"/>
        <choose-days-in-week :close="() => { isShowFrequency=false }" v-if="isShowFrequency"/> 
  </nb-container>
</template>
<script>
import {Dimensions} from "react-native";
import { Picker, Icon } from "native-base";
import DateTimePicker from 'react-native-modal-datetime-picker';
import React from "react";
import DialogFbApi from './dialog/dialogFbAPI'
import DialogYoutubeOrther from './dialog/dialogYoutubeOrther'
import ChooseDaysInWeek from '../baseCustom/chooseDaysInWeek'
import i18n from '../../plugins/i18n'
import {db}  from '../../plugins/firebase'
import {getAvatar,api,generalCatch} from '../../helpers'
import {formatDatePicker} from '../../helpers/handler'
import {EventBus} from '../../plugins/eventbus'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
import { functions } from 'react-native-firebase';

export default {
    props: ['accountType', 'targetType', 'onlyApp','navigation'],
    components: {DialogFbApi,DialogYoutubeOrther,Item: Picker.Item, DateTimePicker,ChooseDaysInWeek},
    data() {
        return {
            dataStream:this.navigation.getParam('dataStream', {}),
            destination:[],
            showPlace: false,
            isProcess:false,
            faceBookDialogVisible:false,
            youtubeDialogVisible:false,
            targetsAdded:[],
            enableNext:false ,
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
            isShowTimer:false,
            isShowFrequency:false,
            isTimePickerVisible: false,
            isDatePickerVisible: false,
            dateInit: new Date(),
            labelItem1Picker:i18n.t('auto_tool.post_now'),
            labelItem2Picker:i18n.t('auto_tool.timer'),
            labelItem3Picker:i18n.t('autolive.schedule_option.post_frequency'),
            selected:"post_now",
            selectedTime:'',
            selectedDay:'',
            schedule:{},
            srcEditIcon:require('../../../assets/images/ic_edit.png'),
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
        getBottomSpaceIpX(){
            return getBottomSpace();
        }
    },
    methods: {
        goBack() {
            this.navigation.goBack();
        },
        cancel(){
            this.navigation.navigate('Home');
        },
        onPressAdd() {
            this.faceBookDialogVisible = true;
        },
        onPressNext(){
            this.isProcess = true;
            this.getSchedule();
            api('stream', this.dataStream).then(data => {
                if ( data.id ) { 
                    EventBus.$emit('reload-history',true);
                    this.navigation.navigate('History')
                }
            }).catch(generalCatch).finally(() => {
                    this.isProcess = false;
            });
        },
        onRemoveTarget: function(index) {
            this.destination.splice(index, 1);
        },
        onValueChange: function(value) {
            this.selected = value;
            if(value == 'post_now'){
                this.isShowTimer = false;
                this.isShowFrequency = false;
            }
            if(value == 'post_later'){
                this.isShowTimer = true;
                this.isShowFrequency = false;
            }
            if(value == 'post_frequency'){
                this.isShowTimer = false;
                this.isShowFrequency = true;
            }
        },
        showTimePicker(){
            this.isTimePickerVisible = true ;
        },
        hideTimePicker(){
            this.isTimePickerVisible = false ;
        },
        showDatePicker(){
            this.isDatePickerVisible = true ;
        },
        hideDatePicker(){
            this.isDatePickerVisible = false ;
        },
        updateTime(time){
            this.selectedTime = time.toString().substring(16,24);
            this.hideTimePicker();
        },
        updateDate(date){
            this.selectedDay=formatDatePicker(date.toString().substring(4,15));
            this.hideDatePicker();
        },
        getSchedule(){
            this.schedule.type = this.selected;
            switch(this.schedule.type){
                case "post_now":{
                    break;
                }
                case "post_later":{
                    if((this.selectedDay == '') || (this.selectedTime == '')) {
                        alert(i18n.t("autolive.scheduled.require_time"));
                        return;
                    }
                    let now = new Date();
                    this.schedule.date =  this.selectedDay + ' ' + this.selectedTime
                    let scheduled = new Date(this.schedule.date);
                    if ( scheduled < new Date(now + 300000 )) {
                        alert(i18n.t("autolive.scheduled.morethan5"));
                        return; 
                    }
                    this.schedule.delta = scheduled - now;
                    this.dataStream.schedule = this.schedule;
                    break;
                }
                case "post_frequency":{
                    this.schedule.kind= "weeks";
                    this.schedule.timezone=420;
                    this.dataStream.schedule = this.schedule;
                    break;
                }
            }
        },
    },
    mounted() {
        this.dataStream.destination=[];
        EventBus.$on('destination', data => {
            try{
                if(data){
                    if(this.dataStream.destination) {
                        for(let i = 0; i < this.dataStream.destination.length; i++){//check avoid duplicate by id target
                            if(data.destination.target.id == this.dataStream.destination[i].target.id) return
                        }
                    }
                    const des = {
                        user : {
                            id: data.destination.account.id,
                            name: data.destination.account.userFullname,
                            access_token: data.destination.account.access_token || data.destination.account.access_token,
                            type: data.destination.account.app.type
                        },
                        target : {
                            name: data.destination.target.name,
                            id: data.destination.target.id
                        },
                        caption : data.destination.caption,
                        continuous : data.destination.continuous
                    }
                    this.destination.push(des);
                    this.dataStream.destination.push(des);
                }
                console.log('dataStream', this.dataStream)
            }
            catch(err){
                 console.log('destination: error', err)
            }
            
            
        });
        EventBus.$on('on-add-stream', data => {
            this.faceBookDialogVisible= false;
            this.showPlace = false;
            if(this.destination[0] && this.destination[0].target) this.enableNext = true;
        });
        EventBus.$on('get-frequency-date', data => {
            this.isShowFrequency= false;
            this.showPlace = false;
            this.schedule.date= data.date;
            this.schedule.time = data.time;
        });
          
    },
    
};
</script>

<style>
.container {
    background-color:#F5F8FA;
}
.border{
    border-width: 1;
    border-color: #E7EBEE;
    border-radius: 4;
}
.input{
    padding-left:16;
    padding-right:10;
    background-color:#FFF;
    height:40;
}
.box{
    padding-left:10;
    padding-right:10;
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
.w90{
    width:90%;
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
  align-items:center
}
.absolute{
  position: absolute;
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
}


.label {
    color: #9B9FAC;
    font-size: 12;
    text-align: left;
    margin-bottom: 8;
}
.marL16{
  margin-left:16;
}
.marT10{
    margin-top:10;
}
.input-link {
    margin-top: 20;
    width: 100%;
    height: 40;
    justify-content: center;
    align-content: center;
    flex-direction: row;
    border-radius: 4;
    border-width: 1;
    border-color: #E7EBEE;
    background-color: #0091FF;
}

.input-left {
    height: 100%;
    margin-right: 8;
    justify-content: center;
    align-content: center;
}

.input-right {
    height: 100%;
    justify-content: center;
    align-content: center;
}
.text-normal{
    padding-left:10;
    padding-right:10;
    font-size:14;
    color:#333;
}
.text-add {
    color: white;
    text-align: center;
    font-size: 13;
    letter-spacing: 2;
}
.video-list{
    height: 200;
    margin-top: 10;
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
.title-video-add{
    width: 90%;
    justify-content: center;
}
.text-normal{
    color: #5B5F6D;
    text-align: left;
    font-size: 13;
    
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
    height: 40;
    border-bottom-color: #E7EBEE;
    border-bottom-width: 1;
}
.title-video-add-item{
    width: 77%;
    justify-content: center;
}
.delete-video-add{
        width: 15%;
    justify-content: center;
}
.title{
    width: 100%;
    height: 50;
    padding: 10;
    margin-top: 20;
}
.title-post{
    width: 100%;
    height: 50;
    flex-direction: row;
    justify-content: center;
    border-bottom-color: #E7EBEE;
    border-bottom-width: 1;
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

.places{
    background-color: white;
    justify-content: center;
}
.item-place{
    height: 40;
    justify-content: center;
    align-content: center;
    border-bottom-color: #E7EBEE;
    border-bottom-width: 1;
    padding:8;
}
.h4 {
    font-size: 13
}
.max{
    width: 100%;
    height:100%;
}
</style>