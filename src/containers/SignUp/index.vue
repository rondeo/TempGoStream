  <template>
  <view class="container">
    <text class="title letter-space bold">{{$i18n.t('signin_up.signup').toUpperCase()}}</text>
    <view class="marT8">
        <text class="h4">{{$i18n.t('signin_up.email')}}</text>
        <view class="marT8 item-input border flex center-items">
            <image  :source="require('./../../../assets/images/sign_in_ic_user.png')" 
                    :style="{width:25,height:30}" resize-mode="contain"/>
            <text-input class="padL16 w100" v-model="email" :autoCapitalize="'none'"/>
        </view>
    </view>
    <view class="marT8">
        <text class="h4">{{$i18n.t('signin_up.password')}}</text>
        <view class="marT8 item-input border flex center-items">
            <image  :source="require('./../../../assets/images/sign_in_ic_lock.png')" 
                    :style="{width:25,height:30}" resize-mode="contain"/>
            <text-input class="padL16 w100"  v-model="password" :secureTextEntry="true" :autoCapitalize="'none'"/>
        </view>
    </view>
    <view class="marT8">
        <text class="h4">{{$i18n.t('signin_up.repassword')}}</text>
        <view class="marT8 item-input border flex center-items">
            <image  :source="require('./../../../assets/images/sign_in_ic_lock.png')" 
                    :style="{width:25,height:30}" resize-mode="contain"/>
            <text-input class="padL16 w100"  v-model="repassword" :secureTextEntry="true" :autoCapitalize="'none'"/>
        </view>
    </view>
    <touchable-opacity class="button center center-items" :on-press="onSignUp">
      <text class="text-button letter-space">{{$i18n.t('signin_up.signup')}}</text>
      <view class="absolute center"
          v-if="isLoading"
          :style="{flex: 1, justifyContent: 'center'}">
          <activity-indicator size="large" color="#FFF" />
      </view>
    </touchable-opacity>
    <view class="not-acc">
      <text class="text-normal not-acc-item">{{$i18n.t('signin_up.do_have_account')}}</text>
      <touchable-opacity class="not-acc-item" :on-press="onSignIn">
        <text class="text-blue">{{$i18n.t('signin_up.signin_now')}}</text>
      </touchable-opacity>
    </view>
    <view class="img-bottom marT8">
      <image
        :source="require('./../../../assets/images/sign_in_up_img_bottom.png')"
        :style="{width:'100%',height:'100%'}"
        resize-mode="contain"
      />
    </view>
  </view>
</template>

<script>
import { NavigationActions, StackActions } from 'react-navigation'
import i18n from "./../../plugins/i18n"
import firebase from 'react-native-firebase'
import { Toast } from "native-base"
export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      isLoading:false,
      email: '',
      password: '',
      repassword:'',
      errorMessage:''
    };
  },
  methods: {
    checkEmpty(){
      if((!this.email) || (!this.password)){
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
    checkRePassword(){
      if(this.password.trim() == this.repassword.trim()){
        return true;
      }else{
        Toast.show({
          text: i18n.t('signin_up.not_match_pass'),
          buttonText: "Okay",
          position: "bottom",
          type:'danger',
          duration:4000
        });
        return false;
      }
    },
    onSignUp() {
       if(!this.checkEmpty()){
        return;
      }
      if(!this.checkRePassword())
        return;
      this.isLoading= true;
      firebase.auth()
      .createUserWithEmailAndPassword(this.email.trim(), this.password.trim())
      .then(() => {
        this.isLoading= false;
        Toast.show({
          text: i18n.t('signin_up.create_acc_success'),
          position: "bottom",
          buttonText: "Okay",
          type:'success',
          duration:3000
        });
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
        alert(this.errorMessage)
      })
    },
    onSignIn() {
      this.navigation.navigate("SignIn");
    }
  }
};
</script>

<style>
.container {
  background-color: #ffffff;
  padding: 6%;
  height: 100%;
}
.letter-space {
  letter-spacing: 2;
}
.flex{
  flex-direction:row;
}
.bold{
  font-weight: bold;
}
.title {
  font-size: 20;
  color: #282b34;
  text-align: center;
  padding-top: 20;
  margin-bottom: 10;
}
.item-input {
  height: 40;
  padding-left: 10;
  padding-right:10;
  background-color: #f5f8fa;
}
.border{
  border-radius: 4;
  border-width: 1;
  border-style: solid;
  border-color: #e7ebee;
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
  height: 50;
  margin-top: 20;
  align-items: center;
  justify-content: center;
  width: 100%;
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
}
.center{
  justify-content: center;
  align-content: center
}
.absolute{
  position: absolute;
}
.center{
  justify-content: center;
  align-content: center;
}
.center-items{
  align-items:center
}
.padT20{
  padding-top:20;
}
.marT8{
  margin-top:8;
}
.padL16{
  padding-left:16;
}
.w100{
  width:100%
}
</style>