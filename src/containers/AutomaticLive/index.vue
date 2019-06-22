<template>

  <nb-container>
    <nb-header>
      <nb-body class="flex center-items">
        <touchable-opacity class="center" :on-press="()=>{return goBackHome()}">
              <nb-icon name="arrow-back" :style="{color:'white'}" />
        </touchable-opacity>
        <nb-title class="marL16 white">{{$t('home.automatic')}}</nb-title>
      </nb-body>
    </nb-header>
    <view class="content center-items">
      <view class="list-option">
        <touchable-opacity class="item-option box-shadow" v-for="(item, index) in options" :key="index"  :on-press="()=>{ return onPressItem(index)}"  :disabled="disableLive">
            <view class="left-blue"></view>
            <view class="box-text"><text class="text">{{item.name}}</text></view>
            <view class="button-right">
              <image
              :source="require('./../../../assets/images/ic_chevron_right.png')" 
              :style="{width:30, height:80}"
              resize-mode="contain"
              />
            </view>
        </touchable-opacity>
      </view>
      <quota class="marT16" @over-plan="overPlan"></quota>
    </view>
  </nb-container>
</template>
<script>
import { NavigationActions, StackActions } from 'react-navigation'
import Vue from "vue-native-core"
import { VueNativeBase ,Toast} from "native-base"
import { Dimensions } from 'react-native'
import i18n from './../../plugins/i18n'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
import Quota from './quota'
import {EventBus} from '../../plugins/eventbus'

Vue.use(VueNativeBase);


export default {
  props: {
    navigation: {
      type: Object
    }
  },
  components:{
    Quota
  },
  data: function() {
    return {
        options: [
          {
            name: i18n.t('auto_tool.from_link_video'),
          }, 
          {
            name: i18n.t('auto_tool.reaction_voting'),
          }, 
          {
            name: i18n.t('auto_tool.game_pic_word'),
          },
          {
            name: i18n.t('autolive.guess_song.title'),
          }
        ],
        disableLive:false,
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
    methods: {
        onPressItem(index) {
          switch(index){
            case 0: {
              this.navigation.navigate("AddVideoStep1");
              break;
            }
            case 1: {
              this.navigation.navigate("ReactStep1");
              break;
            }
            case 2: {
              this.navigation.navigate("GamePicturesStep1");
              break;
            }
            case 3: {
              this.navigation.navigate("GuessNameSongStep1");
              break;
            }
            default:{
              this.navigation.navigate("AddVideoStep1");
              break;
            }
          }
          
        },
        goBackHome(){
          this.navigation.goBack();
        },
        async getInforUser(){
          let data ;
          await db.collection("user").doc(this.$store.state.userInfo.id).get().then((snapshot) => {
            data = snapshot.data();
            console.log('getInforuser')
          });
        }
    },
    mounted() {
      EventBus.$on('over-plan',data=>{
        console.log('because: ',data);
        var mess = i18n.t(`livestream.error.${data}`);
        Toast.show({
            text: mess,
            buttonText: "Okay",
            duration:6000,
            type: "warning"
          });
        this.disableLive = true;
      })
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
.center-items{
  align-items: center;
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
.marT16{
  margin-top: 16;
}
</style>