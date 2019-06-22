<template>

  <nb-container>
    <nb-header>
      <nb-body class="flex center-items">
        <touchable-opacity class="center" :on-press="()=>{return goBack()}">
              <nb-icon name="arrow-back" :style="{color:'white'}" />
        </touchable-opacity>
        <nb-title class="marL16 white">{{$i18n.t('home.marketing_tool')}}</nb-title>
      </nb-body>
    </nb-header>
    <view class="content">
      <view class="list-option">
        <touchable-opacity  class="item-option box-shadow" v-for="(item, index) in options" :key="index" :on-press="()=>{ return onPressItem(index)}">
            <view class="left-blue"></view>
            <view class="box-text"><text class="text">{{$i18n.t(`marketing_tool.${item.name}`)}}</text></view>
            <view class="button-right">
              <image
              :source="require('./../../../assets/images/ic_chevron_right.png')" 
              :style="{width:30, height:80}"
              resize-mode="contain"
              />
            </view>
        </touchable-opacity >
      </view>
    </view>
  </nb-container>
</template>
<script>
import { NavigationActions, StackActions } from 'react-navigation';
import Vue from "vue-native-core";
import { VueNativeBase } from "native-base";
import { Dimensions } from 'react-native'
import i18n from '../../plugins/i18n'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
Vue.use(VueNativeBase);


export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      options: [
        {
          name: 'broadcast_mess',
        },
        {
          name: 'increase_viewer'
        },
      ],
    };
    },
    methods: {
        onPressItem(index) {
          switch(index){
            case 0: {
              this.navigation.navigate("BroadcastMessage");
              break;
            }
            case 1: {
              this.navigation.navigate("FakeViewer");
              break;
            }
            default:{
               this.navigation.navigate("BroadcastMessage");
              break;
            }
          }
          
        },
        goBack(){
          this.navigation.goBack();
        }
    },
    computed: {
      statusBarHeight() {
        if(isIphoneX()){
          console.log('isIphoneX')
            return getStatusBarHeight()+3;
        }else{
            return 0;
        }
      },
      getHeightDevices(){
        return  Dimensions.get('window').height
      }
    },
};
</script>
<style>
.head-statusbar{
    background-color: #222230;
    color:white;
    opacity: 0.7;
}
.header{
  background-color: white;
  border-color: #D7D9E0;
  border-width: 1;
  height: 50;
  padding-left: 10;
  padding-right: 10;
}
.content{
  background-color:#fff;
  width:100%;
  height:100%;
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
.dark{
  color: #282B34
}
.center{
  justify-content: center;
  align-content:center;
}
.list-option {
    margin-top: 16;
    padding-left: 10;
    padding-right: 10;
    justify-content: center;
}

.item-option {
  width: 100%;
  height: 50;
  flex-direction: row;
  border-radius: 6;
  margin-bottom: 16;
  justify-content: center;
  background-color:#F5F8FA
}

.box-shadow {
  	shadow-color: rgba(40, 43, 52, 0.1);
  	shadow-opacity: 0.8;
	  shadow-radius: 6;
}
.left-blue {
    width: 2%;
    background-color: #0091FF;
    align-items: flex-start;
    border-top-left-radius: 6;
    border-bottom-left-radius: 6;
}

.box-text {
    width: 82%;
    justify-content: center;
    padding-left: 10
}

.text {
    color: #5B5F6D;
    font-size: 16;
}

.button-right {
    width: 15%;
    height: 100%;
    align-items: center;
    justify-content: center;
}
.marL16{
  margin-left:16;
}
</style>