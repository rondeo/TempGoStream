<template>
    <view class="container">
        <nb-header>
            <nb-body class="flex center-item">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('account.upgrade_acc.title')}}</nb-title>
            </nb-body>
        </nb-header> 
        <view class="content center center-item">
            <scroll-view :showsVerticalScrollIndicator="false">
                <view class="plan">
                    <view class="plan-item border center center-item" v-for="item in plan" :class="`${item.name}`" >
                        <text class="white h2 bold">{{ item.name.toUpperCase()}}</text>
                        <view class="center center-item">
                            <money class="bold h1 white center" :value="item.price" />
                            <text class="white">{{ $i18n.t('money.currency') }}/{{ $i18n.t('month') }}</text>
                        </view>
                        <view class="plan-item-text"><text class="white">{{$i18n.t('plan.max_live', {value: item.max_live})}}</text></view>
                        <view class="plan-item-text"><text class="white">{{$i18n.t('plan.max_parallel', {value: item.max_parallel})}}</text></view>
                        <view class="plan-item-text"><text class="white">{{$i18n.t('plan.max_duration', {value: item.max_duration})}}</text></view>
                        <view class="plan-item-text"><text class="white">{{$i18n.t('plan.max_resolution', {value: getResolution(item.max_resolution)})}}</text></view>
                        <view class="plan-item-text"><text class="white">{{ $i18n.tc('plan.mini_game', item.mini_game) }}</text></view>
                        <view class="plan-item-text"><text class="white">{{ $i18n.tc('plan.auto_share', item.auto_share) }}</text></view>
                        <view class="plan-item-text"><text class="white">{{ $i18n.tc('plan.ranking', item.ranking) }}</text></view>
                        <view class="plan-item-text"><text class="white">{{ $i18n.tc('plan.ads', item.ads) }}</text></view>
                        <touchable-opacity class="btn-buy border center center-item" :on-press="()=>{return buy(item.name)}" v-if="(item.name != 'free')" >
                            <text class="white h3 bold">{{ $i18n.t("plan.buy_now").toUpperCase() }}</text>
                        </touchable-opacity>
                    </view>
                </view>
                <view class="attention">
                    <text class="h4 bold">{{ $t("plan.attention.title") }}</text>
                    <text>* {{$i18n.t("plan.attention.max_resolution") }}</text>
                    <text>* {{$i18n.t("plan.attention.youtube_resolution") }}</text>
                    <text>* {{$i18n.t("plan.attention.mini_game") }}</text>
                </view>
                <touchable-opacity class="btn-audit-config border center center-item marT16" :on-press="()=>{return customPlan()}">
                    <text class="white h2">{{ $i18n.t("plan.custom.title") }}</text>
                </touchable-opacity>
            </scroll-view>
            <view class="absolute center center-item"
                v-if="loading"
                :style="{flex: 1, justifyContent: 'center'}">
                <activity-indicator size="large" color="#FFF" />
            </view>
        </view>    
    </view>
