<template>
	<view class="mask top" :style="{height}">
		<view class="dialog-content">
			<text class="h3">Add place posted</text>
			<view class="box-item">
				<text class="label">Select account</text>
				<nb-form>
					<nb-picker
					mode="dropdown"
					iosHeader="Select your SIM"
					:iosIcon="getIosIcon()"
					:style="{ width: '100%',color:'#333',borderColor:'#E7EBEE',borderWidth:1,borderRadius:4,fontSize:13}"
					:selectedValue="selectAccount"
					:onValueChange="onValueChange"
					placeholder="Choose a account">
					<item label="Tran Van Thai Son" value="key0" />
					<item label="ATM Card" value="key1" />
					<item label="Debit Card" value="key2" />
					<item label="Credit Card" value="key3" />
					<item label="Net Banking" value="key4" />
					</nb-picker>
				</nb-form>
				<text class="right label blue marTop10">Add more Facebook account</text>
			</view>
			<view class="box-item">
				<text class="label">Place posted</text>
				<nb-form>
					<nb-picker
					mode="dropdown"
					iosHeader="Select your SIM"
					:iosIcon="getIosIcon()"
					:style="{ width: '100%',color:'#333',borderColor:'#E7EBEE',borderWidth:1,borderRadius:4,fontSize:13}"
					:selectedValue="selectAccount"
					:onValueChange="onValueChange"
					placeholder="Target">
					<item label="Gostream test" value="key0" />
					<item label="ATM Card" value="key1" />
					<item label="Debit Card" value="key2" />
					<item label="Credit Card" value="key3" />
					<item label="Net Banking" value="key4" />
					</nb-picker>
				</nb-form>
			</view>
			<view class="box-item">
				<text class="label">Caption</text>
					<nb-textarea class="border" :rowSpan="5"  placeholder="Content" />
			</view>
			<view class="box-item flex">
				<touchable-opacity class="btn-unactive border center" :on-press="close">
					<text class="h4 gray">CANCEL</text>
				</touchable-opacity>  
				<touchable-opacity class="btn-active border center">
					<text class="h4 white">ADD</text>
				</touchable-opacity>  
			</view>
		</view>
	</view>
</template>
<script>
    import React from "react";
    import {
        Dimensions
    } from "react-native";
    import {
        Picker,
        Icon
    } from "native-base";

    export default {
        props: ['close', 'visible'],
        components: {},
        data() {
            return {
                height: Math.round(Dimensions.get('window').height),
                accountVisible: false,
                selectAccount: '',
            }
        },
        computed: {
            qrcode() {
                return 'user:' + this.$store.state.userInfo.uid;
            }
        },
        methods: {
            onValueChange: function(value) {
                this.selectAccount = value;
            },
            getIosIcon: function() {
                return <Icon name = "arrow-dropdown" /> ;
            },
        },
        mounted() {
            setTimeout(() => {
                this.accountVisible = true;
            }, 500)
        }
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
        opacity: 0.95;
    }
    
    .center {
        align-content: center;
        align-items: center;
        justify-content: center;
    }
    .top{
        justify-content: flex-start;
        align-items: center;
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
        position: relative;
        padding-top: 20;
		padding-bottom: 16;
        padding-left: 8;
        padding-right: 8;
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
        font-size: 12;
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