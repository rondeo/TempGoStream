<template>
  <main-tab ref="maintab" />
</template>
<script>
import React from "react";
import { Text ,Platform} from "react-native";
import { Icon } from 'native-base';
import Earn from './../Earn';
import { TabNavigator } from "vue-native-router";
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import i18n from "./../../../src/plugins/i18n";
import user from '../../helpers/user'
import {EventBus} from  '../../plugins/eventbus'
import {createAppContainer,  createBottomTabNavigator, createStackNavigator,NavigationActions, StackActions } from 'react-navigation'

//start import component of HomeStack
import AutomaticLive from './../AutomaticLive'
import Home from '../Home'
import AddVideoStep1 from './../AutomaticLive/AddVideo/step1'
import AddVideoStep2 from './../AutomaticLive/AddVideo/step2'
import AddVideoStep3 from './../AutomaticLive/AddVideo/step3'
import Destination from '../../containers/AutomaticLive/destination'
import Details from '../../containers/AutomaticLive/AddVideo/Details'
import ReactStep1  from './../AutomaticLive/FbReactionVote/step1'
import ReactStep2  from './../AutomaticLive/FbReactionVote/step2'
import GamePicturesStep1  from './../AutomaticLive/GamePictures/step1'
import GamePicturesStep2  from './../AutomaticLive/GamePictures/step2'
import GuessNameSongStep1 from '../AutomaticLive/GuessNameSongs/step1'
import GuessNameSongStep2 from '../AutomaticLive/GuessNameSongs/step2'
    //start marketingtool
import MarketingToolsMain from './../../containers/MarketingTools/main'
import BroadcastMessage from './../../containers/MarketingTools/BroadcastMessage/index'
import FakeViewer from '../MarketingTools/FakeViewer'
    //end marketingtool
//end import component of HomeStack
//start import component of History
import HistoryAll  from '../History/index'
import HistoryPlaying from '../History/HistoryPlaying'
import HistoryTimer from '../History/HistoryTimer'
import HistoryEnded from '../History/HistoryEnded'
import DetailsStream from '../../containers/History/DetailsStream'
//end import component of History
//start import component of Account
import Account from "../Account"
import LinkedAccount from '../Account/LinkedAccount'
import AddTokenFb from '../Account/AddTokenFb'
import UpgradeAcc from '../Account/UpgradeAcc'
import LoginFB from '../Account/LoginFB'

//end import component of Account


const HomeStack =createStackNavigator(
  {
    Home:{ screen:Home,
      navigationOptions: {
        header:null
      },
    },
    AutomaticLive:{
      screen:AutomaticLive,
      navigationOptions: {
        header:null
      },
    },
    AddVideoStep1:{
      screen:AddVideoStep1,
      navigationOptions: {
        header:null
      },
    },
    AddVideoStep2:{
      screen:AddVideoStep2,
      navigationOptions: {
        header:null
      },
    },
    AddVideoStep3:{
      screen:AddVideoStep3,
      navigationOptions: {
        header:null
      },
    },
    ReactStep1:{
      screen:ReactStep1,
      navigationOptions: {
        header:null
      },
    },
    ReactStep2:{
      screen:ReactStep2,
      navigationOptions: {
        header:null
      },
    },
    GamePicturesStep1:{
      screen:GamePicturesStep1,
      navigationOptions: {
        header:null
      },
    },
    GamePicturesStep2:{
      screen:GamePicturesStep2,
      navigationOptions: {
        header:null
      },
    },
    GuessNameSongStep1:{
      screen:GuessNameSongStep1,
      navigationOptions: {
        header:null
      },
    },
    GuessNameSongStep2:{
      screen:GuessNameSongStep2,
      navigationOptions: {
        header:null
      },
    },
    Destination:{
      screen:Destination,
      navigationOptions: {
        header:null
      },
    },
    Details:{
      screen:Details,
      navigationOptions: {
        header:null
      },
    },
    MarketingToolsMain:{
      screen:MarketingToolsMain,
      navigationOptions: {
        header:null
      },
    },
    BroadcastMessage:{
      screen:BroadcastMessage,
      navigationOptions: {
        header:null
      },
    },
    FakeViewer:{
      screen:FakeViewer,
      navigationOptions: {
        header:null
      },
    },
  },
);

