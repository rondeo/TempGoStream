<template>
	<view class="noselect">
		<text class="h3">{{$t('linked_account.account')}}</text>
        <view class="select-append border center-items flex">
            <view class="w85 input center">
                <nb-picker
                    mode="dropdown"
                    :selectedValue="account"
                    :onValueChange="selectAccount" >
                    <item  v-for="item in accounts" :label="item.userFullname + ' - ' + item.app.type" 
                        :value="item.id" />
                </nb-picker>
            </view>
            <view class="w15 center center-items">
                <touchable-opacity  :on-press="loadAccount">
                    <nb-icon name="refresh-circle" :style="{color:'#409eff', fontSize:30}"/>
                </touchable-opacity>
            </view>
            <view class="absolute marL10 center center-item"
                v-if="accountLoading"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="small" color="#0091FF" />
            </view>
        </view>
        <text class="h3 marT8">{{$t('linked_account.target')}}</text>
        <view class="select-append input border center-items flex">
            <nb-picker
                mode="dropdown"
                :selectedValue="target"
                :onValueChange="selectTarget" >
                <item v-for="item in targets"   :label="item.name"   :value="item.id" />
            </nb-picker>
            <view class="absolute marL10 center center-item"
                v-if="targetLoading"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="small" color="#0091FF" />
            </view>
        </view>
	</view>
</template>
<script>
    import React from 'react'
    import { auth, firebase,  db  } from '../../plugins/firebase'
    import {  ucfirst, getAvatar,  api } from '../../helpers'
    import {   Picker  } from "native-base"
    import {EventBus} from '../../plugins/eventbus'
    //import linkedAccount from '../../helpers/linked-account'

    export default {
        components: {
            Item: Picker.Item
        },
        props: ['accountType', 'targetType', 'onlyApp'],
        data() {
            return {
                accountLoading: false,
                targetLoading: false,
                accounts: [],
                targets: [],
                account: '',
                target: ''
            }
        },
        methods: {
            submit: function() {

            },
            selectAccount(value) {
                this.account = value;
                console.log('selectAccount value',value)
                // if (this.account === 'add') {
                //     document.getElementById('add_account').click();
                //     this.account = this.accounts.length ? this.accounts[0]['id'] : '';
                // }
            },
            selectTarget(value) {
                this.target = value;
                console.log('selectTarget value',value)
                // if (this.account === 'add') {
                //     document.getElementById('add_account').click();
                //     this.account = this.accounts.length ? this.accounts[0]['id'] : '';
                // }
            },
            currentAccount: function(account_id = null) {
                account_id = account_id || this.account;
                for (let i = 0; i < this.accounts.length; i++) {
                    if (this.accounts[i].id === account_id) {
                        return this.accounts[i];
                    }
                }
                return null;
            },
            currentTarget: function(target_id = null) {
                target_id = target_id || this.target;
                for (let i = 0; i < this.targets.length; i++) {
                    if (this.targets[i].id === target_id) {
                        return this.targets[i];
                    }
                }
                return null;
            },
            loadAccount: function() {
                this.accountLoading = true;
                this.account = '';
                this.getLinkedAccount(this.accountType, this.onlyApp).then(data => {
                    if (data.length == 0) return;
                    this.accounts = data;
                    this.account = data[0].id;
                }).finally(() => {
                    this.accountLoading = false;
                });
            },
            getLinkedAccount: async function(accountType = '', onlyApp = '') {
                const userId = this.$store.state.userInfo.id;
                let dataRef = db.collection("linked_account").where("gs_uid", "==", userId);
                if (accountType.length) dataRef = dataRef.where("app.type", "==", this.accountType);
                return dataRef.get().then((querySnapshot) => {
                    let tableData = [];
                    querySnapshot.forEach(function(doc) {
                        const data = doc.data();
                        if (onlyApp.length == 0 || onlyApp.indexOf(data.app.id) >= 0)
                            tableData.push({
                                id: doc.id,
                                access_token: data.access_token,
                                app: {
                                    name: data.app.name,
                                    type: data.app.type,
                                    id: data.app.id
                                },
                                userFullname: data.name,
                                avatar: getAvatar(data.app.type, data.id)
                            });
                    });
                    return tableData;
                });
            },
            getTarget: async function(token, targetType = '') {
                return targets;
            },
            getIosIcon: function() {
                return <Icon name = "arrow-down" /> ;
            },
        },
        watch: {
            account: function(account_id) {
                const account = this.currentAccount();
                if (account) {
                    this.targetLoading = true;
                    api(`${account.app.type}/targets?target_type=${this.targetType || ''}&access_token=${account.access_token}`)
                        .then(data => {
                            let targets = [];
                            for (let target_type in data) {
                                for (let i = 0; i < data[target_type].length; i++) {
                                    targets.push({
                                        type: target_type,
                                        ...data[target_type][i]
                                    });
                                }
                            }
                            this.targets = targets;
                            this.target = targets.length ? targets[0].id : '';
                        }).finally(() => {
                            this.targetLoading = false;
                        });
                }
            },
            target: function(target_id) {
                EventBus.$emit('change-selected-linked-acc', {
                    account: this.currentAccount(),
                    target: this.currentTarget()
                })
            }
        },
        mounted() {
            this.loadAccount();
        },
        // mixins: [linkedAccount],
        filters: {
            ucfirst
        }
    }
</script>
<style>
    span.type_group {
        color: green;
    }
    
    span.type_fanpage {
        color: blue;
    }
    
    span.type_event {
        color: red;
    }
    
    #add_account {
        color: #999;
    } 
    .input {
        background-color: #fff;
        padding-left: 10;
        color: #606266;
        height: 45;
    }
    
    .border {
        border-radius: 4;
        border-color: #dcdfe6;
        border-width: 1;
    }
    .select-append {
        margin-top:8;
    }
    
    .center-items {
        align-items: center;
    }
    .center{
        justify-content: center;
        align-content: center;
    }
    .right {
        align-items: flex-end;
    }
    
    .flex {
        flex-direction: row;
    }
    .w85{
        width:85%;
    }
    .w15{
        width:15%;
    }
    .marT8{
        margin-top:8
    }
    .marL10{
        margin-left:10;
    }
    .absolute{
        position:absolute;
    }
</style>