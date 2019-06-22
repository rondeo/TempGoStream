<template>
    <nb-container class="container" >
        <scroll-view :scrollBarIndicatorVisible="false">
            <KeyboardAvoidingView behavior="padding" enabled>
            <view class="content">
                <text class="h1 bold">{{ $t("broadcast.create") }}</text>
                <text class="h3 marT8 marB10">* {{ $t('broadcast.limit_10k') }}</text>
                <linked-account-select :accountType="'facebook'" :targetType="'fanpage'"/>
                <view class="marB10">
                    <text class="h3 marT8">{{$t('broadcast.estimate')}}</text>
                    <view class="flex">
                        <text class="h3 marT8" v-if="(estimate_result >= 0)">{{ estimate_result }}</text>
                        <view class="marL10 center center-items"  v-if="estimating">
                            <activity-indicator size="small" color="#0091FF" />
                        </view>
                        <touchable-opacity class="padL16 marT8" :on-press="estimate">
                            <text class="h3 primary bold">{{ $t('broadcast.calculate') }}</text>
                        </touchable-opacity>
                    </view>
                </view>
                <view class="marB10">
                    <view class="flex">
                        <text class="h3 marT8 red">*</text>
                        <text class="h3 marT8">{{$t('broadcast.content')}} </text>
                     </view>
                    <nb-textarea class="marT8 bg-white border" :rowSpan="5"  v-model="formBroadcast.content" />
                </view>
                <view class="marB10">
                    <text class="h3 marT8">{{$t('broadcast.pricing')}}</text>
                    <view class="flex">
                        <money class="h3 red bold" :value="50000" :currency="$t('money.currency')" />
                        <text class="marL10 h5">({{ $t('broadcast.current_balance') }}: </text>
                        <money class="h5" ref="moneyuser" :value="getUserinfo('balance')" :currency="$t('money.currency')" />
                        <text class="h5">)</text> 
                    </view>
                    <view class="cant_send center center-items" v-if="!can_send">
                        <text class="h3 marT10 cant_send_text">{{ $t('broadcast.not_enough_money') }} </text>
                    </view>
                </view>
                <touchable-opacity class="center button-next flex" :on-press="()=>{return submit()}" :disabled="sent || estimating || !can_send">
                    <nb-icon name="paper-plane" :style="{color:'white', fontSize:25}" />
                    <text class="marL10 white bold text-center">{{$i18n.t('send_mess')}}</text>
                    <view class="marL10 center center-item"
                        v-if="sending"
                        :style="{justifyContent: 'center'}">
                        <activity-indicator size="small" color="#FFF" />
                    </view>
                </touchable-opacity>
                <view class="attention marB10">
                    <text class="h3 marT8">{{ $t("plan.attention.title") }}</text>
                    <text class="h3 marT8">* {{ $t("broadcast.attention.only_inboxed") }}</text>
                    <text class="h3 marT8">* {{ $t("broadcast.attention.dont_send_much") }}</text>
                    <text class="h3 marT8">* {{ $t('broadcast.attention.contact_us')}} </text>
                </view>
            </view>
            </KeyboardAvoidingView>
        </scroll-view> 
  </nb-container>
