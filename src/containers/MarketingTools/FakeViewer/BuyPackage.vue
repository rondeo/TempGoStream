<template>
    <nb-container class="container" >
        <scroll-view :scrollBarIndicatorVisible="false">
            <view class="app-box">
                <fake-viewer-setting></fake-viewer-setting>
                <view class="marT10 attention">
                    <text>{{ $t("plan.attention.title") }}</text>
                    <text>* {{ $t("fakeviews.attention.note1") }}</text>
                    <text>* {{ $t("fakeviews.attention.note2") }}</text>
                </view>
            </view>
        </scroll-view>
  </nb-container>
</template>
<script>
    import {Alert } from 'react-native'
    import i18n from '../../../plugins/i18n'
    import {api, generalCatch, formatDate} from '../../../helpers'
    import {db,auth} from '../../../plugins/firebase'
    import Money from '../../Account/Money'
    import {EventBus} from '../../../plugins/eventbus'
    import FakeViewerSetting from './FakeViewerSetting'

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        components: {
            Money,
            FakeViewerSetting
        },
        data() {
            return {
               loading: false
            }
        },
        methods: {
            createTransaction(data) {
                this.loading = true;
                api("views", {
                    ...data
                }).then(res => {
                    this.loading = false;
                    console.log('ByPackeage viewer -- res',res)
                    if ( res.id ){
                        Alert.alert('mua thanh cong');
                        EventBus.$emit('load-buy-viewer','true');
                    }
                    else alert("error")
                })
                console.log('submit', data);
            }
        },
        filters: {
            short(link) {
                return link.split("/").slice(3).filter(s => s.length).join("/");
            }
        },
        mounted() {
		    EventBus.$on('buy-viewer',(data)=>{
               this.createTransaction(data);
            });
        },
        
    };
</script>

<style>
.container {
    flex-direction: column;
    flex: 1;
    width: 100%;
    background-color: #F5F8FA;
}
.app-box{
    padding:10;
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
.
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

</style>