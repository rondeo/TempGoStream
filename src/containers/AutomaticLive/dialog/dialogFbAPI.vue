<template>
	<view class="mask center alignItems" :style="{height}">
		<view class="dialog-content" v-bind:style= "[keyboardVisible ? { bottom:keyboardHeight} : {top:40}]">
			<text class="h3">{{$i18n.t('linked_account.title')}}</text>
			<view class="box-item">
				<text class="label">{{$i18n.t('seclect_account')}}</text>
				<nb-form>
					<nb-picker
					mode="dropdown"
					iosHeader="Accounts"
					:selectedValue="account"
					:onValueChange="onChangeAccount"
					placeholder="Choose a account">
					<item v-for="acc in accounts" :key="acc.access_token" :label="acc.userFullname" :value="acc.id" />
					</nb-picker>
                    <view class="absolute center align-item-center"
                        v-if="accountLoading"
                        :style="{flex: 1, justifyContent: 'center'}">
                        <activity-indicator size="small" color="#0091FF" />
                    </view>
				</nb-form>
				<text class="right label blue marTop10">{{$i18n.t('add_more_fb_account')}}</text>
			</view>
			<view class="box-item">
				<text class="label">{{$i18n.t('target')}}</text>
				<nb-form>
					<nb-picker
                        mode="dropdown"
                        iosHeader="Targets"
                        :selectedValue="target"
                        :onValueChange="onChangeTarget"
                        placeholder="Target">
					<item v-for="target in targets" :key="target.id" :label="target.name" :value="target.id" />
					</nb-picker>
                    <view class="absolute center align-item-center"
                        v-if="targetLoading"
                        :style="{flex: 1, justifyContent: 'center'}">
                        <activity-indicator size="small" color="#0091FF" />
                    </view>
				</nb-form>
			</view>
			<view class="marTop20 flex">
				<nb-checkbox class="marR16"  :checked="continuous" :on-press="changeCheck" />
				<nb-text class="label gray">{{$i18n.t('auto_tool.live_continuos')}}</nb-text>
			</view>
			<view class="box-item marTop10">
				<text class="label">{{$i18n.t('caption')}}</text>
					<nb-textarea  class="border" :rowSpan="5" :placeholder="$i18n.t('caption_live')" :value="caption" 
                    :onChangeText="(text)=>{return changeCaption(text)}"/>
			</view>
			<view class="box-item marTop10 flex">
				<touchable-opacity class="btn-unactive border center" :on-press="close">
					<text class="h4 gray text-center">{{$i18n.t('cancel')}}</text>
				</touchable-opacity>  
				<touchable-opacity class="btn-active border center" :on-press="onAddStream">
					<text class="h4 white text-center">{{$i18n.t('add_stream')}}</text>
				</touchable-opacity>  
			</view>
		</view>
	</view>
