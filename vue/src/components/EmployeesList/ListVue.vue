<template>
	<div class="main">
		<div class="listTitle">{{titleStr}}</div>
			<div v-if="datatype.type == 'emp'" class="last_page" @click="toClassPage">
				返回上一级..
			</div>
			<mt-cell-swipe
			v-for="(val,index) of itemlist" :key="index"
				@click.native="toNextPage(val.id)"
			  :title="val.name"
			  :right="[
			    {
			      content: '删除',
			      style: { background: 'red', color: '#fff' },
			      handler: ()=>{delItem(val.id)}
			    }
			  ]"></mt-cell-swipe>
			  <div v-if="itemlist.length == 0" class="no_item">暂无内容...</div>
			  <div class="add_item" @click="addItem">
				  添加<span v-if="datatype.type == 'class'">部门</span><span v-if="datatype.type == 'emp'">员工</span>...
			  </div>
			  <mt-popup v-model="popupVisible"	position="bottom" class="popup">
			    <div v-if="datatype.type == 'emp'">
					<mt-field label="员工名" placeholder="请输入员工名" v-model="username"></mt-field>
					<!-- <mt-cell title="部门"></mt-cell> -->
					<!-- <mt-picker :slots="slots" @change="onValuesChange"></mt-picker> -->
				</div>
				<div v-if="datatype.type == 'class'">
					<mt-field label="部门" placeholder="请输入部门" v-model="cname"></mt-field>
				</div>
				<div class="btn_p">
					<mt-button class="update_btn" @click="updateItem">确定</mt-button>
				</div>
			  </mt-popup>
			  <!-- {{datatype}} -->
	</div>
</template>

