<template>
    <touchable-opacity  class="item-list border flex center" :on-press="()=>{return toDetailStream()}">
        <view class="box-img w35"> 
            <image
            :source="getThuml"
            :style="{width:'100%',height:'100%',  borderRadius:4}" resize-mode="cover"
            />
        </view>       
        <view class="box-text w60 center">
            <text class="title" :numberOfLines="2">{{data.title}}</text>
            <view class="marT8 flex">
                <text class="label">{{$i18n.t('status')}}: </text>
                <text class="h5" :style="{color:colorStatus}">{{getStatus}}</text>
            </view>
            <view class="flex">
                <text class="label">{{$i18n.t('time')}}: </text>
                <text class="h5">{{getTime}}</text>
            </view>
        </view>
        <view class="center center-item w5 marL6 h100" >
            <image 
                :source="require('./../../../assets/images/ic_chevron_right.png')"
                :style="{width:32,height:32}" resize-mode="contain"
            />
        </view>
    </touchable-opacity >    
</template>
<script>
import i18n from '../../plugins/i18n'
import {api} from '../../helpers'
import {EventBus} from'../../plugins/eventbus'
import {statusCode,  formatDate, getTargetVideo } from '../../helpers/handler'


    export default {
        props:['data'],
        components: {
        },
        data: function() {
            return {
                statusCode:0,
                colorStatus:'#333',
            }
        },
        computed: {
            getStatus(){
                return statusCode(this.statusCode)
            },
            getTime(){
                return formatDate(this.data.created)
            },
            getThuml(){
                if(this.data.setting.frame && this.data.setting.frame.link != ""){
                    return {uri: this.data.setting.frame.link}
                }else{
                    return require('../../../assets/images/img_placeholder.png');
                }
               
            },
            
            
        },
        methods: {
            toDetailStream(){
                EventBus.$emit('detail-stream', {
                    data: this.data
                });
            },
            
        },
        watch: {
            statusCode(num){
                switch(num){
                    case 1:{
                        this.colorStatus = '#20B2AA';
                        break;
                    }
                    case 2:{
                        this.colorStatus = '#228B22';
                        break;
                    }
                    case 3:{
                        this.colorStatus = '#4B0082';
                        break;
                    }
                    case 4:{
                        this.colorStatus = '#B22222';
                        break;
                    }
                    case 5:{
                        this.colorStatus = '#FF7F50';
                        break;
                    }
                }
            }
        },
        mounted() {
            this.statusCode = this.data.status;
           // console.log('this.data - hisory',this.data)
            EventBus.$on('update-stream',this.streams)
           
        },
    };
</script>
<style>
.header{
width: 100%;
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
font-size: 18;
color: #282B34;
}
.text{
    flex:1;
}
.bold{
font-weight: bold
}
.text-center{
text-align: center
}
.w35{
width: 35%;
}
.w60{
width: 60%;
}
.w5{
width: 5%;
}
.h100{
    height:100%
}
.marT8{
    margin-top:8;
}
.marL6{
    margin-left:6;
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
.center-item{
    align-items:center;
}
.border{
border-bottom-color: #E7EBEE;
border-bottom-width: 1;
margin-top:2;
}
.item-list {
height: 100;
width: 100%;
padding:10;
}
.box-text {
padding-left:10;
}
.box-img {
width: 35%;
height: 100%;
border-radius: 4;
}
.title {
font-size: 12;
color: #282B34;
font-weight:bold;
}
.h5{
    font-size:12
}

.label {
font-size: 12;
color: #606266;
}


</style>