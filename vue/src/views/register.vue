<template>
	<div v-title data-title="赛特物业防控统计">
		<mt-header title="赛特物业防控统计">
		</mt-header>
		<h3>管理员注册</h3>
		<mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
		<mt-field label="密码" placeholder="请输入密码" v-model="password" type="password"></mt-field>
		<mt-field label="确认密码" placeholder="请输入密码" v-model="repassword" type="password"></mt-field>
		<mt-field label="超密" placeholder="请输入超密" v-model="supassword" type="password"></mt-field>
		<div class="btn_p">
			<mt-button type="primary" class="register_btn" @click="register">确认注册</mt-button>
		</div>
	</div>
</template>

<script>
	import {
		Toast,MessageBox 
	} from 'mint-ui';
	export default {
		name:"Login",
		data(){
			return{
				username:'',
				password:'',
				repassword:'',
				btnLock:false,
				supassword:''
			}
		},
		methods:{
			register(){
				if(this.btnLock == true){
					return
				}else if(!/^[A-Za-z0-9]{4,16}$/.test(this.username)){
					Toast('用户名格式错误')
					return
				}else if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/.test(this.password)){
					Toast('密码格式错误')
					return
				}else if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/.test(this.supassword)){
					Toast('超密格式错误')
					return
				}else if(! (this.password == this.repassword)){
					Toast('两次密码输入不一致')
					return
				}
				regAxios.apply(this)
				async function regAxios(){
					this.btnLock = true
					try{
						let md5Pwd= this.$md5(this.password)
						let md5Sppwd = this.$md5(this.supassword)
						let publicKeyData = await this.axios.get(this.$serverUrl+'/login_public_key')
						const jse = new this.$jsEncrypt(); 
						jse.setPublicKey(publicKeyData.data.result); 
						const rsaUsername = jse.encrypt(this.username)
						const rsaPassWord = jse.encrypt(md5Pwd)
						const rsaSuPassWord = jse.encrypt(md5Sppwd)
						let regMsg = await this.axios.post(this.$serverUrl+'/resgiter',`username=${rsaUsername}&password=${rsaPassWord}&suPassword=${rsaSuPassWord}`)
						if(regMsg.data.code == 201) MessageBox('提示', '用户已注册')
						else if(regMsg.data.code == 202) MessageBox('提示', '超密错误')
						else if(regMsg.data.code == 200) {
							MessageBox('提示', '注册成功')
							this.$router.push({path:"/Login",query:{
								uname:this.username
							}})
						}
						
						this.btnLock = false
					}catch(err){
						console.log(err)
						Toast('网络开小差了')
						this.btnLock = false
					}	
				}
			}
		}
	}
</script>

<style scoped>
	h3{
		margin: 1rem;
	}
	.btn_p{
		padding: 1rem;
	}
	.register_btn{
		width: 100%;
	}
</style>