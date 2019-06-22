<template>
  <view>
    <view class="container"> 
      <scroll-view :showsVerticalScrollIndicator="false">
        <view class="center">
            <view class="marB10"><text class="h2 gray">{{$i18n.t('affiliate.guide')}}</text></view>
            <view class="box border center">
              <text class="marB10">{{$i18n.t('giftcode.note1')}}</text>
              <text class="marB10">{{$i18n.t('giftcode.note2')}}</text>
              <text class="marB10">{{$i18n.t('giftcode.note3')}}</text>
            </view>
            <view class="marB10"><text class="h2 gray">{{$i18n.t('buy_now')}}</text></view>
            <view class="box center border">
                <view class="marB10">
                    <text class="h4 gray marB6">{{$i18n.t('giftcode.details.plan')}}</text>
                    <view class="box-input center gray border"><text-input v-model="plan"/></view>
                </view>
                <view class="marB10">
                    <text class="h4 gray marB6">{{$i18n.t('giftcode.details.amount')}}</text>
                    <view class="box-input center gray border"><text-input v-model="quantityChar" :keyboardType="'numeric'" /></view>
                </view>
                <touchable-opacity class="box-input center border button bg-btn marB10" :on-press="check">
                    <text class="h4 gray text-center primary">{{$i18n.t('giftcode.check')}}</text>
                </touchable-opacity>
                <view class="absolute center-item"
                    v-if="loading"
                    :style="{flex: 1, justifyContent: 'center'}">
                    <activity-indicator size="small" color="#0091FF" />
                </view>
                <view v-if="(detail.unit_price)">
                    <view class="marB6 flex">
                        <text class="h4 dark">{{$i18n.t('giftcode.unit_price')}}:</text>
                        <money :value="detail.unit_price" :currency="$i18n.t('money.currency')"/>
                    </view>
                    <view class="marB6 flex">
                        <text class="h4 dark">{{$i18n.t('giftcode.listed_price')}}:</text>
                        <money :lineThrough="1" :value="detail.price" :currency="$i18n.t('money.currency')"/>
                    </view>
                    <text class="h4 dark">{{$i18n.t('giftcode.promotion_price')}}:</text>
                    <view class="marB10 flex">
                        <money class="bold" :value="detail.promo_price" :currency="$i18n.t('money.currency')"/>
                        <text>(-{{ detail.discount }}%)</text>
                    </view>
                    <touchable-opacity class="marB10 box-input center border button bg-primary"
                        :on-press="buyNow">
                        <text class="h4 white text-center">{{$i18n.t('buy_now')}}</text>
                    </touchable-opacity>
                </view>
            </view>
            <view class="marB10 maxWidth flex">
              <text class="h2 gray">{{$i18n.t('giftcode.code_available')}}</text>
              <touchable-opacity class="rightItem">
                <text class="h4 blue text-center">{{$i18n.t('giftcode.download')}}</text>
              </touchable-opacity>
            </view>
            <view class="box border center flex">
              <available-code :data="available" v-if="showCode"/>
            </view>
            <view class="marB10 maxWidth flex">
              <text class="h2 gray">{{$i18n.t('giftcode.code_used')}}</text>
              <touchable-opacity class="rightItem">
                <text class="h4 blue text-center">{{$i18n.t('giftcode.download')}}</text>
              </touchable-opacity>
            </view>
            <view class="box border center flex">
                <used-code :data="used_code"/>
            </view>
        </view>
      </scroll-view>
    </view>
    <dlog-detail-code v-if="(diaLogDetailCode.visiable)"
          :title="diaLogDetailCode.title" 
          :content="diaLogDetailCode.content"
          :close="() => { diaLogDetailCode.visiable=false }"/>
  </view>
