  <template>
  <view class="container center-item">
    <text class="title letter-space bold">{{$i18n.t('signin_up.signin').toUpperCase()}}</text>
    <KeyboardAvoidingView  :behavior="'padding'" enabled>
      <view class="item-input">
        <view class="icon-left">
          <image :source="require('./../../../assets/images/sign_in_ic_user.png')" :style="{width:25,height:30}" 
                  resize-mode="contain"/>
        </view>
        <view class="input-right center">
          <text-input :placeholder="'gostream@gmail.com'" v-model="userName"  :autoCapitalize="'none'"/>
        </view>
      </view>
      <view class="item-input">
        <view class="icon-left">
          <image :source="require('./../../../assets/images/sign_in_ic_lock.png')" :style="{width:25,height:30}"
          resize-mode="contain"/>
        </view>
        <view class="input-right center">
          <text-input :placeholder="'***********'" v-model="userPass" :secureTextEntry="true" :autoCapitalize="'none'" />
        </view>
      </view>
    </KeyboardAvoidingView>  
    <touchable-opacity class="button" :on-press="onSignIn">
      <text class="text-button letter-space">{{$i18n.t('signin_up.signin')}}</text>
    </touchable-opacity>
    <touchable-opacity :on-press="onResetPass">
      <text class="text-normal marT10">{{$i18n.t('signin_up.forget_pass')}}</text>
    </touchable-opacity>
    <view class="not-acc">
      <text class="text-normal not-acc-item">{{$i18n.t('signin_up.do_have_not_account')}}</text>
      <touchable-opacity class="not-acc-item" :on-press="onSignUp">
        <text class="text-blue">{{$i18n.t('signin_up.signup_now')}}</text>
      </touchable-opacity>
    </view>
    <view class="img-bottom">
      <image
        :source="require('./../../../assets/images/sign_in_up_img_bottom.png')"
        :style="{width:'100%',height:'100%'}"
        resize-mode="contain"
      />
    </view>
    <view class="absolute center"
        v-if="isLoading"
        :style="{flex: 1, justifyContent: 'center'}">
        <activity-indicator size="large" color="#0091FF" />
    </view>
  </view>
</template>

<script>
import {KeyboardAvoidingView} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import i18n from "./../../plugins/i18n"
import firebase from 'react-native-firebase'
import { Toast } from "native-base"
import user from '../../helpers/user'
import {auth} from './../../plugins/firebase'
import { EventBus } from "./../../plugins/eventbus"


export default {
  components:{
    KeyboardAvoidingView
  },
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      isLoading:false,
      userName: '',
      userPass: '',
      errorMessage:'',
    };
  },
  methods: {
    checkEmpty(){
      if((!this.userName) || (!this.userPass)){
          Toast.show({
          text: i18n.t('signin_up.user_name_or_pass_empty'),
          buttonText: "Okay",
          position: "bottom",
          type:'danger',
          duration:6000
        });
          return false;
      }
      return true;
    },
    onSignIn() {
      if(!this.checkEmpty()){
        return;
      }
      this.isLoading= true;
      this.signin(this.userName.trim(), this.userPass.trim()).then(() => {
        this.isLoading= false;
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'App'})
          ],
        });
        this.navigation.dispatch(resetAction);
      })
      .catch(error => { 
        this.isLoading= false;
        this.errorMessage = error.message;
       // alert(this.errorMessage)
       })
    },
    onSignUp() {
      this.navigation.navigate("SignUp");
    },
    onResetPass(){ 
       this.navigation.navigate("ResetPass");
    }
  }, 
  mixins: [user],
  beforeMount() {
    if(auth.currentUser && auth.currentUser.uid ) {
        this.navigation.navigate('App')
    }
    //  EventBus.$on('firebase-loaded', user => {
    //     console.log('loaded event bus loading');
    //     this.navigation.navigate(user ? 'App' : 'SignIn')
    // });
  },
};
</script>

<style>
.container {
  padding: 6%;  
  height: 100%;
}
.letter-space {
  letter-spacing: 2;
}
.title {
  font-size: 20;
  color: #282B34;
  text-align: center;
  padding-top: 30;
  margin-bottom: 10;
}
.bold{
  font-weight: bold;
}

.item-input {
  flex-direction: row;
  width: 100%;
  height: 45;
  padding-left: 10;
  background-color: #f5f8fa;
  border-radius: 4px;
  border-width: 1;
  border-style: solid;
  border-color: #e7ebee;
  margin-top: 15;
  line-height: 20;
  letter-spacing: 1;
}
.icon-left {
  width: 10%;
  justify-content: center;
}
.input-right {
  width: 90%;
  font-size: 14;
}
.button {
  background-color: #0091ff;
  border-radius: 2;
  padding: 10;
  width: 100%;
  height: 50;
  margin-top: 20;
  align-items: center;
  justify-content: center;
}
.text-button {
  color: white;
  font-size: 18;
  text-align: center;
}
.text-normal {
  color: #9b9fac;
  line-height: 20;
  margin-top: 10;
  text-align: center;
  font-size: 13;
  margin-left: 10;
}
.not-acc {
  width: 100%;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}
.not-acc-item {
  text-align: center;
}
.text-blue {
  color: #0091ff;
  line-height: 20;
  margin-top: 10;
  font-size: 13;
  margin-left: 10;
  text-decoration-line: underline;
}
.img-bottom {
  align-content: center;
  justify-content: center;
  width: 100%;
  height: 180;
  margin-top: 40;
}
.center{
  justify-content: center;
  align-content: center
}
.absolute{
  position: absolute;
}
.center-item{
  justify-content: center;
  align-content: center;
  align-items:center
}
.marT10{
  margin-top:10;
}
</style>