<template>
    <nb-container class="container">
        <view class="header flex">
            <touchable-opacity class="w20 center" :on-press="()=>{return goBack()}">
                <nb-icon class="dark" name="close" />
            </touchable-opacity>
            <view class="w60 center"><text class="text-center h3 blue">{{$i18n.t('affiliate.transaction_history')}}</text></view>
        </view>
        <view class="content"> 
            <text class="red" v-if="isEmptyTran">{{$i18n.t('affiliate.you_not_had_trans')}}</text>
            <view v-else>
            </view>
        </view>
  </nb-container>
</template>

<script>
import React from "react";
import { Picker, Icon } from "native-base";
import i18n from './../../plugins/i18n'


    export default {
        components:{
            
        },
        props: {
            navigation: {
                type: Object
            }
        },
        data() {
            return {
                dataTransactions:[],
                isEmptyTran:false,// default true. in debug so set false,
                columns : [
                    {
                        title: 'Date',
                        dataIndex: 'date',
                        width: 105
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        width: 140
                    },
                    {
                        title: 'Adress',
                        dataIndex: 'address'
                    }
                ],
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            getParam(){
                this.dataTransactions = this.navigation.getParam('dataTransactions',null)
                if(this.dataTransactions.lenght > 0)
                    this.isEmptyTran = false;
                console.log('dataTransactions', this.dataTransactions)
            },
        },
        mounted() {
            this.getParam();            
        },
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
.h1{
  font-size: 18;
  color: #282B34;
}
.h3{
  font-size: 14;
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
    color:red;
}
.content {
    text-align: left;
    padding: 10;
    background-color: #F5F8FA;
    height: 100%;
}

.marT10{
    margin-top: 10;
}
.label {
    color: #9B9FAC;
    font-size: 12;
    margin-bottom: 8;
    text-align: left;
}
.input {
    width: 100%;
    height: 50;
    background-color: #FFFFFF;
    border-radius: 2;
    border-width: 1;
    padding-left: 10;
    border-color: #E7EBEE;
}
.left{
    width: 85%;
    justify-content: center;
    padding-left: 10;
}
.right{
    width: 15%;
    justify-content: center;
    background-color: #0091FF;
    align-items: center;
    border-top-right-radius: 2;
    border-bottom-right-radius:2; 
}

.img{
    padding: 10;
    border-top-left-radius: 2;
    border-bottom-right-radius: 2;
}
.text-normal{
    color: #5B5F6D;
    text-align: left;
    font-size: 13;
    line-height: 20;
}
.text-center{
    text-align: center;
}
.text-bold{
    font-weight: bold;
}
.touch{
    width: 20%;
    justify-content: center;
    background-color: #0091FF;
    justify-content: center;
    align-content: center;
    border-top-right-radius: 2;
    border-bottom-right-radius: 2;
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
</style>