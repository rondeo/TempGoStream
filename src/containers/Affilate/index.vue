<template>
    <view class="center-item">
        <view class="container"> 
            <view class="monney"> 
              <text class="num-monney">{{total_earned}}</text>
              <text class="unit-monney">VND</text>
              <touchable-opacity class="btn-transaction"  :on-press="onloadTransactions">
                <text class="text-right">{{$i18n.t('earn.transaction')}}</text>
              </touchable-opacity>
            </view>
            <view class="list">
              <text v-if="dialogAttend.visiable" class="text-normal"> {{$i18n.t('earn.you_not_have_link').toUpperCase()}}</text>
                <view v-else> 
                    <text class="text-normal"> {{$i18n.t('earn.you_afilate_link').toUpperCase()}}</text>
                    <scroll-view>
                      <view class="item-link" v-for="(item, index) in ref_links" :key="index">
                        <view class="icon">
                          <view class="box-icon"/>
                        </view>
                        <view class="item-code-text">
                            <view class="text-overflow">
                              <text class="text-bold over-left">{{item.id}}</text>
                            </view>
                            <view class="flex">
                                <text class="text-normal">{{$i18n.t('earn.discount')}}: </text>
                                <text class="text-normal">{{item.user_discount}}%</text>
                            </view>
                            <view class="flex">
                                <text class="text-normal">{{$i18n.t('earn.your_share')}}: </text>
                                <text class="text-normal">{{item.ref_share}}%</text>
                            </view>
                        </view>
                        <view class="item-code-button">
                          <touchable-opacity class="btn-coppy" :on-press="()=>{ return coppyLink(item)}">
                            <text class="text-btn">{{$i18n.t('earn.coppy_link')}}</text>
                          </touchable-opacity>
                        </view>
                      </view>
                    </scroll-view>  
                </view>
            </view>
        </view>
        <base-dialog
          :data="dialogAttend"
          :title="dialogAttend.title" 
          :content="dialogAttend.content"
          :textBtnActive="dialogAttend.textBtnActive"
          :close="() => { dialogAttend.visiable=false }" v-if="(dialogAttend.visiable)"/>
        <view class="absolute center-item"
          v-if="loading"
          :style="{flex: 1, justifyContent: 'center'}">
          <activity-indicator size="large" color="#0091FF" />
        </view>      
    </view>
</template>
<script>
import i18n from './../../plugins/i18n'
import {api, generalCatch, copyToClipboard} from '../../helpers'
import {db} from '../../plugins/firebase'
import BaseDialog from '../../containers/baseCustom/baseDialog'
import React from 'react';
import { Clipboard} from 'react-native'

export default {
  props: {
            navigation: {
            type: Object
            }
  },
  components:{
    BaseDialog
  },
  data: function() {
    return {
      loading:true,
      dialogAttend:{
                title:i18n.t('affiliate.term'),
                content:i18n.t('affiliate.rule1') + "\n"+i18n.t('affiliate.rule2')+"\n"+i18n.t('affiliate.rule3')
                +"\n"+ i18n.t('affiliate.rule4')+"\n" + i18n.t('affiliate.note1')+"\n" + i18n.t('affiliate.note2') 
                +"\n"+ i18n.t('affiliate.note3')+"\n" + i18n.t('affiliate.note4') +"\n"+ i18n.t('affiliate.note5') ,
                textBtnActive:i18n.t('affiliate.join'),
                visiable:false,
                press:this.attendAfilate
        },
      ref_links:[],
      transaction:[],
      total_registed:0,
      total_earned: 0,
    };
  },
  methods: {
      onloadTransactions(){
         this.loading = true;
        db.collection("aff_trans").where("gs_uid", "==", this.$store.state.userInfo.id).orderBy("created", "desc").get().then(snapshot => {
          this.loading = false;
          //console.log('snapshot', snapshot);
          let trans = [];
          snapshot.forEach(doc => {
            trans.push({ ...doc.data(), id: doc.id })
          })
          this.transaction = trans;
        })
        this.navigation.navigate('HisTransations',{dataTransactions:this.transaction})
      },
      coppyLink(item){
          Clipboard.setString(item.id);
          alert('Copied!');
      },
      loadAffilate() {
        api("affilate",{}).then(res => {
          this.loading=false;
          this.getRefLink();
            
        }).catch(console.log)
      },
      getRefLink() {
        this.loading = true;
        db.collection("ref_link").where("gs_uid", "==", this.$store.state.userInfo.id).get().then(snapshot => {
          let links = [];
          //console.log('snapshot', snapshot);
          if((typeof snapshot !== 'undefined') && (snapshot.docs.length == 0)){
              this.dialogAttend.visiable = true;
          }
          snapshot.forEach(doc => {
            let data = doc.data();
            this.total_registed += data.registered;
            links.push({ ...data, id: doc.id })
          })
          this.ref_links = links;
          this.loading = false;
        });
      },
      attendAfilate(){
        this.createLink();
      },
      createLink() {
        this.loading = true;
        this.dialogAttend.visiable = false;
        api('affiliate', {}).then(res => {
          this.loading = false;
          this.getRefLink();
        });
      },
  },
  mounted() {
    this.getRefLink();
  },
};
</script>
<style>
.container{
  width: 100%;
  background-color: white;
  margin: 6;
  height:100%
}
.flex{
  flex-direction: row;
}
.absolute{
  position: absolute;
}
.center{
  justify-content: center;
  align-content: center;
  
}
.center-item{
  justify-content: center;
  align-content: center;
  align-items:center
}
.monney{
  padding: 20;
  height: 110;
  background-color: #F5F8FA;
  flex-direction: column;
}
.num-monney{
  height: 50%;
  color: #FF2020;
  text-align: center;
  font-size: 30;
  font-weight: bold;

}
.unit-monney{
  height: 30%;
  color: #9B9FAC;
  font-size: 13;
  text-align: center;
}
.btn-transaction{
  height: 30%;
  font-size: 12;
  text-align: right;

}
.text-right{
  text-align: right;
  color: #0091FF;
}
.list{
  background-color: white;
  padding-top: 15;
  padding-left: 10;
  padding-right: 10;
}
.text-bold{
  font-size: 14;
  font-weight: bold;
  line-height: 20;
  color: #282B34;
  height: 20;
}
.text-normal{
  font-size: 12;
  line-height: 20;
  color: #9B9FAC;
}
.text-overflow{
  width: 100%;
  flex-direction: row;
}
.over-left{
  width: 90%;
  margin-right: 0;
  padding-right: 0;
}
.over-dot{
  width: 10%;
  margin-left: 0;
  padding-left: 0;
}
.item-link{
  padding: 10;
  width: 100%;
  flex-direction: row;
  border-bottom-color: #E7EBEE;
  border-bottom-width: 1;
}
.icon{
  width: 15%;
  padding-top: 5;
}
.box-icon{
  width: 10;
  height: 10;
  background-color: #0091FF;
  border-radius: 2;
}
.item-code-text{
  width: 50%;
  flex-direction: column;
}
.item-code-button{
  width: 35%
}
.btn-coppy{
  width: 100%;
  height: 50;
  background-color: #F5F8FA;
  border-width: 1 ;
  border-style: solid;
  border-color: #E7EBEE;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}
.text-btn{
  color: #9B9FAC;
  text-align: center;
  font-size: 13;
}
</style>
