<template>
  <view>
      <view class="head-statusbar" :style="{paddingTop:statusBarHeight}"></view>
      <view class="header shadow flex">
            <view class="center w100"><text class="text-bold text-center h1">{{$t('app.account')}}</text></view>
      </view>
      <view class="container">
          <view class="infor-acc center center-items">
              <view class="img-acc center center-items">
                  <nb-thumbnail large :source="{uri: acc.avatar}" :style="{width: 80, height: 80, borderRadius: 40}"  />
              </view>
              <view class="text-acc">
                  <text class="name-acc" :numberOfLines="1">{{acc.email}}</text>
                  <view class="flex">
                    <text class="subtext-acc">{{$t('account.data_plan')}}: </text>
                    <text class="type-acc bold blue" :numberOfLines="1">{{plan}}</text>
                  </view>
                  <view class="flex" v-if="(typeof expired ==='number')">
                    <text class="subtext-acc">{{$t('account.shelf_life')}}: </text>
                    <text class="subtext-acc">{{(expired)}}</text>
                  </view>
                  <view class="flex">
                    <text class="subtext-acc">{{$t('account.sur_plus')}}: </text>
                    <text class="subtext-acc">{{balance}}</text>
                  </view>
              </view>
              <!--<view class="btn-chevron-right">
                  <image
                    :source="require('./../../../assets/images/ic_chevron_right.png')"
                    :style="{width:'100%', height:'100%'}" resize-mode="contain"
                  />
              </view>-->
          </view>
          <view class="list-option">
            <scroll-view :showsVerticalScrollIndicator="true">
                <view class="group-op center center-items">
                  <view v-for="op in optionsGroup1" :key="op.key">
                    <touchable-opacity class="item-op center center-items" :on-press="() => {return selectOption(op.key) }">
                      <view class="img-op"> 
                        <image
                        :source="op.imgSrc"
                        :style="{width:'60%', height:'60%'}" resize-mode="contain"
                      />
                      </view>
                      <text class="name-op h3">{{$t('account.'+op.key)}}</text>
                    </touchable-opacity>
                  </view>
                </view>
                <view class="group-op"> 
                  <view  class="center center-items" v-for="op in optionsGroup2" :key="op.key">
                    <touchable-opacity class="item-op center center-items" :on-press="() => {return selectOption(op.key) }">
                      <view class="img-op"> 
                        <image
                        :source="op.imgSrc"
                        :style="{width:'60%', height:'60%'}" resize-mode="contain"
                      />
                      </view>
                      <text class="name-op h3">{{$t('account.'+op.key)}}</text>
                    </touchable-opacity>
                  </view>
                </view>
                <view class="group-op">
                  <view v-for="op in optionsGroup3" :key="op.key">
                    <touchable-opacity class="item-op center center-items" :on-press="() => {return selectOption(op.key) }">
                      <view class="img-op"> 
                        <image
                          :source="op.imgSrc"
                          :style="{width:'60%', height:'60%'}" resize-mode="contain"
                        />
                      </view>
                      <text class="name-op h3">{{$t('account.'+op.key)}}</text>
                    </touchable-opacity>
                  </view>
                </view>
            </scroll-view>
          </view>
      </view>
      <touchable-opacity class="bottom-button center" :style="{ marginBottom: getBottomSpace}"
        :on-press="()=>{return signOut()}">
        <text class="text-signout">{{$t('account.sign_out').toUpperCase()}}</text>
      </touchable-opacity>
      <change-language v-if="showAlertLanguage" :close="()=>{showAlertLanguage = false}"/>
  </view>
