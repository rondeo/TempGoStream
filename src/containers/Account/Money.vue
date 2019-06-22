<template>
	<text v-bind:style="[lineThrough? {textDecorationLine:'line-through'}:{}]">{{ money }}</text>
</template>

<script>
import { formatMoney } from '../../helpers'

export default {
	data () {
		return {
			
		}
	},
	props: {
		value: {
			type: [Number, String],
			default: 0
		},
		currency: {
			type: String,
			default: ""
		},
		lineThrough: {
			type: [Number, Boolean],
			default: 0
		},
		rate: {
			type: [Number],
			default: 1
		}
	},
	computed: {
		money: function() {
			const value = this.value===''?0:(parseInt(this.value, 10)/this.rate);
			const decimalCount = this.$t("money.decimalCount", 0);
			const money = formatMoney(value, decimalCount, '.', ',');
			return this.$t("money.format", { money, 'currency':this.currency });
		},
		moneyClass: function() {
			return this.lineThrough? {textDecorationLine:'line-through',textAlign:'center'}:{textAlign:'center'};
		}
	},
	methods: {
		
	},
	mounted() {
	}
}
</script>

