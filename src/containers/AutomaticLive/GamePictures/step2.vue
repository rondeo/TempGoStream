<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('autolive.pic2word.title')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content">
            <view>
                <scroll-view :showsVerticalScrollIndicator="false">
                    <view class="box border">
                        <text class="label">{{$i18n.t('auto_tool.background_music')}}</text>
                        <text-input class="border text-input" v-model="audio" :placeholder="$i18n.t('autolive.react.audio_no_copyright')"/>
                    </view>
                    <view class="box border" v-for="(item, idx) in questions" :key="idx">
                        <text class="label">{{$i18n.t('autolive.pic2word.question',{num: idx+1})}}</text>
                        <view class="picker-img border center center-item" v-if="item.image">
                            <image class="img-picked border"
                                :source="{uri: item.image}"
                                :style="{width:'100%', height:'100%'}"
                                resize-mode="cover"
                            />
                        </view>
                        <view class="marT16 center">
                            <view class="border flex">
                                <text-input class="text-input" v-model="item.image" :placeholder="$i18n.t('autolive.pic2word.input_image')"/>
                                <touchable-opacity class="border bg-primary center center-item" :style="{position:'absolute', right:0, width:30, height:'100%'}"
                                    :on-press="()=>{return selectPhotoTapped(idx)}">
                                    <image
                                        :source="require('../../../../assets/images/ic_upload.png')"
                                        :style="{width:'60%',height:'50%'}" resize-mode="cover"
                                    />  
                                </touchable-opacity>
                            </view>
                            <view class="absolute loading center center-item"
                                v-if="isLoading"
                                :style="{flex: 1, justifyContent: 'center'}">
                                <activity-indicator size="small" color="#0091FF" />
                            </view>
                        </view>
                        <view class="marT16 center">
                            <view class="">
                                <text-input class="border text-input" v-model="item.answer" :placeholder="$i18n.t('autolive.pic2word.input_answer')"/>
                            </view>
                        </view>
                        <view class="marT16 center">
                            <view class="">
                                <text-input class="border text-input" v-model="item.hint" :placeholder="$i18n.t('autolive.pic2word.input_hint')"/>
                            </view>
                        </view>
                    </view>
                    <view class="flex">
                            <touchable-opacity class="box border center flex center-item item-tool"
                                :on-press="()=>{return addQuestion()}">
                                <view class="center box-icon">
                                    <nb-icon name='add' :style="{color:'#0091FF'}"/>
                                </view>
                                <text class="text-tool">{{$i18n.t('autolive.pic2word.add_question')}}</text>  
                            </touchable-opacity>
                             <touchable-opacity class="box border  flex center center-item item-tool"
                                :on-press="()=>{return openLibrary()}">
                                <view class="center box-icon">
                                    <nb-icon name='appstore' :style="{color:'#0091FF'}" />
                                </view>
                                <text class="text-tool">{{$i18n.t('autolive.pic2word.library')}}</text>  
                            </touchable-opacity>
                             <touchable-opacity class="box border flex center center-item item-tool"
                                :on-press="()=> { return saveDialog()}">
                                <view class="center box-icon">
                                    <nb-icon name='cloud-done' :style="{color:'#0091FF'}" />
                                </view>
                                <text class="text-tool">{{$i18n.t('autolive.pic2word.save')}}</text>  
                            </touchable-opacity>
                    </view>
                </scroll-view>
            </view> 
        </view>
        <view class="absolute center center-item"
            v-if="isProcess"
            :style="{flex: 1, justifyContent: 'center'}">
            <activity-indicator size="large" color="#0091FF" />
        </view>
        <view class="button-next" >
            <touchable-opacity class="center" :on-press="()=>{return onPressNext()}">
                <text class="white text-bold text-center">{{$i18n.t('next')}}</text>
            </touchable-opacity>
        </view>
        <dialog-library :close="() => { libraryDialogVisible=false }" v-if="libraryDialogVisible"
           :title="$i18n.t('autolive.pic2word.library')" :data="items"/>
        <view class="mask-save center center-item"  v-if="saveDialogVisible">
            <view class="dialog-content-save">
                <text class="h3">{{$i18n.t('autolive.pic2word.save')}}</text>
                <view class="box-item-save">
                    <text class="label">{{$i18n.t('autolive.pic2word.save_name')}}</text>
                    <text-input class="border text-input" v-model="title" placeholder="name" />
                </view>
                <view class="box-item-save marT20 flex">
                    <touchable-opacity class="btn-unactive border center center-item" :on-press="closeSaveDialog">
                        <text class="h4 gray">{{$i18n.t('cancel')}}</text>
                    </touchable-opacity>  
                    <touchable-opacity class="btn-active border center center-item" :on-press="saveTemplate">
                        <text class="h4 white">{{$i18n.t('autolive.pic2word.save')}}</text>
                    </touchable-opacity>  
                </view>
            </view>
        </view>
  </nb-container>