<script>
	import { MessageBox,Toast,Picker,Indicator } from 'mint-ui';
	export default{
		name:'ListVue',
		data(){
			return{
				delBtnLock:false,
				updateBtnLock:false,
				itemlist:[],
				popupVisible:false,
				username:'',
				cname:'',
				slots: [
				        {
				          values: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6'],
				          className: 'slot1'
				        }
				      ],
				classlist:[]
			}
		},
		computed:{
			titleStr(){
				switch(this.datatype.type){
					case 'class':
						return '部门：'
					case 'emp':
						// console.log(this.classlist)
						for(let i=0;i<this.classlist.length;i++){
							if(this.classlist[i].id == this.datatype.where){
								return this.classlist[i].name+':'
							}
						}
						return '员工：'
				}
			}
		},
		methods:{
			updateItem(){
				if(this.updateBtnLock == true){
					return
				}
				
				if(this.datatype.type == 'emp'){
					if (!/^[\u4e00-\u9fa5]{2,4}$/.test(this.username)){
						MessageBox('提示','员工名格式错误')
						window.scrollTo({
						        top: 0,
						        behavior: 'smooth'
						      })
						return
					}
					Indicator.open()
					this.updateBtnLock = true
					//开始上传
					this.axios.post(this.$serverUrl+'/add_emp',`token=${this.$cookies.get('token')}&uname=${this.username}&cid=${this.datatype.where}`).then(res=>{
						if(res.data.code == 200){
							MessageBox('提示','添加成功')
							this.username = ''
							this.popupVisible = false
							this.loadData()	
						}else{
							MessageBox('提示','添加失败')
							this.popupVisible = false
						}
						Indicator.close()
						this.updateBtnLock = false
						//结束上传
					},err=>{
						Toast('网络开小差了')
						Indicator.close()
						this.updateBtnLock = false
						this.popupVisible = false
					})
				}
				if(this.datatype.type == 'class'){
					if (!/^[\u4e00-\u9fa5]{2,8}$/.test(this.cname)){
						MessageBox('提示','部门名称格式错误')
						window.scrollTo({
						        top: 0,
						        behavior: 'smooth'
						      })
						return
					}
					Indicator.open()
					this.updateBtnLock = true
					//开始上传
					this.axios.post(this.$serverUrl+'/add_class',`token=${this.$cookies.get('token')}&cname=${this.cname}`).then(res=>{
						if(res.data.code == 200){
							MessageBox('提示','添加成功')
							this.cname = ''
							this.popupVisible = false
							this.loadData()
						}else{
							MessageBox('提示','添加失败')
							this.popupVisible = false
						}
						Indicator.close()
						this.updateBtnLock = false
						//结束上传
					},err=>{
						Toast('网络开小差了')
						Indicator.close()
						this.updateBtnLock = false
						this.popupVisible = false
					})
				}
			},
			onValuesChange(picker, values) {
			    if (values[0] > values[1]) {
			        picker.setSlotValue(1, values[0]);
			      }
			    },
			addItem(){
				this.popupVisible=true
			},
			delItem(id){
				// 删除部门业务逻辑
				Indicator.open()
				this.delBtnLock = true
				if(this.datatype.type == 'emp'){
					this.axios.post(this.$serverUrl+"/del_emp",`token=${this.$cookies.get('token')}&uid=${id}`).then(res=>{
						if(res.data.code == 200){
							MessageBox('提示', '删除成功');
							this.loadData()
						}else{
							MessageBox('提示', '删除失败');
						}
						this.delBtnLock = false
						Indicator.close()
					},err=>{
						Toast('网络开小差了')
						this.delBtnLock = false
						Indicator.close()
					})
				}else if(this.datatype.type == 'class'){
					this.axios.post(this.$serverUrl+"/del_class",`token=${this.$cookies.get('token')}&cid=${id}`).then(res=>{
						if(res.data.code == 200){
							MessageBox('提示', '删除成功');
							this.loadData()
						}else{
							MessageBox('提示', '删除失败');
						}
						this.delBtnLock = false
						Indicator.close()
					},err=>{
						Toast('网络开小差了')
						this.delBtnLock = false
						Indicator.close()
					})
				}
			},
			toNextPage(id){
				if(this.datatype.type == 'emp'){
					//最里层不在传父组件
					return
				}
				this.$emit('toNextPage',id)
			},
			toClassPage(){
				this.$emit('toPage','class')
			},
			loadData(){
				Indicator.open();
				if(this.datatype.type == 'class'){
					this.axios.get(this.$serverUrl+'/get_class_item').then(res=>{
						// console.log(res.data.result) 
						this.itemlist=res.data.result
						this.classlist=res.data.result
						Indicator.close();
					},err=>{
						Toast('网络开小差了')
						Indicator.close();
					})
				}else if(this.datatype.type == 'emp'){
					this.axios.get(this.$serverUrl+`/employeesList?cid=${this.datatype.where}&token=${this.$cookies.get('token')}`).then(res=>{
						// console.log(res.data) 
						this.itemlist=res.data.result
						Indicator.close();
					},err=>{
						Toast('网络开小差了')
						Indicator.close();
					})
				}
			}
		},
		props:{
			datatype:{
				type:Object
			}
		},
		watch:{
			datatype(){
				// console.log(this.datatype.type)
				this.itemlist = []
				this.loadData()
			},
			classlist(){
				// console.log(this.classlist)
				let list = []
				for(let i=0;i<this.classlist.length;i++){
					// console.log(this.classlist[i].name)
					list.push(this.classlist[i].name)
				}
				this.slots[0].values = list
			}
		},
		created(){
			this.loadData()
		}
	}
</script>

<style scoped>
	.add_item{
		display: flex;
		justify-content: center;
		border-top: 1px #d9d9d9 solid;
		padding: 1rem;
		font-size: .8rem;
	}
	.last_page{
		font-size: .8rem;
		display: flex;
		justify-content: center;
		padding: 1rem;
	}
	.no_item{
		color: #d9d9d9;
		display: flex;
		justify-content: center;
		padding: 1rem;
	}
	.popup{
		width: 100%;
	}
	.update_btn{
		width: 100%;
	}
	.btn_p{
		padding: 1rem;
	}
	.listTitle{
		color: #555555;
		margin: .2rem;
		padding: .2rem;
		padding-left: .6rem;
		font-size: .8rem;
		background-color: #d9d9d9;
		border-radius: .4rem;
		font-weight: bold;
	}
</style>