</template>
<script>
    import React from "react"
    import {Dimensions,Image,KeyboardAvoidingView,Alert } from "react-native"
    import {Picker,Icon,Toast } from "native-base"
    import {getBottomSpace } from 'react-native-iphone-x-helper'
    import BaseDialog from '../../baseCustom/baseDialog'
    import i18n from '../../../plugins/i18n'
    import LinkedAccountSelect from '../../Account/LinkedAccountSelect'
    import {api, generalCatch, formatDate} from '../../../helpers'
    import {mapGetters} from 'vuex'
    import {db,auth} from '../../../plugins/firebase'
    import Money from '../../Account/Money'
    import {EventBus} from '../../../plugins/eventbus'
    import user from '../../../helpers/user'

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {
            BaseDialog,
            LinkedAccountSelect,
            Money,
            KeyboardAvoidingView
        },
        data() {
            return {
                sending: false,
                estimating: false,
                sent: false,
                access_token: '',
                fanpage: null,
                estimate_result: -1,
                formBroadcast: {
                    content: ''
                },
                tableData: []
            }
        },
        computed: {
            ...mapGetters([
                'getUserinfo'
            ]),
            statusBarHeight() {
                return Constants.statusBarHeight;
            },
            screenHeight() {
                return Math.round(Dimensions.get('window').height);
            },
            getBottomSpaceIpX() {
                return getBottomSpace();
            },
            can_send: function() {
                return this.getUserinfo('balance')>50000;
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            submit: function() {
                if ( this.fanpage===null ) {
                    let mess = i18n.t('error') + "\n" + i18n.t('broadcast.no_fanpage');
                    Alert.alert(mess);
                    return;
                }
                if(this.checkValidContent(this.formBroadcast.content)){
                    this.sending = true;
					api('facebook/broadcast', {
						mode: 'add',
						data: {
							fanpage: this.fanpage,
							content: this.formBroadcast.content
						}
					}).then(res => {
						this.sent = true;
                        Toast.show({
                            text: i18n.t('broadcast.sent'),
                            type: "success",
                            position: "bottom", 
                            buttonText: "Ok",
                            duration: 3000
                        });
                        //update user from store.js
                        let currentUser = this.returnUser(auth.currentUser);
                        this.$store.commit('updateUser', { payload: currentUser });
                        //update DOM
                        this.$refs.moneyuser.$forceUpdate();
                        this.getUser();
                        //send update to history
                        EventBus.$emit('load-his-broad-message','true');
                        //this.broadcast_insights(doc.id)
					}).catch(generalCatch).finally(() => {
						this.sending = false;
					});
                } 
                
            },
            get_estimate_result: function(access_token, estimate_id) {
                api(`facebook/broadcast?mode=estimate&access_token=${access_token}&estimate_id=${estimate_id}`).then(data => {
                    if ( !isNaN(data.reach_estimation) && data.reach_estimation!==this.estimate_result ) {
                        this.estimate_result = data.reach_estimation;
                    } else {
                        clearTimeout(this.timer);
                        this.estimating = false;
                        if ( this.sent )
                            this.loadHistory();
                    }
                }).catch((e) => {
                    clearTimeout(this.timer);
                    this.estimating = false;
                });
            },
            estimate: function() {
                if ( this.fanpage===null ) {
                    const mess = i18n.t('error') + "\n"+ i18n.t('broadcast.no_fanpage');
                    Alert.alert(mess);
                    return;
                }
                this.estimating = true;
                this.estimate_result = -1;
                api('facebook/broadcast?mode=estimate&access_token='+this.access_token).then(data => {
                    if ( data.reach_estimation_id ) {
                        this.timer = setInterval(() => {
                            this.get_estimate_result(this.access_token, data.reach_estimation_id);
                        }, 5000);
                    }
                })
            },
            broadcast_insights: function(broadcast_id) {
                this.estimating = true;
                this.estimate_result = -1;
                db.collection("broadcast_history").doc(broadcast_id).get().then((doc) => {
                    const data = doc.data();
                    if ( data ) {
                        clearTimeout(this.timer);
                        if ( !data.status || data.status===0 ) {
                            this.timer = setTimeout(() => {
                                this.broadcast_insights(broadcast_id);
                            }, 5000);
                        } else if ( data.status===1 )
                            if ( data.response.broadcast_id )
                                this.timer = setInterval(() => {
                                    this.get_estimate_result(data.fanpage.access_token, data.response.broadcast_id, 'insights');
                                }, 5000);
                            else if ( data.response.error ) {
                                if ( data.response.error.message ) {
                                    this.$alert(data.response.error.message, i18n.t('error'), {
                                    confirmButtonText: 'OK'
                                    });
                                }
                            }
                    }
                });
            },
            changeTarget: function(data) {
                //this.access_token = data['target']['access_token'];
               // this.fanpage = data['target'];
            },
            loadHistory: function() {
                db.collection("broadcast_history").where("gs_uid", "==", this.$store.state.userInfo.id)
                        .orderBy('create_time', 'desc').limit(20).get().then(snapshot => {
                    let broadcasted = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if ( data['reach']===undefined && data.response.broadcast_id ) {
                            api('facebook/broadcast', {
                                mode: 'insights',
                                access_token: data.fanpage.access_token,
                                estimate_id: data.response.broadcast_id,
                                id: doc.id
                            });
                        }
                        broadcasted.push({
                            content: data['content'].substring(0, 200),
                            create_time: formatDate(data['create_time'], true),
                            fanpage: data['fanpage'],
                            reach: data['reach']?data['reach']:0
                        });
                    });
                    this.tableData = broadcasted;
                })
            },
            checkValidContent(content){
                var mess ='';
                if(content && content.length){
                    if(content.length <4 || content.length>2000){
                         mess = i18n.t("broadcast.content_max_length");
                        Alert.alert(mess);
                        return false; 
                    }
                    return true;
                }else{
                    mess = i18n.t("broadcast.empty_content");
                    Alert.alert(mess);
                    return false;
                }
               

            }
        },
        mounted() {
		    this.loadHistory();
            EventBus.$on('change-selected-linked-acc',(data) => {
                this.fanpage = data.target;
                this.access_token = data.target.access_token;
                //this.account = data.account;
            })
        },
        beforeMount: function() {
            this.$store.commit('updateBreadcrumb', [{title: 'marketing'}, {title: "broadcast"}])
        },
        beforeDestroy: function() {
            clearTimeout(this.timer);
        },
        mixins: [user]
    };
