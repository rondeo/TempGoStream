<template>
<scroll-view>
    <view class="flex">
        <nb-grid>
            <nb-row v-for="(item,idx) in arrayChunk" :key="idx">
                <nb-col class="center center-items" v-for="(child, idxChild) in item" :key="idxChild">
                    <touchable-opacity class="item-box center border button marB10" 
                        :on-press="()=>{ return onClickItem(child)}">
                        <text class="h4 gray text-center">{{child.plan}}</text>
                    </touchable-opacity>
                </nb-col>   
            </nb-row>
        </nb-grid>
    </view>
</scroll-view>
</template>
<script>
    import React from "react";
    import {Dimensions} from "react-native";
    import { Picker, Icon } from "native-base";
    import i18n from '../../plugins/i18n'
    import {EventBus} from '../../plugins/eventbus'
    import {chunk} from '../../helpers/handler'

    export default {
        props: ['data'],
        components: {},
        data() {
            return {
                height: Math.round(Dimensions.get('window').height),
                arrayChunk:[],
            }
        },
        computed: {
        },
        methods: {
            onClickItem(child){
                EventBus.$emit('on-click-item-available-code', {
                    item : child
                });
            }
        },
        mounted() {
            this.arrayChunk = chunk(this.data,2);
        },
        watch: {
            available(){

            }
        },
    }
</script>
<style>
    .center {
        align-items: center;
        justify-content: center;
    }
    .center-items{
        align-content:center;
    }
    .flex {
        flex-direction: row;
    }
    .item-box {
        height: 40;
        padding-left: 10;
        background-color:#F5F8FA
    }
    .white {
        color: white;
    }
    .border {
        border-radius: 4;
        border-width: 1;
        border-color: #dcdfe6;
    }
     .button {
        width: 100;
        height: 40;
        padding-top: 8;
        padding-bottom: 8;
        padding-left: 16;
        padding-right: 16;
    }
    .marB10{
        margin-bottom:10;
    }
</style>