</template>
<script>
    import i18n from './../../plugins/i18n'
    import DlogDetailCode from '../baseCustom/alertBase'
    import config from '../../plugins/config'
    import { db } from '../../plugins/firebase'
    import {EventBus} from '../../plugins/eventbus'
    import {  api, generalCatch } from '../../helpers'
    import { formatDate } from '../../helpers/handler'
    import Money from '../Account/Money'
    import AvailableCode from './AvailableCode'
    import UsedCode from './UsedCode'

    export default {
        components: {
            DlogDetailCode,Money,AvailableCode,UsedCode
        },
        data: function() {
            return {
                diaLogDetailCode: {},
                plan: 'basic',
                quantity: 25,
                quantityChar: '25',
                available: [],
                used_code: [],
                loading: false,
                showCode:false,
                detail: {},
                detail_code: {},
            };
        },
        methods: {
            coppyCode(item) {
                alert(item.code)
            },
            buyCodeDialog() {
                alert('Buy code Ok')
            },
            async check() {
                this.loading = true;
                return api(`giftcode?plan=${this.plan}&quantity=${this.quantity}`).then(res => {
                    this.loading = false;
                    if (res.price) {
                        this.detail = res;
                        return res;
                    } else {
                        let  message= i18n.t("giftcode.plan_not_found");
                        alert(message);
                        throw {
                            error: "no_plan"
                        }
                    }
                });
            },
            async getCodeByStatus(status) {
                return db.collection("giftcode").where("status", "==", status)
                    .where("gs_uid", "==", this.$store.state.userInfo.id).limit(18).get().then(snapshot => {
                        let available = [];
                        if (snapshot.size) {
                            snapshot.forEach(doc => {
                                available.push({...doc.data(),
                                    id: doc.id
                                })
                            })
                        }
                        return available;
                    });
            },
            async loadGiftCode() {
                this.loading = true;
                this.available = await this.getCodeByStatus(0);
                this.used_code = await this.getCodeByStatus(1);
                this.loading = false;
                this.showCode = true;
                console.log('Gidtcode code used_code', this.used_code);
            },
            showCode(item) {
                this.detail_code = item;
                this.dialogVisible = true;
            },
            buyNow(){
                alert("buy In app")
            }
        },
        mounted() {
            this.loadGiftCode();
            EventBus.$on('on-click-item-available-code', (data)=>{
                this.diaLogDetailCode={
                    title: i18n.t('giftcode.details.title'),
                    content: i18n.t('giftcode.details.code') + ": "+data.item.id
                    +"\n" + i18n.t('giftcode.details.plan') +": "+ data.item.plan
                    +"\n" + i18n.t('giftcode.details.expried')+": "+ data.item.status,
                    visiable: true,
                }
            });
        },
    };
</script>
<style>
    .container {
        width: 100%;
        background-color: #f5f8fa;
        padding: 16
    }
    
    .center {
        align-content: center;
        justify-content: center;
    }
    
    .flex {
        flex-direction: row;
    }
    
    .text-center {
        text-align: center;
    }
    
    .box {
        background-color: white;
        margin-bottom: 20;
        padding-top: 25;
        padding-left: 20;
        padding-right: 20;
        padding-bottom: 25;
    }
    
    .border {
        border-radius: 4;
        border-width: 1;
        border-color: #dcdfe6;
    }
    
    .item-code {
        padding: 10;
        width: 100%;
        height: 90;
        flex-direction: row;
        border-bottom-color: #E7EBEE;
        border-bottom-width: 1;
        margin-top: 10
    }
    
    .item-code-img {
        width: 15%;
    }
    
    .img-percent {
        padding: 10;
    }
    
    .item-code-text {
        width: 50%;
        padding-left: 5;
    }
    
    .bold {
        font-size: 14;
        font-weight: bold;
        line-height: 20;
        color: #282B34;
    }
    
    .text-normal {
        font-size: 12;
        line-height: 20;
        color: #9B9FAC;
    }
    
    .item-code-button {
        width: 35%;
        align-items: center
    }
    
    .btn-coppy {
        width: 90%;
        height: 50;
        background-color: #F5F8FA;
        border-width: 1;
        border-style: solid;
        border-color: #E7EBEE;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
    }
    
    .text-btn {
        color: #9B9FAC;
        text-align: center;
        font-size: 13;
    }
    
    .gray {
        color: #282B34;
    }
    
    .blue {
        color: #0091FF;
    }
    
    .h4 {
        font-size: 13;
    }
    
    .marB10 {
        margin-bottom: 10;
    }
    .marB6{
        margin-bottom: 6;
    }
    
    .marL10 {
        margin-left: 10;
    }
    
    .maxWidth {
        width: 100%;
    }
    
    .rightItem {
        position: absolute;
        right: 5;
    }
    
    .box-input {
        height: 40;
        margin-right: 16;
        padding-left: 10;
    }
    
    .white {
        color: white;
    }
    .dark{
        color:#333;
    }
    
    .button {
        width: 100;
        height: 40;
        padding-top: 8;
        padding-bottom: 8;
        padding-left: 16;
        padding-right: 16;
    }
    .bg-primary{
        background-color:#0091FF;
    }
    .primary{
        color:#0091FF;
    }
    .bg-btn{
        background-color:#F5F8FA;
    }
</style>