<template>
	<view class="quota center">
		<view class="flex left" :class="live_today>=max_live?'red':''">
			<text>{{ $t("quota.live_today")}}:</text> 
            <text class="live">{{ live_today }}/{{ max_live }}</text>
		</view>
		<view class="flex left marT10"  :class="live_now>=max_parallel?'red':''">
			<text>{{ $t("quota.live_now") }}:</text>
            <text class="live">{{ live_now }}/{{ max_parallel }}</text>
		</view>
        <view class="line marT10"></view>
        <touchable-opacity class="marT10" v-if="(live_today>=max_live || live_now >=max_parallel)" :on-press="toUpgrade">
            <text class="upgrade">{{$t('account.update_acc')}}</text>
        </touchable-opacity >
	</view>
</template>
<script>
import {api, generalCatch, parseUrl} from '../../helpers'
import user from '../../helpers/user'
import { mapGetters } from 'vuex'
import {EventBus} from '../../plugins/eventbus'

export default {
	props: ['hiddenComponent'],
	components: {
	},
	data () {
		return {
			
		}
	},
	computed: {
		...mapGetters([
			'getUserinfo'
		]),
		live_today() {
			let userInfo = this.getUserinfo();
			return userInfo["quota"]?userInfo["quota"]["live_today"]:'-';
		},
		max_live() {
			if ( !this.$store.state.userInfo.plan.details ) return 0;
			return this.$store.state.userInfo.plan.details.max_live;
		},
		live_now() {
			let userInfo = this.getUserinfo();
			return userInfo["quota"]?userInfo["quota"]["live_now"]:'-';
		},
		max_parallel() {
			if ( !this.$store.state.userInfo.plan.details ) return 0;
			return this.$store.state.userInfo.plan.details.max_parallel;
		},
		
	},
	updated() {
		if ( isNaN(this.max_live) ) return;
		if ( this.live_today>=this.max_live )
			EventBus.$emit('over-plan', 'max_live');
		else if ( this.live_now>=this.max_parallel )
			EventBus.$emit('over-plan', 'max_parallel');
    },
    methods: {
        toUpgrade(){
            EventBus.$emit('link-to-upgrade','toUpgrade');
		},
    },
	mounted() {
		api('user/usage').then(data => {
			this.$store.commit('updateUser', {payload: data, field: 'quota'});
		});
		// if ( !this.$store.state.userInfo.plan.details ) {
		// 	this.getUserPlan().then(res => {
		// 		console.log(res);
		// 	});
		// }
	},
	mixins: [user]
}
</script>
<style scoped>
.quota{
    background-color: white;
    border-radius: 4;
    border-width: 1;
    border-color: #dcdfe6;
    padding:10;
    width: 80%;
}
.flex{
    flex-direction: row;
}
.red {
	color: red;
}
.live{
    margin-left: 16;
    font-size: 16;
    font-weight: bold;
    color: #2c3e50;
}
.upgrade{
    color: #409eff;
    font-size: 15;
    text-align: center;
}
.center{
    align-content: center;
    justify-content: center;
}
.left{
    align-content: flex-start;
    justify-content: flex-start;
}
.center-items{
    align-items: center
}
.marT10{
    margin-top: 10;
}
.line{
    background-color: #ccc;
    height: 2;
    width: 100%;
}
</style>