const HistoryStack = createStackNavigator(
  {
      History:{
        screen:HistoryAll,
        navigationOptions: {
            header:null
        },
      },
      HistoryPlaying:{
        screen:HistoryPlaying,
        navigationOptions: {
            header:null
        },
      },
      HistoryTimer:{
        screen:HistoryTimer,
        navigationOptions: {
            header:null
        },
      },
      HistoryEnded:{
        screen:HistoryEnded,
        navigationOptions: {
            header:null
        },
      },
      DetailsStream:{
        screen:DetailsStream,
        navigationOptions: {
            header:null
        },
      }
  }
);

const AccountStack = createStackNavigator(
  {
      Account:{
        screen:Account,
        navigationOptions: {
            header:null
        },
      },
      LinkedAccount:{
        screen:LinkedAccount,
        navigationOptions: {
            header:null
        },
      },
      AddTokenFb:{
        screen:AddTokenFb,
        navigationOptions: {
            header:null
        },
      },
      UpgradeAcc:{
        screen:UpgradeAcc,
        navigationOptions: {
            header:null
        },
      },
      LoginFB:{
        screen:LoginFB,
        navigationOptions: {
            header:null
        },
      },
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible
    };
};
HistoryStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible
    };
};

AccountStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible
    };
};
const mainTab= createAppContainer(createBottomTabNavigator(
{
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel:i18n.t('app.home'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={20} style={{color:tintColor}} />
        )
      },
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel:i18n.t('app.history'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="list-box" size={20} style={{color:tintColor}} />
        )
      },
    },
    Earn: {
      screen: Earn,
      navigationOptions: {
        tabBarLabel:i18n.t('app.earn'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="cash" size={20} style={{color:tintColor}}/>
        )
      },
    },
    Account: {
      screen: AccountStack,
      navigationOptions: {
        tabBarLabel:i18n.t('app.account'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="person" size={20} style={{color:tintColor}}/>
        )
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#0091FF',
      inactiveTintColor: 'gray',
    },
  }
));



export default {
  props: ['navigation','isShowAppBar'],
  components: { mainTab},
  data: function() {
    return {
      statusHeight:20,
      show:true,
      mainTab:{}
    }
  },
  computed: {
      statusBgColor() {
        return this.tabs[this.tab_active].statusBg;
      }
  },
  methods: {
    reload() {
      this.mainTab= createAppContainer(createBottomTabNavigator(
{
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel:i18n.t('app.home'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={20} style={{color:tintColor}} />
        )
      },
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        tabBarLabel:i18n.t('app.history'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="list-box" size={20} style={{color:tintColor}} />
        )
      },
    },
    Earn: {
      screen: Earn,
      navigationOptions: {
        tabBarLabel:i18n.t('app.earn'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="cash" size={20} style={{color:tintColor}}/>
        )
      },
    },
    Account: {
      screen: AccountStack,
      navigationOptions: {
        tabBarLabel:i18n.t('app.account'),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="person" size={20} style={{color:tintColor}}/>
        )
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#0091FF',
      inactiveTintColor: 'gray',
    },
  }
))
    }
  },
  created() {
    if ( Platform.OS==='android' ) this.statusHeight = 0;
    else this.statusHeight = getStatusBarHeight(true);
  },
  mounted() {
    this.getUser();
    EventBus.$on('change-language',(data)=>{
        this.reload();
    });
    EventBus.$on('logout-event',(data)=>{
        const resetAction = StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'SignIn'})
        ],
        });
        this.navigation.dispatch(resetAction);
    });
  },
  mixins: [user],
};
</script>