</template>
<script>
    import {Dimensions,Keyboard} from "react-native";
    import React from "react";
    import {Picker, Icon,Toast} from "native-base";
    import {getBottomSpace,getStatusBarHeight,isIphoneX} from 'react-native-iphone-x-helper'
    import ImagePicker from 'react-native-image-picker';
    import pick from './../../../api/pickImage';
    import i18n from './../../../plugins/i18n'
    import {EventBus} from '../../../plugins/eventbus'
    import {api,generalCatch,imgurUpload } from '../../../helpers'
    import {db} from  '../../../plugins/firebase'
    import DialogLibrary from './../dialog/dialogLibrary'
    import {mapGetters} from 'vuex'

    export default {
        props: ['data','navigation'],
        components: {Icon,DialogLibrary},
        data() {
            return {
                dataStream: this.navigation.getParam('dataStream', {}),
                keyboardVisible: false,
                keyboardHeight: 0,
                isProcess: false,
                audio: '',
                questions: [{}],
                libraryDialogVisible: false,
                items: [],
                saveDialogVisible: false,
                isLoading:false,
                title:'',
            }
        },
        computed: {
            ...mapGetters([
                'getUserinfo'
            ]),
            valid_questions() {
                let questions = [];
                for ( let item of this.questions ) {
                    if ( item.image && item.answer && item.image.indexOf('http')===0 && item.answer.length )
                        questions.push(item);
                }
                return questions;
            },
            maxQuestion() {
                if ( this.getUserinfo('plan')["details"] && this.getUserinfo('plan')["details"]["mini_game"] )
                    return 100
                return 5;
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            onPressNext() {
                if ( this.valid_questions.length == 0 ) {
                    Toast.show({
                        text: i18n.t('autolive.pic2word.content_err'),
                        type: "danger"
                    });
                    return;
                }
                this.setData();
                this.navigation.navigate('Destination',{ dataStream : this.dataStream });
            },
            getIosIcon: function() {
                return <Icon name = "ios-arrow-down-outline" /> 
            },
            addQuestion(){
               if ( this.questions.length<this.maxQuestion )
				    this.questions.push({});
            },
            removeQuestion(idx) {
			    this.questions.splice(idx, 1);
            },
            loadLibrary() {
                db.collection("pic2word").get().then(snapshot => {
                    let items = [];
                    snapshot.forEach(doc => {
                        items.push(doc.data())
                    });
                    this.items = items;
                });
            },
            openLibrary() {
                this.libraryDialogVisible = true;
            },
            selectFromLibrary(item) {
                if ( this.questions.length>this.maxQuestion ) return;
                let last_question = this.questions[this.questions.length-1];
                let new_question = {
                        image: item.image,
                        answer: item.answer,
                        hint: item.hint || '',
                    };
                if ( !last_question.image && !last_question.answer ) {
                    this.questions[this.questions.length-1] = new_question;
                }
                else
                    this.questions.push(new_question);
            },
            saveTemplate() {
                if ( this.title.length==='' ) return false;
                let doc_id = this.$store.state.userInfo.id+'_'+this.title;
                db.collection("user_saved").doc(doc_id).set({
                    gs_uid: this.$store.state.userInfo.id,
                    title: this.title,
                    questions: this.valid_questions,
                    type:"pic2word"
                }).then(doc => {
                    Toast.show({
                        text: i18n.t('autolive.pic2word.save_success'),
                        type: "success"
                    });
                    this.saveDialogVisible = false;
                })
            },
            saveDialog() {
                if ( this.valid_questions.length==0 ) {
                    Toast.show({
                        text: i18n.t('autolive.pic2word.save_more_question'),
                        type: "warning"
                    });
                    return;
                }
                this.saveDialogVisible = true;
            },
            closeSaveDialog(){
                 this.saveDialogVisible = false;
            },
            selectPhotoTapped(idx) {
                pick((source, data) => {
                    this.isLoading= true;
                    let file = source.uri;
                    imgurUpload(file).then((response) => {
                        if (response.data && response.data.link)
                                this.questions[idx].image = response.data.link;
                            }).catch((e) => {
                                console.log('error uploadImg: ', e)
                            }).finally(() => {
                                this.isLoading= false;
                            })
                    });
            },
            setData() {
                this.dataStream.setting= {
                    questions:this.questions,
                    audio:this.audio
                }
            }

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
        mounted() {
            console.log('this.dataStream',this.dataStream)
            if(this.maxQuestion == 5){
                Toast.show({
                    text: i18n.t('account.max_question'),
                    buttonText: "Okay",
                    type: "warning",
                    duration:6000
                })
            }
            if ( this.dataStream.setting)
			    this.questions = this.dataStream.setting.questions;
		
		    this.loadLibrary();
            EventBus.$on('on-click-item-library', data=>{
                    let dataLibrary =  data.item;
                    this.selectFromLibrary(dataLibrary);
            });
            
        },
    };
</script>

<style>
    .container {
        width: 100%;
        flex: 1;
        background-color: #F5F8FA;
    }
    
    .max-witdh {
        width: 100%;
    }
    
    .mask-icon {
        background-color: #FFFFFF;
        opacity: 0.5;
        border-bottom-right-radius: 4;
        border-top-left-radius: 2;
        width: 20;
        height: 20;
        z-index: -1;
    }
    .mask-save {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 50;
        background-color: #282B34;
        opacity: 1;
    }
     .dialog-content-save {
        width: 90%;
        background-color: white;
        border-radius: 4;
        position: relative;
        padding-top: 20;
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

    .box {
        width: 100%;
        padding-left: 16;
        padding-right: 16;
        padding-top: 10;
        padding-bottom: 10;
        background-color: white;
        margin-bottom: 16;
    }

    .box-icon{
        width:30;
        height:30;
    }
    .marL10 {
        margin-left: 10;
    }
    .marL16{
        margin-left:16;
    }
    .marT16 {
        margin-top: 16;
    }
    .marR10{
        margin-right:10;
    }
    .marT10 {
        margin-top: 10;
    }
    
    .marT20 {
        margin-top: 20;
    }
    
    .right {
        align-content: center;
        justify-content: center;
        align-items: flex-end;
    }
    
    .header {
        background-color: white;
        border-color: #D7D9E0;
        border-width: 1;
        height: 50;
        padding-left: 10;
        padding-right: 10;
    }
    
    .head-statusbar {
        background-color: #222230;
        color: white;
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
    .label {
        color: #9B9FAC;
        font-size: 12;
        text-align: left;
        margin-bottom: 8;
    }
    .text-tool{
        font-size:14;
        color: #9B9FAC;
    }
    .w20 {
        width: 20%;
    }
    
    .w60 {
        width: 60%;
    }
    .w85{
        width:85%;
    }
    .w100 {
        width: 100%
    }
    
    .shadow {
        shadow-color: black;
        shadow-opacity: 0.15;
        shadow-radius: 2
    }
    
    .dark {
        color: #282B34
    }
    
    .center {
        justify-content: center;
        align-content: center;
    }
    
    .center-item {
        align-items:center;
    }
    
    .white {
        color: white;
    }
    
    .bold {
        font-weight: bold;
    }
    
    .h4 {
        font-size: 13
    }
    
    .blue {
        color: #0091FF
    }
    
    .circle {
        border-radius: 50;
    }
    
    .content {
        text-align: left;
        padding: 10;
        background-color: #F5F8FA;
        height: 85%;
        position: relative;
        overflow: hidden;
    }
    
    .item-box {
        margin: 10;
        width: 100%;
    }

    .item-tool{
        width:30%;
        margin-right:10;
        height:40;
    }
    
    .text-input {
        height: 40;
        padding-left: 16;
        padding-right: 16;
        padding-top: 10;
        padding-bottom: 10;
    }
    .flex {
        flex-direction: row;
    }
    
    .text-center {
        text-align: center;
    }
    
    .text-bold {
        font-weight: bold;
    }
    
    .white {
        color: #fff;
    }
    
    .picker {
        width: 30%;
        background-color: white;
    }
    
    .border {
        border-width: 1;
        border-color: #E7EBEE;
        border-radius: 4;
    }
    
    .btn-upgrade {
        margin-left: 5%;
        width: 40%;
        border-radius: 4;
        background-color: #0091FF;
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
    
    .picker-img {
        background-color: #9B9FAC;
        height: 140;
    }
    
    .img-picked {
        z-index: 1;
        opacity: 0.8;
        width: 100%;
        height: 100%;
    }
    
    .absolute {
        position: absolute;
    }
    .loading{
        top:10;
        left:10
    }
    .button-next {
        padding: 10;
        width: 100%;
        height: 50;
        position: absolute;
        bottom: 0;
        border-radius: 1;
        background-color: #0091FF;
        justify-content: center;
    }
    .bg-primary{
        background-color:#0091FF;
    }
</style>