</template>
<script>
import { NavigationActions, StackActions } from 'react-navigation'
import {Dimensions,Linking ,Alert} from "react-native"
import { Icon } from 'native-base'
import i18n from './../../plugins/i18n'
import {auth,db} from './../../plugins/firebase'
import user from '../../helpers/user'
import config from '../../plugins/config'
import {getAvatar, formatDate} from '../../helpers'
import { getBottomSpace,getStatusBarHeight,isIphoneX } from 'react-native-iphone-x-helper'
import {EventBus} from '../../plugins/eventbus'
import ChangeLanguage from '../baseCustom/changeLanguage'
export default {
  props:['navigation'],
  components:{
    ChangeLanguage
  },
  data: function() {
    return {
        acc:this.getUser(false),
        balance:0,
        plan:'free',
        expired:0,
        optionsGroup1:[
          {
            imgSrc: require('./../../../assets/images/acc_tab_ic_option_fb.png'),
            key:'account_facebook',
          },
          {
            imgSrc: require('./../../../assets/images/acc_tab_ic_option_update.png'),
            key:'update_acc',
          },
        ],
        optionsGroup2:[
          {
            imgSrc: require('./../../../assets/images/acc_tab_ic_option_book.png'),
            key:'guide',
          },
          {
            imgSrc: require('./../../../assets/images/acc_tab_ic_option_contact.png'),
            key:'contact',
          },
        ],
        optionsGroup3:[
          {
            imgSrc: require('./../../../assets/images/acc_tab_ic_option_infor.png'),
            key:'infro_app',
          },
          {
            imgSrc: require('./../../../assets/images/acc_tab_ic_option_language.png'),
            key:'language',
          },
        ],
        loading:false,
        tableData:[],
        showAlertLanguage:false,
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
    getBottomSpace(){
      return getBottomSpace()
    }
  },
  methods: {
    selectOption(idOption){
       switch(idOption){
          case 'account_facebook':{
            this.navigation.navigate('LinkedAccount');
            break;
          }
          case 'update_acc':{
            this.navigation.navigate('UpgradeAcc');
            break;
          }
          case 'guide':{
            const url = config.domain+'/app/guide';
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                  Linking.openURL(url);
              } else {
                  alert("Don't know how to open URI: ");
              }
            });
            break;
          }
          case 'contact':{
            const url = config.urlFb + '/gostreamtool/';
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                  Linking.openURL(url);
              } else {
                  alert("Don't know how to open URI: ");
              }
            });
            break;
          }
          case 'infro_app':{
            let mess = i18n.t('account.infor_app');
            Alert.alert(mess);
            break;
          }
          case 'language':{
            this.showAlertLanguage = true;
            break;
          }
          
       }
    },
    async signOut(){
      try{
          await auth.signOut(); 
          EventBus.$emit('logout-event','logout');
      }catch(error){
        Alert.alert("Opps! "+error)
      }
    },
    loadLinkedAccount() {
			this.loading = true;
			const userId = this.$store.state.userInfo.id;
			db.collection("linked_account").where("gs_uid", "==", userId).get().then((querySnapshot) => {
				let tableData = [];
				querySnapshot.forEach(function(doc) {
					const data = doc.data();
		            tableData.push({
		            	id: doc.id,
		            	app : {
		            		name: data.app.name,
		            		type: data.app.type,
		            		id: data.app.id
		            	},
		            	userFullname : data.name,
		            	email : data.email,
		            	avatar: data.picture?data.picture:getAvatar(data.app.type, data.id)
		            });
		        });
		        this.tableData = tableData;
			}).catch(e => {
				console.log("error", e);
			}).finally(e => {
				this.loading = false;
			});
		},
    async getInforUser(){
      let data ;
      await db.collection("user").doc(this.$store.state.userInfo.id).get().then((snapshot) => {
        data = snapshot.data();
      });
      this.expired = formatDate(data.plan.expired);                 
      this.plan = data.plan.id;           
      this.balance = data.coin;        
    }
  	
  },
  mounted() {
    //this.loadLinkedAccount();
    this.getInforUser();
    EventBus.$on('change-language',(data)=>{
        this.showAlertLanguage = false;
        this.$i18n.locale= data;
    });
    EventBus.$on('pay-plan-success',(data)=>{
        this.getInforUser();
    });
  },
  mixins: [user]
};
</script>
<style>
.container{
  width: 100%;
  height:100%;
  background-color: #F5F8FA;
  position: relative;
}
.header{
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
.flex{
  flex-direction: row;
}
.h1{
  font-size: 18;
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
    width: 100%;
}
.h3{
    font-size:14;
    color:#333;
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
.center-items{
  align-items:center;
}
.infor-acc{
  width: 100%;
  height: 120;
  padding-top: 6;
  padding-bottom: 6;
  margin-top: 1;
  background-color: #ffffff;
  flex-direction: row;
  border-bottom-color: #E7EBEE;
  border-bottom-width: 1;
}
.img-acc{
  width: 40%;
  height:100%;
}
.text-acc{
  width: 60%;
  padding: 10;
}
.btn-chevron-right{
  width: 10%;
  height: 100%;
  background-color:red;
}
.list-option{
  width: 100%;
}
.bottom-button{
  width: 100%;
  height: 50;
  position: absolute;
  bottom: 50;
  border-radius: 1;
  background-color: #0091FF;
  justify-content: center;
}
.bold{
  font-weight:bold;
}
.name-acc{
  color:  #282B34;
  font-size: 15;
  font-weight: bold;
  line-height: 20;
}
.type-acc{
  font-size: 13;
  line-height: 20;
  text-transform: uppercase;
}
.blue{
  color: #0091FF;
}
.subtext-acc{
  color: #333;
  font-size: 12;
  line-height: 20;
}
.group-op{
  margin-top: 10;
}
.item-op{
  background-color: #FFFFFF;
  color: #5B5F6D;
  height: 45;
  flex-direction: row;
  width: 100%;
  margin-bottom:3;
}
.img-op{
  width: 20%;
}
.name-op{
  width:80%;
  text-align: left;
  color: #5B5F6D;
}
.text-signout{
  color: #FFF ;
  text-align: center;
  align-items: center;
  font-size: 14;
  font-weight: bold;
}
</style>