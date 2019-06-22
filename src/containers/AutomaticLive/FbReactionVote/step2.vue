<template>
    <nb-container class="container">
        <nb-header>
            <nb-body class="flex center-items">
                <touchable-opacity class="center" :on-press="()=>{return goBack()}">
                    <nb-icon name="arrow-back" :style="{color:'white'}" />
                </touchable-opacity>
                <nb-title class="marL16 white">{{$i18n.t('auto_tool.text_logo')}}</nb-title>
            </nb-body>
        </nb-header>
        <view class="content">
            <KeyboardAvoidingView :behavior="'padding'" enabled>
                <view  v-bind:style= "[keyboardVisible ? {paddingBottom:80} : {}]">
                <scroll-view :showsVerticalScrollIndicator="false">
                    <view class="item-box flex">
                        <view class="picker-img border center center-item">
                            <Image class="img-picked border" :source ="question.imgSrc" v-if="(question.imgSrc!='')"/>
                            <touchable-opacity   class="absolute center center-item"  :style="{zIndex:2}"
                            :on-press="()=>{return selectPhotoTapped()}">
                                <image
                                    :source="require('./../../../../assets/images/ic_plus_circle_outline.png')"
                                    :style="{width:20, height:20}"
                                    resize-mode="contain"
                                />
                                <text class="white text-center">{{$i18n.t('add_logo')}}</text>
                            </touchable-opacity>    
                        </view>
                        <view class="marL10" :style="{width:'55%', justifyContent: 'center'}">
                            <text class="label">{{question.label}}</text>
                            <view  :style="{marginTop:0}">
                                <text-input
                                    :style="{height:35}"
                                    :underlineColorAndroid="'#E7EBEE'"
                                    :placeholder="question.placeholder"
                                    v-model="question.text"
                                />
                            </view>
                        </view>
                        <view class="right">
                            <image
                            :source="require('./../../../../assets/images/ic_edit.png')" 
                            :style="{width:25, height:25}" resize-mode="contain"
                            />
                        </view>
                    </view>
                    <view class="item-box flex marT16" v-for="(item,index) in answers" :key="index">
                        <view class="picker-img border center center-item">
                            <view class="absolute mask-icon center center-item"  :style="{zIndex:1,top:0,left:0}">
                                <view class="circle">
                                    <image :source="item.srcIcon" :style="{width:16,height:16}" resize-mode="contain" />
                                </view>
                            </view>
                            <Image class="img-picked border" :source="item.imgSrc" v-if="(item.imgSrc!='')"/>
                            <touchable-opacity   class="absolute center center-item"  :style="{zIndex:2}"
                            :on-press="()=>{return selectPhotoTapped(index)}" :disabled="index>=maxAnswer">
                                <image
                                    :source="require('./../../../../assets/images/ic_plus_circle_outline.png')"
                                    :style="{width:20, height:20}"
                                    resize-mode="contain"
                                />
                                <text class="white text-center">{{$i18n.t('add_logo')}}</text>
                            </touchable-opacity>    
                        </view>
                        <view class="marL10" :style="{width:'55%', justifyContent: 'center'}">
                            <text class="label">{{item.label}}</text>
                            <view  :style="{marginTop:0}">
                                <text-input
                                    :editable="index < maxAnswer" 
                                    :style="{height:35}"
                                    :underlineColorAndroid="'#E7EBEE'"
                                    :placeholder="item.placeholder"
                                    v-model="item.text"
                                />
                            </view>
                        </view>
                        <view class="right">
                            <image
                            :source="require('./../../../../assets/images/ic_edit.png')" 
                            :style="{width:25, height:25}" resize-mode="contain"
                            />
                        </view>
                    </view>
                </scroll-view>
            </view> 
            </KeyboardAvoidingView>
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
  </nb-container>
