<template>
    <view>
        <view class="border input center">
            <nb-picker
                note
                mode="dropdown"
                :selectedValue="targetType"
                :onValueChange="onChangeTypeBuy">
                    <item class="dark" v-for="item in targetTypeOptions"  :key="item.value"  :label="item.label" :value="item.value"/>
            </nb-picker>
        </view>
       <view class="marT10">
            <text class="h3">{{$t('fakeviews.link_post')}}</text>
            <text-input  class="border marT8 input-text" v-model="videoLink" />
        </view>
        <view class="marT10">
            <text class="h3">{{$t('fakeviews.views_num')}}</text>
            <view class="border marT8 input center">
                <nb-picker
                    note
                    mode="dropdown"
                    :selectedValue="viewsNum"
                    :onValueChange="onChangeViewNum">
                        <item class="dark" v-for="item in viewsNumOptions"  :key="item"  :label="(item +'')" :value="item"/>
                </nb-picker>
            </view>
        <view>
        <view class="marT10">
            <text class="h3">{{$t('fakeviews.duration.title')}}</text>
            <view class="border marT8 input center">
                <nb-picker
                    note
                    mode="dropdown"
                    :selectedValue="viewsDuration"
                    :onValueChange="onChangeViewDuaration">
                        <item class="dark" v-for="item in viewsDurationOptions" :label="item +' '+ $t('fakeviews.duration.'+targetType)" :value="item"/>
                </nb-picker>
            </view>
        <view>
        <view class="marT10">
            <text class="h3">{{$t('fakeviews.price')}}</text>
            <money class="marT8 bold" :value="price" :currency="$t('money.currency')" />
        <view>
        <touchable-opacity class="marT10 center center-items button-next flex" :on-press="()=>{return submit()}">
            <text class="h1 white">{{$t('buy_now')}}</text>
            <view class="marL10 center center-item"
                v-if="sending"
                :style="{justifyContent: 'center'}">
                <activity-indicator size="small" color="#FFF" />
            </view>
        </touchable-opacity>    	
    </view>
</template>
<style>

</style>
<script>
import {Alert} from 'react-native'
import Money from '../../Account/Money'
import { Picker } from "native-base"
import {EventBus} from '../../../plugins/eventbus'
import {api } from '../../../helpers'
import config from '../../../plugins/config'
 import {  Dimensions,Linking } from "react-native"

export default {
	components: {
		Money,
        Item: Picker.Item
	},
	data() {
		return {
			videoLink: '',
			viewsNum: 50,
			viewsNumOptions: [50, 100, 150, 200, 300, 500, 700, 1000, 1500],
			viewsDuration: 1,
			viewsDurationOptions: [1,2,3,4,5,6],
			targetType: 'post',
			targetTypeOptions: [{
				label: this.$t("fakeviews.month"),
				value: 'month'
			}, {
				label: this.$t("fakeviews.post"),
				value: 'post'
			}],
            sending:false
		}
	},
	computed: {
		price: function() {
			if ( this.targetType=='month' ) {
				return 2500*this.viewsNum*this.viewsDuration ;
			} else {
				return 13*60*this.viewsNum*this.viewsDuration;
			}
		}
	},
	methods: {
		submit() {
			if ( this.videoLink.indexOf("facebook.com/")==-1 || 
					(this.targetType=='post' && this.videoLink.indexOf("/videos/")==-1) ) {
				Alert.alert(this.$t('fakeviews.wrong_link'));
				return;
			}
            const data = {
				type: this.targetType,
				link: this.videoLink,
				views: this.viewsNum,
				duration: this.viewsDuration,
				price: this.price
            };
            this.createTransaction(data) ;

        },
        createTransaction(data) {
			this.loading = true;
			api("views", {
				...data
			}).then(res => {
				this.loading = false;
				if ( res.id ){
                    let url = config.domain+ `/app/charge/vnd:${data.price}:fakeviews-${res.id}`;
                    Linking.canOpenURL(url).then(supported => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        console.log("Don't know how to open URI: ");
                    }
                    });
                }
				else alert("error")
			})
			
			console.log('submit', data)
		},
        onChangeTypeBuy(value){
            this.targetType = value
        },
        onChangeViewNum(value){
            this.viewsNum = value
        },
        onChangeViewDuaration(value){
             this.viewsDuration = value
        },
        
	}
}
</script>
<style>
.container{
    background-color: #F5F8FA;
    padding: 10;
}
.flex{
  flex-direction: row;
}
.h1{
  font-size: 16;
  color: #282B34;
}
.h3{
    font-size: 14;
}
.h5{
    font-size:12;
}
.bold{
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
.shadow {
  shadow-color: black;
  shadow-opacity: 0.15;
  shadow-radius: 2
}
.dark{
  color: #606266
}
.primary{
    color:#409eff
}
.red{
    color:red
}
.center{
  justify-content: center;
  align-content:center;
}
.center-items {
    align-items: center;
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
.red{
    color: red
}
.max-width{
    width: 100%;
}

.text-center{
    text-align: center;
}

.white{
    color: #FFF;
}

.bg-blue{
    background-color: #0091FF;
}

.content {
    padding: 10;
}

.item-box {
    margin: 10;
}
.input-text{
    background-color: #FFF;
    height: 40;
    padding-left:16;
}
.input{
    background-color:#FFF;
    height: 40;
}
.bg-white{
    background-color:white;
}
.w70{
    width: 70%
}
.w30{
    width: 30%
}

.marT10{
    margin-top:10;
}
.marL10{
    margin-left:10;
}
.padL16{
    padding-left:16;
}
.marB10{
    margin-bottom:10;
}
.marT8{
    margin-top:8;
}

.flex{
    flex-direction: row;
}
.text-center {
    text-align: center;
}

.bold {
    font-weight: bold;
}
.white{
    color:#fff;
}

.border{
    border-width: 1;
    border-color: #E7EBEE;
    border-radius: 4;
}

.absolute{
    position: absolute;
}

.button-next {
    padding: 10;
    height: 50;
    border-radius: 4;
    background-color: #0091FF;
    justify-content: center;
    width:120;
    margin-bottom:16;
}

</style>