</template>
<script>
    import * as RNIap from 'react-native-iap'
    import i18n from '../../plugins/i18n'
    import Vue from 'vue-native-core'
    import UUID from 'vue-uuid'
    import { Clipboard,Linking,NetInfo,Alert,Dimensions, Platform} from 'react-native'
    import {Toast } from "native-base"
    import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
    import {api,getAvatar} from '../../helpers'
    import config from '../../plugins/config'
    import user from '../../helpers/user'
    import {auth,db} from './../../plugins/firebase'
    Vue.use(UUID)
    import md5 from 'md5'
    import {EventBus} from '../../plugins/eventbus'
    import Money from '../Account/Money'
    
    const itemSkus = Platform.select({
        ios: [
            'co.godream.gostream.consume.basic.1month',
            'co.godream.gostream.consume.plus.1month',
            'co.godream.gostream.consume.pro.1month'
        ],
        android: [
            'co.godream.gostream.consume.basic.1month',
            'co.godream.gostream.consume.plus.1month',
            'co.godream.gostream.consume.pro.1month' // product
        ]
    });
    const itemSubs = Platform.select({
        ios: [
            'co.godream.gostream.nonrenew.basic.month.1', 
            'co.godream.gostream.nonrenew.pro.month.1',
            'co.godream.gostream.nonrenew.plus.month.1' 
            
        ],
        android: [
            'co.godream.gostream.nonrenew.basic.month.1', 
            'co.godream.gostream.nonrenew.pro.month.1',
            'co.godream.gostream.nonrenew.plus.month.1'  // subscription
        ],
    });
    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components:{Money},
        data() {
            return {
                loading:false,
                plan:[],
                productList: [],
                receipt: '',
                availableItemsMessage: '',
                
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            getResolution(num){
                resolutions= [480,720,1080]
                switch(num){
                    case 0:{
                        return resolutions[0]
                        break;
                    }
                    case 1:{
                        return resolutions[1]
                        break;
                    }
                    case 2:{
                        return resolutions[2]
                        break;
                    }
                }
            },
            async buy(name){
                switch(name){
                    case 'basic': {
                        await this.getSubscriptions();
                        if(this.productList && this.productList.length >0 ){
                            this.buySubscription(this.productList[0].productId);
                        }
                        break;
                    }
                    case 'plus': {
                        await this.getSubscriptions();
                        if(this.productList && this.productList.length >0 ){
                            this.buySubscription(this.productList[1].productId);
                        }
                        break;
                    }
                    case 'marketing': {
                        await this.getSubscriptions();
                        if(this.productList && this.productList.length >0 ){
                            this.buySubscription(this.productList[2].productId);
                        }
                        break;
                        break;
                    }
                }
            },
            customPlan(){
                const url = config.domain+'/app/plan/custom';
                Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    alert("Don't know how to open URI: ");
                }
                });
            },
            async getProducts() {
                try {
                const products = await RNIap.getProducts(itemSkus);
                this.productList = products;
                } catch (err) {
                console.log(err.code, err.message);
                }
            },
            async buyProduct(sku) {
                try {
                const purchase = await RNIap.buyProduct(sku);
                this.receipt= purchase.transactionReceipt ;
                this.getTransaction(this.receipt);
                } catch (err) {
                console.log(err.code, err.message);
                const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async(purchase) => {
                    this.receipt=purchase.transactionReceipt ;
                    this.getTransaction(this.receipt);
                    subscription.remove();
                });
                }
            },
            async buySubscription(sku){
                try {
                    const purchase = await RNIap.buySubscription(sku);
                    console.log(purchase);
                    this.receipt=purchase.transactionReceipt;
                    this.getTransaction(this.receipt);
                } catch (err) {
                console.log(err.code, err.message);
                Alert.alert(err.message);
                }
            },
            async getSubscriptions () {
                try {
                const products = await RNIap.getSubscriptions(itemSubs);
                this.productList= products;
                console.log('productList', this.productList)
                } catch (err) {
                console.log(err.code, err.message);
                }
            },
            async getAvailablePurchases(){
                try {
                console.log('Get available purchases (non-consumable or unconsumed consumable)');
                const purchases = await RNIap.getAvailablePurchases();
                console.log('Available purchases :: ', purchases);
                if (purchases && purchases.length > 0) {
                    this.availableItemsMessage= `Got ${purchases.length} items.`;
                    this.receipt= purchases[0].transactionReceipt;
                }
                } catch (err) {
                console.log(err.code, err.message);
                Alert.alert(err.message);
                }
            },
            async getTransaction(receipt){
                console.log('this.receipt:  ',receipt);
                const result=  await api('transaction/android', { 'receipt':receipt });
                console.log('result getTransaction: ',result );
                if(result && result.transaction_id){
                    EventBus.$emit('pay-plan-success','success');
                    this.goBack();
                }else{
                }
            }
            
        },
        async mounted() {
            this.loading = true;
            await db.collection("plan").where("special", "==", 1).orderBy("price").limit(4).get().then(querySnapshot => {
                let plans = [];
                querySnapshot.forEach(function(doc) {
                    let data = doc.data();
                    data['name'] = doc.id;
                    plans.push(data);
                });
                this.plan = plans;
            }).finally(() => {
                this.loading = false;
            });
            const result =RNIap.initConnection();
        },
       
    }