</template>
<script>
    import {Dimensions,Image,Keyboard,Alert,KeyboardAvoidingView} from "react-native";
    import React from "react";
    import {Picker, Icon,Toast} from "native-base";
    import {getBottomSpace,getStatusBarHeight,isIphoneX} from 'react-native-iphone-x-helper'
    import ImagePicker from 'react-native-image-picker';
    import pick from './../../../api/pickImage';
    import i18n from './../../../plugins/i18n'
    import {EventBus} from '../../../plugins/eventbus'
    import {api,generalCatch,imgurUpload } from '../../../helpers'
    import { mapGetters } from 'vuex'

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {Image,Icon, KeyboardAvoidingView},
        data() {
            return {
                dataStream: this.navigation.getParam('dataStream', {}),
                keyboardVisible: false,
                keyboardHeight: 0,
                isProcess: false,
                question: {
                    srcIcon: '',
                    label: i18n.t('auto_tool.question'),
                    placeholder: i18n.t('auto_tool.content_question'),
                    text: '',
                    imgSrc: '',
                },
                answers: [{
                    srcIcon: require('./../../../../assets/images/ic_like.png'),
                    label: i18n.t('auto_tool.answer'),
                    placeholder: i18n.t('auto_tool.content_answer'),
                    key: 'like',
                    text: '',
                    imgSrc: '',
                }, {
                    srcIcon: require('./../../../../assets/images/ic_heart.png'),
                    label: i18n.t('auto_tool.answer'),
                    placeholder: i18n.t('auto_tool.content_answer'),
                    key: 'love',
                    text: '',
                    imgSrc: '',
                    image: ''
                }, {
                    srcIcon: require('./../../../../assets/images/ic_face_smile.png'),
                    label: i18n.t('auto_tool.answer'),
                    placeholder: i18n.t('auto_tool.content_answer'),
                    key: 'haha',
                    text: '',
                    imgSrc: '',
                }, {
                    srcIcon: require('./../../../../assets/images/ic_face_surprise.png'),
                    label: i18n.t('auto_tool.answer'),
                    placeholder: i18n.t('auto_tool.content_answer'),
                    key: 'wow',
                    text: '',
                    imgSrc: '',
                }, {
                    srcIcon: require('./../../../../assets/images/ic_face_sad.png'),
                    label: i18n.t('auto_tool.answer'),
                    placeholder: i18n.t('auto_tool.content_answer'),
                    key: 'sad',
                    text: '',
                    imgSrc: '',
                }, {
                    srcIcon: require('./../../../../assets/images/ic_face_angry.png'),
                    label: i18n.t('auto_tool.answer'),
                    placeholder: i18n.t('auto_tool.content_answer'),
                    key: 'angry',
                    text: '',
                    imgSrc: ''
                }],


            }
        },
        computed: {
                ...mapGetters([
                'getUserinfo'
            ]),
            maxAnswer() {
                if ( this.getUserinfo('plan')["details"] && this.getUserinfo('plan')["details"]["mini_game"] )
                    return 6
                return 2;
            }
        },
        methods: {
            goBack() {
                this.navigation.goBack();
            },
            onPressNext() {
                if (!this.checkInvalidContent()) return;
                this.uploadImageToServer();
                this.navigation.navigate("Destination",{dataStream :this.dataStream})
            },
            onValueChange: function(value) {
                this.timeHours = value;
            },
            onValueChangeMusic(music) {
                this.bgMusic = music;
            },
            selectPhotoTapped(i) {
                if (typeof i !== 'undefined') {
                    pick((source, data) => {
                        this.answers[i].imgSrc = source;
                        console.log('this.answers[i].imgSrc', this.answers[i].imgSrc)
                    });
                } else { // select image question
                    pick((source, data) => {
                        this.question.imgSrc = source;
                        //console.log('this.answers[i].imgSrc', this.question.imgSrc)
                    });
                }
            },
            checkInvalidContent() {
                if (this.question.text == '') {
                    Alert.alert(i18n.t('autolive.react.question_empty'));
                    return false;
                }
                var num = 0;
                for (let i = 0; i < this.answers.length; i++) {
                    if (this.answers[i].text != '')
                        num++;
                }
                if (num < 2) {
                    Alert.alert(i18n.t('autolive.react.more_answer'));
                    return false;
                }
                return true;
            },
            uploadImageToServer() {
                if (this.question.imgSrc != '')
                    this.uploadImageQues();
                this.uploadImageAnswer()
            },
            uploadImageQues() {
                imgurUpload(this.question.imgSrc.uri).then((response) => {
                    if (response.data && response.data.link)
                        this.question.image = response.data.link;
                }).catch((e) => {
                    console.log('error uploadImg: ', e)
                }).finally(() => {
                     this.setDataReactionVote();
                })
            },
            uploadImageAnswer() {
                for (let i = 0; i < this.answers.length; i++) {
                    if (this.answers[i].imgSrc != '')
                        imgurUpload(this.answers[i].imgSrc.uri).then((response) => {
                            if (response.data && response.data.link)
                                this.answers[i].image = response.data.link;
                        }).catch((e) => {
                            console.log('error uploadImg: ', e)
                        }).finally(() => {
                             this.setDataReactionVote();
                        })
                }
            },
            setDataReactionVote() {
                this.dataStream.setting.question = {
                    text: this.question.text,
                    image: this.question.image
                }
                var newAnswers = [];
                for (let i = 0; i < this.answers.length; i++) {
                    const item = this.answers[i];
                    if (item.text != '') {
                        var newAnser = {
                            key: item.key,
                            text: item.text,
                            image: item.image
                        }
                        newAnswers.push(newAnser);
                    }
                }
                this.dataStream.setting.answers = newAnswers;
            },

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
            console.log('maxAnswer',this.maxAnswer)
            if(this.maxAnswer == 2){
                Toast.show({
                    text: i18n.t('account.max_answer'),
                    buttonText: "Okay",
                    type: "warning",
                    duration:6000
                })
            }
        },
    };
</script>

<style>
    .container {
        width: 100%;
        flex: 1;
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
    .marL16{
        margin-left:16;
    }
    .marL10 {
        margin-left: 10;
    }
    
    .marT16 {
        margin-top: 16;
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
    
    .w20 {
        width: 20%;
    }
    
    .w60 {
        width: 60%;
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
       /* margin-bottom: 10;*/
        width: 100%;
    }
    
    .label {
        color: #9B9FAC;
        font-size: 12;
        text-align: left;
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
    
    .picker-img {
        background-color: #9B9FAC;
        height: 80;
        width: 30%;
    }
    
    .img-picked {
        z-index: 1;
        opacity: 0.25;
        width: 100%;
        height: 100%;
    }
    
    .absolute {
        position: absolute;
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
</style>