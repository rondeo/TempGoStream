<template>
	<LinearGradient class="max"
		:start="{x: 0.1, y: 0.1}" :end="{x: 1, y: 1}"
		:locations="[0,0.5,0.6]"
		:colors="['#D1EBFF', '#D1EBFF', 'rgba(230, 244, 255, 0)']">
			<view class="container">
				<view class="slogan">
					<text class="h1 dark letter-spacing">{{$t('home.slogan_p1')}}</text>
					<text class="h1 dark letter-spacing">{{$t('home.slogan_p2')}}</text>
				</view>
				<view class="list center center-items">
					<!--<scroll-view :showsVerticalScrollIndicator="false">-->
						<view class="box-shadow" :style="{shadowOffset:{width:2,height:10}}"
								v-for="(item, index) in listServices" :key="index">
							<touchable-opacity class="item-service center center-items"
									:on-press="()=> { return servicePress(index) }"  v-if="!item.positionIsLeft" >
								<view class="service-text">
									<text class="service-text-title">{{$i18n.t('home.'+item.title)}}</text>
									<text class="service-text-desc" :numberOfLines="3">{{$i18n.t('home.'+item.desc)}}</text>
								</view>
								<view class="service-img"> 
									<image
									:source="item.imgSrc"
									:style="{width:'90%',height:'90%'}" resize-mode="cover"
									/>
								</view>
							</touchable-opacity>
							<touchable-opacity class="item-service" :on-press="()=> { return servicePress(index) }"  v-else >
								<view class="service-img"> 
									<image
									:source="item.imgSrc"
									:style="{width:'90%', height:'90%'}" resize-mode="cover"
									/>
								</view>
								<view class="service-text">
									<text class="service-text-title">{{$i18n.t('home.'+item.title)}}</text>
									<text class="service-text-desc">{{$i18n.t('home.'+item.desc)}}</text>
								</view>
							</touchable-opacity>
						</view>
					<!--</scroll-view>-->
				</view>
			</view
	</LinearGradient>
</template>
<script>
import {Dimensions, Image} from "react-native"
import { StackNavigator } from "vue-native-router"
import LinearGradient from 'react-native-linear-gradient'
import i18n from './../../plugins/i18n'
import {EventBus} from '../../plugins/eventbus'


export default {
	components: {LinearGradient },
	props: {
		navigation: {
			type: Object
		}
  	},
	data: function() {
		return {
			lang: this.$store.state.language,
			listServices:[
				{
					title:'automatic',
					desc:'des_automatic',
					imgSrc:require('./../../../assets/images/home_tab_item1.png'),
					positionIsLeft: false
				},
				// {
				// 	title: 'home.real_live',
				// 	desc: 'home.des_real_live',
				// 	imgSrc:require('./../../../assets/images/home_tab_item2.png'),
				// 	positionIsLeft: true
				// },
				{
					title: 'marketing_tool',
					desc: 'des_marketing',
					imgSrc:require('./../../../assets/images/home_tab_item3.png'),
					positionIsLeft: false
				}
			],
		};
	},
	methods: {
		servicePress(index) {
			switch(index){
				case 0 : {
					this.navigation.navigate("AutomaticLive");
					break;
				}
				case 1:{
					this.navigation.navigate("MarketingToolsMain");
					break;
				}
				case 2:{
					this.navigation.navigate("MarketingToolsMain");
					break;
				}
				default:{
					this.navigation.navigate("AutomaticLive");
					break;
				}
			}
		}
	},
	computed: {
		screenHeight() {
			return Math.round(Dimensions.get('window').height);
		},
		itemHeight(){
			return Math.round(this.screenHeight- 50)/4;
		}
	},
	mounted() {
		EventBus.$on('link-to-upgrade',data =>{
			this.navigation.navigate('UpgradeAcc')
		});
	},
	beforeCreate() {
	}
};
</script>
<style scoped>
.max{
	width:100%;
	height:100%;
}
.container{
	margin-top:20;
}
.center{
	justify-content: center;
	align-content: center;
}
.center-items{
	align-items: center;
}
.slogan{
	margin:16;
}
.letter-spacing{
	letter-spacing: 2;
}
.h1{
	font-size:30
}

.list{
	padding: 10;
	max-height:360;
}
.item-service{
	background-color: white;
	border-radius: 6;
	padding: 10;
	margin-bottom:10;
	flex-direction: row;
	max-height:135;
}

.service-text{
	width: 50%;
	margin-left: 3
}
.service-text-title{
	font-size: 15;
	font-weight: bold;
	color: #282B34; 
}
.service-text-desc{
	font-size: 12;
	line-height:20;
	color: #9B9FAC;
}
.service-img{
	width: 50%;
	height:100%
}
.dark{
	color:#282B34;
}
.bold{
	font-weight:bold;
}
</style>