</template>
<script>
    import React from "react";
    import {Dimensions,Keyboard} from "react-native";
    import { Picker, Icon} from "native-base";
    import i18n from '../../../plugins/i18n'
    import { EventBus } from '../../../plugins/eventbus';
    import {db}  from '../../../plugins/firebase'
    import {getAvatar,api} from '../../../helpers'

    export default {
        props: ['close', 'visible','accountType', 'targetType', 'onlyApp'],
        components: {Item: Picker.Item },
        data() {
            return {
                keyboardVisible: false,
			    keyboardHeight: 0,
                accountLoading: false,
                targetLoading: false,
                accounts: [],
                targets: [],
                account: '',
                target: '',
                destination:{},
                continuous: false,
                caption: '',
                
            }
        },
        computed: {
            height(){
                return Math.round(Dimensions.get('window').height)
            }
        },
        methods: {
            onChangeAccount: function(newAccount) {
                this.account = newAccount;
            },
            onChangeTarget(newTarget){
                this.target= newTarget;
            },
            getIosIcon: function() {
                return <Icon name = "arrow-dropdown" /> ;
            },
            changeCheck(){
                this.continuous = !this.continuous;
            },
            changeCaption(newcaption){
                this.caption = newcaption
            },
            currentAccount: function(account_id=null) {
                account_id = account_id || this.account;
                for ( let i=0; i<this.accounts.length; i++ ) {
                    if ( this.accounts[i].id===account_id ) {
                        return this.accounts[i];
                    }
                }
                return null;
            },
            currentTarget: function(target_id) {
                for ( let i=0; i<this.targets.length; i++ ) {
                    if ( this.targets[i].id==target_id ) {
                        return this.targets[i];
                    }
                }
                return null;
            },
            loadAccount() {
                this.accountLoading = true;
                this.account = '';
                this.getLinkedAccount(this.accountType, this.onlyApp).then(data => {
                    if ( data.length==0 ) return;
                    this.accounts = data;
                    this.account = data[0].id;
                }).finally(() => {
                    this.accountLoading = false;
                });
            },
            getLinkedAccount: async function(accountType='', onlyApp='') {
                const userId = this.$store.state.userInfo.id;
                let dataRef = db.collection("linked_account").where("gs_uid", "==", userId);
                if ( accountType.length ) dataRef = dataRef.where("app.type", "==", this.accountType);
                return dataRef.get().then((querySnapshot) => {
                    let tableData = [];
                    querySnapshot.forEach(function(doc) {
                        const data = doc.data();
                        if ( onlyApp.length==0 || onlyApp.indexOf(data.app.id)>=0 )
                            tableData.push({
                                id: doc.id,
                                access_token: data.access_token,
                                app : {
                                    name: data.app.name,
                                    type: data.app.type,
                                    id: data.app.id
                                },
                                userFullname : data.name,
                                avatar: getAvatar(data.app.type, data.id)
                            });
                    });
                    return tableData;
                });
            },
            getTarget: async function(token, targetType='') {
                
                return targets;
            },
            onAddStream(){
                this.destination={
                    account:this.currentAccount(),
                    target:this.currentTarget(this.target),
                    caption:this.caption,
                    continuous:this.continuous ? 1 : 0
                }
                EventBus.$emit('destination', {
                    destination :this.destination
                });
                EventBus.$emit('on-add-stream', {closedialog:true});
            },
           
        },
        created() {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                this.keyboardVisible = true;
                this.keyboardHeight = e.endCoordinates.height;
            });
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                this.keyboardVisible = false;
            });
        },
        beforeDestroy() {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        },
       watch: {
		account: function (account_id) {
			const account = this.currentAccount();
			if ( account ) {
				this.targetLoading = true;
				api(`${account.app.type}/targets?target_type=${this.targetType || ''}&access_token=${account.access_token}`)
				.then(data => {
					let targets = [];
					for ( let target_type in data ) {
						for ( let i=0; i<data[target_type].length; i++ ) {
							targets.push({
								type: target_type,
								...data[target_type][i]
							});
						}
					}
                    this.targets = targets;
                    for(let i = 0; i < this.targets.length;i++){
                        target= targets[i];
                        if(target.type =='group') target.name= i18n.t('autolive.group')+' '+ target.name  ;
                        if(target.type =='fanpage') target.name= i18n.t('autolive.page')+' '+ target.name  ; 
                    }
                    if (targets && targets[0].id)
					    this.target = targets[0].id;
				}).finally(() => {
					this.targetLoading = false;
				});
			}
		},
		target: function(target_id) {
			// this.$emit('change', {
			// 	account: this.currentAccount(),
			// 	target: this.currentTarget()
            // })
           /// console.log('target_id',target_id)
		},
	},
    mounted() {
        this.loadAccount();
        // if(this.account == '' ) 
        //     alert("You need add account facebook to use this furture")
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
    
     .alignItems{
        align-items:center
    }
    .center {
        align-content: center;
        justify-content:center;
    }
    .absolute{
        position: absolute;
        right: 8;
        top:8
    }
    .align-item-center{
        align-items:center
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
        position:absolute;
        width: 90%;
        background-color: white;
        border-radius: 4;
        padding-top: 10;
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
    .text-center{
         text-align: center;
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
        font-size: 14;
    }
    
    .label {
        color: #9B9FAC;
        font-size: 12;
        margin-bottom: 8;
    }
    
    .box-item {
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
    
    .marR16 {
        margin-right: 16;
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