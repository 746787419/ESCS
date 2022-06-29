<template>
	<div v-title data-title="赛特物业防控统计">
		<mt-header title="赛特物业防控统计"> 
		<!-- <mt-button slot="right"><router-link to='/watchmsg'>查看</router-link></mt-button> -->
		</mt-header>
		<mt-field label="姓名" placeholder="请输入姓名" v-model="username"></mt-field>
		<mt-field label="体温" placeholder="请输入体温" v-model="tiwen"></mt-field>
		<mt-radio class="main_item" title="当天是否已做核酸" v-model="isHs" :options="['是', '否']">
		</mt-radio>
		<mt-radio class="main_item" title="当天是否已提交二维码" v-model="isRwm" :options="['是', '否']">
		</mt-radio>
		<div class="btn_p">
			<div id="imgState" v-html="imgState"></div>
			<input class="uploadimg" type="file" name="" id="pic" accept="image/jpeg,image/png,image/tiff"
				@change="imgChange">
			<label for="pic" class="uploadimgbtn">
				<div style="margin: auto;">上传核酸结果图片</div>
			</label>
			<mt-button class="main_item" type="primary" @click="toUpdate">提交</mt-button>
		</div>
	</div>
</template>

<script>
	import {
		Toast,MessageBox,Indicator
	} from 'mint-ui';
	export default {
		name: 'HomeView',
		components: {},
		data() {
			return {
				username: '',
				isHs: '',
				tiwen: '',
				isRwm: '',
				imgState: '',
				btnLock:false

			}
		},
		methods: {
			imgChange() {
				this.imgState = pic.value
			},
			toUpdate() {
				if (!/^[\u4e00-\u9fa5]{2,4}$/.test(this.username)) {
					Toast('请输入真实姓名')
					return
				} else if (!/^[0-9]{2}.[0-9]{1}$/.test(this.tiwen)) {
					Toast('体温输入错误')
					return
				} else if (this.isHs === '') {
					Toast('请选择是否已做核酸')
					return
				} else if (this.isRwm === '') {
					Toast('请选择是否已提交二维码')
					return
				} else if (this.imgState === '') {
					Toast('请选择上传核算结果')
					return
				}else if(this.btnLock){
					return
				}
				Indicator.open()
				this.btnLock = true
				let formData = new FormData();
				formData.append('imgData',pic.files[0])
				formData.append('uname',this.username)
				formData.append('tiwen',this.tiwen)
				formData.append('isHs',this.isHs)
				formData.append('isRwm',this.isRwm)
				// console.log(imgfile)
				this.axios({
					method: 'post',
					url: this.$serverUrl+'/updateData',
					// headers: {
					// 	'Content-Type': 'application/x-www-form-urlencoded'
					// },
					data: formData
				}).then(res => {
					console.log(res)
					if(res.data.code == 113){
						Toast('您不是本公司员工')
					}else if(res.data.code == 200){
						MessageBox('提示', '提交成功');
						this.username=''
						this.isHs=''
						this.tiwen=''
						this.isRwm=''
						this.imgState=''
						pic.value=''
					}
					this.btnLock = false
					Indicator.close()
				},err=>{
					this.btnLock = false
					Indicator.close()
					Toast('网络开小差了')
					throw err
				})
			}
		}

	}
</script>
<style scoped>
	.main_item {
		margin-top: 1rem;
		width: 100%;
	}

	.btn_p {
		padding: 1rem;

	}

	.uploadimg {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}

	.uploadimgbtn {
		display: flex;
		border-radius: .2rem;
		width: 100%;
		height: 2.5rem;
		background-color: aliceblue;
		align-items: center;
	}
</style>