</script>
<style>
    .container {
        width: 100%;
        height: 100%;
        background-color: #F5F8FA;
    }
    .content {
        padding:10;
        height:90%;
    }
    .absolute{
        position: absolute;
    }
    .flex {
        flex-direction: row;
    }
    
    .center {
        justify-content: center;
        align-content: center;
    }
    .center-item{
        align-items: center;
    }
    .box {
        padding-top:10;
        padding-bottom:10;
        padding-left: 10;
        padding-right: 10;
        margin-bottom: 10;
    }
    
    .border {
        border-radius: 4;
        border-color: #E7EBEE;
        border-width:1;
    }
    
    .h1 {
        font-size: 24;
    }
    .h2{
        font-size:16;
    }
    .h3 {
        font-size: 14;
    }
    .w20{
        width: 20%;
    }
    .w60{
        width: 60%;
    }
    .white {
        color: white;
    }
    .blue{
        color:#0091FF
    }
    .gray {
        color: #A9A9A9;
    }
    .dark{
        color:#333;
    }
    .marB16{
        margin-bottom:16;
    }
    .marT16{
        margin-top:16;
    }
    .marT10{
        margin-top:10;
    }
    .marL16{
        margin-left:16;
    }
    .w100{
        width: 100%;
    }
    .text-center{
        text-align:center;
    }
    .text-left{
        text-align:left;
    }
    .text-right{
        text-align: right;
    }
    .bold{
        font-weight:bold;
    }
    .input-from{
        padding-left: 10;
        padding-right: 10;
        width:100%;
        height:40;
        background-color:white;
    }
    .button {
        padding: 10;
        width: 100%;
        border-radius: 1;
        height:45;
        background-color: #0091FF;
    }
    .button-coppy{
        padding: 10;
        width: 50%;
        border-radius: 1;
        height:45;
        background-color: white;
    }
    .icon-type-acc{
        bottom:0;
        right:0;
    }
    .item-linked{
        height:80;
        background-color:#ebeef5;
    }
    .padL10{
        padding-left:10;
    }
    .w20{
        width:20%
    }
     .w70{
        width:70%
    }
     .w10{
        width:10%
    }
    .list-linked-acc{
       height:70%
    }
    .footer{
        height:70;
        padding:10;
        background-color: #F5F8FA;
    }
    .item-menu{
        width:30%;
        padding:6;
        background-color: #fff;
        margin:3%;
    }
    .plan{
        padding:10;
    }
    .plan-item{
        padding:10;
        margin-bottom:10;
    }
    .plan-item-text{
        border-top-color: #F0F8FF;
        border-top-width: 1;
        width:100%;
        padding:6;
        height:35;
        text-align:center;
        color: #FFF;
        align-content: center;
        align-items: center;
        justify-content: center;
        margin-top: 10;
    }
    .free{
        background-color: #9B9FAC;
    }
    .basic{
        background-color: #3EBC63;
    }
    .plus{
        background-color: #558DEA;
    }
    .marketing{
        background-color: #ED5C4D;
    }
    .btn-buy {
        margin-top: 20;
        color: #fff;
        opacity: 0.8;
        width: 80%;
        padding:8;
        height:50;
    }
    .attention{
        padding:10;
    }
    .btn-audit-config{
        background-color:#0091FF;
        height:50;
        padding-top:8;
        padding-bottom:8;
        padding-left:16;
        padding-right:16;
    }
</style>