<template>
	<div v-title data-title="赛特物业防控统计">
		<mt-header title="今日防控统计"></mt-header>
		<mt-navbar v-model="classChoose">
		  <mt-tab-item v-for="(val,index) of classList" :id='"tab_item_"+val.id' :key="index">{{val.name}}</mt-tab-item>
		</mt-navbar>
		<div class="warnmsg" v-if="noUnpdatelist.length != 0">
			今日未填报信息：<span v-for="(val,index) of noUnpdatelist" :key='index'>{{val.name}}&nbsp;</span>
		</div>
		<div class="item" v-for='(val,index) of itemlist' :key="index">
			<mt-cell title="姓名：" :value="val.uname"></mt-cell>
			<mt-cell title="体温："><mt-badge type="error" v-if='val.tiwen>37.5 || val.tiwen<35'>{{val.tiwen}}</mt-badge><span v-html="val.tiwen" v-else></span></mt-cell>
			<mt-cell title="已做核酸：" :value="val.uname"><mt-badge type="error" v-if='val.is_hs=="否"'>{{val.is_hs}}</mt-badge><span v-html="val.is_hs" v-else></span></mt-cell>
			<mt-cell title="已填报二维码：" :value="val.uname"><mt-badge type="error" v-if='val.is_rwm=="否"'>{{val.is_rwm}}</mt-badge><span v-html="val.is_rwm" v-else></span></mt-cell>
			<mt-cell title="健康宝截图："></mt-cell>
			<div style="display: flex; justify-content: center;">
				<img class="item_img" :src="val.img" alt="">
			</div>
		</div>
		<div v-if="itemlist.length == 0" class="no_item">
			今日暂无人录入
		</div>
	</div>
</template>

<script>
	export default{
		name:'Watchmsg',
		data(){
			return{
				itemlist:[],
				noUnpdatelist:[],
				classChoose:'',
				classList:[]
			}
		},
		watch:{
			classChoose(){
				let cid = this.classChoose.replace('tab_item_','')
				this.initItemlist(cid)
				this.initNoUpdata(cid)
			}
		},
		methods:{
			initItemlist(cid){
				this.itemlist = []
				this.axios.get(this.$serverUrl+`/get_staff_list_today?cid=${cid}`).then(res=>{
					// console.log(res)
					let data = res.data.result
					for(let i = 0;i<data.length;i++){
						data[i].img = this.$serverUrl+data[i].img
					}
					this.itemlist = data
				})
			},
			initNoUpdata(cid){
				this.noUnpdatelist = []
				this.axios.get(this.$serverUrl+`/get_staff_no_updata_today?cid=${cid}`).then(res=>{
					console.log(res)
					this.noUnpdatelist = res.data.result
				})
			}
		},
		created(){
			this.axios.get(this.$serverUrl+'/get_class_item').then(res=>{
				// console.log(res.data)
				this.classList = res.data.result
				if(res.data.result.length != 0){
					this.classChoose = "tab_item_"+res.data.result[0].id
					// console.log(this.classChoose)
				}
			})
		}
	}
</script>

<style scoped>
	.item{
		font-size: 1.2rem;
		line-height: 1.5rem;
		border-bottom: 1px #d9d9d9 solid;
		padding: 2rem;
	}
	.item_img{
		width: 60%;
		margin: .6rem;
	}
	.warnmsg{
		padding: 1rem;
		background-color: yellow;
	}
	.no_item{
		display: flex;
		justify-content: center;
		font-size: 1.2rem;
		color: #c9c9c9;
	}
</style>