<template>
    <GestureRecognizer
        :onSwipeUp="()=>{return onSwipeUp()}"
        :config="configSwipe"
        :style="{ flex: 1 }">
        <view class="container">
            <nb-header>
                <nb-body class="flex center-items">
                    <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                        <nb-icon name="arrow-back" :style="{color:'white'}" />
                    </touchable-opacity>
                    <nb-title class="marL16 white">{{$i18n.t('history.menu.timer')}}</nb-title>
                </nb-body>
            </nb-header>
            <scroll-view :showsVerticalScrollIndicator="false">
                <ShimmerPlaceHolder  :autoRun="true" :visible="isReadly" :width="1000" :height="1000">
                    <view class="box-list-stream" v-if="(typeof streams !== 'undefined' && streams.length > 0)">
                        <stream-item-list v-for="stream in streams" :data="stream"/>
                    </view>
                </ShimmerPlaceHolder>
            </scroll-view>
            <text class="primary text-center" v-else>{{$i18n.t('history.no_stream')}}</text>
        </view>
    </GestureRecognizer>     
</template>
<script>
    import i18n from '../../plugins/i18n'
    import { api } from '../../helpers'
    import {EventBus} from '../../plugins/eventbus'
    import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
    import StreamItemList from './StreamItemList'
    import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
     import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {
            ShimmerPlaceHolder,
            StreamItemList,
            GestureRecognizer
            
        },
        computed: {
            statusBarHeight() {
                if(isIphoneX()){
                    console.log('')
                    return getStatusBarHeight()+3;
                }else{
                    return 0;
                }
            },
        },
        data: function() {
            return {
                isReadly: false,
                histories: [],
                streams:[],
                isLoading:false,
                configSwipe :{
                    velocityThreshold: 0.4,
                    directionalOffsetThreshold: 100
                },
            };
        },
        computed: {
            statusBarHeight() {
                if(isIphoneX()){
                    return getStatusBarHeight()+3;
                }else{
                    return 0;
                }
                
            },
            screenHeight() {
                return Math.round(Dimensions.get('window').height);
            },
            getBottomSpaceIpX(){
                return getBottomSpace();
            }

        },
        methods: {
            tabClick: function(tab, event) {
                const tab_map = ['', 2, 5, 4];
                const index = parseInt(tab.index, 10);
                this.loadStream(tab_map[index]);
            },
            loadStream: function(status='') {
                let url = 'stream';
                if ( status!='' ) url += '?status='+status;
                this.loading = true;
                api(url).then(data => {
                    this.streams = data;
                    console.log('this.streams:  ', this.streams)
                    this.isLoading = false;
                    this.isReadly = true;
                });
            },
            onPressItem(index){
                switch(index){
                    case 0:{
                        this.isReadly= false;
                        this.loadStream(5);
                        break;
                    }
                    case 1:{
                        this.navigation.navigate("HistoryPlaying")
                        break;
                    }
                    case 2:{
                        this.navigation.navigate("HistoryTimer")
                        break;
                    }
                    case 3:{
                        this.navigation.navigate("HistoryEnded")
                        break;
                    }
                }
            },
            onSwipeUp(gestureState) {
                this.isReadly= false;
                this.loadStream(5);
            },
            goBack() {
                this.navigation.goBack();
            },
        },
        mounted() {
            this.loadStream(5);
            EventBus.$on('detail-stream', data => {
                this.navigation.navigate("DetailsStream",{data:data})
            });
        },
    };
</script>
<style>
    .container {
        height: 100%;
    }
    
    .header {
        width: 100%;
        background-color: white;
        border-color: #D7D9E0;
        border-width: 1;
        height: 50;
        padding-left: 10;
        padding-right: 10;
    }
    
    .head-statusbar{
        background-color: #222230;
        color:white;
        opacity: 0.7;
    }
    .flex {
        flex-direction: row;
    }
    
    .h1 {
        font-size: 18;
        color: #282B34;
    }
    
    .text-bold {
        font-weight: bold
    }
    
    .text-center {
        text-align: center
    }
    
    .w20 {
        width: 20%;
    }
    
    .w60 {
        width: 60%;
    }
    
    .w100 {
        width: 100%;
    }
     .marL16{
        margin-left:16;
    }
    .shadow {
        shadow-color: black;
        shadow-opacity: 0.15;
        shadow-radius: 2
    }
    
    .dark {
        color: #282B34
    }
    
    .white {
        color: white;
    }
    
    .primary {
        color: #0091FF;
    }
    
    .center {
        justify-content: center;
        align-content: center;
    }
    
    .center-item {
        align-items: center
    }
    
    .menu-top {
        height: 50;
        background-color: #fff;
        padding-left: 16;
        padding-right: 16;
        padding-top:3;
        padding-bottom:3;
        margin-top:10;
    }
    
    .item-menu {
        margin-right: 10;
        padding:8;
        width:25%;
    }
    .box-list-stream{
        margin-top:8;
        height:80%;
        padding:10;
    }
</style>