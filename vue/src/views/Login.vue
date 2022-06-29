<template>
	<div v-title data-title="赛特物业防控统计">
		<mt-header title="赛特物业防控统计">
		</mt-header>
		<h3>管理员登录</h3>
		<mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
		<mt-field label="密码" placeholder="请输入密码" v-model="password" type="password"></mt-field>
		<div class="btn_p">
			<mt-button type="primary" class="btn" @click="login">登录</mt-button>
			<mt-button type="primary" class="btn register_btn" @click="register">注册</mt-button>
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
				btnLock:false
			}
		},
		created(){
			if(this.$route.query.uname) this.username = this.$route.query.uname
		},
		methods:{
			register(){
				this.$router.push('/register')
			},
			login(){
				if(this.btnLock == true){
					return
				}else if(!/^[A-Za-z0-9]{4,16}$/.test(this.username)){
					Toast('用户名格式错误')
					return
				}else if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,15}$/.test(this.password)){
					Toast('密码格式错误')
					return
				}
				regAxios.apply(this)
				async function regAxios(){
					this.btnLock = true
					try{
						let md5Pwd= this.$md5(this.password)
						let publicKeyData = await this.axios.get(this.$serverUrl+'/login_public_key')
						const jse = new this.$jsEncrypt(); 
						jse.setPublicKey(publicKeyData.data.result); 
						const rsaUsername = jse.encrypt(this.username)
						const rsaPassWord = jse.encrypt(md5Pwd)
						let loginMsg = await this.axios.post(this.$serverUrl+'/login',`username=${rsaUsername}&password=${rsaPassWord}`)
						if(loginMsg.data.code == 201) MessageBox('提示', '用户名或密码错误')
						else if(loginMsg.data.code == 200){
							Toast('登陆成功')
							this.$cookies.set("token", loginMsg.data.token)
							this.$router.push('/employeesList')
						}else{
							Toast('未知错误')
							console.log('未知错误')
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
	.btn{
		width: 100%;
	}
	.register_btn{
		margin-top: 1rem;
	}
</style>