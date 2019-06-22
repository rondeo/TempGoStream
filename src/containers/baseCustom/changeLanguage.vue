<template>
	<view class="mask center center-itemsƒ.center" :style="{height}">
		<view class="dialog-content" :style="{height:heightbox}">
			<text class="h3 dark">{{title}}</text>
			<view class="content">
				<nb-content>
                    <nb-list-item :on-press="()=>{return isSelectEN(true)}">
                        <nb-left>
                        <nb-text>English</nb-text>
                        </nb-left>
                        <nb-right>
                        <nb-radio :selected="isEN" />
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item :on-press="()=>{return isSelectEN(false)}">
                        <nb-left>
                        <nb-text>Viet Nam</nb-text>
                        </nb-left>
                        <nb-right>
                        <nb-radio :selected="!isEN"/>
                        </nb-right>
                    </nb-list-item>
                </nb-content>
			</view>
			<view class="box-item marTop20 flex">
				<touchable-opacity class="btn-unactive border center" :on-press="close">
					<text class="h4 gray">{{$i18n.t('cancel')}}</text>
				</touchable-opacity>  
				<touchable-opacity class="btn-active border center"  :on-press="() => { return saveLanguage() }">
					<text class="h4 white">OK</text>
				</touchable-opacity>  
			</view>
		</view>
	</view>
</template>
<script>
    import React from "react"
    import { Dimensions} from "react-native"
    import i18n from '../../plugins/i18n'
    import {EventBus} from '../../plugins/eventbus'
    import AsyncStorage from '@react-native-community/async-storage'

    export default {
        props: ['close','title','content','data','heightbox'],
        components: {},
        data() {
            return {
                height: Math.round(Dimensions.get('window').height),
                isEN:false,
            }
        },
        computed: {
        },
        methods: {
            isSelectEN(val){
                this.isEN = val;
                 console.log('is En', this.isEN)
            },
            async saveLanguage(){
                try {
                    let locale= "vi";
                    if(this.isEN){
                        locale = "en";
                        console.log('save EN')
                    }     
                    await AsyncStorage.setItem('@language', locale);
                    EventBus.$emit('change-language',locale);

                } catch (e) {
                    alert("Can't not change language: "+ e);
                    console.log('error when save seting language: '+ e)
                }
            },
            async getCurrentSaveLang(){
                try {
                    const value = await AsyncStorage.getItem('@language')
                    if (value !== null) {
                        if(value == "en"){
                            this.isEN = true;
                        }
                    }
                } catch (ex) {
                    console.log('Change Lang -- error when get data store lagngue: ' + ex);
                }
            }

        },
        async mounted() {
            await this.getCurrentSaveLang();
        },
    }
</script>
<style>
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 50;
        background-color: #282B34;
        opacity: 1;
    }
    
    .center {
        align-items: center;
        justify-content: center;
    }
    .center-items{
        align-items:center;
    }
    .right {
        align-items: flex-end;
        justify-content: center;
        text-align: right
    }
    
    .flex {
        flex-direction: row;
    }
    
    .marTop10 {
        margin-top: 10;
    }
    
    .marTop20 {
        margin-top: 20;
    }
    
    .dialog-content {
        width: 90%;
        background-color: white;
        border-radius: 4;
        padding-top: 20;
		padding-bottom: 16;
        padding-left: 8;
        padding-right: 8;
        position:absolute;
    }
    
    .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 50;
        height: 40;
        color: gray;
    }
    
    .close-txt {
        color: gray;
    }
    
    .title {
        font-weight: bold;
        text-align: center;
        margin-bottom: 20;
    }
    
    .border {
        border-radius: 4;
        border-width: 1;
        border-color: #E7EBEE;
        padding: 10;
    }
	.letter-space{
		letter-spacing: 2;
	}
    .bold{
		font-weight:bold;
	}
    .h3 {
        color: #282B34;
        font-weight: 300;
        font-size: 16;
        margin-bottom: 8;
        margin-left: 10;
    }
	.h4 {
        font-weight: 300;
        font-size: 14;
    }
    
    .label {
        color: #9B9FAC;
        font-size: 13;
        margin-bottom: 8;
    }
    
    .box-item {
        margin-top: 10;
        padding-left: 10;
        padding-right: 10;
    }
    
    .blue {
        color: #0091FF;
    }
    .white{
		color:#fff;
	}
    .gray {
        color: #5B5F6D;
    }
    .dark{
        color:#5B5F6D;
    }
    
    .checkbox {
        background-color: white;
        border-radius: 2;
        border-width: 1;
        border-color: #9B9FAC;
        color: #0091FF;
        margin-right: 16;
        width: 16;
        height: 16;
    }
    
    .btn-unactive {
        width: 47%;
		height:50;
        color: #9B9FAC;
        background-color: #F5F8FA;
        margin-right: 6%;
		justify-content:center;
    }
    
    .btn-active {
        width: 47%;
		height:50;
        color: #fff;
        background-color: #0091FF;
        margin-right: 10;
		justify-content:center;
    }
</style>