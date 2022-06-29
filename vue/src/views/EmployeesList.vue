<template>
	<div v-title data-title="赛特物业防控统计">
		<mt-header title="后台设置">
		<mt-button slot="left" type="default" @click="todayMsg">今日记录</mt-button>
		<mt-button slot="right" type="default" @click="logout">注销</mt-button>
		</mt-header>
		<ListVue :datatype='datatype' @toNextPage="toNextPage" @toPage = 'toPage'></ListVue>
	</div>
</template>

<script>
	import ListVue from "../components/EmployeesList/ListVue.vue"
	import {Toast} from 'mint-ui'
	export default{
			name:'EmployeesList',
			components:{
				ListVue
			},
			data(){return{
				datatype:{
					type:'class',
					where:''
				}
			}},
			methods:{
				todayMsg(){
					this.$router.push('/watchMsg')
				},
				logout(){
					this.axios.post(this.$serverUrl+'/logout','token='+this.$cookies.get('token')).then(res=>{
						// console.log(res)
						this.$cookies.set('token','')
						Toast('已登出')
						this.$router.push('/login')
					})
				},
				toPage(type){
					this.datatype = {
						type
					}
				},
				toNextPage(id){
					this.datatype  = {
						type:'emp',
						where:id
					}
				}
			}
	}
	
</script>

<style scoped>
</style>