</script>

<style>
    .container {
        flex-direction: column;
        flex: 1;
        width: 100%;
        background-color: #F5F8FA;
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
  font-size: 16;
  color: #282B34;
}
.h3{
    font-size: 14;
}
.h5{
    font-size:12;
}
.bold{
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
.primary{
    color:#409eff
}
.red{
    color:red
}
.center{
  justify-content: center;
  align-content:center;
}
.center-items {
        align-items: center;
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
    color: red
}
.max-width{
    width: 100%;
}

.text-center{
    text-align: center;
}

.white{
    color: #FFF;
}

.bg-blue{
    background-color: #0091FF;
}

.content {
    padding: 10;
}

.item-box {
    margin: 10;
}
.input-text{
    background-color: #E7EBEE;
    height: 50;
}
.bg-white{
    background-color:white;
}
.w70{
    width: 70%
}
.w30{
    width: 30%
}
.label {
    color: #9B9FAC;
    font-size: 12;
    text-align: left;
    margin-bottom: 8;
}
.marT10{
    margin-top:10;
}
.marL10{
    margin-left:10;
}
.padL16{
    padding-left:16;
}
.marB10{
    margin-bottom:10;
}
.marT8{
    margin-top:8;
}
.center{
    justify-content: center;
    align-content: center;
    align-items: center;
}
.flex{
    flex-direction: row;
}
.text-center {
    text-align: center;
}

.bold {
    font-weight: bold;
}
.white{
    color:#fff;
}
.picker{
        width: 55%;
        background-color: white;
}
.border{
    border-width: 1;
    border-color: #E7EBEE;
    border-radius: 4;
}
.border-left{
    border-top-left-radius: 4;
    border-bottom-left-radius: 4;
    border-width: 1;
    border-color: #E7EBEE;
}
.border-right{
    border-top-right-radius: 4;
    border-bottom-right-radius: 4;
    border-width: 1;
    border-color: #E7EBEE;
}
.btn-upgrade{
    margin-left: 5%;
    width: 40%;
    border-radius: 4;
    background-color: #0091FF;
}
.picker-img{
    background-color: #9B9FAC;
    height: 160;
}

.img-picked{
    z-index: 1;
    opacity: 0.25;
    width: 100%;
    height: 100%;
}
.absolute{
    position: absolute;
}
.button-next {
    padding: 10;
    height: 50;
    border-radius: 4;
    background-color: #0091FF;
    justify-content: center;
    margin:20;
}
.cant_send{ 
    background-color:#fef0f0;
    padding-top:16;
    padding-bottom:16;
    padding-bottom:16;
    border-radius:4;
}
.cant_send_text{
    color:#f56c6c;
}
</style>